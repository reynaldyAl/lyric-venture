"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/lib/types";

type TagRow = Tables<"tags">;

interface TagFormProps {
  mode: "create" | "edit";
  tag?: TagRow;
}

const COLOR_PRESETS = [
  { hex: "#6366f1", name: "Indigo" },
  { hex: "#8b5cf6", name: "Violet" },
  { hex: "#a855f7", name: "Purple" },
  { hex: "#ec4899", name: "Pink" },
  { hex: "#f43f5e", name: "Rose" },
  { hex: "#f59e0b", name: "Amber" },
  { hex: "#10b981", name: "Emerald" },
  { hex: "#06b6d4", name: "Cyan" },
  { hex: "#3b82f6", name: "Blue" },
  { hex: "#84cc16", name: "Lime" },
  { hex: "#f97316", name: "Orange" },
  { hex: "#78716c", name: "Stone" },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function TagForm({ mode, tag }: TagFormProps) {
  const router    = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name:  tag?.name  ?? "",
    slug:  tag?.slug  ?? "",
    color: tag?.color ?? "#6366f1",
  });

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleNameChange(value: string) {
    setForm((f) => ({
      ...f,
      name: value,
      ...(mode === "create" ? { slug: slugify(value) } : {}),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        name:  form.name.trim(),
        slug:  form.slug.trim(),
        color: form.color,
      };

      // ✅ PUT pakai tag.id — sesuai /api/tags/[id]/route.ts
      const url    = mode === "create" ? "/api/tags" : `/api/tags/${tag!.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok) {
        toast({
          title:       mode === "create" ? "Tag created!" : "Tag updated!",
          description: payload.name,
        });
        router.push("/dashboard/tags");
        router.refresh();
      } else {
        toast({
          title:       "Error",
          description: json.error ?? "Something went wrong",
          variant:     "destructive",
        });
      }
    });
  }

  const previewStyle = {
    background:  `${form.color}20`,
    borderColor: `${form.color}50`,
    color:       form.color,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-5 space-y-4">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Tag Info</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">
                Name <span className="text-red-400">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Love Song"
                required
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">
                Slug <span className="text-red-400">*</span>
              </Label>
              <Input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="e.g. love-song"
                required
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 h-9 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  title={c.name}
                  onClick={() => set("color", c.hex)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    form.color === c.hex
                      ? "border-white scale-110"
                      : "border-transparent hover:border-zinc-500 hover:scale-105"
                  }`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-7 h-7 rounded border border-zinc-700 shrink-0"
                style={{ background: form.color }}
              />
              <Input
                value={form.color}
                onChange={(e) => set("color", e.target.value)}
                placeholder="#6366f1"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 h-8 font-mono text-sm max-w-[120px]"
              />
              <span className="text-xs text-zinc-600">custom hex</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {form.name && (
        <Card className="bg-zinc-900/50 border-zinc-800/60">
          <CardContent className="px-5 py-4">
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3">Preview</p>
            <span
              className="text-xs px-2.5 py-1 rounded-full border font-medium"
              style={previewStyle}
            >
              {form.name}
            </span>
          </CardContent>
        </Card>
      )}

      <Separator className="bg-zinc-800" />

      <div className="flex items-center gap-3 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={() => router.back()}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-9">
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isPending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-6 min-w-[110px]">
          {isPending
            ? (mode === "create" ? "Creating..." : "Saving...")
            : (mode === "create" ? "Create Tag" : "Save Changes")}
        </Button>
      </div>
    </form>
  );
}