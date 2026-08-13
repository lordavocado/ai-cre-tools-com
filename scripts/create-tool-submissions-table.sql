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

-- Submissions contain email addresses and are accessed only by server-side routes
-- using a Supabase secret/service-role key. No anon/authenticated policies are needed.
revoke all on table public.tool_submissions from anon, authenticated;

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
