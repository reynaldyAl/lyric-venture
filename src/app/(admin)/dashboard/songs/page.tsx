import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SongTableClient from "@/components/admin/songs/SongTableClient";
import type { Tables } from "@/lib/types";

// ── Types ──────────────────────────────────────────────────
type SongRow = Pick<
  Tables<"songs">,
  "id" | "title" | "slug" | "cover_image" | "language" |
  "is_published" | "duration_sec" | "view_count" | "created_at"
> & {
  artists: Pick<Tables<"artists">, "id" | "name" | "slug"> | null;
  albums:  Pick<Tables<"albums">,  "id" | "title" | "slug"> | null;
  song_tags: { tags: Pick<Tables<"tags">, "id" | "name" | "color"> | null }[];
};

// ── Data — query langsung Supabase (bukan /api/songs) karena butuh semua data termasuk unpublished ──
async function getSongs(): Promise<SongRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("songs")
    .select(`
      id, title, slug, cover_image, language,
      is_published, duration_sec, view_count, created_at,
      artists ( id, name, slug ),
      albums  ( id, title, slug ),
      song_tags ( tags ( id, name, color ) )
    `)
    .order("created_at", { ascending: false });

  if (error) { console.error("getSongs:", error.message); return []; }
  return (data ?? []) as SongRow[];
}

export default async function SongsPage() {
  const songs          = await getSongs();
  const publishedCount = songs.filter((s) => s.is_published).length;
  const draftCount     = songs.length - publishedCount;

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 font-serif">Songs</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {songs.length} total · {publishedCount} published · {draftCount} draft
          </p>
        </div>
        <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs">
          <Link href="/dashboard/songs/new">+ Add Song</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Songs", value: songs.length,     color: "text-zinc-200" },
          { label: "Published",   value: publishedCount,   color: "text-emerald-400" },
          { label: "Draft",       value: draftCount,       color: "text-zinc-500" },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900/60 border border-zinc-800/60 rounded-lg px-4 py-3">
            <p className={`text-2xl font-bold font-serif ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <Separator className="bg-zinc-800" />

      {/* Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="px-5 py-4">
          <CardTitle className="text-sm font-semibold text-zinc-200 font-serif">All Songs</CardTitle>
          <CardDescription className="text-zinc-500 text-xs">
            Search, filter, edit, or delete songs
          </CardDescription>
        </CardHeader>
        <Separator className="bg-zinc-800" />
        <CardContent className="p-0">
          <SongTableClient songs={songs} />
        </CardContent>
      </Card>
    </div>
  );
}