# Development Notes

## Local development

- `pnpm dev` runs `pnpm migrate:local` before starting Next.js.
- `pnpm cf-typegen` generates `cloudflare-env.d.ts` from Wrangler bindings.

## Cloudflare commands

- `pnpm build:cf` builds the OpenNext Cloudflare output.
- `pnpm preview` runs the OpenNext preview worker locally.
- `pnpm deploy` or `pnpm deploy:cf` deploys to Cloudflare.

## PDF Export

PDF export uses the Cloudflare Browser Rendering REST API, which requires remote execution. This feature cannot be tested with `pnpm dev` alone.

### Required Environment Variables

Set these in your `.env.local` file (see `.env.example`):

```
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_BROWSER_RENDERING_API_TOKEN=your-api-token
```

You can find your Account ID in the Cloudflare dashboard URL. Create an API token with Browser Rendering permissions at https://dash.cloudflare.com/profile/api-tokens.

### Testing PDF Export Locally

**Option 1: Use `pnpm preview` (Recommended)**

```bash
pnpm preview
```

This builds and runs the OpenNext preview worker, which has access to your Cloudflare environment variables and can call the Browser Rendering API.

**Option 2: Deploy to a preview branch**

Push your changes and test on a Cloudflare preview deployment.

### Debug Endpoint

To inspect the HTML that gets rendered to PDF, visit:

```
/api/resumes/[resume-id]/pdf/html
```

This returns the raw HTML without generating a PDF, useful for debugging styling issues.

### Known Limitations

- Chrome PDF rendering has a text layer bug with italicized text that can cause spaced characters on copy-paste
- This may affect ATS parsing of dates in italics, though manual testing with several ATS checkers (Jobscan, etc.) has not shown issues
- If ATS problems are reported, consider avoiding italics for critical content like dates, or explore Firefox rendering as an alternative

## Database migrations

When adding a new migration in `drizzle/`, update the schema snapshots in
`drizzle/meta` (`*_snapshot.json` files and `_journal.json`) so migrations stay
in sync.

## Design system

- App UI uses the brand accent for controls and marketing surfaces.
- Resume output defaults to the brand indigo accent but exposes accent/color, font, and spacing controls so people can choose what works best for their resume.

## Styling and theming

- Tailwind v4 configuration lives in CSS via `@theme` in `src/styles/theme.css`.
- Global styles live in `src/styles/globals.css`.
- Resume styling lives in `src/styles/resume/*`.
- Apply `.resume-theme` or `.resume-preview-theme` to switch resume accents.

## UI primitives

When adding new UI primitives, use Base UI (`@base-ui/react`) instead of Radix.

## Storybook

- `pnpm storybook` runs Storybook locally with co-located component stories.
- `pnpm storybook:check-coverage` verifies each render component has a co-located story file.
- `pnpm storybook:build` builds static Storybook output for CI validation.
