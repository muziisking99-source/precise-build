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

type Range = { id: string; slug: string; name: string };
type Product = {
  id: string; range_id: string; name: string; description: string | null;
  image_url: string | null; pill_text: string | null; is_visible: boolean; sort_order: number;
};

function ProductsAdmin() {
  const { user } = useAdminAuth();
  const [ranges, setRanges] = useState<Range[]>([]);
  const [activeRange, setActiveRange] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const loadRanges = async () => {
    const { data } = await supabase.from("product_ranges").select("id, slug, name").order("sort_order");
    const rs = (data as Range[]) ?? [];
    setRanges(rs);
    setActiveRange((prev) => prev ?? rs[0]?.id ?? null);
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

  const activeRangeName = ranges.find(r => r.id === activeRange)?.name ?? "";

  return (
    <AdminShell title="Products">
      <div className="admin-products-layout">
        <div className="admin-range-list">
          <div className="admin-card">
            {ranges.length === 0 && (
              <div style={{ color: "rgba(255,255,255,0.4)", padding: 12, fontSize: 13 }}>
                No ranges yet.
              </div>
            )}
            {ranges.map((r) => (
              <button key={r.id} className={`admin-range-item ${activeRange === r.id ? "active" : ""}`} onClick={() => setActiveRange(r.id)}>
                {r.name}
              </button>
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
    </AdminShell>
  );
}
