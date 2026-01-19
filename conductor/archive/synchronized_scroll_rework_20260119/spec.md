# Specification: Synchronized Scroll Rework

## Overview
Re-engineer the synchronized scroll mechanism in TidyResume to address alignment issues caused by custom CSS and complex resume layouts. This rework will replace or heavily augment the default `md-editor-rt` scroll logic with a custom, more robust implementation tailored for resume editing.

## Goals
- Achieve reliable, bidirectional synchronized scrolling between the Markdown editor and the Resume preview.
- Ensure alignment remains accurate even with complex CSS (grids, page breaks, varying block heights).
- Provide a smooth, high-performance scrolling experience without "jitter".

## Functional Requirements
- **Bidirectional Sync:** Scrolling the editor updates the preview, and scrolling the preview updates the editor.
- **Hybrid/Block Mapping Strategy:** 
    - Use "anchor" elements (Headers H1-H3, horizontal rules, and major section blocks) as primary synchronization checkpoints.
    - Interpolate scroll positions between these anchors to maintain fluidity.
- **Sync Toggle:** Add a control in the editor (toolbar or footer) to enable/disable synchronized scrolling.
- **State Persistence:** The toggle state should be persisted (locally) so it remains consistent across sessions.

## Non-Functional Requirements
- **Performance (A):** Implementation must use efficient event listeners and throttling/debouncing to target 60fps scrolling and avoid "scroll jank".
- **Maintainability:** The logic should be decoupled from the core renderer as much as possible to allow for future resume theme updates without breaking sync.

## Acceptance Criteria
- [ ] Scrolling to a header in the editor accurately scrolls the preview to the corresponding rendered header.
- [ ] Scrolling the preview to a specific section accurately scrolls the editor to the corresponding markdown source.
- [ ] The "Sync Scroll" toggle correctly enables/disables the behavior.
- [ ] No noticeable performance degradation or layout shifting during active scrolling.

## Out of Scope
- Implementing "Scroll to Click" (clicking a block to jump to it) - this may be a separate track.
- Support for syncing deeply nested elements within complex components (e.g., inside a custom table component) if they lack anchor points.
