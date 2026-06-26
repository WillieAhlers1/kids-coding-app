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

### Phase 4: Delivery architecture recommendation

Success criteria:

* V1 delivery approach is feasible for a small product team
* Architecture leaves room for future scale without overbuilding day one infrastructure

Notes:

* A modular monolith is the right default because product risk outweighs infrastructure risk at this stage
* Shared packages should isolate runtime logic, content schemas, and design primitives
* Offline support should be treated as product-critical, not optional polish
* Version 1 should ship with one shared adult portal optimized for parent guidance, while preserving future separation of guardian and educator surfaces

### Phase 5: Review and iterate

Success criteria:

* The user can respond to assumptions and scope choices before development begins
* Open questions are explicit and bounded

Open questions for iteration:

* Should the creative sandbox be available from day one, or unlock after a short guided onboarding?
* Is monetization out of scope for V1 planning, or should subscription boundaries influence architecture now?
* Should the shared adult portal omit educator-specific workflows entirely in V1, or keep minimal structural placeholders for later growth?
