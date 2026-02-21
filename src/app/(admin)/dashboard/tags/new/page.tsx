import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TagForm from "@/components/admin/tags/TagForm";

export default function NewTagPage() {
  return (
    <div className="max-w-md mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild
          className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 h-8 px-2 text-xs">
          <Link href="/dashboard/tags">← Back</Link>
        </Button>
        <Separator orientation="vertical" className="h-4 bg-zinc-700" />
        <div>
          <h1 className="text-lg font-bold text-zinc-100 font-serif">Add Tag</h1>
          <p className="text-xs text-zinc-500">Create a new tag for songs</p>
        </div>
      </div>
      <TagForm mode="create" />
    </div>
  );
}