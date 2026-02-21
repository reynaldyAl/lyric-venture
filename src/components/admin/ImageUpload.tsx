"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value:        string;
  onChange:     (url: string) => void;
  bucket?:      "songs" | "artists" | "albums"; // ← sesuai route kamu ?bucket=
  label?:       string;
  aspectRatio?: "square" | "wide";
}

export default function ImageUpload({
  value,
  onChange,
  bucket = "songs",
  label  = "Cover Image",
  aspectRatio = "square",
}: ImageUploadProps) {
  const { toast } = useToast();
  const fileRef   = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [preview,  setPreview]  = useState<string>(value);
  const [tab,      setTab]      = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value);

  // ── Upload file ke /api/upload?bucket=xxx ─────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Tampilkan preview lokal dulu
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);

      // ✅ Sesuai route kamu — pakai ?bucket= query param
      const res  = await fetch(`/api/upload?bucket=${bucket}`, {
        method: "POST",
        body:   formData,
      });
      const json = await res.json();

      if (res.ok) {
        onChange(json.url);
        setPreview(json.url);
        setUrlInput(json.url);
        toast({ title: "Image uploaded!", description: "Cover image saved." });
      } else {
        // Revert preview jika gagal
        setPreview(value);
        toast({
          title:       "Upload failed",
          description: json.error ?? "Something went wrong",
          variant:     "destructive",
        });
      }
    });
  }

  // ── Pakai URL langsung ────────────────────────────────
  function handleUrlApply() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setPreview(trimmed);
    toast({ title: "Image URL applied" });
  }

  // ── Clear ─────────────────────────────────────────────
  function handleClear() {
    onChange("");
    setPreview("");
    setUrlInput("");
    if (fileRef.current) fileRef.current.value = "";
  }

  const hasImage = !!preview;

  return (
    <div className="space-y-3">
      <Label className="text-xs text-zinc-400">{label}</Label>

      {/* Preview box */}
      <div
        className={`relative bg-zinc-800 border border-zinc-700 overflow-hidden ${
          aspectRatio === "square" ? "w-32 h-32" : "w-full h-40"
        }`}
      >
        {hasImage ? (
          <>
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes={aspectRatio === "square" ? "128px" : "400px"}
              unoptimized={preview.startsWith("blob:")}
            />

            {/* Loading overlay */}
            {isPending && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Clear button */}
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/70 text-white text-[10px] flex items-center justify-center hover:bg-red-600 transition-colors rounded-sm"
            >
              ✕
            </button>
          </>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-700/50 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-2xl text-zinc-600">↑</span>
                <span className="text-[10px] text-zinc-500">Click to upload</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Tab switcher: Upload vs URL */}
      <div className="flex border border-zinc-700 w-fit">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`text-[10px] px-3 py-1.5 transition-colors ${
            tab === "upload"
              ? "bg-zinc-700 text-zinc-100"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`text-[10px] px-3 py-1.5 transition-colors ${
            tab === "url"
              ? "bg-zinc-700 text-zinc-100"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Paste URL
        </button>
      </div>

      {/* Tab content */}
      {tab === "upload" ? (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={isPending}
            className="h-8 text-xs border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            {isPending ? "Uploading..." : "Choose Image"}
          </Button>
          <p className="text-[10px] text-zinc-600 mt-1.5">
            JPG, PNG, WebP, GIF · max 5MB
          </p>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUrlApply();
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleUrlApply}
            className="h-8 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-100 px-3 shrink-0"
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}