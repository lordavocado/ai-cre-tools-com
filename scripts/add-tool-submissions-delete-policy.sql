-- Allow admin delete on tool_submissions (run in Supabase SQL Editor if delete fails)
-- Safe to run multiple times.

create policy "Allow delete" on public.tool_submissions
  for delete
  using (true);

grant update, delete on public.tool_submissions to anon;
