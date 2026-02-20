import { createClient } from '@/lib/supabase/server'
import { okResponse, errorResponse, notFound, requireAuth } from '@/lib/api-helpers'

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const supabase = await createClient()
  const { sectionId } = await params
  const { error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const { data: section } = await supabase
    .from('lyric_sections').select('id').eq('id', sectionId).single()
  if (!section) return notFound('Section')

  const body = await request.json()
  const { phrase, meaning, start_index, end_index, color_tag, highlight_type, order_index } = body

  if (!phrase?.trim() || !meaning?.trim()) {
    return errorResponse('phrase and meaning are required', 400)
  }
  if (start_index === undefined || end_index === undefined) {
    return errorResponse('start_index and end_index are required', 400)
  }

  const db = supabase as any  // ✅ fix v2.97

  const { data, error } = await db
    .from('lyric_highlights')
    .insert({
      section_id:     sectionId,
      phrase:         phrase.trim(),
      meaning:        meaning.trim(),
      start_index:    Number(start_index),
      end_index:      Number(end_index),
      color_tag:      color_tag      ?? null,
      highlight_type: highlight_type ?? null,
      order_index:    order_index    ?? 0,
    })
    .select()
    .single()

  if (error) return errorResponse(error.message)
  return okResponse(data, 201)
}