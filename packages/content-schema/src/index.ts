import { z } from "zod";

export const ageBandSchema = z.enum(["5-7", "8-10"]);

export const worldSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  theme: z.string(),
  targetAgeBand: ageBandSchema,
  unlockRules: z.array(z.string()),
  narrationProfile: z.string(),
  missionOrder: z.array(z.string()),
  worldMapAssetId: z.string().optional(),
  introSceneId: z.string().optional(),
  parentGuideSummary: z.string().optional()
});

export const missionSchema = z.object({
  id: z.string(),
  worldId: z.string(),
  order: z.number().int().nonnegative(),
  title: z.string(),
  learningGoals: z.array(z.string()),
  starterScene: z.string(),
  allowedBlocks: z.array(z.string()),
  narrationSteps: z.array(z.string()),
  successConditions: z.array(z.string()),
  rewardEvents: z.array(z.string()),
  estimatedDurationMinutes: z.number().positive(),
  hintTreeId: z.string().optional(),
  sandboxUnlocks: z.array(z.string()).optional(),
  parentPrompt: z.string().optional()
});

export const onboardingFlowSchema = z.object({
  id: z.string(),
  steps: z.array(z.string()),
  parentActions: z.array(z.string()),
  childActions: z.array(z.string()),
  guidanceSettings: z.array(z.string()),
  completionEvents: z.array(z.string()),
  fallbackSkipPath: z.string().optional(),
  repeatInstructionToken: z.string().optional()
});

export const sandboxTemplateSchema = z.object({
  id: z.string(),
  sourceWorld: z.string(),
  starterAssets: z.array(z.string()),
  allowedBlocks: z.array(z.string()),
  suggestedPrompts: z.array(z.string()),
  originMissionId: z.string().optional(),
  shareRecommendation: z.string().optional()
});

export const rewardDefinitionSchema = z.object({
  id: z.string(),
  category: z.enum(["mastery", "persistence", "creativity", "collaboration", "milestone"]),
  trigger: z.string(),
  celebrationStyle: z.string(),
  followUpSuggestion: z.string(),
  adultMessage: z.string().optional(),
  streakSafe: z.boolean().optional()
});

export const hintTreeSchema = z.object({
  id: z.string(),
  missionId: z.string(),
  triggerConditions: z.array(z.string()),
  narrationVariant: z.string(),
  visualCue: z.string(),
  parentAssistPrompt: z.string().optional()
});

export type World = z.infer<typeof worldSchema>;
export type Mission = z.infer<typeof missionSchema>;
export type OnboardingFlow = z.infer<typeof onboardingFlowSchema>;
export type SandboxTemplate = z.infer<typeof sandboxTemplateSchema>;
export type RewardDefinition = z.infer<typeof rewardDefinitionSchema>;
export type HintTree = z.infer<typeof hintTreeSchema>;
