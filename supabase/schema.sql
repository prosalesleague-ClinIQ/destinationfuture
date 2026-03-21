-- Run this in the Supabase SQL Editor to create your tables.
-- Supabase Auth handles user accounts (auth.users) automatically.
-- These tables store profile details and dashboard progress.

-- ─── PROFILES ───────────────────────────────────────────────────
-- Stores intake details linked to auth.users via user_id.

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  first_name text not null default '',
  middle_name text,
  last_name text,
  nickname text,
  birthday date,
  birth_time text,        -- HH:MM 24h
  birth_city text,
  birth_state text,
  intake_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── USER PROGRESS ──────────────────────────────────────────────
-- Dashboard gamification state.

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  xp integer not null default 0,
  level integer not null default 1,
  level_name text not null default 'Awakened',
  streak integer not null default 0,
  last_active_date date,
  quests_completed text[] not null default '{}',
  quests_active text[] not null default '{}',
  reports_generated integer not null default 0,
  badges text[] not null default '{}',
  reflections jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────
-- Users can only read/write their own data.

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- ─── AUTO-UPDATE updated_at ──────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger user_progress_updated_at
  before update on public.user_progress
  for each row execute function public.handle_updated_at();
