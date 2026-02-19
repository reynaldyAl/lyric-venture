import type { Database } from './database.types'

// Utility type helpers
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

// Main types
export type Profile = Tables<'profiles'>
export type Tag = Tables<'tags'>
export type Artist = Tables<'artists'>
export type Album = Tables<'albums'>
export type Song = Tables<'songs'>
export type LyricAnalysis = Tables<'lyric_analyses'>
export type LyricSection = Tables<'lyric_sections'>
export type LyricHighlight = Tables<'lyric_highlights'>

// Extended types with relations
export type SongWithRelations = Song & {
  artist: Artist
  album: Album | null
  tags: Tag[]
  lyric_analysis: LyricAnalysis | null
}

export type LyricAnalysisWithSections = LyricAnalysis & {
  lyric_sections: (LyricSection & {
    lyric_highlights: LyricHighlight[]
  })[]
}