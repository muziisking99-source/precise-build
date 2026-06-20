"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Toggle, Drawer, ConfirmModal } from "@/components/admin/Toggle";
import { logActivity, useAdminAuth } from "@/components/admin/AdminAuth";
import { queryKeys } from "@/lib/queries/keys";

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

type Category = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cta_text: string | null;
  cta_variant: "red" | "secondary";
  route_path: string;
  sort_order: number;
  is_visible: boolean;
};

type Range = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  sort_order: number;
};

type Product = {
  id: string;
  range_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  pill_text: string | null;
  is_visible: boolean;
  sort_order: number;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveCategoryRoutePath(slug: string, current?: string | null) {
  const trimmed = current?.trim();
  if (trimmed && trimmed !== "/products" && trimmed !== "/products/") return trimmed;
  return `/products/${slug}`;
}

function emptyCategory(sortOrder: number): Category {
  return {
    id: "",
    slug: "",
    title: "",
    description: "",
    cta_text: "",
    cta_variant: "red",
    route_path: "",
    sort_order: sortOrder,
    is_visible: true,
  };
}

function emptyRange(category: string, sortOrder: number): Range {
  return {
    id: "",
    slug: "",
    name: "",
    description: "",
    category,
    sort_order: sortOrder,
  };
}

function ProductsAdmin() {
  const { user } = useAdminAuth();
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [ranges, setRanges] = useState<Range[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeRange, setActiveRange] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [editingRange, setEditingRange] = useState<Range | null>(null);
  const [rangeDrawerOpen, setRangeDrawerOpen] = useState(false);
  const [rangeToDelete, setRangeToDelete] = useState<Range | null>(null);
  const [rangeSlugTouched, setRangeSlugTouched] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categorySlugTouched, setCategorySlugTouched] = useState(false);

  const categoryRanges = useMemo(
    () => ranges.filter((r) => r.category === activeCategory).sort((a, b) => a.sort_order - b.sort_order),
    [ranges, activeCategory]
  );

  const activeCategoryRow = categories.find((c) => c.slug === activeCategory);
  const activeRangeRow = ranges.find((r) => r.id === activeRange);

  const loadCategories = async (preferSlug?: string | null) => {
    const { data } = await supabase.from("product_categories").select("*").order("sort_order");
    const rows = (data as Category[]) ?? [];
    setCategories(rows);
    setActiveCategory((prev) => {
      if (preferSlug && rows.some((c) => c.slug === preferSlug)) return preferSlug;
      if (prev && rows.some((c) => c.slug === prev)) return prev;
      return rows[0]?.slug ?? null;
    });
  };

  const loadRanges = async (preferId?: string | null) => {
    const { data } = await supabase
      .from("product_ranges")
      .select("id, slug, name, description, category, sort_order")
      .order("sort_order");
    const rs = (data as Range[]) ?? [];
    setRanges(rs);
    setActiveRange((prev) => {
      const inCategory = rs.filter((r) => r.category === activeCategory);
      if (preferId && inCategory.some((r) => r.id === preferId)) return preferId;
      if (prev && inCategory.some((r) => r.id === prev)) return prev;
      return inCategory[0]?.id ?? null;
    });
  };

  const loadProducts = async (rangeId: string) => {
    const { data } = await supabase.from("products").select("*").eq("range_id", rangeId).order("sort_order");
    setProducts((data as Product[]) ?? []);
  };

  useEffect(() => {
    loadCategories();
    loadRanges();
  }, []);

  useEffect(() => {
    if (!activeCategory) {
      setActiveRange(null);
      return;
    }
    const inCategory = ranges.filter((r) => r.category === activeCategory);
    setActiveRange((prev) => {
      if (prev && inCategory.some((r) => r.id === prev)) return prev;
      return inCategory[0]?.id ?? null;
    });
  }, [activeCategory, ranges]);

  useEffect(() => {
    if (activeRange) loadProducts(activeRange);
    else setProducts([]);
  }, [activeRange]);

  const openNew = () => {
    if (!activeRange) return;
    setEditing({
      id: "",
      range_id: activeRange,
      name: "",
      description: "",
      image_url: null,
      pill_text: "",
      is_visible: true,
      sort_order: products.length + 1,
    });
    setDrawerOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing({ ...p });
    setDrawerOpen(true);
  };

  const close = () => {
    setDrawerOpen(false);
    setEditing(null);
  };

  const save = async () => {
    if (!editing || !editing.name.trim()) {
      toast.error("Name required");
      return;
    }
    if (editing.id) {
      const { id, ...rest } = editing;
      const { error } = await supabase.from("products").update(rest).eq("id", id);
      if (error) {
        toast.error(error.message);
        return;
      }
      logActivity("Product updated", editing.name, user?.email ?? null);
      toast.success("Saved");
    } else {
      const { id, ...rest } = editing;
      const { error } = await supabase.from("products").insert(rest);
      if (error) {
        toast.error(error.message);
        return;
      }
      logActivity("Product added", editing.name, user?.email ?? null);
      toast.success("Added");
    }
    close();
    if (activeRange) loadProducts(activeRange);
    if (activeCategory) invalidatePublicCategories();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("products").delete().eq("id", toDelete.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    logActivity("Product deleted", toDelete.name, user?.email ?? null);
    toast.success("Deleted");
    setToDelete(null);
    if (activeRange) loadProducts(activeRange);
    invalidatePublicCategories();
  };

  const openNewRange = () => {
    if (!activeCategory) {
      toast.error("Select a category first");
      return;
    }
    setEditingRange(emptyRange(activeCategory, categoryRanges.length + 1));
    setRangeSlugTouched(false);
    setRangeDrawerOpen(true);
  };

  const openEditRange = (r: Range, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRange({ ...r });
    setRangeSlugTouched(true);
    setRangeDrawerOpen(true);
  };

  const closeRangeDrawer = () => {
    setRangeDrawerOpen(false);
    setEditingRange(null);
    setRangeSlugTouched(false);
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
      if (error) {
        toast.error(error.message);
        return;
      }
      logActivity("Range updated", editingRange.name, user?.email ?? null);
      toast.success("Range saved");
      closeRangeDrawer();
      await loadRanges(editingRange.id);
    } else {
      const { data, error } = await supabase.from("product_ranges").insert(payload).select("id").single();
      if (error) {
        toast.error(error.message);
        return;
      }
      logActivity("Range added", editingRange.name, user?.email ?? null);
      toast.success("Range added");
      closeRangeDrawer();
      await loadRanges((data as { id: string }).id);
    }
  };

  const confirmDeleteRange = async () => {
    if (!rangeToDelete) return;
    const { error } = await supabase.from("product_ranges").delete().eq("id", rangeToDelete.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    logActivity("Range deleted", rangeToDelete.name, user?.email ?? null);
    toast.success("Range deleted");
    const deletedId = rangeToDelete.id;
    setRangeToDelete(null);
    await loadRanges(activeRange === deletedId ? null : activeRange);
  };

  const openNewCategory = () => {
    setEditingCategory(emptyCategory(categories.length + 1));
    setCategorySlugTouched(false);
    setCategoryDrawerOpen(true);
  };

  const openEditCategory = (c: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory({ ...c });
    setCategorySlugTouched(true);
    setCategoryDrawerOpen(true);
  };

  const closeCategoryDrawer = () => {
    setCategoryDrawerOpen(false);
    setEditingCategory(null);
    setCategorySlugTouched(false);
  };

  const invalidatePublicCategories = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.productCategories });
    void queryClient.invalidateQueries({ queryKey: queryKeys.categoryHeroes });
    void queryClient.invalidateQueries({ queryKey: queryKeys.categoryCatalog });
    void queryClient.invalidateQueries({ queryKey: queryKeys.categoryMeta });
  };

  const saveCategory = async () => {
    if (!editingCategory || !editingCategory.title.trim()) {
      toast.error("Category title required");
      return;
    }
    const slug = (editingCategory.slug.trim() || slugify(editingCategory.title)).slice(0, 80);
    if (!slug) {
      toast.error("Slug required");
      return;
    }
    const payload = {
      slug,
      title: editingCategory.title.trim(),
      description: editingCategory.description?.trim() || null,
      cta_text: editingCategory.cta_text?.trim() || null,
      cta_variant: editingCategory.cta_variant,
      route_path: resolveCategoryRoutePath(slug, editingCategory.route_path),
      sort_order: editingCategory.sort_order,
      is_visible: editingCategory.is_visible,
    };
    if (editingCategory.id) {
      const { error } = await supabase.from("product_categories").update(payload).eq("id", editingCategory.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      logActivity("Category updated", editingCategory.title, user?.email ?? null);
      toast.success("Category saved");
      invalidatePublicCategories();
      closeCategoryDrawer();
      await loadCategories(slug);
      await loadRanges();
    } else {
      const { error } = await supabase.from("product_categories").insert(payload);
      if (error) {
        toast.error(error.message);
        return;
      }
      logActivity("Category added", editingCategory.title, user?.email ?? null);
      toast.success("Category added");
      invalidatePublicCategories();
      closeCategoryDrawer();
      await loadCategories(slug);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    const linkedRanges = ranges.filter((r) => r.category === categoryToDelete.slug);
    if (linkedRanges.length) {
      toast.error(`Move or delete ${linkedRanges.length} range(s) in this category first`);
      setCategoryToDelete(null);
      return;
    }
    const { error } = await supabase.from("product_categories").delete().eq("id", categoryToDelete.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    logActivity("Category deleted", categoryToDelete.title, user?.email ?? null);
    toast.success("Category deleted");
    invalidatePublicCategories();
    setCategoryToDelete(null);
    await loadCategories();
    await loadRanges();
  };

  return (
    <AdminShell title="Products">
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: "0 0 20px", maxWidth: 720 }}>
        Organise products by category, then range. Edit category card wording on the Products page under each category&apos;s Edit button.
      </p>

      <div className="admin-products-layout">
        <div className="admin-range-list">
          <div className="admin-range-list-head">
            <span>Categories</span>
            <button type="button" className="admin-btn-ghost admin-btn-sm" onClick={openNewCategory}>+ Add</button>
          </div>
          <div className="admin-card">
            {categories.length === 0 && (
              <div style={{ color: "rgba(255,255,255,0.4)", padding: 12, fontSize: 13 }}>
                No categories yet. Add one to get started.
              </div>
            )}
            {categories.map((c) => (
              <div key={c.id} className={`admin-range-row ${activeCategory === c.slug ? "active" : ""}`}>
                <button type="button" className="admin-range-item" onClick={() => setActiveCategory(c.slug)}>
                  <span className="admin-range-item-name">{c.title}</span>
                  <span className="admin-range-item-meta">
                    {ranges.filter((r) => r.category === c.slug).length} range(s)
                    {!c.is_visible ? " · hidden" : ""}
                  </span>
                </button>
                <div className="admin-range-row-actions">
                  <button type="button" onClick={(e) => openEditCategory(c, e)} aria-label={`Edit ${c.title}`}>Edit</button>
                  <button
                    type="button"
                    className="delete"
                    onClick={(e) => { e.stopPropagation(); setCategoryToDelete(c); }}
                    aria-label={`Delete ${c.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {activeCategory && (
            <>
              <div className="admin-range-list-head" style={{ marginTop: 20 }}>
                <span>Ranges in {activeCategoryRow?.title ?? "category"}</span>
                <button type="button" className="admin-btn-ghost admin-btn-sm" onClick={openNewRange}>+ Add</button>
              </div>
              <div className="admin-card">
                {categoryRanges.length === 0 && (
                  <div style={{ color: "rgba(255,255,255,0.4)", padding: 12, fontSize: 13 }}>
                    No ranges in this category yet.
                  </div>
                )}
                {categoryRanges.map((r) => (
                  <div key={r.id} className={`admin-range-row ${activeRange === r.id ? "active" : ""}`}>
                    <button type="button" className="admin-range-item" onClick={() => setActiveRange(r.id)}>
                      <span className="admin-range-item-name">{r.name}</span>
                    </button>
                    <div className="admin-range-row-actions">
                      <button type="button" onClick={(e) => openEditRange(r, e)} aria-label={`Edit ${r.name}`}>Edit</button>
                      <button
                        type="button"
                        className="delete"
                        onClick={(e) => { e.stopPropagation(); setRangeToDelete(r); }}
                        aria-label={`Delete ${r.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div>
          <div className="admin-section-head">
            <div>
              <h2>{activeRangeRow?.name ?? "Select a range"}</h2>
              {activeCategoryRow && (
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: "4px 0 0" }}>
                  {activeCategoryRow.title}
                </p>
              )}
            </div>
            <button className="admin-btn-red" onClick={openNew} disabled={!activeRange}>+ Add Product</button>
          </div>
          <div className="admin-product-grid">
            {!activeRange && (
              <div style={{ color: "rgba(255,255,255,0.4)", padding: 20 }}>
                Choose a category and range to manage products.
              </div>
            )}
            {activeRange && products.length === 0 && (
              <div style={{ color: "rgba(255,255,255,0.4)", padding: 20 }}>No products yet. Click “Add Product”.</div>
            )}
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
              <ImageUpload
                bucket="product-images"
                value={editing.image_url}
                onChange={(url) => setEditing({ ...editing, image_url: url })}
                prefix={`prod-${activeRange?.slice(0, 6) ?? "x"}`}
              />
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

      <Drawer open={rangeDrawerOpen && !!editingRange} onClose={closeRangeDrawer} title={editingRange?.id ? "Edit Range" : "New Range"}>
        {editingRange && (
          <>
            <div className="admin-field">
              <label className="admin-label">Category</label>
              <input className="admin-input" value={categories.find((c) => c.slug === editingRange.category)?.title ?? editingRange.category} disabled />
            </div>
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
                    slug: rangeSlugTouched ? editingRange.slug : slugify(name),
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
                  setRangeSlugTouched(true);
                  setEditingRange({ ...editingRange, slug: slugify(e.target.value) });
                }}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Description</label>
              <textarea className="admin-textarea" rows={3} value={editingRange.description ?? ""} onChange={(e) => setEditingRange({ ...editingRange, description: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Sort Order</label>
              <input className="admin-input" type="number" value={editingRange.sort_order} onChange={(e) => setEditingRange({ ...editingRange, sort_order: parseInt(e.target.value || "0", 10) })} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 24 }}>
              <button type="button" className="admin-btn-ghost" onClick={closeRangeDrawer}>Cancel</button>
              <button type="button" className="admin-btn-red" onClick={saveRange}>Save Range</button>
            </div>
          </>
        )}
      </Drawer>

      <Drawer open={categoryDrawerOpen && !!editingCategory} onClose={closeCategoryDrawer} title={editingCategory?.id ? "Edit Category" : "New Category"}>
        {editingCategory && (
          <>
            <div className="admin-field">
              <label className="admin-label">Card title</label>
              <input
                className="admin-input"
                value={editingCategory.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setEditingCategory({
                    ...editingCategory,
                    title,
                    slug: categorySlugTouched ? editingCategory.slug : slugify(title),
                  });
                }}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Slug</label>
              <input
                className="admin-input"
                value={editingCategory.slug}
                onChange={(e) => {
                  setCategorySlugTouched(true);
                  setEditingCategory({ ...editingCategory, slug: slugify(e.target.value) });
                }}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Card description</label>
              <textarea className="admin-textarea" rows={3} value={editingCategory.description ?? ""} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Button text</label>
              <input className="admin-input" value={editingCategory.cta_text ?? ""} onChange={(e) => setEditingCategory({ ...editingCategory, cta_text: e.target.value })} placeholder="Explore Single Biscuits" />
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label className="admin-label">Button style</label>
                <select className="admin-input" value={editingCategory.cta_variant} onChange={(e) => setEditingCategory({ ...editingCategory, cta_variant: e.target.value as Category["cta_variant"] })}>
                  <option value="red">Red</option>
                  <option value="secondary">Outline</option>
                </select>
              </div>
              <div className="admin-field">
                <label className="admin-label">Sort order</label>
                <input className="admin-input" type="number" value={editingCategory.sort_order} onChange={(e) => setEditingCategory({ ...editingCategory, sort_order: parseInt(e.target.value || "0", 10) })} />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Link URL</label>
              <input className="admin-input" value={editingCategory.route_path} onChange={(e) => setEditingCategory({ ...editingCategory, route_path: e.target.value })} placeholder={`/products/${editingCategory.slug || "your-slug"}`} />
              <small style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Leave blank to use /products/your-slug automatically</small>
            </div>
            <div className="admin-field">
              <Toggle checked={editingCategory.is_visible} onChange={(v) => setEditingCategory({ ...editingCategory, is_visible: v })} label={editingCategory.is_visible ? "Visible on Products page" : "Hidden"} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 24 }}>
              <button type="button" className="admin-btn-ghost" onClick={closeCategoryDrawer}>Cancel</button>
              <button type="button" className="admin-btn-red" onClick={saveCategory}>Save Category</button>
            </div>
          </>
        )}
      </Drawer>

      <ConfirmModal open={!!toDelete} title="Delete product?" message={`Are you sure you want to delete "${toDelete?.name}"? This cannot be undone.`} onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />
      <ConfirmModal open={!!rangeToDelete} title="Delete range?" message={`Delete "${rangeToDelete?.name}" and all products in this range? This cannot be undone.`} onCancel={() => setRangeToDelete(null)} onConfirm={confirmDeleteRange} />
      <ConfirmModal open={!!categoryToDelete} title="Delete category?" message={`Delete "${categoryToDelete?.title}"? Ranges must be removed first.`} onCancel={() => setCategoryToDelete(null)} onConfirm={confirmDeleteCategory} />
    </AdminShell>
  );
}
