import type { Database } from './database.types'

// ── Utility type helpers ───────────────────────────────────
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

// ── Main types ─────────────────────────────────────────────
export type Profile        = Tables<'profiles'>
export type Tag            = Tables<'tags'>
export type Artist         = Tables<'artists'>
export type Album          = Tables<'albums'>
export type Song           = Tables<'songs'>
export type SongTag        = Tables<'song_tags'>
export type LyricAnalysis  = Tables<'lyric_analyses'>
export type LyricSection   = Tables<'lyric_sections'>
export type LyricHighlight = Tables<'lyric_highlights'>

// ── Extended types with relations ──────────────────────────
export type SongWithRelations = Song & {
  artists:        Artist
  albums:         Album | null
  song_tags:      { tags: Tag }[]
  lyric_analyses: LyricAnalysisWithSections | null
}

export type LyricAnalysisWithSections = LyricAnalysis & {
  lyric_sections: (LyricSection & {
    lyric_highlights: LyricHighlight[]
  })[]
}

export type ArtistWithRelations = Artist & {
  albums: Album[]
  songs:  Song[]
}

export type AlbumWithRelations = Album & {
  artists: Artist
  songs:   Song[]
}