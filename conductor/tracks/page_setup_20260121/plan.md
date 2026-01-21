# Plan: Page Setup & Margins

## Phase 1: Data Model & State Management [checkpoint: 4d28fd6]
- [x] Task: Update `ResumeThemeSettings` type in `src/types/resume.ts` 8eb6f28
- [x] Task: Implement `margins` state and actions in `useAppearanceSettings` hook 30fca29
- [x] Task: Conductor - User Manual Verification 'Data Model & State Management' (Protocol in workflow.md)

## Phase 2: UI Implementation
- [ ] Task: Create `MarginInput` sub-component for reuse in `AppearanceSettings`
- [ ] Task: Integrate "Page Setup" section into `src/components/appearance-settings/index.tsx`
    - [ ] Add section header and separator
    - [ ] Add 2x2 grid for Top, Bottom, Left, Right inputs
    - [ ] Add lock buttons with Phosphor icons
- [ ] Task: Conductor - User Manual Verification 'UI Implementation' (Protocol in workflow.md)

## Phase 3: Resume Styling & Print Support
- [ ] Task: Update `useResumeAppearanceClasses` or a new hook to provide margin CSS variables
- [ ] Task: Apply margin CSS variables to the resume preview container
- [ ] Task: Implement dynamic style injection for `@page` print margins
    - [ ] Ensure print layout respects the user's custom margins
- [ ] Task: Conductor - User Manual Verification 'Resume Styling & Print Support' (Protocol in workflow.md)
