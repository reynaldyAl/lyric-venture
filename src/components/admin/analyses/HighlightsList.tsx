"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/lib/types";

type Highlight = Tables<"lyric_highlights">;

const HIGHLIGHT_TYPES = ["meaning", "metaphor", "symbolism", "cultural", "emotion", "wordplay", "other"];

const COLOR_PRESETS = [
  "#F59E0B", "#EF4444", "#8B5CF6",
  "#10B981", "#3B82F6", "#EC4899", "#F97316",
];

interface Props {
  analysisId: string;
  sectionId:  string;
  content:    string;
  highlights: Highlight[];
  onAdded:    (h: Highlight) => void;
  onDeleted:  (id: string) => void;
  onUpdated:  (h: Highlight) => void;
}

export default function HighlightsList({
  analysisId, sectionId, content, highlights,
  onAdded, onDeleted, onUpdated,
}: Props) {
  const { toast }  = useToast();
  const [isPending, startTransition] = useTransition();
  const [showAdd,   setShowAdd]  = useState(false);
  const [editTarget, setEditTarget] = useState<Highlight | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Highlight | null>(null);

  const [addForm, setAddForm] = useState({
    phrase:         "",
    meaning:        "",
    highlight_type: "meaning",
    color_tag:      COLOR_PRESETS[0],
  });

  // Auto compute start_index & end_index dari phrase dalam content
  function computeIndexes(phrase: string) {
    const idx = content.indexOf(phrase);
    if (idx === -1) return { start_index: 0, end_index: phrase.length };
    return { start_index: idx, end_index: idx + phrase.length };
  }

  // ── Add highlight ─────────────────────────────────────
  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.phrase.trim() || !addForm.meaning.trim()) {
      toast({ title: "Error", description: "Phrase and meaning are required", variant: "destructive" });
      return;
    }

    const { start_index, end_index } = computeIndexes(addForm.phrase.trim());

    startTransition(async () => {
      const res = await fetch(
        `/api/lyric-analyses/${analysisId}/sections/${sectionId}/highlights`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phrase:         addForm.phrase.trim(),
            meaning:        addForm.meaning.trim(),
            highlight_type: addForm.highlight_type,
            color_tag:      addForm.color_tag,
            start_index,
            end_index,
            order_index:    highlights.length,
          }),
        }
      );
      const json = await res.json();
      if (res.ok) {
        onAdded(json);
        setAddForm({ phrase: "", meaning: "", highlight_type: "meaning", color_tag: COLOR_PRESETS[0] });
        setShowAdd(false);
        toast({ title: "Highlight added", description: `"${json.phrase}"` });
      } else {
        toast({ title: "Error", description: json.error, variant: "destructive" });
      }
    });
  }

  // ── Edit highlight ────────────────────────────────────
  function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;

    const { start_index, end_index } = computeIndexes(editTarget.phrase?.trim() ?? "");

    startTransition(async () => {
      const res = await fetch(
        `/api/lyric-analyses/${analysisId}/sections/${sectionId}/highlights/${editTarget.id}`,
        {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phrase:         editTarget.phrase,
            meaning:        editTarget.meaning,
            highlight_type: editTarget.highlight_type,
            color_tag:      editTarget.color_tag,
            start_index,
            end_index,
          }),
        }
      );
      const json = await res.json();
      if (res.ok) {
        onUpdated(json);
        setEditTarget(null);
        toast({ title: "Highlight updated" });
      } else {
        toast({ title: "Error", description: json.error, variant: "destructive" });
      }
    });
  }

  // ── Delete highlight ──────────────────────────────────
  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await fetch(
        `/api/lyric-analyses/${analysisId}/sections/${sectionId}/highlights/${deleteTarget.id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        onDeleted(deleteTarget.id);
        toast({ title: "Highlight deleted" });
      } else {
        toast({ title: "Error", description: "Failed", variant: "destructive" });
      }
      setDeleteTarget(null);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
          Highlights
          {highlights.length > 0 && (
            <span className="ml-2 text-amber-500/80">{highlights.length}</span>
          )}
        </p>
        {!showAdd && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdd(true)}
            className="h-6 text-[10px] text-zinc-500 hover:text-amber-400 hover:bg-zinc-800 px-2"
          >
            + Add Highlight
          </Button>
        )}
      </div>

      {/* Existing highlights */}
      {highlights.length > 0 && (
        <div className="space-y-1.5">
          {highlights.map((hl) => (
            <div
              key={hl.id}
              className="flex items-start gap-2.5 p-2.5 bg-zinc-900 border border-zinc-800 rounded group"
            >
              {/* Color dot */}
              <div
                className="w-2 h-2 rounded-full mt-1 shrink-0"
                style={{ background: hl.color_tag ?? "#F59E0B" }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: hl.color_tag ?? "#F59E0B" }}
                  >
                    &ldquo;{hl.phrase}&rdquo;
                  </span>
                  {hl.highlight_type && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 uppercase tracking-wider">
                      {hl.highlight_type}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                  {hl.meaning}
                </p>
              </div>
              {/* Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditTarget(hl)}
                  className="h-6 w-6 p-0 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-700"
                >
                  ✎
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(hl)}
                  className="h-6 w-6 p-0 text-zinc-600 hover:text-red-400 hover:bg-zinc-700"
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add form — inline */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="border border-zinc-700 bg-zinc-800/40 p-3 space-y-3 rounded"
        >
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
            New Highlight
          </p>

          {/* Phrase */}
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500">Phrase (copy from lyrics above)</Label>
            <Input
              value={addForm.phrase}
              onChange={(e) => setAddForm((f) => ({ ...f, phrase: e.target.value }))}
              placeholder='e.g. "Come together"'
              className="h-7 text-xs bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
            />
          </div>

          {/* Meaning */}
          <div className="space-y-1">
            <Label className="text-[10px] text-zinc-500">Meaning / Explanation</Label>
            <Textarea
              value={addForm.meaning}
              onChange={(e) => setAddForm((f) => ({ ...f, meaning: e.target.value }))}
              placeholder="Explain what this phrase means..."
              rows={3}
              className="text-xs bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 resize-none"
            />
          </div>

          {/* Type + Color */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-zinc-500">Type</Label>
              <select
                value={addForm.highlight_type}
                onChange={(e) => setAddForm((f) => ({ ...f, highlight_type: e.target.value }))}
                className="w-full h-7 text-xs bg-zinc-900 border border-zinc-700 text-zinc-200 px-2 rounded"
              >
                {HIGHLIGHT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-zinc-500">Color</Label>
              <div className="flex gap-1.5 flex-wrap">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAddForm((f) => ({ ...f, color_tag: c }))}
                    className="w-5 h-5 rounded-full transition-all"
                    style={{
                      background: c,
                      outline: addForm.color_tag === c ? `2px solid white` : "none",
                      outlineOffset: "1px",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="ghost" size="sm"
              onClick={() => setShowAdd(false)}
              className="h-7 text-[10px] text-zinc-500 hover:text-zinc-200">
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isPending}
              className="h-7 text-[10px] bg-amber-600 hover:bg-amber-500 text-white">
              {isPending ? "Adding..." : "Add Highlight"}
            </Button>
          </div>
        </form>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 font-serif text-sm">Edit Highlight</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <form onSubmit={handleEdit} className="space-y-3 mt-1">
              <div className="space-y-1">
                <Label className="text-[10px] text-zinc-400">Phrase</Label>
                <Input
                  value={editTarget.phrase ?? ""}
                  onChange={(e) => setEditTarget((h) => h ? { ...h, phrase: e.target.value } : h)}
                  className="h-7 text-xs bg-zinc-800 border-zinc-700 text-zinc-200"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-zinc-400">Meaning</Label>
                <Textarea
                  value={editTarget.meaning ?? ""}
                  onChange={(e) => setEditTarget((h) => h ? { ...h, meaning: e.target.value } : h)}
                  rows={4}
                  className="text-xs bg-zinc-800 border-zinc-700 text-zinc-200 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] text-zinc-400">Type</Label>
                  <select
                    value={editTarget.highlight_type ?? "meaning"}
                    onChange={(e) => setEditTarget((h) => h ? { ...h, highlight_type: e.target.value } : h)}
                    className="w-full h-7 text-xs bg-zinc-800 border border-zinc-700 text-zinc-200 px-2 rounded"
                  >
                    {HIGHLIGHT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-zinc-400">Color</Label>
                  <div className="flex gap-1.5 flex-wrap">
                    {COLOR_PRESETS.map((c) => (
                      <button
                        key={c} type="button"
                        onClick={() => setEditTarget((h) => h ? { ...h, color_tag: c } : h)}
                        className="w-5 h-5 rounded-full"
                        style={{
                          background: c,
                          outline: editTarget.color_tag === c ? "2px solid white" : "none",
                          outlineOffset: "1px",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="ghost" size="sm"
                  onClick={() => setEditTarget(null)}
                  className="text-zinc-400 text-xs h-7">Cancel</Button>
                <Button type="submit" size="sm" disabled={isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7">
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 font-serif text-sm">Delete Highlight?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-400">
            &ldquo;{deleteTarget?.phrase}&rdquo; will be permanently removed.
          </p>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}
              className="text-zinc-400 text-xs h-7">Cancel</Button>
            <Button size="sm" disabled={isPending} onClick={handleDelete}
              className="bg-red-700 hover:bg-red-600 text-white text-xs h-7">
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}