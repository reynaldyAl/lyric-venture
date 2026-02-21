import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TagForm from "@/components/admin/tags/TagForm";
import type { Tables } from "@/lib/types";

type TagRow = Tables<"tags">;

export default async function EditTagPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("id", id)
    .single();

  const tag = data as TagRow | null;
  if (!tag || error) notFound();

  return (
    <div className="max-w-md mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild
          className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 h-8 px-2 text-xs">
          <Link href="/dashboard/tags">← Back</Link>
        </Button>
        <Separator orientation="vertical" className="h-4 bg-zinc-700" />
        <div>
          <h1 className="text-lg font-bold text-zinc-100 font-serif">Edit Tag</h1>
          <p className="text-xs text-zinc-500">{tag.name}</p>
        </div>
      </div>
      <TagForm mode="edit" tag={tag} />
    </div>
  );
}