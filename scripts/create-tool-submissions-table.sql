-- Create tool_submissions table for AI CRE Tools
-- Run this in your Supabase SQL Editor

-- Drop existing table if it exists (WARNING: this will delete existing data)
drop table if exists public.tool_submissions cascade;

-- Create the table fresh
create table public.tool_submissions (
  submission_id    text primary key,
  website          text not null,
  email            text not null,
  comment          text not null,
  slug             text,
  name             text,
  category         text,
  features         text,
  one_liner        text,
  description      text,
  country          text,
  city             text,
  icon_link        text,
  research_status  text not null default 'pending',
  submitted_at     timestamptz not null default now(),
  status           text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Create indexes for common queries
create index idx_tool_submissions_status on public.tool_submissions(status);
create index idx_tool_submissions_submitted_at on public.tool_submissions(submitted_at desc);
create index idx_tool_submissions_email on public.tool_submissions(email);

-- Enable Row Level Security
alter table public.tool_submissions enable row level security;

-- Policy: Allow anonymous users to insert submissions (for the public form)
create policy "Allow anonymous insert" on public.tool_submissions
  for insert
  with check (true);

-- Policy: Allow all users to read submissions (needed for admin dashboard)
create policy "Allow read" on public.tool_submissions
  for select
  using (true);

-- Policy: Allow all users to update submissions (needed for admin actions)
create policy "Allow update" on public.tool_submissions
  for update
  using (true);

-- Policy: Allow delete (needed for admin to remove invalid submissions)
create policy "Allow delete" on public.tool_submissions
  for delete
  using (true);

-- Auto-update updated_at timestamp
create or replace function update_tool_submissions_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_tool_submissions_updated_at on public.tool_submissions;

create trigger update_tool_submissions_updated_at
  before update on public.tool_submissions
  for each row
  execute function update_tool_submissions_updated_at();

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.tool_submissions to anon;
grant select, insert, update, delete on public.tool_submissions to authenticated;
