import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'

// ── Standard response helpers ──────────────────────────────
export function okResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status })
}

export function notFound(resource = 'Resource') {
  return NextResponse.json({ error: `${resource} not found` }, { status: 404 })
}

// ── Auth guard ─────────────────────────────────────────────
export async function requireAuth(supabase: SupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, error: errorResponse('Unauthorized', 401) }
  return { user, error: null }
}

// ── Admin guard ────────────────────────────────────────────
export async function requireAdmin(supabase: SupabaseClient) {
  const { user, error } = await requireAuth(supabase)
  if (error || !user) return { user: null, error: error ?? errorResponse('Unauthorized', 401) }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { user: null, error: errorResponse('Forbidden — admin only', 403) }
  }

  return { user, error: null }
}

// ── Pagination helper ──────────────────────────────────────
export function getPagination(url: string, defaultLimit = 20) {
  const { searchParams } = new URL(url)
  const limit  = Math.min(Number(searchParams.get('limit') ?? defaultLimit), 100)
  const page   = Math.max(Number(searchParams.get('page') ?? 1), 1)
  const offset = (page - 1) * limit
  return { limit, page, offset, searchParams }
}

// ── Pagination meta ────────────────────────────────────────
export function paginatedResponse(
  data: unknown,
  count: number | null,
  page: number,
  limit: number
) {
  return okResponse({
    data,
    meta: {
      total:        count ?? 0,
      page,
      limit,
      total_pages:  Math.ceil((count ?? 0) / limit),
      has_next:     page * limit < (count ?? 0),
      has_prev:     page > 1,
    },
  })
}