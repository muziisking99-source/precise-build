"use client";
import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Props = {
  bucket: "product-images" | "character-images" | "hero-images";
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  /** prefix used in filename, e.g. "products/{id}" */
  prefix?: string;
};

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

export function ImageUpload({ bucket, value, onChange, prefix = "img" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!ACCEPT.includes(file.type)) { toast.error("Only JPG, PNG or WebP allowed"); return; }
    if (file.size > MAX_BYTES) { toast.error("Max file size is 5 MB"); return; }
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `${prefix}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(filename, file, { upsert: false });
      if (error) throw error;
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(filename);
      // delete old image if it lived in same bucket
      if (value) {
        const oldName = value.split(`/${bucket}/`)[1];
        if (oldName) await supabase.storage.from(bucket).remove([oldName]);
      }
      onChange(pub.publicUrl);
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const shown = preview || value;

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
            <small>JPG, PNG, WebP · max 5MB</small>
          </div>
        )}
        {uploading && <div className="admin-img-loading">Uploading…</div>}
      </div>
      {shown && (
        <div className="admin-img-actions">
          <button type="button" className="admin-btn-ghost" onClick={() => inputRef.current?.click()}>Change</button>
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
