export type AgeBand = "5-7" | "8-10";

export interface ChildProfile {
  childId: string;
  displayName: string;
  ageBand: AgeBand;
  guidanceSettings: string[];
  accessibilityPreferences: string[];
  progressSnapshot: string;
}

export interface AdultAccount {
  adultId: string;
  roleType: "parent" | "guardian" | "educator";
  consentState: "pending" | "granted" | "revoked";
  linkedChildren: string[];
  portalPreferences: string[];
  entitlementTier: "free";
}

export interface WorldProgress {
  childId: string;
  worldId: string;
  completedMissions: string[];
  unlockedFeatures: string[];
  masterySignals: string[];
  lastSessionState: string;
}

export interface ProjectDocument {
  projectId: string;
  ownerChildId: string;
  originMissionId?: string;
  sceneState: string;
  codeBlocks: string[];
  assets: string[];
  remixLineage: string[];
}

export interface RewardLedger {
  childId: string;
  earnedRewards: string[];
  pendingCelebrations: string[];
  streakSafeMilestones: string[];
}

export interface FamilyCircle {
  circleId: string;
  members: string[];
  visibilityRules: string[];
  approvedShares: string[];
  reactions: string[];
}

export interface ApiErrorPayload {
  error: string;
  message: string;
  statusCode: number;
  fieldErrors: Record<string, string[]>;
}

export const domainEvents = [
  "ChildProfileCreated",
  "GuidanceSettingsUpdated",
  "NarrationPreferenceChanged",
  "AdultAccountCreated",
  "ChildLinkedToAdult",
  "ConsentStateUpdated",
  "MissionCompleted",
  "SandboxUnlocked",
  "WorldCelebrationEarned",
  "ProjectCreated",
  "ProjectSaved",
  "ProjectSharedToFamilyCircle",
  "RewardEarned",
  "CelebrationShown",
  "FamilyCircleCreated",
  "ShareApproved",
  "ReactionAdded"
] as const;

export type DomainEvent = (typeof domainEvents)[number];
