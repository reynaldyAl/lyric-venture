"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const title    = pageTitles[pathname] ?? "Dashboard";

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
          {/* Custom 3-bar icon */}
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
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-indigo-600 text-white text-[10px] font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="text-sm hidden md:block">Admin</span>
              <span className="text-zinc-600 text-xs hidden md:block">▾</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52 bg-zinc-900 border-zinc-800 text-zinc-300 shadow-xl shadow-black/30"
          >
            <DropdownMenuLabel className="text-zinc-500 text-[10px] uppercase tracking-wide font-medium">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-zinc-800 hover:text-zinc-100 text-sm">
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-zinc-800 hover:text-zinc-100 text-sm">
              <Link href="/" target="_blank">View Public Site ↗</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="cursor-pointer text-red-500 hover:bg-red-950/50 hover:text-red-400 text-sm">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}