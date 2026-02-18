-- ============================================
-- 03_artists.sql
-- Artists table
-- ============================================

CREATE TABLE IF NOT EXISTS public.artists (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  bio              TEXT,
  origin           TEXT,
  formed_year      INT,
  disbanded_year   INT,                        -- opsional, jika band sudah bubar
  genre            TEXT[] DEFAULT '{}',
  cover_image      TEXT,                       -- foto/logo utama
  banner_image     TEXT,                       -- banner halaman artist
  social_links     JSONB DEFAULT '{}',         -- { spotify, instagram, wikipedia, ... }
  -- SEO
  meta_title       TEXT,
  meta_description TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_by       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);