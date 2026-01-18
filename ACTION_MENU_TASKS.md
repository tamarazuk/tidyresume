# Action Menu Refactor Tasks

## Goals
- Reduce editor header crowding by moving secondary actions into an ellipsis action menu.
- Keep the existing toolbar actions for now (first pass duplicates) until the new layout is approved.

## Tasks
- [x] Sketch action menu layout in `src/components/layout/header.tsx` so the right side becomes `[⋯] [Publish]`.
- [x] Add a new action menu trigger (ellipsis icon button) using the existing dropdown menu component.
- [x] Duplicate the following actions into the menu (do not remove existing toolbar items yet):
  - [x] Print (with ⌘P shortcut label; calls `window.print()`).
  - [x] Appearance (reuses `AppearanceSettings` behavior).
  - [x] Edit link (reuses `SlugSettings`, shown only when published).
  - [x] Unpublish (shown only when published, confirm flow stays intact).
  - [x] Dark/Light mode toggle (reuses `ThemeToggle`).
- [x] Icon mapping (use existing icons where possible; pick a menu icon for the trigger):
  - [x] Print: `PrinterIcon`.
  - [x] Appearance: `PaletteIcon`.
  - [x] Edit link: `LinkSimpleIcon`.
  - [x] Unpublish: `CloudSlashIcon`.
  - [x] Dark/Light mode: `MoonIcon` / `SunIcon` via `ThemeToggle`.
  - [x] Menu trigger: choose `DotsThreeVerticalIcon` (kebab) unless we decide otherwise.
- [x] Add a visual separator before the Dark/Light mode section.
- [x] Ensure menu items have icons, labels, and accessible aria text matching existing button behavior.
- [ ] Verify header spacing and alignment across responsive breakpoints.

## Public View Header Tasks
- [x] Add action menu to public view header with two layouts based on viewer:
  - [x] Owner view menu: Print, Appearance, Edit link, Unpublish, then separator, then Dark/Light mode.
  - [x] Visitor view menu: Print, Appearance, then separator, then Dark/Light mode.
- [x] Keep the primary right-side action as `[⋯] [Print]` for both owner and visitor views.
- [x] Reuse existing components/handlers for print, appearance, edit link, unpublish, and theme toggle.
- [x] Ensure menu items include icons and shortcut hints (⌘P for Print).
- [x] Validate owner/visitor switching logic so menus match permissions.

## Follow-up (after layout is approved)
- [x] Remove redundant toolbar actions once the action menu placement is finalized.
- [ ] Revisit shortcut hints/tooltip duplication after actions are consolidated.

## Follow-up Fixes (post-review)
- [x] Swap menu trigger icon to `DotsNineIcon` for stronger visibility.
- [x] Ensure menu items show pointer cursor on hover for clear click affordance.
- [ ] Fix menu action handlers:
  - [x] Print should open the print dialog.
  - [x] Unpublish should show the confirmation alert and execute correctly.
  - [x] Edit link popover input should accept typing.
- [x] Update theme toggle menu label to reflect state:
  - [x] “Switch to dark mode” when in light mode.
  - [x] “Switch to light mode” when in dark mode.
