import type { AdultAccount, ChildProfile, DomainEvent } from "@kids-coding-app/shared-domain";
import type { FastifyPluginAsync } from "fastify";
import {
  onboardingGuidanceBodySchema,
  onboardingParamsSchema,
  onboardingSetupBodySchema
} from "./contracts.js";
import { JsonFileStore } from "../persistence/json-file-store.js";
import { validateInput } from "./validation.js";

const childStore = new JsonFileStore<ChildProfile>("children.json");
const adultStore = new JsonFileStore<AdultAccount>("adults.json");

const upsertChild = (children: ChildProfile[], candidate: ChildProfile): ChildProfile[] => {
  const existingIndex = children.findIndex((item) => item.childId === candidate.childId);
  if (existingIndex === -1) {
    return [...children, candidate];
  }

  const next = [...children];
  next[existingIndex] = candidate;
  return next;
};

const upsertAdult = (accounts: AdultAccount[], candidate: AdultAccount): AdultAccount[] => {
  const existingIndex = accounts.findIndex((item) => item.adultId === candidate.adultId);
  if (existingIndex === -1) {
    return [...accounts, candidate];
  }

  const next = [...accounts];
  next[existingIndex] = candidate;
  return next;
};

export const registerOnboardingRoutes: FastifyPluginAsync = async (app) => {
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

    const adults = await adultStore.readAll();
    const existingAdult = adults.find((adult) => adult.adultId === setupBody.adultId);
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

    await childStore.updateAll((children) => upsertChild(children, childProfile));
    await adultStore.updateAll((accounts) => upsertAdult(accounts, adultAccount));

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

      const children = await childStore.readAll();
      const childProfile = children.find((item) => item.childId === params.childId) ?? null;
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

    const children = await childStore.readAll();
    const current = children.find((item) => item.childId === params.childId);
    if (!current) {
      return reply.code(404).send({ childProfile: null, emittedEvents: [] });
    }

    const updated: ChildProfile = {
      ...current,
      guidanceSettings: body.guidanceSettings,
      progressSnapshot: "guidance-updated"
    };

    await childStore.updateAll((items) => upsertChild(items, updated));

    return {
      childProfile: updated,
      emittedEvents: ["GuidanceSettingsUpdated"]
    };
  });
};
