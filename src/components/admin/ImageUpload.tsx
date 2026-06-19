"use client";
import { useRef, useState } from "react";
import { Upload, Wand2, ZoomIn, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { shouldStripBackground, stripEdgeBlackBackground } from "@/lib/stripEdgeBlackBackground";
import { enlargeImage } from "@/lib/enlargeImage";
import { DEFAULT_PACK_ENLARGE_SCALE } from "@/lib/productPackImage";

type Props = {
  bucket: "product-images" | "character-images" | "hero-images";
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  /** prefix used in filename, e.g. "products/{id}" */
  prefix?: string;
};

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

function storageObjectName(value: string, bucket: string) {
  return value.split(`/${bucket}/`)[1]?.split("?")[0] ?? null;
}

export function ImageUpload({ bucket, value, onChange, prefix = "img" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canStrip = shouldStripBackground(bucket);

  const uploadBlob = async (uploadFile: File, oldValue?: string | null) => {
    const ext = uploadFile.name.split(".").pop() || "jpg";
    const filename = `${prefix}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(filename, uploadFile, { upsert: false });
    if (error) throw error;
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(filename);
    const source = oldValue ?? value;
    if (source) {
      const oldName = storageObjectName(source, bucket);
      if (oldName) await supabase.storage.from(bucket).remove([oldName]);
    }
    onChange(pub.publicUrl);
    toast.success("Image uploaded");
  };

  const maybeStrip = async (file: File) => {
    if (!canStrip) return file;
    try {
      const processed = await stripEdgeBlackBackground(file);
      if (processed !== file) {
        toast.message("Edge black removed — saved as transparent PNG");
        return processed;
      }
    } catch {
      toast.message("Uploaded original — could not auto-remove background");
    }
    return file;
  };

  const handleFile = async (file: File) => {
    if (!ACCEPT.includes(file.type)) { toast.error("Only JPG, PNG or WebP allowed"); return; }
    if (file.size > MAX_BYTES) { toast.error("Max file size is 5 MB"); return; }
    const uploadFile = await maybeStrip(file);
    const localUrl = URL.createObjectURL(uploadFile);
    setPreview(localUrl);
    setUploading(true);
    try {
      await uploadBlob(uploadFile);
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const fixBackground = async () => {
    if (!value || !canStrip) return;
    const oldName = storageObjectName(value, bucket);
    if (!oldName) {
      toast.error("Could not read stored image path");
      return;
    }
    setUploading(true);
    try {
      const { data, error } = await supabase.storage.from(bucket).download(oldName);
      if (error || !data) throw error ?? new Error("Download failed");
      const file = new File([data], oldName, { type: data.type || "image/png" });
      const processed = await stripEdgeBlackBackground(file);
      if (processed === file) {
        toast.message("No removable edge black on this file");
        return;
      }
      toast.message("Edge black removed — re-uploading…");
      const localUrl = URL.createObjectURL(processed);
      setPreview(localUrl);
      await uploadBlob(processed, value);
    } catch (e: any) {
      toast.error(e.message ?? "Could not fix background");
    } finally {
      setUploading(false);
    }
  };

  const enlargePackImage = async () => {
    if (!value || !canStrip) return;
    const oldName = storageObjectName(value, bucket);
    if (!oldName) {
      toast.error("Could not read stored image path");
      return;
    }
    setUploading(true);
    try {
      const { data, error } = await supabase.storage.from(bucket).download(oldName);
      if (error || !data) throw error ?? new Error("Download failed");
      const file = new File([data], oldName, { type: data.type || "image/png" });
      const processed = await enlargeImage(file);
      if (processed === file) {
        toast.message("Image unchanged");
        return;
      }
      toast.message(`Enlarged ${Math.round((DEFAULT_PACK_ENLARGE_SCALE - 1) * 100)}% — re-uploading…`);
      const localUrl = URL.createObjectURL(processed);
      setPreview(localUrl);
      await uploadBlob(processed, value);
    } catch (e: any) {
      toast.error(e.message ?? "Could not enlarge image");
    } finally {
      setUploading(false);
    }
  };

  const shown = preview || value;
  const uploadHint =
    bucket === "character-images"
      ? "PNG with transparency recommended for characters"
      : canStrip
        ? "JPG, PNG, WebP · max 5MB · edge black auto-removed on product uploads"
        : "JPG, PNG, WebP · max 5MB";

  return (
    <div className="admin-img-upload">
      <div
        className="admin-img-frame"
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        {shown ? (
          <img src={shown} alt="" />
        ) : (
          <div className="admin-img-empty">
            <Upload size={20} />
            <span>Click to upload</span>
            <small>{uploadHint}</small>
          </div>
        )}
        {uploading && <div className="admin-img-loading">Uploading…</div>}
      </div>
      {shown && (
        <div className="admin-img-actions">
          <button type="button" className="admin-btn-ghost" onClick={() => inputRef.current?.click()}>Change</button>
          {canStrip && value && (
            <button type="button" className="admin-btn-ghost" onClick={fixBackground} disabled={uploading}>
              <Wand2 size={14} /> Fix background
            </button>
          )}
          {canStrip && value && (
            <button type="button" className="admin-btn-ghost" onClick={enlargePackImage} disabled={uploading}>
              <ZoomIn size={14} /> Enlarge {Math.round((DEFAULT_PACK_ENLARGE_SCALE - 1) * 100)}%
            </button>
          )}
          <button type="button" className="admin-btn-ghost danger" onClick={() => { setPreview(null); onChange(null); }}>
            <X size={14} /> Remove
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
}
