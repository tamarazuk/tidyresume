# TidyResume modernization review (Next.js 16 + React 19 + TS + Tailwind)

This document lists improvements that would bring the codebase closer to current
best practices for a modern App Router app. Items are grouped by priority and
area, with file references for quick follow-up.

## Priority improvements

- [x] Remove stray debug output in the editor toolbar hook. This logs on every render
  and can impact perf in production. Ref: `src/components/editor/hooks/use-editor-toolbars.tsx`.
- [x] Add cleanup for editor event listeners. `editor.on(...)` is registered without
  an unsubscribe; repeated mounts or editor swaps can accumulate handlers. Ref:
  `src/components/editor/hooks/use-editor-toolbars.tsx`.
- [x] Guard localStorage writes for large data URLs. Image uploads are stored inline
  in markdown and then persisted to localStorage; large images can exceed quota
  and silently fail or throw. Consider file size limits, downscaling, or storing
  binary data in IndexedDB. Ref: `src/components/editor/hooks/use-editor-toolbars.tsx`,
  `src/stores/resume-store.ts`.
- [x] Sanitize external links consistently. Markdown links get `rel="noopener noreferrer"`
  via markdown-it, but raw HTML could bypass it because `sanitizeHtml` only allows
  attributes. Consider a `transformTags` step to enforce rel values. Ref:
  `src/lib/sanitize-html.ts`, `src/components/editor/config/editor-extensions.ts`.

## App Router and React 19 alignment

- [x] Reduce client boundaries for marketing routes. `SiteHeader` is fully client
  because it reads localStorage and uses theme toggle; split it into a server
  component with tiny client islands for the toggle and CTA label to lower the
  JS shipped to marketing pages. Ref: `src/components/marketing/site-header.tsx`,
  `src/components/ui/theme-toggle.tsx`.
- [x] Add route-level `loading.tsx`, `error.tsx`, and `not-found.tsx` to improve
  resiliency and perceived performance for App Router navigation. Ref:
  `src/app/(marketing)`, `src/app/edit`.
- [x] Add route metadata per page via `generateMetadata` and set a `metadataBase`
  in the root layout for consistent Open Graph and Twitter cards. Ref:
  `src/app/layout.tsx`, `src/app/(marketing)/page.tsx`,
  `src/app/(marketing)/privacy-policy/page.tsx`.
- [x] Add `app/icon.tsx` (or `app/favicon.ico`) to wire up the existing icon asset.
  The current `public/icon.svg` is not used by App Router conventions. Ref:
  `public/icon.svg`.

## Performance and bundle size

- Consider `reactStrictMode: true` in `next.config.ts` if not already enabled by
  default in your Next.js version. It helps catch side-effectful patterns.
  Ref: `next.config.ts`.
- Expand `optimizePackageImports` for other heavy libraries if needed (e.g.
  `@phosphor-icons/react` is already included); verify the bundle report for
  `md-editor-rt`, `@codemirror/*`, and `@base-ui/react`. Ref: `next.config.ts`,
  `package.json`.
- Add `app/edit/loading.tsx` instead of a heavy dynamic fallback to keep the
  editor skeleton co-located with the route and shareable for streaming. Ref:
  `src/components/editor/editor-client.tsx`, `src/app/edit`.

## State, persistence, and storage

- [x] Persist versioning: add a `migrate` function to handle future store changes,
  since the persisted schema is already versioned. Ref: `src/stores/resume-store.ts`.
- [x] Consider throttling or debouncing store updates rather than `setTimeout` in
  the store module to avoid global timers and to align with React 19 concurrent
  rendering. Ref: `src/stores/resume-store.ts`.
- [x] Track hydration state in a centralized hook or store utility so you do not
  need a separate `hydrated` boolean in multiple places as the app grows. Ref:
  `src/stores/resume-store.ts`, `src/components/layout/resume-title-input.tsx`.

## Security and content safety

- [x] Tighten `sanitizeHtml` configuration for images: disallow `data:image/svg+xml`
  entirely unless you explicitly want embedded SVG. It is currently filtered but
  allowlist logic can be simplified for clarity and maintainability. Ref:
  `src/lib/sanitize-html.ts`.
- [x] Add a max length guard for markdown input to prevent runaway memory usage
  from extremely large data URLs or pasted content. Ref:
  `src/stores/resume-store.ts`, `src/components/editor/editor.tsx`.

## Accessibility and UX

- [x] Make the hero mockup decorative for screen readers to avoid reading a large
  block of sample resume text twice. Add `aria-hidden` at the container level
  or convert to background imagery. Ref: `src/components/marketing/hero.tsx`.
- [x] Replace the placeholder `aria-label="ghost"` with a meaningful label or
  `aria-hidden` on the disabled theme toggle skeleton. Ref:
  `src/components/ui/theme-toggle.tsx`.
- [x] Add `prefers-reduced-motion` handling for animated pulse placeholders so users
  who reduce motion do not get continuous animation. Ref:
  `src/components/editor/editor-client.tsx`, `src/styles/globals.css`.

## SEO and content quality

- Add explicit canonical URLs and Open Graph images for marketing pages.
  This improves share previews and avoids duplicate content confusion. Ref:
  `src/app/layout.tsx`, `src/app/(marketing)/page.tsx`

## Tailwind and styling

- Consider extracting shared editor styles into CSS layers that are only loaded
  on the edit route (via `app/edit/layout.tsx`) to avoid shipping editor CSS to
  marketing pages. Ref: `src/components/editor/editor.tsx`, `src/styles/globals.css`.
- Add a print stylesheet entry in the `@media print` scope for the editor route
  only; currently globals apply everywhere. Ref: `src/styles/print.css`,
  `src/app/edit/layout.tsx`.

## Testing and tooling

- [x] Add component tests for the editor toolbar/footers and image handling logic,
  since they include non-trivial logic and direct DOM usage. Ref:
  `src/components/editor/hooks/use-editor-toolbars.tsx`,
  `src/components/editor/hooks/use-editor-footers.tsx`.
- [x] Add `@testing-library/jest-dom` for richer assertions in `vitest` and include
  a `setupTests.ts` to align with modern React 19 testing patterns. Ref:
  `vitest.config.ts`, `package.json`.
