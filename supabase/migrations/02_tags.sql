-- ============================================
-- 02_tags.sql
-- Tags table — genre/mood/tema untuk lagu
-- ============================================

CREATE TABLE IF NOT EXISTS public.tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT UNIQUE NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  color      TEXT NOT NULL DEFAULT '#6366f1', -- warna untuk UI badge
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);