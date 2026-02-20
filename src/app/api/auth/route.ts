import { createClient } from '@/lib/supabase/server'
import { okResponse, errorResponse, notFound, requireAuth } from '@/lib/api-helpers'

export async function GET() {
  const supabase = await createClient()
  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  if (error || !data) return notFound('Profile')
  return okResponse(data)
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const body = await request.json()
  delete body.id
  delete body.role
  delete body.created_at

  const db = supabase as any  // ✅ fix v2.97

  const { data, error } = await db
    .from('profiles')
    .update(body)
    .eq('id', user!.id)
    .select()
    .single()

  if (error) return errorResponse(error.message)
  if (!data)  return notFound('Profile')
  return okResponse(data)
}