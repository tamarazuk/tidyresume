# TidyResume

A markdown-based resume builder that lets you create professional resumes in Markdown with local-first saving and PDF export. Shareable URLs are coming soon.

![TidyResume Editor](/.github/images/editor-preview.png)

## Features

- **Markdown Editor** — Write your resume in familiar Markdown syntax with live preview
- **Local-first Saving** — Drafts stay in your browser (no account required)
- **PDF Export** — Print or export a clean, ATS-friendly PDF
- **Shareable URLs** — Publishing is coming soon
- **Multiple Templates** — Additional layouts are coming soon
- **Dark Mode** — Editor UI supports dark mode (preview stays light)

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

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── (marketing)/       # Landing page route group
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │   └── privacy-policy/
│   │       └── page.tsx
│   ├── edit/              # Resume editor page
│   │   └── page.tsx
│   ├── layout.tsx         # Root layout
├── styles/
│   ├── globals.css        # Global styles, Tailwind imports
│   ├── print.css          # Print styles for PDF export
│   └── theme.css          # CSS custom properties (colors, shadows, etc.)
├── components/
│   ├── editor/            # Markdown editor components
│   ├── layout/            # Header, navigation
│   ├── marketing/         # Landing page sections
│   └── ui/                # Reusable UI primitives
├── stores/                # Zustand stores (editor state, drafts)
├── lib/
│   └── utils.ts           # Utility functions (cn, etc.)
└── providers/
    └── theme-provider.tsx # next-themes wrapper
```

## Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm format     # Format code with Prettier
```

## Design System

The app uses a dual-color scheme:

- **App UI (Indigo `#6366f1`)** — Used for buttons, links, and interactive elements
- **Resume Output (Blue `#2b9dee`)** — Used in the resume preview/templates via `.resume-theme` class

This separation ensures the app has personality while resumes remain universally professional.

## Printing and PDF export

TidyResume supports browser-native printing: use the print button in the editor, or your browser's File → Print/print shortcut. The print view is scoped so only the resume renders (no app chrome), and you can save to PDF using the browser's built-in print dialog.

## Component Library Note

When adding new UI primitives, use Base UI (`@base-ui/react`) instead of Radix.

## Roadmap

- [x] Markdown editor with live preview
- [x] Landing page
- [x] Dark mode support
- [ ] Publish flow with shareable URLs
- [ ] Edit via secret token (no auth)
- [ ] PDF export
- [ ] Multiple resume templates
- [ ] Guided editor mode (form-based)
- [ ] Custom slug selection

## Contributing

This is a personal portfolio project, but suggestions and feedback are welcome! Feel free to open an issue.

## License

MIT
