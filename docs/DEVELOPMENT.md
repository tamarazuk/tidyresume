# Development Notes

## Local development

- `pnpm dev` runs `pnpm migrate:local` before starting Next.js.
- `pnpm cf-typegen` generates `cloudflare-env.d.ts` from Wrangler bindings.

## Cloudflare commands

- `pnpm build:cf` builds the OpenNext Cloudflare output.
- `pnpm preview` runs the OpenNext preview worker locally.
- `pnpm deploy` or `pnpm deploy:cf` deploys to Cloudflare.

## Database migrations

When adding a new migration in `drizzle/`, update the schema snapshots in
`drizzle/meta` (`*_snapshot.json` files and `_journal.json`) so migrations stay
in sync.

## Design system

- App UI uses the brand accent for controls and marketing surfaces.
- Resume output uses its own accent palette (default indigo) so exported resumes
  stay neutral.

## Styling and theming

- Tailwind v4 configuration lives in CSS via `@theme` in `src/styles/theme.css`.
- Global styles live in `src/styles/globals.css`.
- Resume styling lives in `src/styles/resume/*`.
- Apply `.resume-theme` or `.resume-preview-theme` to switch resume accents.

## UI primitives

When adding new UI primitives, use Base UI (`@base-ui/react`) instead of Radix.
