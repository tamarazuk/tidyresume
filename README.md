# <img src="https://tidyresume.tzuk.app/logo-icon.svg" alt="TidyResume" width="32" align="top" />&nbsp;&nbsp;TidyResume

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?style=flat&logo=tailwindcss&logoColor=38BDF8)](https://tailwindcss.com/)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/tamarazuk/tidyresume?utm_source=oss&utm_medium=github&utm_campaign=tamarazuk%2Ftidyresume&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

A local-first Markdown resume builder with live preview, resume theming, shareable links, and print-ready output.

![TidyResume Editor - Light Mode](/.github/images/tidyresume-editor-preview-light.png)

![TidyResume Editor - Dark Mode](/.github/images/tidyresume-editor-preview-dark.png)

## Features

- **Markdown Editor** — Write your resume in Markdown with live preview and resume-specific shortcuts
- **Local-first Drafts** — Drafts stay in your browser (no account required)
- **Resume Appearance** — Accent colors, font families, sizing, and spacing controls
- **Shareable Links** — Publish to a public URL with an optional custom slug
- **Magic-Link Editing** — Continue editing on another device via email link
- **Auto Sync + Unpublish** — Changes sync after publishing, with one-click unpublish
- **PDF Export** — One-click download or print from your browser — both ATS-friendly
- **Dark Mode** — Editor UI supports light/dark themes and preview theming

## How it works

- Write locally in the editor; drafts stay in your browser.
- Publish to Cloudflare D1 and share at `/r/[slug]` (slug optional).
- Use a magic link to edit elsewhere; updates auto-sync while published.

## Markdown Extensions

Quick reference for resume-specific shortcuts (shorthand and verbose forms are both supported):

| Feature | Shorthand | Verbose | Output |
| --- | --- | --- | --- |
| Split line | `Left \|\| Right` | `[[Left \|\| Right]]` | Left/right aligned line |
| Accent divider | `+++` | `[[HR:accent]]` | Thick accent divider |
| Page break | `///` | `[[PAGEBREAK]]` | Page break for print/PDF |

Example (raw Markdown in editor):

```md
# Maya Sandoval
## Senior Software Engineer

San Francisco, CA ・ maya@example.com ・ portfolio.example.dev ・ (555) 123-4567

+++

## Professional Summary
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

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, custom components + shadcn/ui patterns (Base UI primitives)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Editor:** md-editor-rt
- **Theming:** next-themes
- **State:** zustand (localStorage persistence)
- **Database:** Cloudflare D1 + Drizzle ORM
- **Email:** Resend + React Email
- **Hosting/Runtime:** OpenNext Cloudflare (Workers)
- **Icons:** Phosphor Icons
> Waiting for Cloudflare/OpenNext to fully support Next 16 before upgrading the framework version.

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

# Start the dev server (runs local D1 migrations)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.
Need a fresh local database? Run `pnpm migrate:local`.

## Environment Variables

Create `.env.local` if you want to send magic links or customize base URLs.

- `NEXT_PUBLIC_APP_URL` — Base URL used for magic links (defaults to request origin).
- `NEXT_PUBLIC_SITE_URL` — Site URL for metadata/SEO.
- `RESEND_API_KEY` — Resend API key for production.
- `RESEND_DEV_API_KEY` — Resend API key for development.
- `EMAIL_FROM` — From address for outbound emails.
- `DISABLE_OUTBOUND_EMAILS` — Set to `true` to disable all emails.
- `DISABLE_MAGIC_LINK_EMAILS` — Legacy flag to disable magic-link emails.

## Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm test       # Run Vitest
pnpm lint       # Run ESLint
pnpm format     # Format code with Prettier
```

## Docs

- Development notes: `docs/DEVELOPMENT.md`

## Roadmap

_Last updated: January 2026_

- [x] 🎯 Markdown editor with live preview
- [x] 🖼️ Landing page
- [x] 🌙 Dark mode support
- [x] 🚀 Publish flow with shareable URLs
- [x] 🪄 Magic link editing (no auth)
- [x] 🖨️ Print to PDF (browser)
- [x] 🧾 PDF export (one-click)
- [ ] 📚 Multiple resume templates
- [ ] 🧭 Guided editor mode (form-based)
- [x] 🔗 Custom slug selection
- [x] 🎨 Resume appearance customization (accent, typography, spacing)

## Contributing

Suggestions and feedback are welcome! Feel free to open an issue or start a discussion. For development details, see `docs/DEVELOPMENT.md`.

## License

MIT. See `LICENSE`.
