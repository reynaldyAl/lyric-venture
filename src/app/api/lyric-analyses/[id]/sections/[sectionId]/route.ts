import { createClient } from '@/lib/supabase/server'
import { okResponse, errorResponse, notFound, requireAuth, requireAdmin } from '@/lib/api-helpers'

// PUT /api/lyric-analyses/[id]/sections/[sectionId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const supabase = await createClient()
  const { sectionId } = await params
  const { error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const body = await request.json()
  delete body.id
  delete body.analysis_id
  delete body.created_at

  const { data, error } = await supabase
    .from('lyric_sections')
    .update(body)
    .eq('id', sectionId)
    .select()
    .single()

  if (error) return errorResponse(error.message)
  if (!data)  return notFound('Section')
  return okResponse(data)
}

// DELETE /api/lyric-analyses/[id]/sections/[sectionId]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const supabase = await createClient()
  const { sectionId } = await params
  const { error: authError } = await requireAdmin(supabase)
  if (authError) return authError

  const { error } = await supabase
    .from('lyric_sections').delete().eq('id', sectionId)
  if (error) return errorResponse(error.message)
  return okResponse({ success: true, message: 'Section deleted' })
}