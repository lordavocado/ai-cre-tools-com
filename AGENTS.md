# AGENTS.md

Guidance for AI coding agents (Cursor, Claude Code, Copilot, and similar tools) working in this repository.

## Read first

| Resource | Purpose |
|----------|---------|
| [CLAUDE.md](./CLAUDE.md) | Full project context: architecture, Supabase schema, env vars, cleanup standards, doc index |
| [.cursorrules](./.cursorrules) | Cursor-oriented rules: data layer patterns, categories, query ordering |
| [docs/](./docs/) | Detailed guides: config, environment, security, SEO, architecture, Supabase schema |

Start with **CLAUDE.md** for breadth; use **.cursorrules** when touching Supabase queries, `DirectoryItem`, or category slugs.

## Project in one paragraph

**AI CRE Tools** is a Next.js 15 App Router directory/marketplace for AI commercial real estate tools. Data lives in **Supabase** (`ecosystem_apps`). Categories are **hardcoded** in `src/lib/supabase.ts` (not in the DB). UI uses **Tailwind CSS**, **shadcn/ui** (`src/components/ui/`), and **https://openalternative.co/** as the design benchmark for layout, typography, and polish.

## Commands

```bash
npm run dev        # Dev server (Turbopack), port 9002
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript (no emit)
```

There is no automated test suite; validate with `typecheck`, `lint`, and manual checks in the browser.

## Agent expectations

1. **Scope** — Change only what the task requires; match existing patterns and imports.
2. **Data** — Fetch directory data from `src/lib/supabase.ts` on the **server**; keep ordering `display_order` ASC, then `name` ASC. Do not reintroduce legacy Sheets as the primary source for listings.
3. **Types** — Strict TypeScript; avoid `any`.
4. **Verification** — After substantive edits, run `npm run typecheck` and `npm run lint`.
5. **Cleanup** — Remove dead code, debug `console.log`s, and unused imports; document non-obvious public APIs as described in CLAUDE.md.
6. **Git commits** — Use the repo owner identity so GitHub/Coolify attribute pushes to `lordavocado`:
   - **Name:** `Nichlas Kvist Campos`
   - **Email:** `nichlaskvistj@gmail.com` (verified on the `lordavocado` GitHub account)
   - **Remote:** `https://github.com/lordavocado/ai-cre-tools-com.git`
   - Do not commit with Cursor/agent default emails or other GitHub accounts.
7. **Deployment** — Production runs on **Coolify** (Dockerfile, port 3000). Do not add Vercel config; push to `master` triggers Coolify rebuilds.

## High-signal paths

- `src/config/site.ts` — Site metadata and SEO templates
- `src/lib/supabase.ts` — Supabase client, queries, caching, category definitions
- `src/types/index.ts` — `DirectoryItem`, `Category`, etc.
- `src/app/` — Routes (`[slug]`, `categories/`, `api/`)
- `src/components/listing/`, `src/components/category/`, `src/components/layout/` — Feature UI

## Environment (overview)

Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`; optional `SUPABASE_SERVICE_ROLE_KEY`. Newsletter and PostHog are documented in CLAUDE.md and `docs/ENVIRONMENT_SETUP.md`.

## Optional workspace rules

If present, `.cursor/rules/` may add feature-specific instructions (for example favourites or PostHog). Respect them when editing related code.
