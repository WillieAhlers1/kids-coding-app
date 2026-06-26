<!-- markdownlint-disable-file -->
---
description: Implementation plan for repository boundaries, cross-surface happy path testing, and API error UX hardening
---

## User Requests

* Continue with the suggested next work items
* Review the prior plan carefully and the current codebase carefully before continuing
* Ensure the suggested work still makes sense before implementation
* Introduce explicit repository interfaces between route modules and persistence implementation to prepare for sqlite or postgres migration
* Add one cross-surface flow test covering parent setup, child profile load, and mission completion persistence
* Normalize API error payload shape and show structured field-level validation messages in both frontends

## Overview

This slice hardens the current scaffolding by separating API modules from concrete JSON storage, adding one end-to-end happy-path test across onboarding and progress, and making API failures usable in the two UI shells.

## Context Summary

* Prior architecture and scaffold artifacts exist under `.copilot-tracking/2026-06-26`
* The controlling coupling is in the API route modules, which instantiate `JsonFileStore` directly
* Existing tests are surface-local and do not cover the combined guided family flow
* Existing error handling returns inconsistent payloads and the frontends only display generic status text
* Relevant instructions followed for this plan:
  * `.github/instructions/hve-core/markdown.instructions.md`
  * `.github/instructions/hve-core/writing-style.instructions.md`

## Implementation Checklist

### Phase 1: Repository Boundary <!-- parallelizable: false -->

* [x] Define domain repository interfaces for onboarding, progress, projects, and family circles
* [x] Provide JSON-backed implementations behind those interfaces
* [x] Inject repositories through app construction and route registration

### Phase 2: Happy-Path Integration Test <!-- parallelizable: false -->

* [x] Add one integration test that exercises onboarding setup, child profile load, mission completion, and persisted progress readback
* [x] Keep or adjust existing narrower tests based on coverage overlap

### Phase 3: Error UX Hardening <!-- parallelizable: false -->

* [x] Standardize API validation and not-found error payloads
* [x] Add frontend helpers to parse API errors
* [x] Render structured field-level errors in both frontends and update tests

## Planning Log Reference

* `.copilot-tracking/plans/logs/2026-06-26/repository-boundary-and-error-ux-log.md`

## Dependencies

* Existing Fastify route modules in `services/platform-api/src/modules`
* Shared domain package in `packages/shared-domain`
* Vitest in the API and Next.js apps

## Success Criteria

* API route modules no longer instantiate `JsonFileStore` directly
* `buildApp` can be constructed with explicit repository implementations
* One integration test proves the adult-to-child happy path persists state across surfaces
* API validation failures and not-found failures return a consistent machine-readable shape
* Both frontends render useful field-level feedback from API errors
* Focused validation passes for the touched workspaces