-- ============================================
-- 09_indexes.sql
-- Performance indexes for all tables
-- Jalankan setelah semua tabel dibuat
-- ============================================

-- profiles
-- (sudah ada index bawaan dari PRIMARY KEY & UNIQUE)

-- tags
CREATE INDEX IF NOT EXISTS idx_tags_slug            ON public.tags(slug);

-- artists
CREATE INDEX IF NOT EXISTS idx_artists_slug         ON public.artists(slug);
CREATE INDEX IF NOT EXISTS idx_artists_is_active    ON public.artists(is_active);

-- albums
CREATE INDEX IF NOT EXISTS idx_albums_artist_id     ON public.albums(artist_id);
CREATE INDEX IF NOT EXISTS idx_albums_slug          ON public.albums(slug);

-- songs
CREATE INDEX IF NOT EXISTS idx_songs_artist_id      ON public.songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_album_id       ON public.songs(album_id);
CREATE INDEX IF NOT EXISTS idx_songs_slug           ON public.songs(slug);
CREATE INDEX IF NOT EXISTS idx_songs_published      ON public.songs(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_songs_view_count     ON public.songs(view_count DESC);

-- song_tags
CREATE INDEX IF NOT EXISTS idx_song_tags_song       ON public.song_tags(song_id);
CREATE INDEX IF NOT EXISTS idx_song_tags_tag        ON public.song_tags(tag_id);

-- lyric_analyses
CREATE INDEX IF NOT EXISTS idx_analyses_song_id     ON public.lyric_analyses(song_id);
CREATE INDEX IF NOT EXISTS idx_analyses_published   ON public.lyric_analyses(is_published);

-- lyric_sections
CREATE INDEX IF NOT EXISTS idx_sections_analysis    ON public.lyric_sections(analysis_id);
CREATE INDEX IF NOT EXISTS idx_sections_order       ON public.lyric_sections(analysis_id, order_index);

-- lyric_highlights
CREATE INDEX IF NOT EXISTS idx_highlights_section   ON public.lyric_highlights(section_id);
CREATE INDEX IF NOT EXISTS idx_highlights_order     ON public.lyric_highlights(section_id, order_index);