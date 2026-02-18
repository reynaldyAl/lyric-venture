-- ============================================
-- 07_lyric_sections.sql
-- Lyric Sections — Verse, Chorus, Bridge, etc.
-- ============================================

CREATE TABLE IF NOT EXISTS public.lyric_sections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id   UUID NOT NULL REFERENCES public.lyric_analyses(id) ON DELETE CASCADE,
  section_type  TEXT NOT NULL CHECK (section_type IN (
                  'intro', 'verse', 'pre-chorus', 'chorus',
                  'post-chorus', 'bridge', 'hook', 'outro', 'interlude'
                )),
  section_label TEXT NOT NULL,   -- "Verse 1", "Chorus", "Bridge"
  content       TEXT NOT NULL,   -- isi lirik bagian ini (mentah)
  order_index   INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);