"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import HighlightsList from "@/components/admin/analyses/HighlightsList";
import type { Tables } from "@/lib/types";

type Highlight = Tables<"lyric_highlights">;
type Section   = Tables<"lyric_sections"> & { lyric_highlights: Highlight[] };

const SECTION_COLORS: Record<string, string> = {
  verse:       "#3B5BDB",
  chorus:      "#7C3AED",
  bridge:      "#059669",
  "pre-chorus":"#0891B2",
  intro:       "#D97706",
  outro:       "#DC2626",
  hook:        "#C026D3",
  other:       "#6B7280",
};

interface Props {
  analysisId:          string;
  section:             Section;
  index:               number;
  onDeleted:           (id: string) => void;
  onUpdated:           (s: Section) => void;
  onHighlightAdded:    (sectionId: string, h: Highlight) => void;
  onHighlightDeleted:  (sectionId: string, hId: string) => void;
  onHighlightUpdated:  (sectionId: string, h: Highlight) => void;
}

export default function SectionCard({
  analysisId, section, index,
  onDeleted, onUpdated,
  onHighlightAdded, onHighlightDeleted, onHighlightUpdated,
}: Props) {
  const { toast }  = useToast();
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded]  = useState(true);
  const [editing,  setEditing]   = useState(false);
  const [deleting, setDeleting]  = useState(false);
  const [editForm, setEditForm]  = useState({
    section_type:  section.section_type,
    section_label: section.section_label,
    content:       section.content,
  });

  const color = SECTION_COLORS[section.section_type] ?? "#6B7280";

  // ── Save edit ─────────────────────────────────────────
  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await fetch(
        `/api/lyric-analyses/${analysisId}/sections/${section.id}`,
        {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section_type:  editForm.section_type,
            section_label: editForm.section_label.trim(),
            content:       editForm.content.trim(),
          }),
        }
      );
      const json = await res.json();
      if (res.ok) {
        onUpdated({ ...json, lyric_highlights: section.lyric_highlights });
        setEditing(false);
        toast({ title: "Section updated" });
      } else {
        toast({ title: "Error", description: json.error, variant: "destructive" });
      }
    });
  }

  // ── Delete ────────────────────────────────────────────
  function handleDelete() {
    startTransition(async () => {
      const res = await fetch(
        `/api/lyric-analyses/${analysisId}/sections/${section.id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        onDeleted(section.id);
        toast({ title: "Section deleted" });
      } else {
        toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
      }
      setDeleting(false);
    });
  }

  return (
    <>
      <div className="border border-zinc-800 bg-zinc-900/60 rounded overflow-hidden">

        {/* ── Section header ── */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 cursor-pointer select-none"
          style={{ borderLeft: `3px solid ${color}` }}
          onClick={() => setExpanded((v) => !v)}
        >
          {/* Type badge */}
          <span
            className="text-[9px] px-2 py-0.5 uppercase tracking-widest font-medium shrink-0"
            style={{
              background: `${color}20`,
              color,
              border: `1px solid ${color}40`,
            }}
          >
            {section.section_type}
          </span>

          {/* Label */}
          <span className="text-sm font-medium text-zinc-200 flex-1 truncate">
            {section.section_label}
          </span>

          {/* Meta */}
          <span className="text-[10px] text-zinc-600 shrink-0 hidden sm:block">
            {section.lyric_highlights.length > 0 && (
              <span className="mr-3 text-amber-500/70">
                {section.lyric_highlights.length} highlight{section.lyric_highlights.length !== 1 ? "s" : ""}
              </span>
            )}
            {section.content.split("\n").filter((l) => l.trim()).length} lines
          </span>

          {/* Actions */}
          <div
            className="flex items-center gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(true)}
              className="h-7 w-7 p-0 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-700"
            >
              ✎
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleting(true)}
              className="h-7 w-7 p-0 text-zinc-600 hover:text-red-400 hover:bg-zinc-700"
            >
              ✕
            </Button>
          </div>

          {/* Chevron */}
          <span className="text-zinc-600 text-xs transition-transform duration-200"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
            ▾
          </span>
        </div>

        {/* ── Expanded content ── */}
        {expanded && (
          <div className="border-t border-zinc-800">
            {/* Lyrics preview */}
            <div className="px-4 py-3 bg-zinc-950/40">
              <pre className="text-xs text-zinc-400 font-mono leading-[1.8] whitespace-pre-wrap">
                {section.content}
              </pre>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Highlights sub-section */}
            <div className="px-4 py-3">
              <HighlightsList
                analysisId={analysisId}
                sectionId={section.id}
                content={section.content}
                highlights={section.lyric_highlights}
                onAdded={(h) => onHighlightAdded(section.id, h)}
                onDeleted={(hId) => onHighlightDeleted(section.id, hId)}
                onUpdated={(h) => onHighlightUpdated(section.id, h)}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Edit dialog ── */}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 font-serif text-base">
              Edit Section
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Type</Label>
                <Input
                  value={editForm.section_type}
                  onChange={(e) => setEditForm((f) => ({ ...f, section_type: e.target.value }))}
                  className="h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Label</Label>
                <Input
                  value={editForm.section_label}
                  onChange={(e) => setEditForm((f) => ({ ...f, section_label: e.target.value }))}
                  className="h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-200"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Lyrics</Label>
              <Textarea
                value={editForm.content}
                onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
                rows={8}
                className="text-xs bg-zinc-800 border-zinc-700 text-zinc-200 font-mono resize-y"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="ghost" size="sm"
                onClick={() => setEditing(false)}
                className="text-zinc-400 hover:text-zinc-200 text-xs h-8">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8">
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirm dialog ── */}
      <Dialog open={deleting} onOpenChange={setDeleting}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 font-serif text-base">
              Delete Section?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-400">
            &ldquo;{section.section_label}&rdquo; and all its highlights will be permanently deleted.
          </p>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleting(false)}
              className="text-zinc-400 text-xs h-8">
              Cancel
            </Button>
            <Button size="sm" disabled={isPending} onClick={handleDelete}
              className="bg-red-700 hover:bg-red-600 text-white text-xs h-8">
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}