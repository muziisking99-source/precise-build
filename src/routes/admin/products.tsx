"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Toggle, Drawer, ConfirmModal } from "@/components/admin/Toggle";
import { logActivity, useAdminAuth } from "@/components/admin/AdminAuth";

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

type Range = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  sort_order: number;
};
type Product = {
  id: string; range_id: string; name: string; description: string | null;
  image_url: string | null; pill_text: string | null; is_visible: boolean; sort_order: number;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function emptyRange(sortOrder: number): Range {
  return {
    id: "",
    slug: "",
    name: "",
    description: "",
    category: "single",
    sort_order: sortOrder,
  };
}

function ProductsAdmin() {
  const { user } = useAdminAuth();
  const [ranges, setRanges] = useState<Range[]>([]);
  const [activeRange, setActiveRange] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [editingRange, setEditingRange] = useState<Range | null>(null);
  const [rangeDrawerOpen, setRangeDrawerOpen] = useState(false);
  const [rangeToDelete, setRangeToDelete] = useState<Range | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const loadRanges = async (preferId?: string | null) => {
    const { data } = await supabase
      .from("product_ranges")
      .select("id, slug, name, description, category, sort_order")
      .order("sort_order");
    const rs = (data as Range[]) ?? [];
    setRanges(rs);
    setActiveRange((prev) => {
      if (preferId && rs.some((r) => r.id === preferId)) return preferId;
      if (prev && rs.some((r) => r.id === prev)) return prev;
      return rs[0]?.id ?? null;
    });
  };
  const loadProducts = async (rangeId: string) => {
    const { data } = await supabase.from("products").select("*").eq("range_id", rangeId).order("sort_order");
    setProducts((data as Product[]) ?? []);
  };
  useEffect(() => { loadRanges(); }, []);
  useEffect(() => { if (activeRange) loadProducts(activeRange); else setProducts([]); }, [activeRange]);


  const openNew = () => {
    if (!activeRange) return;
    setEditing({ id: "", range_id: activeRange, name: "", description: "", image_url: null, pill_text: "", is_visible: true, sort_order: products.length + 1 });
    setDrawerOpen(true);
  };
  const openEdit = (p: Product) => { setEditing({ ...p }); setDrawerOpen(true); };
  const close = () => { setDrawerOpen(false); setEditing(null); };

  const save = async () => {
    if (!editing || !editing.name.trim()) { toast.error("Name required"); return; }
    if (editing.id) {
      const { id, ...rest } = editing;
      const { error } = await supabase.from("products").update(rest).eq("id", id);
      if (error) { toast.error(error.message); return; }
      logActivity("Product updated", editing.name, user?.email ?? null);
      toast.success("Saved");
    } else {
      const { id, ...rest } = editing;
      const { error } = await supabase.from("products").insert(rest);
      if (error) { toast.error(error.message); return; }
      logActivity("Product added", editing.name, user?.email ?? null);
      toast.success("Added");
    }
    close();
    if (activeRange) loadProducts(activeRange);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("products").delete().eq("id", toDelete.id);
    if (error) { toast.error(error.message); return; }
    logActivity("Product deleted", toDelete.name, user?.email ?? null);
    toast.success("Deleted");
    setToDelete(null);
    if (activeRange) loadProducts(activeRange);
  };

  const openNewRange = () => {
    setEditingRange(emptyRange(ranges.length + 1));
    setSlugTouched(false);
    setRangeDrawerOpen(true);
  };
  const openEditRange = (r: Range, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRange({ ...r });
    setSlugTouched(true);
    setRangeDrawerOpen(true);
  };
  const closeRangeDrawer = () => {
    setRangeDrawerOpen(false);
    setEditingRange(null);
    setSlugTouched(false);
  };

  const saveRange = async () => {
    if (!editingRange || !editingRange.name.trim()) {
      toast.error("Range name required");
      return;
    }
    const slug = (editingRange.slug.trim() || slugify(editingRange.name)).slice(0, 80);
    if (!slug) {
      toast.error("Slug required");
      return;
    }
    const payload = {
      name: editingRange.name.trim(),
      slug,
      description: editingRange.description?.trim() || null,
      category: editingRange.category,
      sort_order: editingRange.sort_order,
    };
    if (editingRange.id) {
      const { error } = await supabase.from("product_ranges").update(payload).eq("id", editingRange.id);
      if (error) { toast.error(error.message); return; }
      logActivity("Range updated", editingRange.name, user?.email ?? null);
      toast.success("Range saved");
      closeRangeDrawer();
      await loadRanges(editingRange.id);
    } else {
      const { data, error } = await supabase.from("product_ranges").insert(payload).select("id").single();
      if (error) { toast.error(error.message); return; }
      logActivity("Range added", editingRange.name, user?.email ?? null);
      toast.success("Range added");
      closeRangeDrawer();
      await loadRanges((data as { id: string }).id);
    }
  };

  const confirmDeleteRange = async () => {
    if (!rangeToDelete) return;
    const { error } = await supabase.from("product_ranges").delete().eq("id", rangeToDelete.id);
    if (error) { toast.error(error.message); return; }
    logActivity("Range deleted", rangeToDelete.name, user?.email ?? null);
    toast.success("Range deleted");
    const deletedId = rangeToDelete.id;
    setRangeToDelete(null);
    await loadRanges(activeRange === deletedId ? null : activeRange);
  };

  const activeRangeName = ranges.find(r => r.id === activeRange)?.name ?? "";

  return (
    <AdminShell title="Products">
      <div className="admin-products-layout">
        <div className="admin-range-list">
          <div className="admin-range-list-head">
            <span>Ranges</span>
            <button type="button" className="admin-btn-ghost admin-btn-sm" onClick={openNewRange}>+ Add</button>
          </div>
          <div className="admin-card">
            {ranges.length === 0 && (
              <div style={{ color: "rgba(255,255,255,0.4)", padding: 12, fontSize: 13 }}>
                No ranges yet. Add one to get started.
              </div>
            )}
            {ranges.map((r) => (
              <div key={r.id} className={`admin-range-row ${activeRange === r.id ? "active" : ""}`}>
                <button type="button" className="admin-range-item" onClick={() => setActiveRange(r.id)}>
                  <span className="admin-range-item-name">{r.name}</span>
                  <span className="admin-range-item-meta">{r.category}</span>
                </button>
                <div className="admin-range-row-actions">
                  <button type="button" onClick={(e) => openEditRange(r, e)} aria-label={`Edit ${r.name}`}>Edit</button>
                  <button type="button" className="delete" onClick={(e) => { e.stopPropagation(); setRangeToDelete(r); }} aria-label={`Delete ${r.name}`}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="admin-section-head">
            <h2>{activeRangeName}</h2>
            <button className="admin-btn-red" onClick={openNew}>+ Add Product</button>
          </div>
          <div className="admin-product-grid">
            {products.length === 0 && <div style={{ color: "rgba(255,255,255,0.4)", padding: 20 }}>No products yet. Click “Add Product”.</div>}
            {products.map((p) => (
              <div key={p.id} className="admin-product-card">
                {p.image_url ? <img src={p.image_url} alt={p.name} /> : <div className="admin-img-placeholder">No image</div>}
                <h4>{p.name}</h4>
                <p>{p.description}</p>
                <div className="admin-product-card-foot">
                  <span className={`admin-pill ${p.is_visible ? "" : "muted"}`}>{p.is_visible ? "Visible" : "Hidden"}</span>
                  <div className="admin-product-card-actions">
                    <button onClick={() => openEdit(p)}>Edit</button>
                    <button className="delete" onClick={() => setToDelete(p)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Drawer open={drawerOpen && !!editing} onClose={close} title={editing?.id ? "Edit Product" : "New Product"}>
        {editing && (
          <>
            <div className="admin-field">
              <label className="admin-label">Image</label>
              <ImageUpload bucket="product-images" value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} prefix={`prod-${activeRange?.slice(0,6) ?? "x"}`} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Name</label>
              <input className="admin-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Description</label>
              <textarea className="admin-textarea" rows={3} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label className="admin-label">Pill / Tag</label>
                <input className="admin-input" value={editing.pill_text ?? ""} onChange={(e) => setEditing({ ...editing, pill_text: e.target.value })} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Sort Order</label>
                <input className="admin-input" type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value || "0", 10) })} />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Visibility</label>
              <Toggle checked={editing.is_visible} onChange={(v) => setEditing({ ...editing, is_visible: v })} label={editing.is_visible ? "Visible on public site" : "Hidden"} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 24 }}>
              <button className="admin-btn-ghost" onClick={close}>Cancel</button>
              <button className="admin-btn-red" onClick={save}>Save</button>
            </div>
          </>
        )}
      </Drawer>

      <ConfirmModal
        open={!!toDelete}
        title="Delete product?"
        message={`Are you sure you want to delete "${toDelete?.name}"? This cannot be undone.`}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />

      <Drawer open={rangeDrawerOpen && !!editingRange} onClose={closeRangeDrawer} title={editingRange?.id ? "Edit Range" : "New Range"}>
        {editingRange && (
          <>
            <div className="admin-field">
              <label className="admin-label">Name</label>
              <input
                className="admin-input"
                value={editingRange.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setEditingRange({
                    ...editingRange,
                    name,
                    slug: slugTouched ? editingRange.slug : slugify(name),
                  });
                }}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Slug</label>
              <input
                className="admin-input"
                value={editingRange.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setEditingRange({ ...editingRange, slug: slugify(e.target.value) });
                }}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Description</label>
              <textarea
                className="admin-textarea"
                rows={3}
                value={editingRange.description ?? ""}
                onChange={(e) => setEditingRange({ ...editingRange, description: e.target.value })}
              />
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label className="admin-label">Category</label>
                <select
                  className="admin-input"
                  value={editingRange.category}
                  onChange={(e) => setEditingRange({ ...editingRange, category: e.target.value })}
                >
                  <option value="single">Single packs</option>
                  <option value="bulk">Bulk</option>
                </select>
              </div>
              <div className="admin-field">
                <label className="admin-label">Sort Order</label>
                <input
                  className="admin-input"
                  type="number"
                  value={editingRange.sort_order}
                  onChange={(e) => setEditingRange({ ...editingRange, sort_order: parseInt(e.target.value || "0", 10) })}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 24 }}>
              <button type="button" className="admin-btn-ghost" onClick={closeRangeDrawer}>Cancel</button>
              <button type="button" className="admin-btn-red" onClick={saveRange}>Save Range</button>
            </div>
          </>
        )}
      </Drawer>

      <ConfirmModal
        open={!!rangeToDelete}
        title="Delete range?"
        message={`Delete "${rangeToDelete?.name}" and all products in this range? This cannot be undone.`}
        onCancel={() => setRangeToDelete(null)}
        onConfirm={confirmDeleteRange}
      />
    </AdminShell>
  );
}
