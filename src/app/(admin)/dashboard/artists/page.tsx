import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ArtistTableClient from "@/components/admin/artists/ArtistTableClient";
import type { Tables } from "@/lib/types";

// ✅ Eksplisit type dari database.types — tidak bergantung pada Supabase infer
type ArtistRow = Pick<
  Tables<"artists">,
  "id" | "name" | "slug" | "origin" | "genre" | "is_active" | "formed_year" | "cover_image" | "created_at"
>;

async function getArtists(): Promise<ArtistRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artists")
    .select("id, name, slug, origin, genre, is_active, formed_year, cover_image, created_at")
    .order("name", { ascending: true });

  if (error) {
    console.error("getArtists error:", error.message);
    return [];
  }

  // ✅ Cast eksplisit karena Supabase kadang return `never` jika type inference gagal
  return (data ?? []) as ArtistRow[];
}

export default async function ArtistsPage() {
  const artists     = await getArtists();
  const activeCount   = artists.filter((a) => a.is_active).length;
  const inactiveCount = artists.length - activeCount;

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 font-serif">Artists</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {artists.length} total · {activeCount} active · {inactiveCount} inactive
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs"
        >
          <Link href="/dashboard/artists/new">+ Add Artist</Link>
        </Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Artists", value: artists.length,  color: "text-zinc-200" },
          { label: "Active",        value: activeCount,     color: "text-emerald-400" },
          { label: "Inactive",      value: inactiveCount,   color: "text-zinc-500" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-zinc-900/60 border border-zinc-800/60 rounded-lg px-4 py-3"
          >
            <p className={`text-2xl font-bold font-serif ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <Separator className="bg-zinc-800" />

      {/* Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="px-5 py-4">
          <CardTitle className="text-sm font-semibold text-zinc-200 font-serif">
            All Artists
          </CardTitle>
          <CardDescription className="text-zinc-500 text-xs">
            Search, edit, or delete artists
          </CardDescription>
        </CardHeader>
        <Separator className="bg-zinc-800" />
        <CardContent className="p-0">
          <ArtistTableClient artists={artists} />
        </CardContent>
      </Card>
    </div>
  );
}