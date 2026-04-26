-- Add screenshot metadata columns to ecosystem_apps
-- Run this in Supabase SQL Editor

alter table public.ecosystem_apps
  add column if not exists screenshot_url text,
  add column if not exists screenshot_path text;

create index if not exists idx_ecosystem_apps_screenshot_path on public.ecosystem_apps(screenshot_path);

