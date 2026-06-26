<!-- markdownlint-disable-file -->
---
title: Kids Coding App Architecture Planning Log
description: Planning log for the kids coding app architecture plan
author: GitHub Copilot
ms.date: 2026-06-26
ms.topic: reference
keywords:
  - planning log
  - kids coding app
  - architecture
estimated_reading_time: 5
---

## Discrepancy Log

* No existing repository code or product constraints were available, so the plan is based on greenfield assumptions
* The user asked for architecture only, so no technical stack or implementation choreography was locked in beyond structural recommendations
* Competitor research was limited to publicly available product messaging and overview material, not teardown-level implementation details
* Initial open questions about V1 audience, live collaboration, and adult portal shape were resolved through user iteration
* The schema-planning pass was promoted into a dedicated artifact because the contract surface became too detailed for the main architecture plan alone

## Approaches Considered

### Modular monolith backend versus microservices

Selected:
* Modular monolith for V1

Rationale:
* Smaller operational footprint
* Faster product iteration for a content-heavy first release
* Easier consistency across rewards, progress, sharing, and moderation domains

Alternative:
* Early microservices

Why not selected:
* Adds operational complexity before product-market clarity exists
* Does not reduce the core UX and pedagogy risk

### Guided-only learning versus hybrid learning

Selected:
* Hybrid mission plus sandbox model

Rationale:
* Matches the strongest parts of Tynker, ScratchJr, and Scratch together
* Better supports both onboarding and long-term creative retention

### Open community versus safe circles

Selected:
* Safe circles for V1

Rationale:
* Better fit for child safety, moderation cost, and guardian trust
* Preserves future expansion path without overcommitting early

## Follow-on Work Candidates

* Start the first child-journey feature slice on top of the new scaffold
* Deepen build, lint, and workspace automation once the first feature slice is chosen
* Map family-circle safety flows into API starter modules
