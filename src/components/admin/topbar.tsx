"use client";

import { useState, useEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const pageTitles: Record<string, string> = {
  "/dashboard":           "Overview",
  "/dashboard/artists":   "Artists",
  "/dashboard/albums":    "Albums",
  "/dashboard/songs":     "Songs",
  "/dashboard/analyses":  "Lyric Analyses",
  "/dashboard/tags":      "Tags",
};

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const title    = pageTitles[pathname] ?? "Dashboard";
  const [isPending, startTransition] = useTransition();

  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Load session ─────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Sign out ──────────────────────────────────────────
  function handleSignOut() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    });
  }

  // ── Display info ──────────────────────────────────────
  const displayName =
    user?.user_metadata?.username ??
    user?.user_metadata?.full_name ??
    user?.email?.split("@")[0] ??
    "Admin";

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const initial   = (displayName as string).charAt(0).toUpperCase();
  const email     = user?.email ?? "";

  return (
    <header className="h-16 shrink-0 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 md:px-6">

      {/* ── Left: hamburger + breadcrumb ── */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          aria-label="Open navigation"
        >
          <span className="flex flex-col gap-[5px] w-4">
            <span className="block h-[1.5px] bg-current rounded-full" />
            <span className="block h-[1.5px] bg-current rounded-full w-3/4" />
            <span className="block h-[1.5px] bg-current rounded-full" />
          </span>
        </Button>

        {/* Page title */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 font-serif leading-none">
            {title}
          </h2>
          <p className="text-[10px] text-zinc-500 mt-0.5 hidden sm:block">
            LyricVenture Admin
          </p>
        </div>
      </div>

      {/* ── Right: quick actions + user ── */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* View site — desktop */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="hidden md:flex h-8 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 gap-1.5"
        >
          <Link href="/" target="_blank">
            <span>↗</span>
            <span>View Site</span>
          </Link>
        </Button>

        <Separator orientation="vertical" className="h-5 bg-zinc-700 hidden md:block" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 h-9 px-2 hover:bg-zinc-800 text-zinc-300"
            >
              {loading ? (
                /* Skeleton */
                <div className="w-6 h-6 rounded-full bg-zinc-700 animate-pulse" />
              ) : (
                <Avatar className="h-6 w-6">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName as string} />}
                  <AvatarFallback className="bg-indigo-600 text-white text-[10px] font-bold">
                    {initial}
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="text-sm hidden md:block max-w-[100px] truncate">
                {loading ? "..." : (displayName as string)}
              </span>
              <span className="text-zinc-600 text-xs hidden md:block">▾</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 bg-zinc-900 border-zinc-800 text-zinc-300 shadow-xl shadow-black/30"
          >
            {/* User info header */}
            <div className="px-3 py-2.5 border-b border-zinc-800">
              <p className="text-sm font-medium text-zinc-100 truncate">
                {displayName as string}
              </p>
              <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                {email}
              </p>
            </div>

            <div className="py-1">
              <DropdownMenuItem
                asChild
                className="cursor-pointer hover:bg-zinc-800 hover:text-zinc-100 text-sm mx-1 rounded"
              >
                <Link href="/dashboard/profile">
                  <span className="mr-2 text-zinc-500">◎</span> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="cursor-pointer hover:bg-zinc-800 hover:text-zinc-100 text-sm mx-1 rounded"
              >
                <Link href="/" target="_blank">
                  <span className="mr-2 text-zinc-500">↗</span> View Public Site
                </Link>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="bg-zinc-800" />

            <div className="py-1">
              <DropdownMenuItem
                onClick={handleSignOut}
                disabled={isPending}
                className="cursor-pointer text-red-400 hover:bg-red-950/40 hover:text-red-300 text-sm mx-1 rounded"
              >
                <span className="mr-2">⏻</span>
                {isPending ? "Signing out..." : "Sign Out"}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}