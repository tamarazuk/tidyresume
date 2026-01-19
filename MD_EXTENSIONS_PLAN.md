# Markdown Extensions Task List

## 1) Parser & Rendering
- [ ] Locate the markdown parsing pipeline (editor preview + public view) that currently handles the verbose `[[...]]` syntax.
- [ ] Add parsing rules for shorthand tokens:
  - [ ] Split line: `Left || Right` and `[[Left || Right]]` (escape handling for `\|\|`).
  - [ ] Accent rule: `+++` and `[[HR:accent]]`.
  - [ ] Page break: `>>>` and `[[PAGEBREAK]]` (ensure existing verbose still works).
- [ ] Ensure shorthand parsing respects the spec:
  - [ ] `+++` must be its own line.
  - [ ] Split lines allow inline styling on each side.
  - [ ] Raw syntax remains in the editor; preview/public render transformed output.
- [ ] Map output to the required class names:
  - [ ] `.split-line`, `.split-line__left`, `.split-line__right`, `.divider--accent`, `.page-break`.

## 2) Styling
- [ ] Add or extend CSS in the resume preview/public styles to implement:
  - [ ] Split line as a justified flex row with left/right alignment.
  - [ ] Accent rule as a thicker decorative divider.
  - [ ] Page break styling for print/PDF.
- [ ] Verify styling in both preview (`.resume-preview-theme`) and public view (`.resume-view`).

## 3) Toolbar UX
- [ ] Update the divider button to a split button:
  - [ ] Primary action inserts `---`.
  - [ ] Dropdown option inserts `+++` labeled “Accent rule”.
- [ ] Add a “Split line” button that inserts `Text || Text` and selects both sides for editing.
- [ ] Add or confirm a “Page break” button that inserts `>>>` (or keep in Insert menu per plan).
- [ ] Update toolbar labels/tooltips to match the naming table.

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
