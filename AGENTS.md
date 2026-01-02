# AGENTS.md

Guidelines for AI assistants working on this codebase.

## Project Overview

TidyResume is a markdown-based resume builder built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4. Users write resumes in Markdown, see a live preview, and save locally with PDF export; shareable URLs are coming soon.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (CSS-first config) |
| UI | Custom components, shadcn/ui patterns (Base UI primitives) |
| Icons | @phosphor-icons/react |
| Editor | md-editor-rt |
| Theming | next-themes |
| State | zustand (persist to localStorage) |
| Package Manager | pnpm |

## Architecture Decisions

### Routing
- Uses Next.js App Router with route groups
- `(marketing)` — Landing page + privacy policy
- `edit` — Resume editor
- Future: `[slug]` for public resume view, `edit/[token]` for editing

### Styling
- **Tailwind v4** — No `tailwind.config.ts`, everything in CSS via `@theme`
- **Theme variables** — Defined in `src/styles/theme.css` using CSS custom properties
- **Global styles** — `src/styles/globals.css` imports theme and defines layers
- **Dual color scheme:**
  - App UI uses Indigo (`--primary: oklch(0.5854 0.2041 277.1173)`)
  - Resume preview uses Blue via `.resume-theme` class (`--primary: #2b9dee`)

### Components
- Located in `src/components/`
- Organized by domain: `editor/`, `layout/`, `marketing/`, `ui/`
- UI primitives follow shadcn/ui patterns with `class-variance-authority`
- Use Base UI (`@base-ui/react`) instead of Radix when adding new primitives
- Use `cn()` utility from `src/lib/utils.ts` for conditional classes

### State Management
- Client-side only with zustand + persist (localStorage)
- Resume markdown, title, and image uploads are stored as data URLs in localStorage
- No backend yet; future: Cloudflare KV for published resumes

## Code Style

### TypeScript
- Strict mode enabled
- Prefer `interface` for object shapes, `type` for unions/primitives
- Export types alongside components when needed

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
1. Create directory in `src/app/`
2. Add `page.tsx` with default export
3. Optionally add `layout.tsx` for nested layout

### Adding a new component
1. Create file in appropriate `src/components/` subdirectory
2. Use existing UI primitives from `src/components/ui/` when possible
3. Follow the props interface pattern shown above

### Styling the resume preview
Apply `.resume-theme` class to the container to switch from indigo to blue accent:
```tsx
<div className="resume-theme">
  {/* Resume content uses blue accent colors */}
</div>
```

### Working with the markdown editor
The editor uses `md-editor-rt`. Custom styling lives in `src/components/editor/styles/` with preview overrides in `src/components/editor/styles/preview/` to keep the resume preview light-themed.

### Printing / PDF export
Printing is built-in: the editor has a print button, and browser print (menu or shortcut) prints only the resume content. Users can save to PDF using the browser's native print dialog.

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

## Known Issues / TODOs

- [ ] Need to add Cloudflare KV integration for publishing
- [ ] Public resume routes (`[slug]`, `edit/[token]`) not yet implemented
- [ ] Guided editor mode (form-based) not yet built
- [ ] Multiple resume templates

## Questions?

This is a portfolio project by [@tamarazuk](https://github.com/tamarazuk).
