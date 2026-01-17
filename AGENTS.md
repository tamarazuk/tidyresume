# AGENTS.md

Guidelines for AI assistants working on this codebase.

## Safety & File Operations

- **NEVER overwrite files** (especially configuration files like `.env`, `wrangler.jsonc`, etc.) without reading them first.
- Always check the current content of a file before modifying it.
- Prefer appending or merging changes over replacing the entire file content, unless explicitly instructed to overwrite.

### Code Modification Best Practices

- **Preserve Integrity:** When using the `replace` tool, ensure you identify a unique block of code to replace, but **NEVER truncate** the surrounding code or the function body unless explicitly intended.
- **Context is Key:** Always include enough context in your `old_string` to ensure uniqueness, but verify that your `new_string` contains the *complete* replacement logic, including any closing braces or return statements that were part of the original block.
- **Read First:** Always read the file content immediately before modifying it to ensure you are working with the latest version.
- **Verify:** After any modification, read the file again or run a quick build/test to ensure no syntax errors were introduced (e.g., missing `}`).

## Project Overview

TidyResume is a markdown-based resume builder built with Next.js 15 (App Router), TypeScript, and Tailwind CSS v4. Users write resumes in Markdown, see a live preview, and export/print to PDF. Drafts are stored locally; publishing saves to Cloudflare D1 and generates a shareable public view at `/r/[slug]`.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (CSS-first config) |
| UI | Custom components, shadcn/ui patterns (Base UI primitives) |
| Icons | @phosphor-icons/react |
| Editor | md-editor-rt |
| Theming | next-themes |
| State | zustand (persist to localStorage) |
| Database | Drizzle ORM + Cloudflare D1 |
| Hosting/Runtime | OpenNext Cloudflare (edge runtime for routes) |
| Package Manager | pnpm |

## Architecture Decisions

### Routing
- Uses Next.js App Router with route groups.
- `(marketing)` — Landing page + privacy policy.
- `edit` — Resume editor.
- `r/[slug]` — Public resume view.
- `api/resumes/publish` — Publish/upsert resume.
- `api/resumes/[id]` — Fetch/delete resume by id or slug.
- Future: `edit/[token]` for token-based editing.

### Data Flow and Persistence
- Local draft state: `src/stores/resume-store.ts` (zustand + persist).
- Publishing: `src/hooks/use-publish.ts` (manual publish) and `src/hooks/use-resume-sync.ts` (debounced sync once an id exists).
- Cloud DB: `src/db/index.ts` (Drizzle D1 client) + `src/services/resume-service.ts` (CRUD helpers).
- Owner detection: `src/hooks/use-owner-check.ts` compares local id to public view id.

### Styling
- **Tailwind v4** — No `tailwind.config.ts`, everything in CSS via `@theme`.
- **Theme variables** — `src/styles/theme.css` with CSS custom properties.
- **Global styles** — `src/styles/globals.css` imports theme and defines layers.
- **Resume theming** — `.resume-theme` and `.resume-preview-theme` switch accents and preview colors.
- **Public/preview containers** — `.resume-view` for shared preview styles; `.resume-view-full` for full-width mode.
- **Printing** — `src/styles/print.css` targets `.editor-page` and `.resume-view` containers.

### Components
- Located in `src/components/`.
- Organized by domain: `editor/`, `layout/`, `marketing/`, `public-view/`, `ui/`.
- UI primitives follow shadcn/ui patterns with `class-variance-authority`.
- Use Base UI (`@base-ui/react`) instead of Radix when adding new primitives.
- Use `cn()` utility from `src/lib/utils.ts` for conditional classes.

### Editor + Toolbars
- Editor styling lives in `src/components/editor/styles/` with preview overrides in `src/components/editor/styles/preview/`.
- Toolbar config: `src/components/editor/hooks/toolbar-items.tsx` and `src/components/editor/hooks/use-editor-toolbars.tsx`.
- Footer config: `src/components/editor/hooks/footer-items.tsx` and `src/components/editor/hooks/use-editor-footers.tsx`.

## Code Style

### TypeScript
- Strict mode enabled.
- Prefer `interface` for object shapes, `type` for unions/primitives.
- Export types alongside components when needed.

### Components
```tsx
// Prefer named exports for components
export default function ComponentName() { }

// Props interface above component
interface ComponentNameProps {
  title: string
  onAction?: () => void
}

// Use destructuring with defaults
export default function ComponentName({
  title,
  onAction,
}: ComponentNameProps) { }
```

### React 19
- **Avoid `forwardRef`**: React 19 allows passing `ref` as a regular prop to function components. Do not use `forwardRef`.
- **Use Actions**: Prefer React Server Actions for form submissions and mutations where applicable.

### Styling
```tsx
// Use cn() for conditional classes
import { cn } from '@/lib/utils'

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)} />

// Prefer Tailwind classes over inline styles
// Use CSS variables for theme values: bg-primary, text-foreground, etc.
```

### Imports
```tsx
// Order: React/Next, external libs, internal (@/), relative, styles
import { useState } from 'react'
import Link from 'next/link'
import { Sun } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import './styles.css'
```

## File Naming

- Components: `PascalCase.tsx` or `kebab-case.tsx` (project uses kebab-case)
- Utilities: `kebab-case.ts`
- Pages: `page.tsx` (Next.js convention)
- Layouts: `layout.tsx` (Next.js convention)

## Common Patterns

### Adding a new page
1. Create directory in `src/app/`.
2. Add `page.tsx` with default export.
3. Optionally add `layout.tsx` for nested layout.

### Adding a new component
1. Create file in appropriate `src/components/` subdirectory.
2. Use existing UI primitives from `src/components/ui/` when possible.
3. Follow the props interface pattern shown above.

### Styling the resume preview
Apply `.resume-theme` or `.resume-preview-theme` to the container to switch to the resume accent colors:
```tsx
<div className="resume-theme">
  {/* Resume content uses blue accent colors */}
</div>
```

### Printing / PDF export
Printing is built-in: the editor and public view provide print buttons, and browser print (menu or shortcut) prints only the resume content. Users can save to PDF using the browser's native print dialog.

## Testing

Vitest is configured for unit tests with Testing Library and jsdom. Prefer Playwright for E2E tests if/when added.

## Common Tasks

### Format code
```bash
pnpm format
```

### Check linting
```bash
pnpm lint
```

### Build for production
```bash
pnpm build
```

### Phosphor Icons
The `@phosphor-icons/react` package has deprecated all icon component names without the suffix of `Icon`.
- **Incorrect**: `import { PencilSimple } from '@phosphor-icons/react'`
- **Correct**: `import { PencilSimpleIcon } from '@phosphor-icons/react'`
Please ensure all new imports and existing ones are using the `Icon` suffix.

## Known Issues / TODOs

- [ ] Guided editor mode (form-based) not yet built.
- [ ] Multiple resume templates.
- [ ] Token-based edit URLs (`edit/[token]`) not yet implemented.

## Questions?

This is a portfolio project by [@tamarazuk](https://github.com/tamarazuk).
