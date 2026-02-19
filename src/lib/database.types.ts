export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'author'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'author'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'author'
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      artists: {
        Row: {
          id: string
          name: string
          slug: string
          bio: string | null
          image_url: string | null
          country: string | null
          social_links: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          bio?: string | null
          image_url?: string | null
          country?: string | null
          social_links?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          bio?: string | null
          image_url?: string | null
          country?: string | null
          social_links?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      albums: {
        Row: {
          id: string
          artist_id: string
          title: string
          slug: string
          release_date: string | null
          cover_image_url: string | null
          album_type: 'studio' | 'live' | 'compilation' | 'ep' | 'single'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          title: string
          slug: string
          release_date?: string | null
          cover_image_url?: string | null
          album_type?: 'studio' | 'live' | 'compilation' | 'ep' | 'single'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          title?: string
          slug?: string
          release_date?: string | null
          cover_image_url?: string | null
          album_type?: 'studio' | 'live' | 'compilation' | 'ep' | 'single'
          created_at?: string
          updated_at?: string
        }
      }
      songs: {
        Row: {
          id: string
          artist_id: string
          album_id: string | null
          title: string
          slug: string
          spotify_track_id: string | null
          view_count: number
          is_published: boolean
          meta_title: string | null
          meta_description: string | null
          og_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          album_id?: string | null
          title: string
          slug: string
          spotify_track_id?: string | null
          view_count?: number
          is_published?: boolean
          meta_title?: string | null
          meta_description?: string | null
          og_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          album_id?: string | null
          title?: string
          slug?: string
          spotify_track_id?: string | null
          view_count?: number
          is_published?: boolean
          meta_title?: string | null
          meta_description?: string | null
          og_image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      song_tags: {
        Row: {
          song_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          song_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          song_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      lyric_analyses: {
        Row: {
          id: string
          song_id: string
          introduction: string | null
          theme: string | null
          background: string | null
          conclusion: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          song_id: string
          introduction?: string | null
          theme?: string | null
          background?: string | null
          conclusion?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          song_id?: string
          introduction?: string | null
          theme?: string | null
          background?: string | null
          conclusion?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      lyric_sections: {
        Row: {
          id: string
          analysis_id: string
          section_type: string
          section_order: number
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          analysis_id: string
          section_type: string
          section_order: number
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          analysis_id?: string
          section_type?: string
          section_order?: number
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      lyric_highlights: {
        Row: {
          id: string
          section_id: string
          text: string
          explanation: string
          start_index: number
          end_index: number
          highlight_type: string | null
          color_tag: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_id: string
          text: string
          explanation: string
          start_index: number
          end_index: number
          highlight_type?: string | null
          color_tag?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          text?: string
          explanation?: string
          start_index?: number
          end_index?: number
          highlight_type?: string | null
          color_tag?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_song_view: {
        Args: {
          song_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}