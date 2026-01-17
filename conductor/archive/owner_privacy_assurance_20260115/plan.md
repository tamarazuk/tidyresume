# Implementation Plan: Owner Privacy Assurance & Preview Mode

This plan outlines the steps to implement a "Preview" mode and privacy indicators for resume owners on the public view.

## Phase 1: State & Foundation
Setup the state management and basic visibility logic.

- [x] Task: Define `isPreviewMode` in `editor-view-store.ts` d36e43d
- [x] Task: Create `PreviewProvider` or update existing providers
    - [x] Decided to use `useEditorViewStore` directly for simplicity and performance.
- [x] Task: Implement `OwnerViewBadge` component
- [x] Task: Implement `PreviewToggle` component
- [x] Task: Integrate components into `Toolbar`
- [x] Task: Update `Editor` and `Toolbar` buttons visibility
- [x] Task: Update `EditableResumeTitle` visibility
- [x] Task: Verify Hover States
    - [x] Confirmed that switching components and filtering toolbar handles hover states.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Visibility Integration' (Protocol in workflow.md)

## Phase 4: Cleanup & Final Polish
Refinement and accessibility checks.

- [x] Task: Accessibility Audit
    - [x] Toggle uses `aria-pressed` and `aria-label`. Badge uses `role="status"`.
- [x] Task: Conductor - Final Track Review
