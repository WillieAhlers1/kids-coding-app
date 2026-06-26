<!-- markdownlint-disable-file -->
---
description: Change log for repository boundaries, happy-path integration coverage, and API error UX hardening
---

## Related Plan

* `.copilot-tracking/plans/2026-06-26/repository-boundary-and-error-ux-plan.instructions.md`

## Implementation Date

* 2026-06-26

## Summary Of Changes

Added explicit repository interfaces and JSON-backed implementations so the API route modules no longer instantiate `JsonFileStore` directly.

Added one family happy-path integration test that spans parent setup, child profile lookup, and mission completion persistence.

Standardized API validation and not-found errors to a consistent payload shape and updated both frontends to render field-level validation feedback.

## Added

* `.copilot-tracking/research/2026-06-26/repository-boundary-and-error-ux-research.md`
* `.copilot-tracking/plans/2026-06-26/repository-boundary-and-error-ux-plan.instructions.md`
* `.copilot-tracking/details/2026-06-26/repository-boundary-and-error-ux-details.md`
* `.copilot-tracking/plans/logs/2026-06-26/repository-boundary-and-error-ux-log.md`
* `.copilot-tracking/changes/2026-06-26/repository-boundary-and-error-ux-changes.md`
* `.copilot-tracking/reviews/2026-06-26/repository-boundary-and-error-ux-review.md`
* `services/platform-api/src/persistence/repositories.ts`
* `services/platform-api/src/modules/family-flow.test.ts`

## Modified

* `apps/adult-portal/src/app/page.tsx`
* `apps/adult-portal/src/app/page.test.tsx`
* `apps/child-client/src/app/page.tsx`
* `apps/child-client/src/app/page.test.tsx`
* `packages/shared-domain/src/index.ts`
* `services/platform-api/src/app.ts`
* `services/platform-api/src/modules/content.ts`
* `services/platform-api/src/modules/family-circle.ts`
* `services/platform-api/src/modules/onboarding.ts`
* `services/platform-api/src/modules/projects.ts`
* `services/platform-api/src/modules/progress.ts`
* `services/platform-api/src/modules/validation.ts`
* `.copilot-tracking/plans/2026-06-26/repository-boundary-and-error-ux-plan.instructions.md`

## Removed

* None

## Release Summary

* `npm run test -w services/platform-api; npm run test -w apps/adult-portal; npm run test -w apps/child-client`: passed
* `npm run typecheck`: passed