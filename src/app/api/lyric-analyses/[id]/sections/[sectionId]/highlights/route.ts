import { createClient } from '@/lib/supabase/server'
import { okResponse, errorResponse, notFound, requireAuth } from '@/lib/api-helpers'

// GET /api/lyric-analyses/[id]/sections/[sectionId]/highlights
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const supabase = await createClient()
  const { sectionId } = await params

  const { data, error } = await supabase
    .from('lyric_highlights')
    .select('*')
    .eq('section_id', sectionId)
    .order('order_index', { ascending: true })

  if (error) return errorResponse(error.message)
  return okResponse(data ?? [])
}

// POST highlights
export async function POST(
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const supabase = await createClient()
  const { sectionId } = await params
  const { error: authError } = await requireAuth(supabase)
  if (authError) return authError

  // Pastikan section exists
  const { data: section } = await supabase
    .from('lyric_sections').select('id').eq('id', sectionId).single()
  if (!section) return notFound('Section')

  const body = await request.json()
  const {
    phrase, meaning, start_index, end_index,
    color_tag, highlight_type, order_index,
  } = body

  if (!phrase?.trim() || !meaning?.trim()) {
    return errorResponse('phrase and meaning are required', 400)
  }

  const { data, error } = await supabase
    .from('lyric_highlights')
    .insert({
      section_id:     sectionId,
      phrase:         phrase.trim(),
      meaning:        meaning.trim(),
      start_index:    start_index    ?? null,
      end_index:      end_index      ?? null,
      color_tag:      color_tag      ?? 'yellow',
      highlight_type: highlight_type ?? 'general',
      order_index:    order_index    ?? 0,
    })
    .select()
    .single()

  if (error) return errorResponse(error.message)
  return okResponse(data, 201)
}