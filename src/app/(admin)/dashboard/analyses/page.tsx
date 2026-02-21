import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AnalysisTableClient from "@/components/admin/analyses/AnalysisTableClient";
import type { Tables } from "@/lib/types";

type AnalysisRow = Pick<
  Tables<"lyric_analyses">,
  "id" | "theme" | "is_published" | "created_at"
> & {
  songs: (Pick<Tables<"songs">, "id" | "title" | "slug" | "cover_image"> & {
    artists: Pick<Tables<"artists">, "id" | "name" | "slug"> | null;
  }) | null;
};

async function getAnalyses(): Promise<AnalysisRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lyric_analyses")
    .select(`
      id, theme, is_published, created_at,
      songs (
        id, title, slug, cover_image,
        artists ( id, name, slug )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) { console.error("getAnalyses:", error.message); return []; }
  return (data ?? []) as AnalysisRow[];
}

// Songs yang belum punya analysis → untuk tombol "New Analysis"
async function getSongsWithoutAnalysis() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("songs")
    .select("id, title, slug, artists ( name )")
    .not("id", "in",
      supabase.from("lyric_analyses").select("song_id")
    )
    .eq("is_published", true)
    .order("title");
  return (data ?? []) as {
    id: string; title: string; slug: string;
    artists: { name: string } | null;
  }[];
}

export default async function AnalysesPage() {
  const [analyses] = await Promise.all([getAnalyses()]);
  const publishedCount = analyses.filter((a) => a.is_published).length;
  const draftCount     = analyses.length - publishedCount;

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 font-serif">Lyric Analyses</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {analyses.length} total · {publishedCount} published · {draftCount} draft
          </p>
        </div>
        <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs">
          <Link href="/dashboard/analyses/new">+ New Analysis</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",     value: analyses.length, color: "text-zinc-200" },
          { label: "Published", value: publishedCount,  color: "text-emerald-400" },
          { label: "Draft",     value: draftCount,      color: "text-zinc-500" },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900/60 border border-zinc-800/60 rounded-lg px-4 py-3">
            <p className={`text-2xl font-bold font-serif ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <Separator className="bg-zinc-800" />

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="px-5 py-4">
          <CardTitle className="text-sm font-semibold text-zinc-200 font-serif">All Analyses</CardTitle>
          <CardDescription className="text-zinc-500 text-xs">
            Click an analysis to edit its content, sections, and highlights
          </CardDescription>
        </CardHeader>
        <Separator className="bg-zinc-800" />
        <CardContent className="p-0">
          <AnalysisTableClient analyses={analyses} />
        </CardContent>
      </Card>
    </div>
  );
}