# Implementation Plan: Synchronized Scroll Rework

## Phase 1: Foundation & Toggle Control [checkpoint: 86bcadf]
Establish the control mechanism and hook structure for the new sync behavior.

- [x] Task: Create `useSynchronizedScroll` hook skeleton [6154039]
    - [x] Create `src/components/editor/hooks/use-synchronized-scroll.ts`
    - [x] Define the hook interface: `(editorRef, previewRef, isEnabled) => void`
    - [x] Add basic event listener setup/teardown logic (no sync logic yet).
    - [x] Write unit tests to verify event listeners are attached/detached correctly.
- [x] Task: Implement Sync Toggle in Editor UI [7a2c958]
    - [x] Update `src/stores/editor-view-store.ts` to add `isSyncScrollEnabled` state (persisted).
    - [x] Create `SyncScrollToggle` component in `src/components/editor/components/`.
    - [x] Integrate toggle into the editor footer or toolbar.
    - [x] Write unit tests for the toggle component and store updates.
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md) [86bcadf]

## Phase 2: Core Mapping Logic [checkpoint: 53fa2b4]
Implement the "Hybrid/Block Mapping" strategy to calculate scroll positions.

- [x] Task: Implement `getScrollAnchors` utility [838a3ca]
    - [x] Create `src/components/editor/utils/scroll-sync.ts`.
    - [x] Implement function to extract anchor points (H1-H3, HR) from the editor (CodeMirror/TextArea).
    - [x] Implement function to find corresponding DOM elements in the preview.
    - [x] Write unit tests with mock HTML/Markdown content to verify anchor extraction.
- [x] Task: Implement `calculateScrollPosition` logic [e50cb22]
    - [x] Implement the interpolation logic: given a scroll position in Source A, find the two nearest anchors, calculate percentage between them, and apply to Source B.
    - [x] Handle edge cases: Top of document (0%), Bottom of document (100%), and sections with no anchors.
    - [x] Write unit tests for the calculation logic.
- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md) [53fa2b4]

## Phase 3: Integration & Performance
Connect the logic to the UI and ensure smooth performance.

- [x] Task: Integrate `useSynchronizedScroll` into Editor [6498ad2]
    - [x] Connect the hook to the actual Editor and Preview components.
    - [x] Use `requestAnimationFrame` or `throttle` to limit scroll event frequency (target 60fps).
    - [x] Implement the "Active Scroller" detection (prevent infinite scroll loops between editor and preview).
- [x] Task: Optimize for Complex Layouts [cd71af0]
    - [x] Test with the "A4" resume layout and complex grids.
    - [x] Adjust anchor detection to account for absolute positioning or print-specific CSS if necessary.
- [x] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md) [06fbc13]

## Phase 4: Polish & Final Review
Refine the experience and ensure quality.

- [ ] Task: Visual Polish
    - [ ] (Optional) Add subtle visual cues when sync is active/inactive.
    - [ ] Ensure the scroll movement feels "natural" (use smooth scrolling behavior where appropriate).
- [ ] Task: Final End-to-End Testing
    - [ ] Verify bidirectional syncing works flawlessly on long documents.
    - [ ] Verify toggle persistence works after page reload.
- [ ] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)
