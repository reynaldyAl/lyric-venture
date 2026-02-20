import { createClient } from '@/lib/supabase/server'
import { okResponse, errorResponse, requireAuth } from '@/lib/api-helpers'

// GET /api/tags — semua tags (public)
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true })

  if (error) return errorResponse(error.message)
  return okResponse(data)
}

// POST /api/tags — buat tag baru (auth)
export async function POST(request: Request) {
  const supabase = await createClient()
  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const body = await request.json()
  const { name, slug, color } = body

  if (!name?.trim() || !slug?.trim()) {
    return errorResponse('name and slug are required', 400)
  }

  const { data, error } = await supabase
    .from('tags')
    .insert({ name: name.trim(), slug: slug.trim(), color })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return errorResponse('Tag with this name/slug already exists', 409)
    return errorResponse(error.message)
  }

  return okResponse(data, 201)
}