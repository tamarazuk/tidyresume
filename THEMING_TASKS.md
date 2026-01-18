# Resume Theming Tasks

## Phase 1 — Accent Color (In Progress)
- [x] Add theme storage in DB (new `theme` column on `resumes`)
- [x] Wire theme through publish/sync + public view
- [x] Add appearance UI (accent swatches)
- [x] Default accent uses brand indigo (logo color)
- [x] Add migration + sync Drizzle snapshots
- [ ] Apply migration to local D1 for testing (`pnpm migrate:local`)
- [ ] Verify: switching accent updates preview + persists after publish

## Phase 2 — Typography (Planned)
- [x] Decide heading/body font options and CSS variable mapping
- [x] Add controls to Appearance panel
- [x] Store typography in `resumeDisplay.theme.typography`
- [x] Apply typography in preview + public view
- [ ] Verify persistence through publish/sync

## Phase 3 — Font Size (Planned)
- [ ] Define scale tokens (e.g., `sm | md | lg`)
- [ ] Add UI control and storage
- [ ] Apply to resume preview styles
- [ ] Verify print output

## Follow-ups
- [ ] Consider adding a tiny “reset to default” action in Appearance
- [ ] Optional: add preset theme dropdown (later)
