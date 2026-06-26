<!-- markdownlint-disable-file -->
---
title: Kids Coding App Architecture Details
description: Execution details and architecture reasoning for the kids coding app plan
author: GitHub Copilot
ms.date: 2026-06-26
ms.topic: reference
keywords:
  - architecture details
  - kids coding app
  - plan details
estimated_reading_time: 8
---

## Context References

* Plan: `.copilot-tracking/plans/2026-06-26/kids-coding-app-architecture-plan.instructions.md`
* Research: `.copilot-tracking/research/2026-06-26/kids-coding-app-research.md`
* Planning log: `.copilot-tracking/plans/logs/2026-06-26/kids-coding-app-architecture-log.md`

## Phase Details

### Phase 1: Product architecture baseline

Success criteria:

* Architecture style is selected
* Product domains are clearly separated
* Cross-platform strategy is explicit

Notes:

* A hybrid mission plus sandbox model best fits the combined lessons from ScratchJr, Scratch, and Tynker
* The child experience must feel playful and creative before it feels instructional
* The runtime and content systems are the architectural core, not the authentication system

### Phase 2: Safety and collaboration architecture

Success criteria:

* Collaboration is designed for children, not copied from adult social products
* Moderation and permissions are represented in the system architecture

Notes:

* Safe circles provide collaboration without overexposing children to open networks
* Parent and educator roles should be modeled separately from child identities
* Predefined reactions and approval flows reduce moderation risk in V1
* Live pair mode is intentionally deferred until the family-first asynchronous model is proven

### Phase 3: Content and progression architecture

Success criteria:

* Lessons, hints, rewards, and themes can evolve through structured content
* Progression is personalized by age band and mastery signals

Notes:

* Content schemas will be essential for scaling curriculum without repeatedly changing client logic
* Progress and gamification need event-driven state changes even if the backend remains a modular monolith
* The first world should combine story-led animation with short puzzle checks so a 7-year-old learner gets both delight and structure
* The first schema pass should explicitly model missions, onboarding, rewards, unlocks, and sandbox templates before implementation starts

### Phase 4: Delivery architecture recommendation

Success criteria:

* V1 delivery approach is feasible for a small product team
* Architecture leaves room for future scale without overbuilding day one infrastructure

Notes:

* A modular monolith is the right default because product risk outweighs infrastructure risk at this stage
* Shared packages should isolate runtime logic, content schemas, and design primitives
* Offline support should be treated as product-critical, not optional polish
* Version 1 should ship with one shared adult portal optimized for parent guidance, while preserving future separation of guardian and educator surfaces
* Monetization should stay outside the version 1 user journey, but the shared domain should preserve a minimal entitlement seam
* The first scaffold should use npm workspaces, Next.js for the two web apps, and Fastify for the platform API

### Phase 5: Review and iterate

Success criteria:

* The user can respond to assumptions and scope choices before development begins
* Open questions are explicit and bounded

Open questions for iteration:

* Should the next execution phase prioritize child-app feature flow or deeper API and tooling hardening?

## Version 1 experience notes

* The recommended first world is a character-animation story world with short puzzle gates
* The recommended onboarding flow starts with parent setup, then quickly transfers control to the child for an immediate success moment
* The shared adult portal should stay parent-simple in version 1 and avoid visible educator complexity
* The recommended sandbox unlock point is after mission 3, when the child has enough coding vocabulary to create confidently
* The recommended narration default is on, with easy parent-controlled mute and replay support
* The recommended monetization posture is no version 1 paywalling, with only a hidden architectural entitlement seam
* `Pixel Park Adventure` remains the locked version 1 first-world theme
* Schema planning now has a dedicated artifact for field-level contracts and service boundaries
* Implementation planning now assumes an npm workspace monorepo with Next.js apps and a Fastify API service
