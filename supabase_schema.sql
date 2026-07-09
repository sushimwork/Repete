-- ─────────────────────────────────────────────────────────────
-- Répète — Supabase Schema
-- Paste this entire file into: Supabase → SQL Editor → Run
-- ─────────────────────────────────────────────────────────────

-- 1. PROFILES (extends Supabase auth.users)
create table if not exists public.profiles (
  id        uuid references auth.users(id) on delete cascade primary key,
  name      text not null,
  job_role  text default 'Professional',
  plan      text default 'starter' check (plan in ('starter','professional','executive')),
  created_at timestamptz default now()
);

-- 2. WARDROBE
create table if not exists public.wardrobe (
  id         bigserial primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  name       text not null,
  emoji      text default '👔',
  colour     text default '#1a1a2e',
  style      text default 'Formal',
  uses       int default 0,
  created_at timestamptz default now()
);

-- 3. CONTACTS
create table if not exists public.contacts (
  id         bigserial primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  name       text not null,
  company    text default '',
  job_role   text default '',
  colour     text default '#7c3aed',
  initials   text default '',
  created_at timestamptz default now()
);

-- 4. OUTFIT LOGS
create table if not exists public.logs (
  id          bigserial primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  log_date    date not null default current_date,
  outfit_id   bigint references public.wardrobe(id) on delete set null,
  contact_ids bigint[] default '{}',
  note        text default '',
  created_at  timestamptz default now()
);

-- ── ROW LEVEL SECURITY (users only see their own data) ──────────────────────
alter table public.profiles  enable row level security;
alter table public.wardrobe  enable row level security;
alter table public.contacts  enable row level security;
alter table public.logs      enable row level security;

-- profiles
create policy "Users can view own profile"   on public.profiles  for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles  for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles  for update using (auth.uid() = id);

-- wardrobe
create policy "Users manage own wardrobe" on public.wardrobe for all using (auth.uid() = user_id);

-- contacts
create policy "Users manage own contacts" on public.contacts for all using (auth.uid() = user_id);

-- logs
create policy "Users manage own logs" on public.logs for all using (auth.uid() = user_id);

-- ── TRIGGER: auto-create profile on signup ───────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, job_role, plan)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    coalesce(new.raw_user_meta_data->>'job_role', 'Professional'),
    'starter'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── INDEXES for performance ───────────────────────────────────────────────────
create index if not exists wardrobe_user_id_idx on public.wardrobe(user_id);
create index if not exists contacts_user_id_idx on public.contacts(user_id);
create index if not exists logs_user_id_idx     on public.logs(user_id);
create index if not exists logs_date_idx        on public.logs(log_date);
