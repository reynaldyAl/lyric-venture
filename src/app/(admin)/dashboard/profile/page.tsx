import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/admin/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = data as any;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-bold text-zinc-100 font-serif">Profile</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Manage your account information
        </p>
      </div>
      <ProfileForm profile={profile} userEmail={user.email ?? ""} />
    </div>
  );
}