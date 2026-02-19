import { createClient } from '@/lib/supabase/server'
import type { Song } from '@/lib/types'

export default async function Home() {
  const supabase = await createClient()
  
  // Type-safe query with autocomplete!
  const { data: songs, error } = await supabase
    .from('songs')
    .select('*')
    .eq('is_published', true)
    .order('view_count', { ascending: false })
    .limit(5)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">LyricVenture 🎵</h1>
      <p className="text-lg mb-8">Song and Lyric Meanings</p>
      
      {error ? (
        <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg">
          <p className="text-red-600 dark:text-red-300">Error: {error.message}</p>
        </div>
      ) : (
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-2xl w-full">
          <h2 className="text-xl font-semibold mb-4">
            ✅ Connected! Published Songs: {songs?.length || 0}
          </h2>
          
          {songs && songs.length > 0 ? (
            <ul className="space-y-2">
              {songs.map((song: Song) => (
                <li key={song.id} className="border-b border-gray-300 dark:border-gray-600 pb-2">
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Views: {song.view_count}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No published songs yet. Add some in the admin panel!
            </p>
          )}
        </div>
      )}
    </main>
  )
}