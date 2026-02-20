import { createClient } from '@/lib/supabase/server'
import { okResponse, errorResponse, notFound, requireAuth, requireAdmin } from '@/lib/api-helpers'

// GET /api/tags/[id]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return notFound('Tag')
  return okResponse(data)
}

// PUT /api/tags/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  const { error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const body = await request.json()
  const { name, slug, color } = body

  const { data, error } = await supabase
    .from('tags')
    .update({ name, slug, color })
    .eq('id', id)
    .select()
    .single()

  if (error) return errorResponse(error.message)
  if (!data)  return notFound('Tag')
  return okResponse(data)
}

// DELETE /api/tags/[id] — admin only
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  const { error: authError } = await requireAdmin(supabase)
  if (authError) return authError

  const { error } = await supabase.from('tags').delete().eq('id', id)
  if (error) return errorResponse(error.message)
  return okResponse({ success: true, message: 'Tag deleted' })
}