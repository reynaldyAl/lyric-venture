import { createClient } from '@/lib/supabase/server'
import { okResponse, errorResponse, notFound, requireAuth } from '@/lib/api-helpers'

// GET /api/auth/profile — profil user yang sedang login
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

// PUT /api/auth/profile — update profil sendiri
export async function PUT(request: Request) {
  const supabase = await createClient()
  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const body = await request.json()

  // Field yang tidak boleh diupdate sendiri
  delete body.id
  delete body.role        // role hanya bisa diubah oleh admin
  delete body.created_at

  const { data, error } = await supabase
    .from('profiles')
    .update(body)
    .eq('id', user!.id)
    .select()
    .single()

  if (error) return errorResponse(error.message)
  if (!data)  return notFound('Profile')
  return okResponse(data)
}