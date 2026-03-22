-- Destination Future – Supabase Schema
-- Run this migration to add preference columns to the profiles table.

-- ─── Profiles table (core + intake preferences) ───────────────────────

-- Add preference columns to profiles (idempotent with IF NOT EXISTS)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS relationship_status text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS career_field text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS career_goals text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS budget_range text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS style_preferences text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS style_budget text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS favorite_stores text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS music_genres text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS film_genres text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tv_genres text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS book_genres text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goals text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hobbies text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS values_list text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender_expression text;

-- ─── User Progress table ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  level_name text DEFAULT 'Awakened',
  streak integer DEFAULT 0,
  last_active_date date,
  quests_completed text[] DEFAULT '{}',
  quests_active text[] DEFAULT '{}',
  reports_generated integer DEFAULT 0,
  badges text[] DEFAULT '{}',
  reflections jsonb DEFAULT '[]',
  quest_responses jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─── Quest Responses table (stores all quest/info submitted in-app) ───

CREATE TABLE IF NOT EXISTS quest_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id text NOT NULL,
  step_index integer NOT NULL,
  response_type text NOT NULL DEFAULT 'text',
  response_text text,
  response_data jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, quest_id, step_index)
);

-- ─── Section Snapshots (stores generated/viewed section data per user) ───

CREATE TABLE IF NOT EXISTS section_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section_name text NOT NULL,
  snapshot_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, section_name)
);

-- ─── RLS Policies ─────────────────────────────────────────────────────

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_snapshots ENABLE ROW LEVEL SECURITY;

-- user_progress
CREATE POLICY IF NOT EXISTS "Users can read own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- quest_responses
CREATE POLICY IF NOT EXISTS "Users can read own quest responses" ON quest_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert own quest responses" ON quest_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update own quest responses" ON quest_responses FOR UPDATE USING (auth.uid() = user_id);

-- section_snapshots
CREATE POLICY IF NOT EXISTS "Users can read own snapshots" ON section_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert own snapshots" ON section_snapshots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update own snapshots" ON section_snapshots FOR UPDATE USING (auth.uid() = user_id);
