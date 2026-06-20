"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { logActivity, useAdminAuth } from "@/components/admin/AdminAuth";

export const Route = createFileRoute("/admin/category-cards")({
  component: CategoryCardsAdmin,
});

type CarouselRow = {
  id: string;
  category: string;
  image_url: string;
  sort_order: number;
  is_visible: boolean;
};

type CategoryTab = { slug: string; title: string };

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

function storageObjectName(value: string) {
  return value.split("/product-images/")[1]?.split("?")[0] ?? null;
}

function CategoryCardsAdmin() {
  const { user } = useAdminAuth();
  const [tabs, setTabs] = useState<CategoryTab[]>([]);
  const [activeTab, setActiveTab] = useState<string>("single");
  const [rows, setRows] = useState<CarouselRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const [{ data: categories, error: catErr }, { data, error }] = await Promise.all([
      supabase.from("product_categories").select("slug, title").order("sort_order"),
      supabase.from("category_carousel_images").select("*").order("sort_order"),
    ]);
    if (catErr) {
      toast.error(catErr.message);
      return;
    }
    if (error) {
      toast.error(error.message);
      return;
    }
    const nextTabs = (categories as CategoryTab[]) ?? [];
    setTabs(nextTabs);
    setActiveTab((prev) => (nextTabs.some((t) => t.slug === prev) ? prev : nextTabs[0]?.slug ?? "single"));
    setRows((data as CarouselRow[]) ?? []);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const categoryRows = rows
    .filter((r) => r.category === activeTab)
    .sort((a, b) => a.sort_order - b.sort_order);

  const uploadImage = async (file: File) => {
    if (!ACCEPT.includes(file.type)) {
      toast.error("Only JPG, PNG or WebP allowed");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Max file size is 5 MB");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `category-${activeTab}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(filename, file, { upsert: false });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("product-images").getPublicUrl(filename);
      const sortOrder = categoryRows.length + 1;
      const { data, error } = await supabase
        .from("category_carousel_images")
        .insert({
          category: activeTab,
          image_url: pub.publicUrl,
          sort_order: sortOrder,
          is_visible: true,
        })
        .select("*")
        .single();

      if (error) throw error;
      setRows((prev) => [...prev, data as CarouselRow]);
      logActivity("Category carousel image added", tabs.find((t) => t.slug === activeTab)?.title ?? activeTab, user?.email ?? null);
      toast.success("Image added to carousel");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeRow = async (row: CarouselRow) => {
    const { error } = await supabase.from("category_carousel_images").delete().eq("id", row.id);
    if (error) {
      toast.error(error.message);
      return;
    }

    const oldName = storageObjectName(row.image_url);
    if (oldName) await supabase.storage.from("product-images").remove([oldName]);

    setRows((prev) => prev.filter((r) => r.id !== row.id));
    logActivity("Category carousel image removed", tabs.find((t) => t.slug === row.category)?.title ?? row.category, user?.email ?? null);
    toast.success("Image removed");
  };

  const moveRow = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= categoryRows.length) return;

    const current = categoryRows[index];
    const swap = categoryRows[target];
    const updates = [
      { id: current.id, sort_order: swap.sort_order },
      { id: swap.id, sort_order: current.sort_order },
    ];

    const results = await Promise.all(
      updates.map(({ id, sort_order }) =>
        supabase.from("category_carousel_images").update({ sort_order }).eq("id", id)
      )
    );

    if (results.some((r) => r.error)) {
      toast.error("Could not reorder images");
      return;
    }

    setRows((prev) =>
      prev.map((r) => {
        const hit = updates.find((u) => u.id === r.id);
        return hit ? { ...r, sort_order: hit.sort_order } : r;
      })
    );
  };

  const toggleVisible = async (row: CarouselRow) => {
    const { error } = await supabase
      .from("category_carousel_images")
      .update({ is_visible: !row.is_visible })
      .eq("id", row.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_visible: !r.is_visible } : r)));
  };

  if (loading) {
    return (
      <AdminShell title="Category Cards">
        <div>Loading…</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Category Cards">
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: "0 0 20px", maxWidth: 720 }}>
        Upload images for the product category cards on the Products page. They rotate every 0.5 seconds.
        If no images are uploaded here, product pack shots are used as a fallback.
      </p>

      <div className="admin-panel-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            className={`admin-panel-tab ${activeTab === tab.slug ? "active" : ""}`}
            onClick={() => setActiveTab(tab.slug)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div>
            <h3 style={{ font: "400 18px 'Abril Fatface', serif", color: "#fff", margin: 0 }}>
              {tabs.find((t) => t.slug === activeTab)?.title ?? "Category"} carousel
            </h3>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: "6px 0 0" }}>
              {categoryRows.length} image{categoryRows.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            className="admin-btn-red"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <Plus size={16} /> Add image
          </button>
        </div>

        {categoryRows.length === 0 ? (
          <div
            className="admin-img-frame"
            style={{ minHeight: 180, cursor: uploading ? "wait" : "pointer" }}
            onClick={() => !uploading && inputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <div className="admin-img-empty">
              <Upload size={20} />
              <span>{uploading ? "Uploading…" : "Click to upload carousel images"}</span>
              <small>JPG, PNG, WebP · max 5MB · switches every 0.5s on the site</small>
            </div>
          </div>
        ) : (
          <div className="admin-carousel-grid">
            {categoryRows.map((row, index) => (
              <div key={row.id} className={`admin-carousel-item${row.is_visible ? "" : " is-hidden"}`}>
                <div className="admin-carousel-thumb">
                  <img src={row.image_url} alt="" />
                </div>
                <div className="admin-carousel-actions">
                  <button type="button" className="admin-btn-ghost" onClick={() => moveRow(index, -1)} disabled={index === 0} aria-label="Move up">
                    <ArrowUp size={14} />
                  </button>
                  <button type="button" className="admin-btn-ghost" onClick={() => moveRow(index, 1)} disabled={index === categoryRows.length - 1} aria-label="Move down">
                    <ArrowDown size={14} />
                  </button>
                  <button type="button" className="admin-btn-ghost" onClick={() => toggleVisible(row)}>
                    {row.is_visible ? "Hide" : "Show"}
                  </button>
                  <button type="button" className="admin-btn-ghost danger" onClick={() => removeRow(row)}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadImage(file);
            e.target.value = "";
          }}
        />
      </div>
    </AdminShell>
  );
}
