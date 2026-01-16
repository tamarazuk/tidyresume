# Implementation Plan: Unpublish Feature & Remote Status Sync

Change the "Delete" model to "Unpublish" to preserve local data while removing remote visibility, and implement periodic existence checks to keep UI in sync across devices.

## Phase 1: Backend & Service Refinement
Update the service layer to handle the "Unpublish" semantic and prepare for status checks.

- [x] Task: Update `deleteResume` service logic if needed (currently it's a hard delete, which is fine for "unpublish")
- [x] Task: Ensure `publishResume` service correctly handles re-publishing an existing ID after it has been deleted from the DB (verified during spec phase)
- [x] Task: Verify `GET /api/resumes/[id]` properly returns 404 for non-existent/unpublished resumes
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend & Service Refinement' (Protocol in workflow.md)

## Phase 2: Unpublish UI & Logic
Refactor the frontend to use the "Unpublish" terminology and preserve local state.

- [x] Task: Update `useResumeStore` to include a method for resetting sync status without clearing resume data
- [x] Task: Refactor the Delete dialog/button in the editor to use the `CloudSlash` icon and "Unpublish" labels
- [x] Task: Update the unpublish handler to call the delete API but retain the local `id`, `slug`, and `deleteSecret`
- [x] Task: Conductor - User Manual Verification 'Phase 2: Unpublish UI & Logic' (Protocol in workflow.md)

## Phase 3: Remote Status Sync (Existence Checks)
Implement the background logic to detect if a resume has been unpublished elsewhere.

- [x] Task: Create or update a hook (e.g., `use-remote-status.ts`) to perform existence checks via `GET /api/resumes/[id]`
- [x] Task: Trigger existence check on editor/viewer mount and browser tab focus
- [x] Task: Implement logic to update `resume-store` sync status to `idle` (or similar) if the check returns 404
- [x] Task: Ensure the UI updates immediately (switching "View" back to "Publish") when a 404 is detected
- [x] Task: Conductor - User Manual Verification 'Phase 3: Remote Status Sync' (Protocol in workflow.md)

## Phase 4: Error Handling & Edge Cases
Ensure robustness during sync failures and edge cases.

- [x] Task: Update `use-resume-sync.ts` to detect 404 errors during auto-save and transition to "Unpublished" state instead of showing a persistent sync error
- [x] Task: Verify that re-publishing a previously unpublished resume works seamlessly (same ID, new deleteSecret)
- [x] Task: Conductor - User Manual Verification 'Phase 4: Error Handling & Edge Cases' (Protocol in workflow.md)
