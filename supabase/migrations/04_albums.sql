-- ============================================
-- 04_albums.sql
-- Albums table
-- ============================================

CREATE TABLE IF NOT EXISTS public.albums (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id        UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  release_date     DATE,
  cover_image      TEXT,
  description      TEXT,
  album_type       TEXT NOT NULL DEFAULT 'album' CHECK (
                     album_type IN ('album', 'ep', 'single', 'compilation', 'live')
                   ),
  total_tracks     INT,
  -- SEO
  meta_title       TEXT,
  meta_description TEXT,
  created_by       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);