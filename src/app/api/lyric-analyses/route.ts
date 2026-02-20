import { createClient } from '@/lib/supabase/server'
import { okResponse, errorResponse, requireAuth, getPagination, paginatedResponse } from '@/lib/api-helpers'

// GET /api/lyric-analyses?song_id=&page=&limit=
export async function GET(request: Request) {
  const supabase = await createClient()
  const { limit, page, offset, searchParams } = getPagination(request.url)
  const song_id = searchParams.get('song_id')

  let query = supabase
    .from('lyric_analyses')
    .select(`
      id, intro, theme, is_published, published_at, created_at,
      songs ( id, title, slug, cover_image,
        artists ( id, name, slug )
      )
    `, { count: 'exact' })
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (song_id) query = query.eq('song_id', song_id)

  const { data, error, count } = await query
  if (error) return errorResponse(error.message)
  return paginatedResponse(data, count, page, limit)
}

// POST /api/lyric-analyses
export async function POST(request: Request) {
  const supabase = await createClient()
  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const body = await request.json()
  const { song_id, intro, theme, background, conclusion, is_published } = body

  if (!song_id) return errorResponse('song_id is required', 400)

  // Cek apakah song exists
  const { data: song } = await supabase
    .from('songs').select('id').eq('id', song_id).single()
  if (!song) return errorResponse('Song not found', 404)

  // Cek apakah sudah ada analisis untuk song ini
  const { data: existing } = await supabase
    .from('lyric_analyses').select('id').eq('song_id', song_id).single()
  if (existing) return errorResponse('Lyric analysis for this song already exists', 409)

  const { data, error } = await supabase
    .from('lyric_analyses')
    .insert({
      song_id,
      author_id:    user!.id,
      intro:        intro      ?? null,
      theme:        theme      ?? null,
      background:   background ?? null,
      conclusion:   conclusion ?? null,
      is_published: is_published ?? false,
      published_at: is_published ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) return errorResponse(error.message)
  return okResponse(data, 201)
}