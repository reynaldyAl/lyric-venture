"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/lib/types";

type TagRow = Tables<"tags">;

export default function TagTableClient({ tags }: { tags: TagRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch]             = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TagRow | null>(null);
  const [isPending, startTransition]    = useTransition();

  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.slug.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      // ✅ DELETE /api/tags/[id] — pakai id, bukan slug
      const res = await fetch(`/api/tags/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Tag deleted", description: `"${deleteTarget.name}" removed.` });
        router.refresh();
      } else {
        const json = await res.json().catch(() => ({}));
        toast({ title: "Error", description: json.error ?? "Failed to delete", variant: "destructive" });
      }
      setDeleteTarget(null);
    });
  }

  return (
    <>
      {/* Search */}
      <div className="px-5 py-3 border-b border-zinc-800">
        <Input
          placeholder="Search tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 text-sm bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 max-w-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-zinc-600 text-sm italic">
          {search ? `No tags matching "${search}"` : "No tags yet. Add the first one!"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500">
                <th className="px-5 py-3 text-left font-medium">Tag</th>
                <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Slug</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Color</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((tag) => (
                <tr key={tag.id} className="hover:bg-zinc-800/30 transition-colors group">

                  {/* Name */}
                  <td className="px-5 py-3">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full border font-medium"
                      style={{
                        background:  tag.color ? `${tag.color}20` : "#3f3f4620",
                        borderColor: tag.color ? `${tag.color}50` : "#3f3f4660",
                        color:       tag.color ?? "#a1a1aa",
                      }}
                    >
                      {tag.name}
                    </span>
                  </td>

                  {/* Slug */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs text-zinc-500 font-mono">{tag.slug}</span>
                  </td>

                  {/* Color */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-zinc-700"
                        style={{ background: tag.color ?? "#3f3f46" }}
                      />
                      <span className="text-xs text-zinc-500 font-mono">
                        {tag.color ?? "—"}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* ✅ Edit pakai tag.id — konsisten dengan API [id] */}
                      <Button variant="ghost" size="sm" asChild
                        className="h-7 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 px-2">
                        <Link href={`/dashboard/tags/${tag.id}`}>Edit</Link>
                      </Button>
                      <Button variant="ghost" size="sm"
                        onClick={() => setDeleteTarget(tag)}
                        className="h-7 text-xs text-zinc-600 hover:text-red-400 hover:bg-red-950/30 px-2">
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="font-serif text-zinc-100">Delete Tag?</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Delete tag{" "}
              <span
                className="px-1.5 py-0.5 rounded text-xs font-medium"
                style={{
                  background: deleteTarget?.color ? `${deleteTarget.color}20` : undefined,
                  color:      deleteTarget?.color ?? "#a1a1aa",
                }}
              >
                {deleteTarget?.name}
              </span>
              ? It will be removed from all songs.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Cancel
            </Button>
            <Button size="sm" onClick={handleDelete} disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white min-w-[100px]">
              {isPending ? "Deleting..." : "Delete Tag"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}