"use client";

import { ChevronLeft, ChevronRight, ImagePlus, Link2, Loader2, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "property-images";
const MAX_EDGE = 2000;
const MAX_IMAGES = 24;

type Pending = { id: string; name: string; preview: string; error?: string };

/** Downscales to MAX_EDGE and re-encodes as WebP (JPEG fallback) before upload. */
async function prepare(file: File): Promise<{ blob: Blob; ext: string; type: string }> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const webp = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", 0.85));
    if (webp && webp.type === "image/webp") return { blob: webp, ext: "webp", type: "image/webp" };
    const jpeg = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.86));
    if (jpeg) return { blob: jpeg, ext: "jpg", type: "image/jpeg" };
  } catch {
    // Fall through and upload the original file.
  }
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  return { blob: file, ext, type: file.type || "image/jpeg" };
}

export function ImageUploader({ images, onChange }: { images: string[]; onChange: (next: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending[]>([]);
  const [dragging, setDragging] = useState(false);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  // Uploads finish out of order; always append to the latest list.
  const latest = useRef(images);
  useEffect(() => {
    latest.current = images;
  }, [images]);

  async function upload(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const room = MAX_IMAGES - latest.current.length - pending.length;
    const batch = list.slice(0, Math.max(0, room));
    if (!batch.length) return;

    const supabase = createClient();
    const year = new Date().getFullYear();
    const items: Pending[] = batch.map((f) => ({ id: crypto.randomUUID(), name: f.name, preview: URL.createObjectURL(f) }));
    setPending((cur) => [...cur, ...items]);

    await Promise.all(
      batch.map(async (file, i) => {
        const item = items[i];
        const { blob, ext, type } = await prepare(file);
        const path = `properties/${year}/${item.id}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
          contentType: type,
          cacheControl: "31536000",
          upsert: false,
        });
        if (error) {
          setPending((cur) => cur.map((p) => (p.id === item.id ? { ...p, error: error.message } : p)));
          return;
        }
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        onChange([...latest.current, data.publicUrl]);
        latest.current = [...latest.current, data.publicUrl];
        setPending((cur) => cur.filter((p) => p.id !== item.id));
        URL.revokeObjectURL(item.preview);
      }),
    );
  }

  function move(index: number, by: -1 | 1) {
    const next = [...images];
    const j = index + by;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
  }

  function addUrl() {
    const v = url.trim();
    if (!/^https:\/\/\S+$/i.test(v)) {
      setUrlError("Paste a full https:// image link.");
      return;
    }
    if (images.includes(v)) {
      setUrlError("That image is already added.");
      return;
    }
    onChange([...images, v]);
    setUrl("");
    setUrlError(null);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void upload(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition",
          dragging ? "border-aqua-500 bg-aqua-50" : "border-line bg-surface hover:border-navy-200 hover:bg-navy-50/50",
        )}
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-navy-700 shadow-card">
          <UploadCloud className="h-6 w-6" />
        </span>
        <span className="mt-3 text-sm font-semibold text-ink">Drop photos here or tap to choose</span>
        <span className="mt-1 text-xs text-muted">JPG, PNG, WebP or HEIC · up to {MAX_IMAGES} photos</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) void upload(e.target.files);
          e.target.value = "";
        }}
      />

      {(images.length > 0 || pending.length > 0) && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((src, i) => (
            <li key={src} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-navy-950 ring-1 ring-line">
              <Photo src={src} alt={`Photo ${i + 1}`} fill sizes="240px" className="object-cover" />
              {i === 0 && (
                <span className="absolute top-2 left-2 rounded-full bg-aqua-500 px-2 py-0.5 text-[0.65rem] font-bold text-navy-950">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-navy-950/80 to-transparent p-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move earlier"
                    className="grid h-7 w-7 place-items-center rounded-lg bg-white/90 text-navy-900 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === images.length - 1}
                    aria-label="Move later"
                    className="grid h-7 w-7 place-items-center rounded-lg bg-white/90 text-navy-900 disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onChange(images.filter((x) => x !== src))}
                  aria-label="Remove photo"
                  className="grid h-7 w-7 place-items-center rounded-lg bg-white/90 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
          {pending.map((p) => (
            <li key={p.id} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-navy-950 ring-1 ring-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.preview} alt="" className="h-full w-full object-cover opacity-50" />
              <div className="absolute inset-0 grid place-items-center p-2 text-center">
                {p.error ? (
                  <div className="rounded-lg bg-white/95 p-2 text-[0.7rem] font-semibold text-red-600">
                    Upload failed: {p.error}
                    <button
                      type="button"
                      onClick={() => setPending((cur) => cur.filter((x) => x.id !== p.id))}
                      className="mt-1 block w-full text-navy-700 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                ) : (
                  <span className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy-800">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {images.length === 0 && pending.length === 0 && (
        <p className="mt-3 flex items-center gap-2 text-xs text-muted">
          <ImagePlus className="h-4 w-4" /> Listings with at least 4 good photos get far more enquiries.
        </p>
      )}

      <div className="mt-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
              placeholder="…or paste an image link"
              aria-label="Image link"
              className="h-10 w-full rounded-xl border border-line bg-white pr-3 pl-9 text-sm focus:border-aqua-500 focus:ring-4 focus:ring-aqua-500/15 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={addUrl}
            className="h-10 rounded-xl bg-surface px-3 text-sm font-semibold text-navy-700 ring-1 ring-line hover:bg-navy-50"
          >
            Add link
          </button>
        </div>
        {urlError && <p className="mt-1.5 text-xs font-medium text-red-600">{urlError}</p>}
      </div>
    </div>
  );
}
