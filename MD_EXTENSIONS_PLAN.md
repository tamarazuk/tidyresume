# Markdown Extensions Task List

## 1) Parser & Rendering
- [x] Locate the markdown parsing pipeline (editor preview + public view) that currently handles the verbose `[[...]]` syntax.
- [x] Add parsing rules for shorthand tokens:
  - [x] Split line: `Left || Right` and `[[Left || Right]]` (escape handling for `\|\|`).
  - [x] Accent rule: `+++` and `[[HR:accent]]`.
  - [x] Page break: `///` and `[[PAGEBREAK]]` (ensure existing verbose still works).
- [x] Ensure shorthand parsing respects the spec:
  - [x] `+++` must be its own line.
  - [x] Split lines allow inline styling on each side.
  - [x] Raw syntax remains in the editor; preview/public render transformed output.
- [x] Map output to the required class names:
  - [x] `.split-line`, `.split-line__left`, `.split-line__right`, `.divider--accent`, `.page-break`.

## 2) Styling
- [x] Add or extend CSS in the resume preview/public styles to implement:
  - [x] Split line as a justified flex row with left/right alignment.
  - [x] Accent rule as a thicker decorative divider.
  - [x] Page break styling for print/PDF.
- [ ] Verify styling in both preview (`.resume-preview-theme`) and public view (`.resume-view`).

## 3) Toolbar UX
- [x] Add separate divider controls:
  - [x] Divider button inserts `---`.
  - [x] Accent divider button inserts `+++`.
- [x] Add a “Split line” button that inserts `Text || Text` and selects both sides for editing.
- [x] Add or confirm a “Page break” button that inserts `///` (or keep in Insert menu per plan).
- [x] Update toolbar labels/tooltips to match the naming table.

## 4) Documentation
- [ ] Add a quick reference section in `README.md` covering all three shortcuts.
- [ ] Include a short example snippet that visually shows each output.
- [ ] Note that verbose `[[...]]` syntax still works alongside shorthand.

## 5) Validation
- [ ] Manually verify:
  - [ ] Editor shows raw shorthand, preview renders expected output.
  - [ ] Public view renders the same as preview.
  - [ ] Print/PDF page break works.
- [ ] Run `pnpm lint` or relevant tests if needed after changes.
