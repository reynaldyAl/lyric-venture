import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ArtistForm from "@/components/admin/artists/ArtistForm";
import type { Tables } from "@/lib/types";

// ✅ Full row type — select("*") butuh cast eksplisit
type ArtistFull = Tables<"artists">;

export default async function EditArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("slug", slug)
    .single();

  // ✅ Cast ke ArtistFull — solusi untuk "Property X does not exist on type never"
  const artist = data as ArtistFull | null;

  if (!artist || error) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 h-8 px-2 text-xs"
        >
          <Link href="/dashboard/artists">← Back</Link>
        </Button>
        <Separator orientation="vertical" className="h-4 bg-zinc-700" />
        <div>
          <h1 className="text-lg font-bold text-zinc-100 font-serif">Edit Artist</h1>
          <p className="text-xs text-zinc-500">{artist.name}</p>
        </div>
      </div>

      <ArtistForm mode="edit" artist={artist} />
    </div>
  );
}