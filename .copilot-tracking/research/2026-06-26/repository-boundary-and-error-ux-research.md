<!-- markdownlint-disable-file -->
---
description: Focused research for repository abstractions, cross-surface happy path coverage, and API error UX hardening
---

## Scope

* Continue the previously suggested next work items after validating them against the current codebase
* Introduce repository boundaries between Fastify route modules and persistence details
* Add one happy-path test spanning onboarding and progress surfaces
* Normalize API error payloads for frontend consumption

## Assumptions

* Storage remains JSON-file-backed for now, but the API should stop depending on that concrete implementation at the route-module boundary
* The requested end-to-end coverage can be satisfied with an API integration test that spans the adult setup and child progress surfaces through `buildApp`
* Frontend changes should remain local to the existing Next.js pages rather than introducing a broader state library

## Evidence Log

* `services/platform-api/src/modules/onboarding.ts` instantiates `JsonFileStore` directly for children and adults
* `services/platform-api/src/modules/progress.ts` instantiates `JsonFileStore` directly for progress records
* `services/platform-api/src/modules/projects.ts` and `services/platform-api/src/modules/family-circle.ts` do the same for their domains
* `services/platform-api/src/modules/onboarding.test.ts` and `services/platform-api/src/modules/progress.test.ts` cover each surface independently, but not the parent setup to child mission flow together
* `services/platform-api/src/modules/validation.ts` returns Zod flatten output directly under `details`, which is inconsistent with the ad hoc 404 responses and not ergonomic for the frontends
* `apps/adult-portal/src/app/page.tsx` and `apps/child-client/src/app/page.tsx` only show generic status failures and do not parse structured error bodies

## Alternatives Considered

### Keep direct `JsonFileStore` usage and only add tests

Rejected. That would not prepare the API for SQLite or Postgres migration and would leave the route modules owning infrastructure concerns.

### Move to a generic repository base class only

Partially useful, but not sufficient by itself. The boundary the user asked for is an explicit interface between route modules and persistence implementation. Domain-shaped repository interfaces are the more stable seam.

### Add browser-level end-to-end tests now

Rejected for this slice. The cheapest discriminating check is an API integration test that exercises both surfaces with shared persisted state. Browser automation would widen scope without improving confidence proportionally.

## Selected Approach

* Create explicit repository interfaces and a default repository bundle backed by `JsonFileStore`
* Update `buildApp` and route registration to accept injected repositories while keeping current runtime defaults
* Add one integration test that performs onboarding setup, child profile lookup, mission completion, and progress readback in a single app instance
* Standardize API errors to a shared shape with `error`, `message`, `fieldErrors`, and `statusCode`, then update both frontends to render these messages

## Actionable Next Steps

1. Add repository interface definitions and default JSON-backed implementations
2. Inject repositories through `buildApp` into route modules
3. Add the happy-path integration test and remove overlapping duplication only if it becomes unnecessary
4. Normalize validation and not-found errors
5. Update both frontends and their tests to render structured API errors