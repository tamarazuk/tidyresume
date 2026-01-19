# <img src="https://tidyresume.tzuk.app/logo-icon.svg" alt="TidyResume" width="32" align="top" />&nbsp;&nbsp;TidyResume

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?style=flat&logo=tailwindcss&logoColor=38BDF8)](https://tailwindcss.com/)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/tamarazuk/tidyresume?utm_source=oss&utm_medium=github&utm_campaign=tamarazuk%2Ftidyresume&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

A markdown-based resume builder that lets you create professional resumes in Markdown with local-first saving, PDF export, and shareable links.

![TidyResume Editor - Dark Mode](/.github/images/editor-preview-dark.png)

![TidyResume Editor - Light Mode](/.github/images/editor-preview-light.png)

## Features

- **Markdown Editor** — Write your resume in familiar Markdown syntax with live preview
- **Local-first Saving** — Drafts stay in your browser (no account required)
- **Print to PDF** — Use your browser to export a clean, ATS-friendly PDF
- **One-click PDF Export** — Coming soon
- **Shareable URLs** — Publish and share a public link
- **Multiple Templates** — Additional layouts are coming soon
- **Dark Mode** — Editor UI supports dark mode (preview stays light)

## Markdown Extensions

Quick reference for resume-specific shortcuts (shorthand and verbose forms are both supported):

| Feature | Shorthand | Verbose | Output |
| --- | --- | --- | --- |
| Split line | `Left &#124;&#124; Right` | `[[Left &#124;&#124; Right]]` | Left/right aligned line |
| Accent divider | `+++` | `[[HR:accent]]` | Thick accent divider |
| Page break | `///` | `[[PAGEBREAK]]` | Page break for print/PDF |

Example (raw Markdown in editor):

```md
# Maya Sandoval
## Senior Software Engineer

San Francisco, CA ・ maya@example.com ・ portfolio.example.dev ・ (555) 123-4567

+++

## Profesional Summary
Product-minded senior engineer with 7+ years building...

## Experience
**Senior Software Engineer** @ Stripe || *2022 — Present*
- Architected a real-time fraud detection pipeline...

///

## Volunteering

**Mentor** — TechCareer Mentorship Program
- Helped early-career engineers with interview prep...
```

Notes:
- Split lines support inline formatting (e.g., `**Bold** || 2020`).
- Verbose `[[...]]` syntax works everywhere the shorthand does.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Custom components + shadcn/ui patterns (Base UI primitives)
- **Icons:** Phosphor Icons
- **Editor:** md-editor-rt
- **Theming:** next-themes
- **State:** zustand (localStorage persistence)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/tamarazuk/tidyresume.git
cd tidyresume

# Install dependencies
pnpm install

# Generate Cloudflare binding types (D1, R2, etc.)
pnpm cf-typegen

# Create/apply local D1 schema
pnpm migrate:local

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm format     # Format code with Prettier
```

## Database Migrations

When adding a new migration in `drizzle/`, make sure to update the schema snapshots in `drizzle/meta` (the `*_snapshot.json` files and `_journal.json`) so migrations stay in sync.

## Design System

The app uses a dual-color scheme:

- **App UI (Indigo `#6366f1`)** — Used for buttons, links, and interactive elements
- **Resume Output (Indigo by default)** — The resume preview uses the brand indigo by default, with user-selectable accent colors

This separation ensures the app has personality while resumes remain universally professional.

## Printing and PDF export

TidyResume supports browser-native printing: use the print button in the editor, or your browser's File → Print/print shortcut. The print view is scoped so only the resume renders (no app chrome), and you can save to PDF using the browser's built-in print dialog.

## Component Library Note

When adding new UI primitives, use Base UI (`@base-ui/react`) instead of Radix.

## Roadmap

- [x] Markdown editor with live preview
- [x] Landing page
- [x] Dark mode support
- [x] Publish flow with shareable URLs
- [ ] Edit via secret token (no auth)
- [x] Print to PDF (browser)
- [ ] PDF export
- [ ] Multiple resume templates
- [ ] Guided editor mode (form-based)
- [x] Custom slug selection

## Contributing

This is a personal portfolio project, but suggestions and feedback are welcome! Feel free to open an issue.

## License

MIT. See `LICENSE`.
