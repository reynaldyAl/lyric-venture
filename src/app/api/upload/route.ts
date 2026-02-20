import { createClient } from '@/lib/supabase/server'
import { okResponse, errorResponse, requireAuth } from '@/lib/api-helpers'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_MB   = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

// POST /api/upload?bucket=artists|albums|songs
export async function POST(request: Request) {
  const supabase = await createClient()
  const { error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const bucket = searchParams.get('bucket') ?? 'songs'

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) return errorResponse('No file provided', 400)
  if (!ALLOWED_TYPES.includes(file.type)) {
    return errorResponse(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`, 400)
  }
  if (file.size > MAX_SIZE_BYTES) {
    return errorResponse(`File too large. Max size: ${MAX_SIZE_MB}MB`, 400)
  }

  // Generate unique filename
  const ext      = file.name.split('.').pop()
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const path     = `${bucket}/${filename}`

  const { error } = await supabase.storage
    .from('lyric-venture')
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    })

  if (error) return errorResponse(error.message)

  const { data: { publicUrl } } = supabase.storage
    .from('lyric-venture')
    .getPublicUrl(path)

  return okResponse({ url: publicUrl, path }, 201)
}
