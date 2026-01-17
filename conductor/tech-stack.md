# Technology Stack - TidyResume

The core technologies used in TidyResume, chosen for performance, type safety, and seamless deployment on the Cloudflare edge.

## Frontend
- **Framework:** Next.js 15/16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** `@base-ui/react` (Base UI) for unstyled primitives with custom Tailwind styling.
- **Icons:** `@phosphor-icons/react` (using the `Icon` suffix and `dist/ssr` imports).
- **State Management:** Zustand with persistence for local drafts.

## Backend & Persistence
- **Runtime:** Cloudflare Workers / Pages
- **ORM:** Drizzle ORM
- **Database:** Cloudflare D1 (SQLite)
- **Deployment:** Cloudflare Pages via OpenNext.
- **Email:** Resend for transactional magic link delivery.
- **Security:** Cloudflare Rate Limiting for abuse prevention on magic link and sync endpoints.

## Design & Theme
- **Theme:** `next-themes` for Dark/Light mode support.
- **App Color:** Indigo (`#6366f1`) for UI.
- **Resume Theme:** Blue (`#2b9dee`) for resume content.
