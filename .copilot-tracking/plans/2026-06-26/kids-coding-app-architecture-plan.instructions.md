<!-- markdownlint-disable-file -->
---
description: Architecture-first plan for a cross-platform gamified coding-learning app for children ages 5 to 10
---

## User Requests

* Design an app targeted at 5 to 10 year old children that helps them learn how to code
* Ensure the app works on iPad, iPhone, tablet, and PC
* Make the experience fun, collaborative, engaging, enjoyable, and strongly gamified
* Teach the basics of coding in an age-appropriate way
* Create a plan with suitable architecture only
* Iterate through the plan before starting development
* Use research from similar applications including Tynker, Scratch, and ScratchJr
* Version 1 should be family-first, built for a 7-year-old child and his mom guiding him
* Live pair mode should stay out of version 1 and remain in the future roadmap
* Version 1 should use one shared adult portal page rather than separate guardian and educator portals

## Overview

We will plan a hybrid learning platform that combines guided coding adventures, creative sandbox building, and safe circle-based collaboration. Version 1 is family-first and optimized for a 7-year-old learner working with a parent guide, while the architecture still preserves a path toward classroom and educator expansion later. The platform must serve a broad developmental range, so the product should split experiences into child-friendly learning tiers while keeping a shared project and progression model underneath.

## Objectives

* Support ages 5 to 10 with age-banded experiences
* Deliver one cross-platform product for touch and desktop input
* Make gamification intrinsic to learning rather than bolted on after lessons
* Keep collaboration safe, structured, and parent-teacher aware
* Use a content-driven architecture so lessons and rewards evolve without core client rewrites
* Preserve a path to iterate on the plan before implementation begins
* Optimize version 1 for guided family use without blocking future classroom expansion

## Context Summary

* Research indicates ScratchJr is the strongest model for ages 5 to 7, especially for touch-first, pre-reader-friendly interaction
* Research indicates Scratch is the strongest model for ages 8 to 10 in creative expression, remixing, and moderated sharing
* Research indicates Tynker is the strongest model for structured progression, tutorials, assessments, and game-like reward loops
* The workspace is greenfield, so the architecture should optimize for product fit and delivery simplicity rather than compatibility with existing code
* Relevant instructions followed for this plan:
  * `.github/instructions/hve-core/markdown.instructions.md`
  * `.github/instructions/hve-core/prompt-builder.instructions.md`
  * `.github/instructions/hve-core/writing-style.instructions.md`

## Selected Product Architecture

### Architecture style

Use a modular client-platform architecture with a shared application shell and a backend composed of bounded services. The app should be content-driven and offline-tolerant.

### Core product domains

1. Learning Journey Domain
   * Manages lessons, missions, skill maps, hints, assessments, and progression rules
2. Coding Workspace Domain
   * Manages the block editor, project scene graph, runtime execution, asset library, and remixing
3. Gamification Domain
   * Manages achievements, streaks, badges, unlocks, character progression, and celebration events
4. Collaboration Domain
   * Manages safe circles, project sharing, teacher-family review flows, moderation queues, and reaction systems
5. Identity and Safety Domain
   * Manages child accounts, guardian consent, educator roles, privacy controls, and age-banded permissions
6. Content Operations Domain
   * Manages curriculum publishing, themed events, challenge content, localization, and in-app narrative assets
7. Analytics and Experimentation Domain
   * Manages progress analytics, drop-off signals, feature flags, and age-band tuning insights

### Recommended client architecture

Use one shared cross-platform client codebase with responsive layout profiles for phone, tablet, and desktop.

Recommended layers:

* Presentation layer
  * Child app shell
   * Shared adult portal for version 1
  * Responsive component system for touch-first and pointer-first use
* Experience orchestration layer
  * Session flow, mission launcher, reward moments, collaboration entry points
* Domain layer
  * Local models for projects, lessons, rewards, circles, and profiles
* Client data layer
  * Offline cache, sync queue, asset store, and telemetry buffer
* Runtime layer
  * Block interpreter, animation engine, audio playback, and project simulation

### Recommended backend architecture

Use a modular monolith for V1 with strong domain boundaries, then split services later only where usage or operational needs justify it.

Modules:

* Auth and Roles
* Learner Profiles
* Curriculum and Missions
* Projects and Assets
* Progress and Rewards
* Sharing and Moderation
* Notifications and Events
* Analytics and Content Flags

Rationale:

* A modular monolith keeps delivery simpler for a first product
* Strong internal boundaries preserve an eventual path to service extraction
* The product’s real early complexity is content, pedagogy, and UX, not distributed systems scale

## Platform Strategy

### Device support

* iPhone and small phones use simplified layouts with short missions and large controls
* iPad and tablets use the primary touch experience, especially for the block workspace
* PC uses a wider layout with richer side panels for project editing and teacher or guardian review

### Offline strategy

* Core lessons and recent projects should remain playable offline
* Local progress, rewards, and project edits should queue for sync
* Collaborative features should degrade gracefully when offline

### Accessibility and child usability

* Large hit targets and low reading dependency for early learners
* Voice guidance, sound cues, icon-led navigation, and motion feedback
* Reduced-complexity mode for younger users
* Localization-ready content and assets from the start

## Collaboration Architecture

### V1 collaboration model

Use safe circles rather than open public networking.

Version 1 emphasis:

* Prioritize parent-guided sharing, remixing, and celebration inside a family-first experience
* Keep collaboration asynchronous in version 1

Circle types:

* Family circle
* Classroom circle
* Kid-safe showcase circle curated by adults or moderators

Allowed V1 interactions:

* Share project into a circle
* Remix approved project templates
* Leave predefined sticker reactions
* Participate in shared weekly challenges
* Parent-guided review and approval before broader sharing outside the immediate family flow

Disallowed V1 interactions:

* Free-form direct messaging
* Public-by-default publishing
* Unmoderated comments
* Live pair mode

### Moderation model

* Predefined reactions only for child-to-child feedback
* Adult review queues for public showcases
* Policy engine for age-based permissions and sharing limits
* Audit trail for project visibility changes

## Gamification Architecture

### Reward model

Gamification should reinforce learning behaviors and creative confidence.

Reward categories:

* Concept mastery rewards
* Persistence rewards for retrying and debugging
* Creativity rewards for customizing characters, stories, or worlds
* Collaboration rewards for remixing and participating in circle challenges
* Seasonal event rewards for themed content arcs

### System behavior

* Missions unlock new blocks or creative tools in a paced way
* Celebration events are triggered by milestones and personal bests
* The economy should avoid manipulative pressure loops. No architecture should depend on intrusive monetization patterns

## Content Architecture

### Content as data

Represent these artifacts as publishable content rather than hardcoded app logic:

* Lesson definitions
* Mission sequences
* Hint trees
* Narration scripts
* Event rules
* Badge definitions
* Challenge prompts
* Character and world themes

### Authoring implication

The architecture should allow non-engineering content teams to evolve learning content through controlled tooling later. That means content schemas need stable contracts from the start.

## Information Architecture

### Primary child-facing areas

* Home world
* Mission path
* Build studio
* My creations
* Friends or circles
* Rewards vault

### Adult-facing areas

* Shared adult portal for version 1
* Moderation console
* Content operations console

### Version 1 adult portal responsibilities

* Help a parent guide the child through onboarding and first missions
* Show progress, rewards, and recent creations
* Approve sharing actions and manage privacy choices
* Leave room to split into dedicated guardian and educator experiences in a later release

### Version 1 adult portal strategy

Recommendation:

* Omit educator-specific workflows from the version 1 user interface
* Preserve educator-ready seams in the domain and permission model behind the scenes

Rationale:

* A family-first launch should keep the adult experience simple and confidence-building for one parent guide
* The architecture can still model future adult roles without exposing classroom complexity in the first release

Version 1 portal capabilities:

* Parent setup and child profile creation
* Session guidance for first missions
* Privacy, sharing, and family-circle controls
* Progress summaries, rewards, and suggested next activities

Deferred portal capabilities:

* Classroom roster management
* Educator assignment tools
* Multi-child classroom analytics
* Moderated showcase publishing workflows beyond family-first needs

## Version 1 Experience Blueprint

### First learning world recommendation

Recommendation:

* Start with a story-led character animation world supported by short puzzle moments

Why this is the best first world for a 7-year-old learner:

* ScratchJr signals show that characters, movement, sound, and storytelling create immediate delight for younger children
* Tynker signals show that structured progression and short challenge loops help children and parents feel early success
* A pure puzzle-first world risks feeling too abstract, while a pure story world can feel passive without interaction checks

Proposed world concept:

* Working title: `Pixel Park Adventure`
* Fantasy: the child helps friendly park characters wake up the world, fix small problems, and put on a mini show
* Feedback loop: every coding action visibly changes character movement, scene animation, or sound

Core coding concepts in the first world:

* Sequence
* Event triggers
* Repetition through simple loops
* Debugging by spotting why a character did not do the intended action

Mission arc for world one:

* Mission 1: make a character move to a destination
* Mission 2: trigger an animation when tapped
* Mission 3: repeat a dance or path with a simple loop
* Mission 4: combine movement and sound for a short celebration scene
* Mission 5: personalize the scene and share it with the family circle

World design constraints:

* Each mission should finish in 3 to 5 minutes
* Reading load stays low and can be supported by audio prompts
* The child should see a playful result within the first 30 to 60 seconds

### Parent-guided onboarding flow

Recommendation:

* Use a dual-lane onboarding flow where the parent completes setup first, then immediately hands control to the child for a very short success moment

Onboarding stages:

* Stage 1: welcome screen framed for parent-and-child play
* Stage 2: parent creates the family account or local family profile
* Stage 3: parent creates the child profile, selects age, and chooses guidance settings such as narration and session length
* Stage 4: child chooses an avatar and helper character
* Stage 5: a one-minute starter mission teaches drag, snap, and run
* Stage 6: the child earns the first reward and the parent sees a simple progress explanation

Architecture implications of onboarding:

* Identity and safety domain needs a parent-owned setup path before child-facing progress begins
* The content system needs a special onboarding mission type with stronger narration and fewer choices
* Gamification should award an immediate first-win badge to reduce drop-off
* The shared adult portal should surface a clear next action after the first mission rather than a dense dashboard

Onboarding success criteria:

* Parent setup can complete in under 3 minutes
* Child reaches a visible first success in under 2 minutes after handoff
* The first session makes it obvious how future sessions will work

### Narration defaults

Recommendation:

* Enable voice narration by default in version 1 onboarding and the first world

Rationale:

* The target learner is 7 years old, so reducing reading dependency matters more than minimizing audio
* Parent-guided sessions still benefit from audio because they lower the burden on the parent to explain every prompt
* ScratchJr-style developmental appropriateness favors guided, multimodal instruction early in the journey

Version 1 narration rules:

* Narration starts enabled for onboarding and the first-world missions
* The parent can mute or lower narration during setup and inside the adult portal
* The child-facing experience should expose a simple repeat-instruction control rather than a full settings surface
* Later worlds can reduce narration intensity as confidence and reading independence increase

Architecture implications:

* Content schemas need scriptable narration fields attached to onboarding steps, hints, and mission beats
* Client state must support parent-controlled accessibility or guidance preferences at the child-profile level
* Analytics should measure narration mute, replay, and skip behavior to refine pacing later

### Sandbox unlock timing

Recommendation:

* Unlock the creative sandbox after mission 3

Rationale:

* After mission 1, the child has too little expressive vocabulary and the sandbox risks feeling empty or confusing
* Waiting until the full first world is complete delays agency too long for a playful, family-first product
* After mission 3, the child has learned sequence, tap-triggered behavior, and a simple loop, which is enough to create something recognizably their own

Version 1 unlock rules:

* Missions 1 to 3 stay tightly scaffolded
* Completing mission 3 unlocks a starter sandbox with a limited but expressive block set
* The starter sandbox should include a remixable template from `Pixel Park Adventure`
* Missions 4 and 5 then demonstrate how sandbox creations can become richer and shareable

Architecture implications:

* Content schemas need milestone-based unlock rules tied to specific mission completions
* Gamification should celebrate sandbox unlock as a major moment of growing independence
* The adult portal should explain why the sandbox has just opened and suggest a short parent-child creation activity

## Version 1 monetization posture

Recommendation:

* Keep monetization out of scope for the version 1 user experience while preserving a clean entitlement boundary in the architecture

Rationale:

* The immediate product goal is learning quality and parent-child engagement, not commerce optimization
* Early monetization surfaces would add friction to onboarding and distort the family-first product signal
* A bounded entitlement seam avoids repainting the architecture later if pricing or subscriptions are introduced

Version 1 rule set:

* No paywalls, upsell flows, or child-facing purchase prompts in the first release
* All version 1 content and family-circle features are treated as included capabilities
* If distribution channels require account tier metadata later, keep it hidden from the child-facing UX in version 1

Architecture implications:

* The shared domain package should reserve an entitlement concept, even if only a single free tier exists initially
* The adult portal may record plan or access metadata internally without exposing it to the child journey
* Analytics and content gating should not depend on monetization logic in version 1

## Content schema and domain model planning

### Content schema recommendation

The first planning translation should define stable schemas for these version 1 artifacts:

* `world`
   * id, title, theme, targetAgeBand, unlockRules, narrationProfile
* `mission`
   * id, worldId, order, learningGoals, starterScene, allowedBlocks, narrationSteps, successConditions, rewardEvents
* `onboardingFlow`
   * id, steps, parentActions, childActions, guidanceSettings, completionEvents
* `sandboxTemplate`
   * id, sourceWorld, starterAssets, allowedBlocks, suggestedPrompts
* `rewardDefinition`
   * id, category, trigger, celebrationStyle, followUpSuggestion
* `hintTree`
   * id, missionId, triggerConditions, narrationVariant, visualCue

Version 1 schema constraints:

* Mission content must support narration, animation feedback, and short-session pacing
* Unlock rules must support milestone-based events such as sandbox availability after mission 3
* Schemas should distinguish parent-facing instructions from child-facing prompts

### Domain model recommendation

The first domain-model planning pass should define these core aggregates:

* `ChildProfile`
   * identity, ageBand, guidanceSettings, progressSnapshot, accessibilityPreferences
* `AdultAccount`
   * family identity, consent state, portal preferences, linked children
* `WorldProgress`
   * completedMissions, unlockedFeatures, masterySignals, lastSessionState
* `ProjectDocument`
   * scene state, code blocks, assets, originMission, remixLineage
* `RewardLedger`
   * earned rewards, pending celebrations, streak-safe milestones
* `FamilyCircle`
   * members, visibility rules, approved shares, reactions

Boundaries to preserve:

* Content definitions stay separate from learner state
* Reward events are derived from progress and mission completion, not hard-coded in UI flows
* Safety and sharing permissions stay separate from project content so family-first rules can evolve later

### Immediate planning output for the next phase

The next architecture pass should convert these schemas and aggregates into:

* field-level contracts for `packages/content-schema`
* aggregate and event definitions for `packages/shared-domain`
* service-boundary notes for `services/platform-api`

Decision:

* This planning now lives in a dedicated artifact: `.copilot-tracking/details/2026-06-26/kids-coding-app-schema-contracts.md`

### First-world theme decision

Decision:

* Keep `Pixel Park Adventure` as the version 1 first-world theme

Rationale:

* It fits the family-first, low-reading, expressive-animation goals already established
* It supports character movement, sound, and mini-story beats without requiring complex mechanics
* It is specific enough to guide content design while staying flexible for later art direction

## Suggested Future Repository Shape

* `apps/child-client/`
* `apps/adult-portal/`
* `apps/admin-console/`
* `packages/design-system/`
* `packages/coding-runtime/`
* `packages/content-schema/`
* `packages/shared-domain/`
* `services/platform-api/`
* `services/content-pipeline/`
* `infrastructure/`
* `docs/architecture/`

## Implementation Stack Recommendation

### Monorepo foundation

Recommendation:

* Use an `npm` workspace monorepo for version 1

Rationale:

* It is lighter-weight than adding a heavier orchestration layer before the project has multiple active teams
* It gives shared packages a clean home from day one
* It keeps setup simple for a greenfield repository owned by a small product team

### Client applications

Recommendation:

* Use Next.js with TypeScript and App Router for `apps/child-client`
* Use Next.js with TypeScript and App Router for `apps/adult-portal`

Rationale:

* The web-first architecture aligns with the earlier product decision
* Next.js provides strong routing, progressive enhancement, and a good path toward installable-app behavior later
* Using the same framework for both user-facing applications reduces cognitive overhead early on

Version 1 note:

* PWA-specific hardening can follow after the initial child journey, adult portal, and content flows are stable

### Shared packages

Recommendation:

* Use TypeScript packages for `packages/content-schema` and `packages/shared-domain`
* Use `zod` inside `packages/content-schema` for runtime-safe schema definitions

Rationale:

* The project already depends on strong schema and contract boundaries
* `zod` keeps content and API validation close to domain definitions without introducing unnecessary infrastructure

### Platform API

Recommendation:

* Use Fastify with TypeScript for `services/platform-api`

Rationale:

* Fastify is small, fast, and suitable for a clean modular-monolith boundary
* It works well with schema-driven validation and typed domain packages
* It avoids overcommitting to a more opinionated backend framework too early

## Initial Milestone Sequence

### Milestone 1: Workspace foundation

Outcome:

* Root workspace configuration
* Shared TypeScript baseline
* Minimal app and service shells

### Milestone 2: Content and domain contracts

Outcome:

* `packages/content-schema` field-level schema contracts
* `packages/shared-domain` aggregate and event contracts
* API boundary notes translated into starter modules

### Milestone 3: Child experience foundation

Outcome:

* `Pixel Park Adventure` entry flow
* Parent-guided onboarding shell
* Mission progression and sandbox unlock wiring points

### Milestone 4: Adult portal and family safety foundation

Outcome:

* Shared adult portal shell
* Family-circle approval and visibility flows
* Parent settings for narration and guidance

### Milestone 5: Integration hardening

Outcome:

* End-to-end contract validation across apps, packages, and API
* Build, lint, and typecheck automation
* Preparation for implementation beyond scaffolding

## Implementation Checklist

### Phase 1: Product architecture baseline <!-- parallelizable: false -->

- [x] Research competitor product patterns
- [x] Select hybrid mission plus sandbox approach
- [x] Define product domains and high-level platform topology
- [x] Confirm family-first version 1 audience

### Phase 2: Safety and collaboration architecture <!-- parallelizable: false -->

- [x] Bound V1 collaboration to safe circles
- [x] Define moderation and sharing rules as first-class architecture concerns
- [x] Defer live pair mode to future releases

### Phase 3: Content and progression architecture <!-- parallelizable: true -->

- [x] Define content-as-data strategy
- [x] Define progression, reward, and lesson domain responsibilities
- [x] Define version 1 content-schema and domain-model planning direction

### Phase 4: Delivery architecture recommendation <!-- parallelizable: true -->

- [x] Recommend modular monolith backend for V1
- [x] Recommend shared cross-platform client and shared packages
- [x] Recommend one shared adult portal for version 1
- [x] Recommend the concrete implementation stack for apps, packages, and API

### Phase 5: Review and iterate <!-- parallelizable: false -->

- [x] Review architecture assumptions with the user
- [x] Decide V1 scope boundaries for audience, collaboration, and adult surfaces
- [x] Revise plan before any development starts
- [x] Resolve narration defaults, sandbox timing, and monetization posture for version 1 planning
- [x] Break the implementation into initial milestones and start repository scaffolding

## Dependencies

* Research artifact: `.copilot-tracking/research/2026-06-26/kids-coding-app-research.md`
* Planning details: `.copilot-tracking/details/2026-06-26/kids-coding-app-architecture-details.md`
* Schema contracts: `.copilot-tracking/details/2026-06-26/kids-coding-app-schema-contracts.md`
* Planning log: `.copilot-tracking/plans/logs/2026-06-26/kids-coding-app-architecture-log.md`
* Changes log: `.copilot-tracking/changes/2026-06-26/kids-coding-app-architecture-changes.md`
* Review log: `.copilot-tracking/reviews/2026-06-26/kids-coding-app-architecture-plan-review.md`
* Skill consulted: `ce-plan`

## Success Criteria

* The architecture clearly supports ages 5 to 10 without treating them as one uniform audience
* Cross-platform operation is accounted for at the client and backend levels
* Gamification, safety, and collaboration are represented as explicit domains
* The plan remains architecture-first and avoids premature implementation detail
* The plan is structured for user iteration before development begins
* Version 1 scope is clearly family-first, asynchronous, and centered on a shared adult portal
* The first learning world, onboarding flow, and adult portal strategy are concrete enough to guide product design without committing to code yet
* Content-schema, domain-model, narration, and monetization boundaries are concrete enough to guide the next planning phase
* The schema-planning pass has a dedicated artifact and the first-world theme is sufficiently locked for downstream design and implementation planning

## Recommended Review Focus For Next Iteration

* Whether the web-first recommendation matches your deployment preference
* Whether the next pass should start the first child-journey feature or deepen platform engineering setup
* Whether the first implementation milestone should emphasize child flow, platform API, or family-circle safety
