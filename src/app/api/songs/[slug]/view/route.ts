import { createClient } from '@/lib/supabase/server'
import { okResponse, errorResponse } from '@/lib/api-helpers'

// POST /api/songs/[slug]/view — increment view count (public, no auth)
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient()
  const { slug } = await params

  const { error } = await supabase.rpc('increment_song_view', { song_slug: slug } as any)

  if (error) return errorResponse(error.message)
  return okResponse({ success: true, message: 'View counted' })
}