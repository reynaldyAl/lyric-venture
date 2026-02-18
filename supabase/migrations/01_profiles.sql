-- ============================================
-- 01_profiles.sql
-- Profiles table — linked to Supabase Auth
-- Hanya untuk admin & author, bukan guest
-- ============================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'author' CHECK (role IN ('admin', 'author')),
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);