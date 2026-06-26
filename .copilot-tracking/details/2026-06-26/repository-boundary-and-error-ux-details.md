<!-- markdownlint-disable-file -->
---
description: Execution details for repository boundary and error UX hardening work
---

## Context References

* Plan: `.copilot-tracking/plans/2026-06-26/repository-boundary-and-error-ux-plan.instructions.md`
* Research: `.copilot-tracking/research/2026-06-26/repository-boundary-and-error-ux-research.md`

## Phase Details

### Phase 1

* Add repository interfaces in the API layer rather than the shared package so the storage seam remains server-owned
* Keep JSON-backed implementations thin and colocated with persistence code
* Preserve current runtime behavior by creating a default repository bundle

### Phase 2

* Use `buildApp` with isolated temp storage to cover the full happy path in one test
* Validate persisted reads instead of only emitted events

### Phase 3

* Centralize API error creation in the server
* Keep UI changes local with a small parser helper per app or shared helper if the duplication becomes meaningful
* Prioritize field-level validation feedback over generic transport text

## Per-Step Success Criteria

* Repository seam compiles without changing route behavior
* Integration test fails if any surface stops sharing persisted state
* Frontend tests verify structured error messages are visible