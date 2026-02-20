import { createClient } from '@/lib/supabase/server'
import { okResponse, errorResponse, notFound, requireAuth } from '@/lib/api-helpers'

// GET /api/lyric-analyses/[id]/sections
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data, error } = await supabase
    .from('lyric_sections')
    .select(`
      *,
      lyric_highlights (
        id, phrase, meaning, start_index, end_index,
        color_tag, highlight_type, order_index
      )
    `)
    .eq('analysis_id', id)
    .order('order_index', { ascending: true })

  if (error) return errorResponse(error.message)
  return okResponse(data ?? [])
}

// POST /api/lyric-analyses/[id]/sections
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  const { error: authError } = await requireAuth(supabase)
  if (authError) return authError

  // Pastikan analysis exists
  const { data: analysis } = await supabase
    .from('lyric_analyses').select('id').eq('id', id).single()
  if (!analysis) return notFound('Lyric analysis')

  const body = await request.json()
  const { section_type, section_label, content, order_index } = body

  if (!section_type || !section_label?.trim() || !content?.trim()) {
    return errorResponse('section_type, section_label, and content are required', 400)
  }

  const { data, error } = await supabase
    .from('lyric_sections')
    .insert({
      analysis_id:   id,
      section_type,
      section_label: section_label.trim(),
      content:       content.trim(),
      order_index:   order_index ?? 0,
    })
    .select()
    .single()

  if (error) return errorResponse(error.message)
  return okResponse(data, 201)
}