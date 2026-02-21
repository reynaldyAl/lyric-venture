"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormProps {
  profile:   any;
  userEmail: string;
}

export default function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const router    = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    username:   profile?.username   ?? "",
    full_name:  profile?.full_name  ?? "",
    avatar_url: profile?.avatar_url ?? "",
  });

  const displayName =
    form.username || form.full_name || userEmail.split("@")[0];
  const initial = displayName.charAt(0).toUpperCase();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await fetch("/api/auth", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username:   form.username  || null,
          full_name:  form.full_name || null,
          avatar_url: form.avatar_url || null,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast({ title: "Profile updated!", description: "Changes saved." });
        router.refresh();
      } else {
        toast({ title: "Error", description: json.error ?? "Failed", variant: "destructive" });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Avatar preview */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-5 flex items-center gap-4">
          <Avatar className="h-14 w-14">
            {form.avatar_url && (
              <AvatarImage src={form.avatar_url} alt={displayName} />
            )}
            <AvatarFallback className="bg-indigo-600 text-white text-lg font-bold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-zinc-100">{displayName}</p>
            <p className="text-xs text-zinc-500">{userEmail}</p>
            <p className="text-[10px] text-zinc-600 mt-0.5 capitalize">
              Role: {profile?.role ?? "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form fields */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-5 space-y-4">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
            Account Info
          </p>
          <Separator className="bg-zinc-800" />

          {/* Email — read only */}
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">Email</Label>
            <Input
              value={userEmail}
              disabled
              className="bg-zinc-800/50 border-zinc-700 text-zinc-500 h-9 text-sm cursor-not-allowed"
            />
            <p className="text-[10px] text-zinc-600">Email cannot be changed</p>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">Username</Label>
            <Input
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="e.g. johndoe"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 h-9 text-sm"
            />
          </div>

          {/* Full name */}
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">Full Name</Label>
            <Input
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              placeholder="e.g. John Doe"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 h-9 text-sm"
            />
          </div>

          {/* Avatar URL */}
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">Avatar URL</Label>
            <Input
              value={form.avatar_url}
              onChange={(e) => setForm((f) => ({ ...f, avatar_url: e.target.value }))}
              placeholder="https://..."
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 h-9 text-sm"
            />
            <p className="text-[10px] text-zinc-600">
              Paste a direct image URL. Google avatar terisi otomatis saat login.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" size="sm"
          onClick={() => router.back()}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-9">
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isPending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-6">
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}