# Implementation Plan: Owner Privacy Assurance & Preview Mode

This plan outlines the steps to implement a "Preview" mode and privacy indicators for resume owners on the public view.

## Phase 1: State & Foundation
Setup the state management and basic visibility logic.

- [x] Task: Define `isPreviewMode` in `editor-view-store.ts` d36e43d
- [x] Task: Create `PreviewProvider` or update existing providers
    - [x] Decided to use `useEditorViewStore` directly for simplicity and performance.
- [~] Task: Implement `OwnerViewBadge` component
- [ ] Task: Implement `PreviewToggle` component
    - [ ] Write tests to verify clicking the toggle updates the state.
    - [ ] Implement the toggle switch/button in the toolbar.
- [ ] Task: Integrate components into `Toolbar`
    - [ ] Position the badge and toggle according to the spec.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Toolbar Enhancements' (Protocol in workflow.md)

## Phase 3: Visibility Integration
Apply the `isPreviewMode` state to hide/show editing controls across the application.

- [ ] Task: Update `Editor` and `Toolbar` buttons visibility
    - [ ] Write tests to verify buttons are hidden when `isPreviewMode` is true.
    - [ ] Implement conditional rendering for formatting tools.
- [ ] Task: Update `EditableResumeTitle` visibility
    - [ ] Write tests to verify edit icons are hidden in preview mode.
    - [ ] Implement conditional rendering for title edit controls.
- [ ] Task: Verify Hover States
    - [ ] Ensure CSS-based hover indicators are disabled in preview mode.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Visibility Integration' (Protocol in workflow.md)

## Phase 4: Cleanup & Final Polish
Refinement and accessibility checks.

- [ ] Task: Accessibility Audit
    - [ ] Ensure ARIA labels and keyboard navigation for the new toggle.
- [ ] Task: Conductor - Final Track Review
