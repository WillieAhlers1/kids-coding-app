import type { AdultAccount, ChildProfile, DomainEvent } from "@kids-coding-app/shared-domain";
import type { FastifyPluginAsync } from "fastify";
import {
  onboardingGuidanceBodySchema,
  onboardingParamsSchema,
  onboardingSetupBodySchema
} from "./contracts.js";
import type { OnboardingRepository } from "../persistence/repositories.js";
import { sendNotFound, validateInput } from "./validation.js";

export const registerOnboardingRoutes = (
  repository: OnboardingRepository
): FastifyPluginAsync => async (app) => {
  app.post<{
    Body: {
      adultId: string;
      childId: string;
      displayName: string;
      ageBand: "5-7" | "8-10";
      guidanceSettings?: string[];
      accessibilityPreferences?: string[];
    };
    Reply: {
      childProfile: ChildProfile;
      adultAccount: AdultAccount;
      emittedEvents: DomainEvent[];
    };
  }>("/onboarding/setup", async (request, reply) => {
    const setupBody = validateInput(reply, onboardingSetupBodySchema, request.body);
    if (!setupBody) {
      return reply;
    }

    const guidanceSettings = setupBody.guidanceSettings ?? ["narration-on", "parent-hints-on"];
    const accessibilityPreferences = setupBody.accessibilityPreferences ?? [];

    const childProfile: ChildProfile = {
      childId: setupBody.childId,
      displayName: setupBody.displayName,
      ageBand: setupBody.ageBand,
      guidanceSettings,
      accessibilityPreferences,
      progressSnapshot: "onboarding-complete"
    };

    const existingAdult = await repository.getAdult(setupBody.adultId);
    const adultAccount: AdultAccount = {
      adultId: setupBody.adultId,
      roleType: "parent",
      consentState: "granted",
      linkedChildren: existingAdult
        ? Array.from(new Set([...existingAdult.linkedChildren, setupBody.childId]))
        : [setupBody.childId],
      portalPreferences: existingAdult?.portalPreferences ?? ["guided-setup"],
      entitlementTier: "free"
    };

    await repository.saveChild(childProfile);
    await repository.saveAdult(adultAccount);

    return {
      childProfile,
      adultAccount,
      emittedEvents: ["ChildProfileCreated", "AdultAccountCreated", "ChildLinkedToAdult"]
    };
  });

  app.get<{ Params: { childId: string }; Reply: { childProfile: ChildProfile | null } }>(
    "/onboarding/:childId",
    async (request, reply) => {
      const params = validateInput(reply, onboardingParamsSchema, request.params);
      if (!params) {
        return reply;
      }

      const childProfile = await repository.getChild(params.childId);
      return { childProfile };
    }
  );

  app.post<{
    Params: { childId: string };
    Body: { guidanceSettings: string[] };
    Reply: { childProfile: ChildProfile | null; emittedEvents: DomainEvent[] };
  }>("/onboarding/:childId/guidance", async (request, reply) => {
    const params = validateInput(reply, onboardingParamsSchema, request.params);
    const body = validateInput(reply, onboardingGuidanceBodySchema, request.body);
    if (!params || !body) {
      return reply;
    }

    const current = await repository.getChild(params.childId);
    if (!current) {
      return sendNotFound(reply, `Child profile ${params.childId} was not found.`);
    }

    const updated: ChildProfile = {
      ...current,
      guidanceSettings: body.guidanceSettings,
      progressSnapshot: "guidance-updated"
    };

    await repository.saveChild(updated);

    return {
      childProfile: updated,
      emittedEvents: ["GuidanceSettingsUpdated"]
    };
  });
};
