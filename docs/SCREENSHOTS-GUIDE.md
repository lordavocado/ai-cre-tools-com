# Screenshots Pipeline (Supabase Storage)

This repo supports attaching **real website screenshots** to each tool and rendering them in the frontend.

The design goal is simple:

- **Automation captures screenshots**
- **Images are stored in Supabase Storage**
- **`ecosystem_apps` stores the screenshot reference** (`screenshot_path` + optional `screenshot_url`)
- **Frontend reads the URL and renders it**

## Supabase one-time setup

### 1) Create a Storage bucket

Create a bucket named:

- `tool-screenshots`

Recommended settings:

- **Public bucket** (simplest for a public directory site)
- Keep the default size limits, and adjust later if needed

### 2) Add columns to `ecosystem_apps`

Run:

- `scripts/add-tool-screenshots-columns.sql`

This adds:

- `screenshot_url text`
- `screenshot_path text`

### 3) Service role key available to server/CI only

Screenshot capture + upload should run with:

- `SUPABASE_SERVICE_ROLE_KEY`

Never expose this key to the browser.

## Codebase structure

### Data layer mapping (read-only)

- `src/lib/supabase.ts`
  - Maps `screenshot_url` / `screenshot_path` to `DirectoryItem`

### Admin data layer mapping (service role)

- `src/lib/supabase-admin.ts`
  - Maps `screenshot_url` / `screenshot_path` to `AdminTool`

### Storage helper (server-only)

- `src/lib/tool-screenshots-storage.ts`
  - Uploads screenshot bytes to Supabase Storage
  - Returns the public URL (assumes public bucket)

## Capture & upload automation

### Local run (quick backfill)

This repo includes a baseline script using Puppeteer:

- `scripts/capture-tool-screenshots.mjs`

Env required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional env:

- `SCREENSHOT_BUCKET` (default: `tool-screenshots`)
- `SCREENSHOT_VIEWPORT_WIDTH` (default: `1440`)
- `SCREENSHOT_VIEWPORT_HEIGHT` (default: `900`)
- `SCREENSHOT_TIMEOUT_MS` (default: `30000`)
- `SCREENSHOT_LIMIT` (default: unlimited)
- `SCREENSHOT_ONLY_MISSING` (default: `true`)

Run:

```bash
node scripts/capture-tool-screenshots.mjs
```

### CI run (recommended)

Run the same script in GitHub Actions (or any cron runner) on a schedule.

Notes:

- Puppeteer downloads Chromium during install; CI should cache dependencies.
- Use `--no-sandbox` args (already included) for most Linux CI environments.

## What the next assistant should do (handoff checklist)

- Confirm the Supabase bucket `tool-screenshots` exists and is public.
- Run `scripts/add-tool-screenshots-columns.sql` in Supabase SQL editor.
- Run `node scripts/capture-tool-screenshots.mjs` locally once to validate:
  - uploads succeed
  - `ecosystem_apps.screenshot_path` and `ecosystem_apps.screenshot_url` are updated
- Add UI rendering:
  - Prefer `DirectoryItem.screenshotUrl` when present, otherwise fallback to `imageUrl` / placeholder.
- (Optional improvements)
  - Capture multiple variants (desktop + mobile)
  - Convert PNG → WebP for smaller payloads
  - Add DB fields: `screenshot_updated_at`, `screenshot_error`, `screenshot_status`
  - Add a GH Action scheduled job + on-demand manual dispatch

