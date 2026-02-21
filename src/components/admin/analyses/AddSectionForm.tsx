"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/lib/types";

type Section = Tables<"lyric_sections"> & { lyric_highlights: Tables<"lyric_highlights">[] };

const SECTION_TYPES = [
  { value: "verse",      label: "Verse",       color: "#3B5BDB" },
  { value: "chorus",     label: "Chorus",      color: "#7C3AED" },
  { value: "bridge",     label: "Bridge",      color: "#059669" },
  { value: "pre-chorus", label: "Pre-Chorus",  color: "#0891B2" },
  { value: "intro",      label: "Intro",       color: "#D97706" },
  { value: "outro",      label: "Outro",       color: "#DC2626" },
  { value: "hook",       label: "Hook",        color: "#C026D3" },
  { value: "other",      label: "Other",       color: "#6B7280" },
];

interface Props {
  analysisId:     string;
  nextOrderIndex: number;
  onAdded:        (section: Section) => void;
  onCancel:       () => void;
}

export default function AddSectionForm({ analysisId, nextOrderIndex, onAdded, onCancel }: Props) {
  const { toast }  = useToast();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    section_type:  "verse",
    section_label: "",
    content:       "",
  });

  // Auto-generate label from type + index
  function handleTypeChange(val: string) {
    const label = `${val.charAt(0).toUpperCase() + val.slice(1)} ${nextOrderIndex + 1}`;
    setForm((f) => ({ ...f, section_type: val, section_label: label }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.content.trim()) {
      toast({ title: "Error", description: "Content is required", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      const res = await fetch(
        `/api/lyric-analyses/${analysisId}/sections`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section_type:  form.section_type,
            section_label: form.section_label.trim() || form.section_type,
            content:       form.content.trim(),
            order_index:   nextOrderIndex,
          }),
        }
      );

      const json = await res.json();
      if (res.ok) {
        onAdded({ ...json, lyric_highlights: [] });
      } else {
        toast({ title: "Error", description: json.error ?? "Failed", variant: "destructive" });
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-zinc-700 bg-zinc-800/50 p-4 space-y-4 rounded"
    >
      <p className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">
        New Section
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Type */}
        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-400">Section Type</Label>
          <Select value={form.section_type} onValueChange={handleTypeChange}>
            <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-700 text-zinc-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              {SECTION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-xs text-zinc-300">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ background: t.color }}
                    />
                    {t.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Label */}
        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-400">Label</Label>
          <Input
            value={form.section_label}
            onChange={(e) => setForm((f) => ({ ...f, section_label: e.target.value }))}
            placeholder="e.g. Verse 1"
            className="h-8 text-xs bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Lyrics content */}
      <div className="space-y-1.5">
        <Label className="text-xs text-zinc-400">Lyrics</Label>
        <Textarea
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          placeholder={"Paste lyrics here...\nEach line = one lyric line"}
          rows={6}
          className="text-xs bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 resize-y font-mono leading-relaxed"
        />
        <p className="text-[10px] text-zinc-600">
          {form.content.split("\n").filter((l) => l.trim()).length} lines
        </p>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 text-xs text-zinc-400 hover:text-zinc-200"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isPending ? "Adding..." : "Add Section"}
        </Button>
      </div>
    </form>
  );
}