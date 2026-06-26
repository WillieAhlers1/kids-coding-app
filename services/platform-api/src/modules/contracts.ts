import { z } from "zod";
import { ageBandSchema } from "@kids-coding-app/content-schema";

export const onboardingSetupBodySchema = z.object({
  adultId: z.string().min(1),
  childId: z.string().min(1),
  displayName: z.string().min(1),
  ageBand: ageBandSchema,
  guidanceSettings: z.array(z.string().min(1)).optional(),
  accessibilityPreferences: z.array(z.string().min(1)).optional()
});

export const onboardingParamsSchema = z.object({
  childId: z.string().min(1)
});

export const onboardingGuidanceBodySchema = z.object({
  guidanceSettings: z.array(z.string().min(1)).min(1)
});

export const progressParamsSchema = z.object({
  childId: z.string().min(1),
  worldId: z.string().min(1)
});

export const progressMissionBodySchema = z.object({
  missionId: z.string().min(1),
  unlockSandbox: z.boolean().optional()
});
