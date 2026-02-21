import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // WAJIB — refresh session cookie
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin')

  // ── Belum login → tidak bisa akses /dashboard ─────────
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ── Sudah login → cek role dari tabel profiles ────────
  if (user && isProtectedRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Bukan admin/author → tolak akses dashboard
    if (!profile || (profile.role !== 'admin' && profile.role !== 'author')) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // ── Sudah login → tidak perlu ke /login atau /register ─
  if (user && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone()

    // Cek role untuk redirect tujuan
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    url.pathname = profile?.role === 'admin' || profile?.role === 'author'
      ? '/dashboard'
      : '/'

    return NextResponse.redirect(url)
  }

  return supabaseResponse
}