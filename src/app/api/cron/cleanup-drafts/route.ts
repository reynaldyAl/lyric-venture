import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const MISSING_ANALYSES_TABLE_ERROR = "Could not find the table 'public.lyric_analyses' in the schema cache"

// ── Auth Guard ─────────────────────────────────────────────────────────────
function validateCronSecret(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return process.env.NODE_ENV === 'development'
  return authHeader === `Bearer ${cronSecret}`
}

// ── GET /api/cron/cleanup-drafts ────────────────────────────────────────────
// Menghapus draft lyric_analyses yang sudah lebih dari 90 hari dan tidak pernah dipublish
// Aman: hanya hapus is_published=false & updated lebih dari 90 hari lalu
export async function GET(request: Request) {
  if (!validateCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  const timestamp = new Date().toISOString()

  try {
    // Ambil jumlah draft lama sebelum hapus (untuk logging)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    const cutoff = ninetyDaysAgo.toISOString()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    const runCleanup = async (supabase: ReturnType<typeof createClient>) => {
      const { count: beforeCount, error: countError } = await supabase
        .from('lyric_analyses')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'draft')
        .lt('updated_at', cutoff)
      if (countError) throw new Error(countError.message)

      const { error: deleteError } = await supabase
        .from('lyric_analyses')
        .delete()
        .eq('status', 'draft')
        .lt('updated_at', cutoff)
      if (deleteError) throw new Error(deleteError.message)

      return beforeCount ?? 0
    }

    let deletedCount: number
    const primaryKey = serviceRoleKey ?? anonKey

    try {
      deletedCount = await runCleanup(createClient(supabaseUrl, primaryKey))
    } catch (primaryError) {
      const message = primaryError instanceof Error ? primaryError.message : ''
      const shouldRetryWithAnon = Boolean(
        serviceRoleKey &&
          message.includes(MISSING_ANALYSES_TABLE_ERROR)
      )

      if (!shouldRetryWithAnon) throw primaryError

      console.warn('[cron/cleanup-drafts] Service role key failed, retrying with anon key')
      deletedCount = await runCleanup(createClient(supabaseUrl, anonKey))
    }

    const duration = Date.now() - startTime

    return NextResponse.json({
      ok: true,
      job: 'cleanup-drafts',
      timestamp,
      duration_ms: duration,
      deleted_count: deletedCount,
      cutoff_date: cutoff,
    })
  } catch (err) {
    console.error('[cron/cleanup-drafts] Error:', err)
    return NextResponse.json(
      {
        ok: false,
        job: 'cleanup-drafts',
        timestamp,
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
