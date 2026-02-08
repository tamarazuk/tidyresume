# Publishing Hardening Incremental Task Backlog

This is an execution checklist derived from `docs/PUBLISHING_HARDENING_PLAN.md`.

## How We’ll Work
- Ship in small, reversible batches.
- Keep each batch independently testable.
- Prefer client-only changes before server contract changes.
- Merge only when batch acceptance checks pass.

## Status Legend
- `ready`: scoped and ready to implement.
- `in_progress`: currently being implemented.
- `blocked`: waiting on dependency.
- `done`: merged and validated.

## Batch 0: Baseline (already completed in working tree)
### T0.1 Ownership hardening in public view
- `status`: `done`
- `goal`: Require local ownership proof (`id + editSecret`) before owner UI/actions.
- `key files`:
  - `src/hooks/use-owner-check.ts`
  - `src/stores/resume-store.ts`
- `acceptance`:
  - owner controls do not appear with id-only matches.
  - duplicate local matches prefer strongest draft (has secret, newest).

### T0.2 Remove passive auto-unpublish
- `status`: `done`
- `goal`: Never unpublish from background status/theme/content sync hooks.
- `key files`:
  - `src/hooks/use-remote-status.ts`
  - `src/hooks/use-resume-sync.ts`
  - `src/hooks/use-public-resume-theme-sync.ts`
- `acceptance`:
  - passive checks set error state, do not clear publish fields.

### T0.3 Initial regression tests
- `status`: `done`
- `goal`: Lock in core owner-check and viewer behavior.
- `key files`:
  - `src/hooks/__tests__/use-owner-check.test.ts`
  - `src/components/public-view/__tests__/resume-viewer.test.tsx`
- `acceptance`:
  - tests pass and cover owner/visitor split for secret/no-secret cases.

## Batch 1: Draft-Scoped Public Controls
### T1.1 Add draft-scoped store actions
- `status`: `done`
- `goal`: Eliminate active-draft coupling for public-view owner actions.
- `changes`:
  - Add explicit draft-scoped setters:
    - `setDraftSyncStatus(draftId, status)`
    - `setDraftSlug(draftId, slug)`
    - `setDraftTheme(draftId, partialTheme)`
    - `setDraftTitle(draftId, title)` or equivalent targeted update helpers.
- `key files`:
  - `src/stores/resume-store.ts`
- `acceptance`:
  - no public-view hook relies on active-draft-only setter.

### T1.2 Wire public-view hooks to `draftId`
- `status`: `done`
- `goal`: Ensure public owner operations mutate only viewed draft.
- `changes`:
  - Update hooks to require/use `draftId`:
    - `use-slug-settings.ts`
    - `use-public-resume-theme-sync.ts`
    - `use-editable-resume-title.ts`
  - Pass `draftId` from public-view components where needed.
- `key files`:
  - `src/hooks/use-slug-settings.ts`
  - `src/hooks/use-public-resume-theme-sync.ts`
  - `src/hooks/use-editable-resume-title.ts`
  - `src/components/public-view/resume-viewer.tsx`
  - `src/components/layout/slug-settings.tsx`
- `acceptance`:
  - editing slug/theme/title on `/r/[slug]` updates viewed draft only.

### T1.3 Add clash-focused tests for public draft targeting
- `status`: `done`
- `goal`: Prevent regressions where public controls mutate active draft.
- `tests`:
  - with two local drafts, opening public view for draft A should never mutate draft B.
  - sync/error status updates apply to viewed draft id.
- `key files`:
  - `src/components/public-view/__tests__/resume-viewer.test.tsx`
  - new hook tests as needed.
- `acceptance`:
  - deterministic test pass in multi-draft mismatch setup.

## Batch 2: Publish/Republish Contract
### T2.1 Make republish deterministic for stale remote id
- `status`: `done`
- `goal`: Publishing with stale `id` creates a new remote record instead of failing.
- `changes`:
  - Service and/or route logic:
    - existing id + valid secret -> update.
    - existing id + invalid secret -> 401.
    - missing id in DB -> create new.
- `key files`:
  - `src/app/api/resumes/publish/route.ts`
  - `src/services/resume-service.ts`
- `acceptance`:
  - no 500 on stale id republish path.

### T2.2 Return publish metadata and handle id replacement client-side
- `status`: `done`
- `goal`: Client can reliably adopt new id/editSecret after republish.
- `changes`:
  - Add `created: boolean` (or `mode`) to publish response.
  - Update `use-publish.ts` and sync hooks to handle id replacement cleanly.
- `key files`:
  - `src/app/api/resumes/publish/route.ts`
  - `src/lib/resume-api.ts`
  - `src/hooks/use-publish.ts`
- `acceptance`:
  - local draft keeps same `draftId` but safely rotates remote `id` when server recreates.

### T2.3 Add publish contract tests
- `status`: `done`
- `goal`: Lock 401/update/create semantics.
- `key files`:
  - `src/app/api/resumes/publish/__tests__/route.test.ts`
  - `src/services/__tests__/resume-service.publish.test.ts`
- `acceptance`:
  - update/unauthorized/stale-id-create all explicitly asserted.

## Batch 3: Magic Link Authorization
### T3.1 Require ownership proof on token generation
- `status`: `done`
- `goal`: Prevent unauthorized token generation for public resumes.
- `changes`:
  - Require `X-Edit-Secret` in `POST /api/auth/generate-token`.
  - Validate against resume’s current `editSecret`.
  - Reject missing/invalid secret with 401.
- `key files`:
  - `src/app/api/auth/generate-token/route.ts`
- `acceptance`:
  - cannot generate token without valid owner secret.

### T3.2 Update Magic Link dialog request contract
- `status`: `done`
- `goal`: Ensure owner flow works from UI with new auth requirement.
- `changes`:
  - Send `X-Edit-Secret` from owner draft in dialog submit.
  - Disable or block dialog submission when owner proof unavailable.
- `key files`:
  - `src/components/public-view/magic-link-dialog.tsx`
  - any hook used to resolve owner draft/editSecret.
- `acceptance`:
  - owner can request token.
  - viewer cannot request token.

### T3.3 Token auth tests
- `status`: `done`
- `goal`: Guarantee new token issuance constraints.
- `tests`:
  - missing secret -> 401
  - invalid secret -> 401
  - valid secret -> 200 + token stored
- `key files`:
  - add/update tests in `src/app/api/auth/generate-token/__tests__/`
- `acceptance`:
  - all auth-gate paths covered.

## Batch 4: Explicit Unpublish UX + Idempotency
### T4.1 Make explicit unpublish idempotent
- `status`: `done`
- `goal`: 404 on explicit unpublish should still clear local publish state.
- `changes`:
  - Handle API 404 as success-equivalent in:
    - `use-publish.ts`
    - `public-view/unpublish-button.tsx`
- `acceptance`:
  - already-deleted remote does not trap local draft in published state.

### T4.2 Improve user-facing error states
- `status`: `done`
- `goal`: Clear distinction between unauthorized, conflict, and transient failures.
- `changes`:
  - normalize user toasts/messages for publish/slug/theme/unpublish.
  - avoid generic “failed” when actionable reason exists.
- `acceptance`:
  - errors are specific and map to correct remediation.

## Batch 5: Final Regression and Release Readiness
### T5.1 Add passive-status tests
- `status`: `done`
- `goal`: Guarantee passive checks never unpublish.
- `tests`:
  - remote 404 from passive check sets `syncStatus='error'` only.
- `key files`:
  - new tests for `use-remote-status.ts`
- `acceptance`:
  - explicit assertion that publish fields are unchanged.

### T5.2 End-to-end clash scenarios
- `status`: `done`
- `goal`: Validate cross-browser and cross-resume behavior.
- `scenarios`:
  - A views B’s resume while editing A’s draft.
  - Magic link open in fresh browser updates only intended resume.
  - stale id republish recovers cleanly.
- `key files`:
  - `e2e/publishing-clash-scenarios.spec.ts`
  - `e2e/helpers.ts`
- `acceptance`:
  - scenario matrix asserts active-draft isolation and no cross-draft mutation.
  - stale-id republish path rotates `id`/`editSecret` on the same local draft.

### T5.2 Implementation Notes
- `effort`: `medium`
- `notes`:
  - Added multi-draft localStorage seed/read helpers for deterministic e2e setup.
  - Added scenario-matrix test coverage for cross-resume navigation, fresh-browser magic-link import, and stale-id republish.
  - Kept assertions centered on persisted store shape to verify draft targeting directly.

## Per-Batch Validation Checklist
Run after each batch:

```bash
pnpm test:once
pnpm cf-typegen
pnpm lint
pnpm build
```

## Suggested PR Breakdown
1. PR-A: Batch 1 + related tests.
2. PR-B: Batch 2 + tests.
3. PR-C: Batch 3 + tests.
4. PR-D: Batch 4 + Batch 5 + final regression sweep.

## Immediate Next Task
All tasks in this hardening sequence are complete.
