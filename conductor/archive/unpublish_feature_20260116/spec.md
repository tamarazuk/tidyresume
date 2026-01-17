# Specification: Unpublish Feature & Remote Status Sync

## Overview
Change the current "Delete" functionality to an "Unpublish" model. Instead of erasing all data, "Unpublishing" will remove the resume from the remote database (making the public link 404) while preserving all Markdown content and settings in the user's local storage. Additionally, the app will periodically verify if a resume still exists on the server to ensure the UI stays in sync across multiple devices.

## User Stories
- As a user, I want to take my resume offline without losing the work I've done locally.
- As a user working on multiple devices, I want to see the correct "Publish" state if I've unpublished or deleted the resume from another machine.

## Functional Requirements

### 1. Unpublish Action
- **UI Update**: Replace the Trash icon in the editor header with a `CloudSlash` icon.
- **Labeling**: Update tooltips and confirmation dialogs to use "Unpublish" instead of "Delete".
- **Logic**:
    - The "Unpublish" action will trigger the `DELETE` API call to the backend.
    - **Crucially**, it will NOT clear the `id`, `slug`, or `editSecret` from the local `resume-store`.
    - It will reset the `syncStatus` to `idle` (or a state representing "Not Published").
- **Confirmation**: Show a standard dialog: *"Are you sure? Your public link will stop working immediately."*

### 2. Remote Status Sync (Existence Check)
- **Automatic Verification**: The app will check the remote status of a published resume in the following scenarios:
    - **On Load**: When the editor or public view (owner mode) is first mounted.
    - **On Visibility Change**: When the user switches back to the browser tab.
- **Handling Deletion/Unpublish**:
    - If the check returns a `404 Not Found`, the local `syncStatus` will be updated to reflect that the resume is no longer online.
    - The UI will immediately switch from "View/Unpublish" buttons back to the "Publish" button.
- **Fail-safe**: If a background sync attempt fails because the resume no longer exists in the DB, the app will gracefully transition the UI to the "Unpublished" state.

## Technical Details
- **API**: Use existing `GET /api/resumes/[id]` for existence checks.
- **Hooks**: Update `use-resume-sync.ts` or create a new `use-remote-status.ts` to handle the periodic validation.
- **Store**: Ensure `resume-store.ts` handles the state transition without wiping content.

## Acceptance Criteria
- Clicking "Unpublish" makes the public URL return a 404.
- After unpublishing, the editor still contains the user's Markdown content.
- If a resume is deleted from the DB (e.g., via another device or manual API call), the current editor UI updates to show "Publish" after the next focus or reload.
- The editor header uses the `CloudSlash` icon for the unpublish action.

## Out of Scope
- Restoring previously deleted resumes that were already wiped from local storage.
- A "Trash Bin" for the remote database (deletion remains permanent on the server).
