-- Locks an existing tool_submissions table to server-side secret/service-role access.
-- Run once in the Supabase SQL Editor after deploying the server-key submission flow.

begin;

alter table public.tool_submissions enable row level security;

drop policy if exists "Allow anonymous insert" on public.tool_submissions;
drop policy if exists "Allow read" on public.tool_submissions;
drop policy if exists "Allow update" on public.tool_submissions;
drop policy if exists "Allow delete" on public.tool_submissions;

revoke all on table public.tool_submissions from anon, authenticated;

commit;
