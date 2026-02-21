import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AnalysisForm from "@/components/admin/analyses/AnalysisForm";
import SectionsEditor from "@/components/admin/analyses/SectionsEditor";
import type { Tables } from "@/lib/types";

type AnalysisFull = Tables<"lyric_analyses"> & {
  songs: (Pick<Tables<"songs">, "id" | "title" | "slug"> & {
    artists: Pick<Tables<"artists">, "name"> | null;
  }) | null;
};

type SectionWithHighlights = Tables<"lyric_sections"> & {
  lyric_highlights: Tables<"lyric_highlights">[];
};

export default async function EditAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }   = await params;
  const supabase = await createClient();

  const { data: rawAnalysis, error } = await supabase
    .from("lyric_analyses")
    .select(`*, songs ( id, title, slug, artists ( name ) )`)
    .eq("id", id)
    .single();

  const analysis = rawAnalysis as AnalysisFull | null;
  if (!analysis || error) notFound();

  // Fetch sections + highlights
  const { data: rawSections } = await supabase
    .from("lyric_sections")
    .select(`*, lyric_highlights ( * )`)
    .eq("analysis_id", id)
    .order("order_index", { ascending: true });

  const sections = (rawSections ?? []) as SectionWithHighlights[];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild
          className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 h-8 px-2 text-xs">
          <Link href="/dashboard/analyses">← Back</Link>
        </Button>
        <Separator orientation="vertical" className="h-4 bg-zinc-700" />
        <div>
          <h1 className="text-lg font-bold text-zinc-100 font-serif">Edit Analysis</h1>
          <p className="text-xs text-zinc-500">{analysis.songs?.title}</p>
        </div>
      </div>

      {/* Part 1: analysis meta */}
      <AnalysisForm mode="edit" analysis={analysis} />

      <Separator className="bg-zinc-800" />

      {/* Part 2: sections + highlights editor */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-zinc-200 font-serif">Lyric Sections</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Add verse, chorus, bridge sections with highlighted phrases and their meanings
          </p>
        </div>
        <SectionsEditor analysisId={id} initialSections={sections} />
      </div>
    </div>
  );
}