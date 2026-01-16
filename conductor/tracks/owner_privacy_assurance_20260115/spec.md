# Specification: Owner Privacy Assurance & Preview Mode

## Overview
When an owner views their public resume, they see editing controls (toolbar, title edit buttons, etc.) that visitors do not see. This track adds visual cues to reassure owners that these controls are private and provides a "Preview" mode to see the exact visitor experience.

## Functional Requirements

### 1. "Owner View" Indicator
- Add a subtle badge or icon to the main editor toolbar labeled "Owner View".
- Include a tooltip on this indicator explaining: "Only you can see these editing controls. Visitors see a clean version of your resume."

### 2. "Preview as Visitor" Toggle
- Add a toggle switch (or icon button) to the main toolbar labeled "Preview".
- **Toggle ON (Preview Mode):**
  - Hide all editing-related UI elements:
    - Main toolbar formatting buttons (the toolbar itself should stay visible but minimized or "ghosted" to keep the toggle accessible).
    - Edit icons/buttons around the resume title.
    - Hover states that indicate editability.
  - The "Preview" toggle must remain visible and functional to allow returning to "Edit" mode.
- **Toggle OFF (Edit Mode):**
  - Show all standard editing controls.

### 3. State Management
- Use local component state (or the existing `editor-view-store`) to track the `isPreviewMode` status.
- Ensure the state defaults to `false` (Edit Mode) on page load.

## Non-Functional Requirements
- **Performance:** Toggling should be instantaneous without page reloads.
- **Accessibility:** The toggle and badge must be keyboard-accessible and have appropriate ARIA labels.

## Acceptance Criteria
- [ ] The "Owner View" badge is visible to owners on the public resume page.
- [ ] Hovering over the badge shows the explanatory tooltip.
- [ ] The "Preview" toggle is visible in the toolbar.
- [ ] Toggling "Preview" to ON hides all edit buttons and formatting tools.
- [ ] Toggling "Preview" to OFF restores all editing controls.
- [ ] Non-owners (visitors) never see the badge, the toggle, or any editing controls.

## Out of Scope
- Permanent "public" links (handled by existing slug logic).
- Changes to the "Viral Loop CTA" (should remain visible to visitors even if the owner is in preview mode, though owners never see it anyway).
