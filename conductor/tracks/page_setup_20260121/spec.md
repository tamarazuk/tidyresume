# Track: Page Setup & Margins (Feature)

## Overview
This feature adds a "Page Setup" section to the Appearance settings, allowing users to customize the print margins of their resume. This ensures users can maximize space or create a more spacious layout depending on their content density.

## Functional Requirements

### 1. Data Model Updates
- Update `ResumeThemeSettings` in `src/types/resume.ts` to include page margin settings:
    ```typescript
    page?: {
      margins?: {
        top: number // in mm
        right: number // in mm
        bottom: number // in mm
        left: number // in mm
      }
    }
    ```
- Default values: `15mm` for all sides (matches current `--preview-paper-padding`).

### 2. Appearance Settings UI
- **Location:** Add a new section titled "Page Setup" in the `AppearanceSettings` popover, located below the "Typography" section.
- **Inputs:**
    - Four number inputs: Top, Bottom, Left, Right.
    - Unit label: "mm" (fixed).
    - Step value: 1mm (or 0.5mm if granular control is needed).
    - Min/Max constraints (e.g., min 0mm, max 50mm).
- **Locking Mechanism:**
    - **Vertical Lock:** A toggle button (link icon) between Top and Bottom inputs.
    - **Horizontal Lock:** A toggle button (link icon) between Left and Right inputs.
    - **Behavior:**
        - When locked, changing one value updates its pair automatically.
        - Toggling lock 'on' should sync the second value to match the first immediately.

### 3. Resume Styling Implementation
- **Preview View:** Inject these margin values as CSS variables (e.g., `--page-margin-top`, etc.) into the resume container.
- **Print View (`@page`):** Since standard CSS variables are often not supported in `@page` rules in some browsers, implement a dynamic `<style>` injection or use a compatible method to ensure the margins are respected when the user prints (Cmd+P).

## Non-Functional Requirements
- **Performance:** Updates should be "real-time" or "near real-time" (debounced if necessary) in the preview.
- **Responsiveness:** The Appearance popover is already quite dense; ensure the new inputs fit comfortably, possibly using a 2x2 grid for the inputs.

## Acceptance Criteria
- [ ] Users can open the Appearance menu and see the "Page Setup" section.
- [ ] Changing margin values immediately updates the resume preview whitespace.
- [ ] "Locking" Top/Bottom keeps them synced.
- [ ] "Locking" Left/Right keeps them synced.
- [ ] Printing the resume (or Print Preview) reflects the custom margins accurately.
- [ ] Settings are persisted to the resume data and restored on reload.
