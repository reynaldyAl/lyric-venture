-- ============================================
-- 08_lyric_highlights.sql
-- Lyric Highlights — kata/frasa yang di-highlight
-- dalam sebuah lyric section
-- ============================================

CREATE TABLE IF NOT EXISTS public.lyric_highlights (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id     UUID NOT NULL REFERENCES public.lyric_sections(id) ON DELETE CASCADE,
  phrase         TEXT NOT NULL,   -- kata/frasa yang di-highlight
  meaning        TEXT NOT NULL,   -- penjelasan makna
  -- posisi dalam string content (untuk rendering highlight di frontend)
  start_index    INT,             -- karakter ke-n mulainya highlight
  end_index      INT,             -- karakter ke-n akhirnya highlight
  color_tag      TEXT NOT NULL DEFAULT 'yellow' CHECK (
                   color_tag IN ('yellow', 'blue', 'red', 'green', 'purple', 'orange')
                 ),
  highlight_type TEXT CHECK (
                   highlight_type IN (
                     'metaphor', 'symbolism', 'cultural_reference',
                     'wordplay', 'historical', 'emotional', 'general'
                   )
                 ),
  order_index    INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);