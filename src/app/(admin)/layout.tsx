import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import type { Tables } from "@/lib/types";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Cek session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Cek role dari tabel profiles — cast eksplisit untuk fix "never"
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profile = data as Pick<Tables<"profiles">, "role"> | null;

  // Hanya admin & author yang boleh masuk dashboard
  if (!profile || (profile.role !== "admin" && profile.role !== "author")) {
    redirect("/");
  }

  return <AdminShell>{children}</AdminShell>;
}