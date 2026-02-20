import { createClient } from '@/lib/supabase/server'
import { okResponse, errorResponse, notFound, requireAuth, requireAdmin } from '@/lib/api-helpers'

// PUT /highlights/[highlightId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ highlightId: string }> }
) {
  const supabase = await createClient()
  const { highlightId } = await params
  const { error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const body = await request.json()
  delete body.id
  delete body.section_id
  delete body.created_at

  const db = supabase as any  // ✅ fix v2.97

  const { data, error } = await db
    .from('lyric_highlights')
    .update(body)
    .eq('id', highlightId)
    .select()
    .single()

  if (error) return errorResponse(error.message)
  if (!data)  return notFound('Highlight')
  return okResponse(data)
}

// DELETE /highlights/[highlightId]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ highlightId: string }> }
) {
  const supabase = await createClient()
  const { highlightId } = await params
  const { error: authError } = await requireAdmin(supabase)
  if (authError) return authError

  const { error } = await supabase
    .from('lyric_highlights').delete().eq('id', highlightId)
  if (error) return errorResponse(error.message)
  return okResponse({ success: true, message: 'Highlight deleted' })
}