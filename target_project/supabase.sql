-- run this in Supabase dashboard -> SQL Editor -> New query

create extension if not exists "pgcrypto";

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  budget_range text not null,
  message text not null,
  status text not null default 'New' check (status in ('New', 'Contacted', 'Closed')),
  created_at timestamptz not null default now()
);

-- lock the table down, then open it up with explicit policies
alter table leads enable row level security;

-- anyone (including the anonymous public visitor) can submit a lead
create policy "public can insert leads"
  on leads for insert
  to anon
  with check (true);

-- only signed-in admins can read leads
create policy "authenticated can read leads"
  on leads for select
  to authenticated
  using (true);

-- only signed-in admins can update status
create policy "authenticated can update leads"
  on leads for update
  to authenticated
  using (true)
  with check (true);

-- create your admin user:
-- Supabase dashboard -> Authentication -> Users -> Add user
-- (use email + password, "Auto Confirm User" checked)
