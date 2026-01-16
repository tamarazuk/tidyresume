# Implementation Plan: Security and Sync Hardening

This plan follows the TDD-first workflow defined in `conductor/workflow.md`.

## Phase 1: Robust Slug Uniqueness [checkpoint: be914d5]
Refactor slug assignment to rely on database constraints for race-condition safety.

- [x] Task: Write failing integration tests for slug collisions during `publishResume` 6494dec
- [x] Task: Implement `isUniqueConstraintViolation` helper for D1/SQLite 6494dec
- [x] Task: Update `publishResume` service to catch uniqueness errors and throw a specific "Slug already taken" error 6494dec
- [x] Task: Ensure the API route returns `409 Conflict` on slug collision 6494dec
- [x] Task: Conductor - User Manual Verification 'Phase 1: Robust Slug Uniqueness' (Protocol in workflow.md) be914d5

## Phase 2: Rate Limiting for Token Generation [checkpoint: fb0ef23]
Protect the magic link endpoint from abuse using Cloudflare's native rate limiting.

- [x] Task: Update `wrangler.jsonc` to include the `rate-limit` binding 3254e9c
- [x] Task: Write failing tests for `POST /api/auth/generate-token` exceeding limits (mocking the binding) 3254e9c
- [x] Task: Implement rate limiting logic in the `generate-token` API route 3254e9c
- [x] Task: Conductor - User Manual Verification 'Phase 2: Rate Limiting for Token Generation' (Protocol in workflow.md) fb0ef23

## Phase 3: Secure Resume Deletion
Implement ownership verification for both claimed and anonymous resumes.

- [x] Task: Update schema to support `deleteSecret` for anonymous resumes 6494dec
- [x] Task: Write failing tests for `DELETE /api/resumes/[id]` (unauthorized, claimed owner, anonymous with secret) 6494dec
- [x] Task: Update `publishResume` to generate and return `deleteSecret` for new anonymous resumes 6494dec
- [x] Task: Update frontend to store `deleteSecret` in localStorage for anonymous resumes 6494dec
- [x] Task: Implement ownership verification in the `DELETE` API route 6494dec
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Secure Resume Deletion' (Protocol in workflow.md)

## Phase 4: Reliable Resume Sync
Enhance the sync mechanism with automatic retries and a manual recovery UI.

- [x] Task: Write failing unit tests for `useResumeSync` retry logic (using fake timers) 6494dec
- [x] Task: Implement exponential backoff retry in `useResumeSync` (up to 3 attempts) 6494dec
- [x] Task: Update the editor footer to include a "Retry" button when sync remains in error state 6494dec
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Reliable Resume Sync' (Protocol in workflow.md)

## Future Tasks
- [ ] Task: Re-test email rate limiting in a production-like environment (Preview/Staging) to confirm limits are enforced.