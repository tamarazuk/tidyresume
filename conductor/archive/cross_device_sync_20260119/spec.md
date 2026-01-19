# Cross-Device Pull Sync & Conflict Handling

## Summary
The editor currently pushes local changes to the server but never pulls changes made on other devices. This spec defines a lightweight pull-sync strategy that detects newer remote updates, keeps local state accurate, and resolves conflicts when local edits diverge from remote.

## Goals
- Ensure edits made on device A become visible on device B without manual reload.
- Prevent silent overwrites when local edits conflict with newer remote content.
- Keep implementation simple and low-risk (no new infrastructure required).
- Preserve the multi-resume local storage model (only affect the active resume).

## Non-goals
- Real-time collaboration (simultaneous multi-user editing).
- Full version history or timeline UI.
- Advanced merge UI beyond a minimal conflict prompt.

## Background (Current Behavior)
- `useResumeSync` pushes local changes to the server on a debounce.
- There is no pull mechanism to refresh local state from the server.
- If another device updates the resume, the local editor does not know unless it reloads.
- If the local editor continues editing, it can overwrite newer remote changes.

## Proposed Solution (Overview)
Add a pull strategy that:
1) Checks remote freshness on focus/visibility and optional intervals.
2) Compares remote `updatedAt` with local `lastSyncedAt`.
3) Auto-refreshes if local is clean, or prompts if local is dirty.

This establishes a minimal sync loop without introducing SSE/WebSockets.

## Data Model Changes (Local)
Extend each resume entry in local storage with:
- `lastSyncedAt: number | null` — timestamp of last successful publish or pull.
- `remoteUpdatedAt: number | null` — latest timestamp seen from remote.
- `localUpdatedAt: number | null` — timestamp of latest local edit.

Local dirty state is derived from:
- `localUpdatedAt > lastSyncedAt` or `saveStatus !== 'saved'`.

## API Considerations
Confirm that `GET /api/resumes/:id` returns `updatedAt`.
If payload size becomes a concern, add a lightweight metadata endpoint:
- `GET /api/resumes/:id/meta` → `{ id, updatedAt }`

## Client Behavior

### When Editor Loads
- Mark the active resume as "opened" and start sync checks.
- If published, fetch remote metadata on focus or visibility changes.

### On Focus / Visibility
1) Fetch remote `updatedAt`.
2) If `remoteUpdatedAt > lastSyncedAt`:
   - If local is clean: auto-refresh local from remote and update `lastSyncedAt`.
   - If local is dirty: enter conflict state.

### Optional Polling
- If enabled, poll metadata every 30–60s while the editor is visible.
- Pause when hidden or offline.

## Conflict Handling UX
When remote is newer and local is dirty, show a conflict prompt:
- **Use remote version**: discard local edits and replace with remote.
- **Keep local version**: keep current draft and push to remote on next publish.
- Optional later: **Review differences** with a basic diff.

## Resolution Rules
- Use remote:
  - Replace `title`, `content`, `theme` from server.
  - Set `lastSyncedAt = remoteUpdatedAt`.
  - Mark `syncStatus = 'synced'`.
- Keep local:
  - Leave local as-is.
  - Keep `syncStatus` in `unsaved`/`error` until next publish.
  - Optionally notify that next publish overwrites remote.

## Edge Cases / Risks
- Edit secret rotated: refresh edit secret during pull if provided by API.
- Multiple local resumes: ensure pull applies only to the active resume id.
- Offline: skip pull; on reconnect, run a freshness check.
- Large content: prefer metadata-only checks before full fetch.

## Testing Strategy
- Unit: conflict detection (dirty/clean states) and state transitions.
- Integration: focus-based pull updates from remote mock.
- Regression: ensure public view does not mutate local drafts.

## Rollout Notes
- Ship with focus-based pull only; add polling later if needed.
- Log conflict prompts to measure frequency and UX friction.

## Future Enhancements (Optional)
- SSE/WebSocket to push remote updates in real-time.
- 3-way merge for markdown (base/local/remote) with fallback prompt.
- Resume switcher UI for multi-resume storage.

## Plan (Phased)

### Phase 1 — Metadata & State Tracking
1) Add `lastSyncedAt`, `remoteUpdatedAt`, `localUpdatedAt` to each resume entry.
2) Ensure `/api/resumes/:id` returns `updatedAt` (or add `:id/meta`).
3) Update publish success to set `lastSyncedAt`.

### Phase 2 — Pull Strategy (Focus + Interval)
4) Fetch remote metadata on focus/visibility.
5) Compare `remoteUpdatedAt` vs `lastSyncedAt`.
6) Auto-refresh when clean, otherwise prompt.

### Phase 3 — Conflict Handling UI
7) Add a conflict prompt with “Use remote” / “Keep local”.
8) Implement resolution logic and update timestamps/statuses accordingly.

### Phase 4 — Merge (Optional)
9) Add diff/merge support for markdown; fall back on prompt if merge fails.

### Phase 5 — Real-Time (Optional)
10) Add SSE/WebSocket events for updates and reuse conflict logic.
