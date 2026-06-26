<!-- markdownlint-disable-file -->
---
title: Kids Coding App Schema Contracts
description: Dedicated schema and shared-domain planning artifact for the version 1 kids coding app architecture
author: GitHub Copilot
ms.date: 2026-06-26
ms.topic: reference
keywords:
  - schema contracts
  - shared domain
  - kids coding app
estimated_reading_time: 10
---

## Context References

* Plan: `.copilot-tracking/plans/2026-06-26/kids-coding-app-architecture-plan.instructions.md`
* Architecture details: `.copilot-tracking/details/2026-06-26/kids-coding-app-architecture-details.md`
* Planning log: `.copilot-tracking/plans/logs/2026-06-26/kids-coding-app-architecture-log.md`

## Decisions Locked In This Artifact

* The first schema pass is split into a dedicated artifact rather than staying embedded only in the architecture plan
* `Pixel Park Adventure` remains the version 1 first-world theme
* This artifact defines field-level planning contracts only, not code or database schemas

## packages/content-schema Contracts

### world

Required fields:

* `id`: stable string identifier
* `slug`: human-readable unique key
* `title`: display title
* `theme`: world theme identifier
* `targetAgeBand`: enum such as `5-7` or `8-10`
* `unlockRules`: rule set for world availability
* `narrationProfile`: default narration behavior for the world
* `missionOrder`: ordered list of mission ids

Optional fields:

* `worldMapAssetId`: visual navigation asset
* `introSceneId`: entry scene
* `parentGuideSummary`: adult-facing explanation of the world

### mission

Required fields:

* `id`: stable string identifier
* `worldId`: owning world id
* `order`: numeric sequence in world
* `title`: display title
* `learningGoals`: list of concept identifiers
* `starterScene`: scene or template reference
* `allowedBlocks`: block capability list
* `narrationSteps`: ordered narrated guidance steps
* `successConditions`: completion rule definitions
* `rewardEvents`: reward triggers emitted on completion
* `estimatedDurationMinutes`: expected session duration

Optional fields:

* `hintTreeId`: linked hint tree
* `sandboxUnlocks`: features unlocked by mission completion
* `parentPrompt`: optional adult-side coaching note

### onboardingFlow

Required fields:

* `id`: stable string identifier
* `steps`: ordered step definitions
* `parentActions`: setup responsibilities owned by the parent
* `childActions`: child-owned steps after handoff
* `guidanceSettings`: default session guidance controls
* `completionEvents`: emitted events after successful onboarding

Optional fields:

* `fallbackSkipPath`: alternate route when onboarding is resumed
* `repeatInstructionToken`: reusable child-facing replay action

### sandboxTemplate

Required fields:

* `id`: stable string identifier
* `sourceWorld`: originating world id
* `starterAssets`: asset references
* `allowedBlocks`: block set available in this sandbox entry point
* `suggestedPrompts`: optional creative prompts shown to the child

Optional fields:

* `originMissionId`: mission that unlocked the template
* `shareRecommendation`: suggestion for family-circle sharing

### rewardDefinition

Required fields:

* `id`: stable string identifier
* `category`: mastery, persistence, creativity, collaboration, or milestone
* `trigger`: event condition
* `celebrationStyle`: animation, sound, or badge treatment
* `followUpSuggestion`: recommended next activity

Optional fields:

* `adultMessage`: short explanation for the adult portal
* `streakSafe`: boolean for low-pressure behavior

### hintTree

Required fields:

* `id`: stable string identifier
* `missionId`: owning mission id
* `triggerConditions`: conditions for hint display
* `narrationVariant`: narrated or silent hint path
* `visualCue`: animation or overlay reference

Optional fields:

* `parentAssistPrompt`: adult coaching fallback

## packages/shared-domain Aggregates

### ChildProfile

Core fields:

* `childId`
* `displayName`
* `ageBand`
* `guidanceSettings`
* `accessibilityPreferences`
* `progressSnapshot`

Key events:

* `ChildProfileCreated`
* `GuidanceSettingsUpdated`
* `NarrationPreferenceChanged`

### AdultAccount

Core fields:

* `adultId`
* `roleType`: version 1 uses parent-oriented behavior
* `consentState`
* `linkedChildren`
* `portalPreferences`
* `entitlementTier`

Key events:

* `AdultAccountCreated`
* `ChildLinkedToAdult`
* `ConsentStateUpdated`

### WorldProgress

Core fields:

* `childId`
* `worldId`
* `completedMissions`
* `unlockedFeatures`
* `masterySignals`
* `lastSessionState`

Key events:

* `MissionCompleted`
* `SandboxUnlocked`
* `WorldCelebrationEarned`

### ProjectDocument

Core fields:

* `projectId`
* `ownerChildId`
* `originMissionId`
* `sceneState`
* `codeBlocks`
* `assets`
* `remixLineage`

Key events:

* `ProjectCreated`
* `ProjectSaved`
* `ProjectSharedToFamilyCircle`

### RewardLedger

Core fields:

* `childId`
* `earnedRewards`
* `pendingCelebrations`
* `streakSafeMilestones`

Key events:

* `RewardEarned`
* `CelebrationShown`

### FamilyCircle

Core fields:

* `circleId`
* `members`
* `visibilityRules`
* `approvedShares`
* `reactions`

Key events:

* `FamilyCircleCreated`
* `ShareApproved`
* `ReactionAdded`

## Service-Boundary Notes For services/platform-api

### Content service boundary

Responsibilities:

* Serve worlds, missions, onboarding flows, hints, rewards, and sandbox templates
* Version and localize content artifacts

Should not own:

* Learner progress state
* Sharing permissions

### Progress service boundary

Responsibilities:

* Track mission completion, unlocks, mastery, and session continuation state
* Emit reward and sandbox unlock events

Should not own:

* Content authoring definitions

### Project service boundary

Responsibilities:

* Save projects, sandbox creations, and remix lineage
* Manage project metadata and asset references

Should not own:

* Family-circle approval policy

### Family and safety service boundary

Responsibilities:

* Adult-child linking
* Consent and visibility rules
* Family-circle approvals and reactions

Should not own:

* Mission pacing rules
* Reward definitions

## Immediate Next Use Of This Artifact

This artifact should guide the next implementation-planning pass for:

* `packages/content-schema`
* `packages/shared-domain`
* `services/platform-api`

It is intentionally technology-agnostic so it can survive framework selection.