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

### Phase 4: Delivery architecture recommendation <!-- parallelizable: true -->

- [x] Recommend modular monolith backend for V1
- [x] Recommend shared cross-platform client and shared packages
- [x] Recommend one shared adult portal for version 1

### Phase 5: Review and iterate <!-- parallelizable: false -->

- [x] Review architecture assumptions with the user
- [x] Decide V1 scope boundaries for audience, collaboration, and adult surfaces
- [x] Revise plan before any development starts

## Dependencies

* Research artifact: `.copilot-tracking/research/2026-06-26/kids-coding-app-research.md`
* Planning details: `.copilot-tracking/details/2026-06-26/kids-coding-app-architecture-details.md`
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

## Recommended Review Focus For Next Iteration

* Whether the web-first recommendation matches your deployment preference
* Whether the first learning world should start with stories, puzzles, or character animation missions
* Whether the shared adult portal needs educator-specific fields hidden in version 1 or omitted entirely
