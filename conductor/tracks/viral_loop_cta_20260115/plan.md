# Implementation Plan - Viral Loop CTA

This plan follows the TDD-first workflow defined in `conductor/workflow.md`.

## Phase 1: Foundation & Owner Detection [checkpoint: ae18ff9]
Focus on creating the component structure and ensuring it only shows for visitors.

- [x] Task: Create the `ViralLoopCTA` component shell and base styling (d940fd2)
    - [x] Write tests for the `ViralLoopCTA` component (Red Phase)
    - [x] Implement the basic Pill structure with Tailwind v4 (Green Phase)
- [x] Task: Integrate `useOwnerCheck` logic (d940fd2)
    - [x] Write tests ensuring component is hidden when `isOwner` is true (Red Phase)
    - [x] Implement logic to return `null` if user is the owner (Green Phase)
- [x] Task: Integrate `ViralLoopCTA` into `src/app/r/[slug]/page.tsx` (4ddb98a)
    - [x] Verify the component renders in the page layout (Red Phase)
    - [x] Place component in the root div of the page (Green Phase)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Owner Detection' (Protocol in workflow.md)

## Phase 2: Timing & Animation
Add the 2-second delay and the slide-up entry animation.

- [x] Task: Implement the 2-second delay (af0d145)
    - [x] Write tests using fake timers to verify delayed visibility (Red Phase)
    - [x] Implement `useEffect` with `setTimeout` to manage visibility state (Green Phase)
- [x] Task: Add Slide-up Animation (a3f08fb)
    - [x] Write tests/Verify animation classes are applied correctly (Red Phase)
    - [x] Implement Tailwind transition/animation classes (Green Phase)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Timing & Animation' (Protocol in workflow.md)

## Phase 3: Interactions & Tooltip
Finalize the link behavior and hover states.

- [ ] Task: Implement New Tab Navigation
    - [ ] Write tests to verify clicking the button opens `/edit` in a new tab (Red Phase)
    - [ ] Implement `ButtonLink` or standard `a` tag with `target="_blank"` (Green Phase)
- [ ] Task: Add Hover Tooltip
    - [ ] Write tests for tooltip visibility on hover (Red Phase)
    - [ ] Implement tooltip using `@base-ui/react` primitives (Green Phase)
- [ ] Task: Hide from Print
    - [ ] Verify `print:hidden` is applied (Red Phase)
    - [ ] Implement `print:hidden` utility class (Green Phase)
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Interactions & Tooltip' (Protocol in workflow.md)

## Phase 4: Phase 4 Cleanup
Final Polish and check.

