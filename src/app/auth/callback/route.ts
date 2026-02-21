import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get("code");
  const next  = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // ✅ Cast eksplisit — fix "Property 'role' does not exist on type 'never'"
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        const profile = data as Pick<Tables<"profiles">, "role"> | null;

        if (profile?.role === "admin" || profile?.role === "author") {
          return NextResponse.redirect(`${origin}/dashboard`);
        }
      }

      return NextResponse.redirect(`${origin}/`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}