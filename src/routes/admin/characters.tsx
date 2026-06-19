"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Toggle, Drawer, ConfirmModal } from "@/components/admin/Toggle";
import { logActivity, useAdminAuth } from "@/components/admin/AdminAuth";

export const Route = createFileRoute("/admin/characters")({
  component: CharactersAdmin,
});

type Character = {
  id: string; name: string; role: string | null; range: string | null;
  description: string | null; pill_text: string | null; image_url: string | null;
  sort_order: number; is_visible: boolean;
};

function CharactersAdmin() {
  const { user } = useAdminAuth();
  const [list, setList] = useState<Character[]>([]);
  const [editing, setEditing] = useState<Character | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Character | null>(null);
  const [ranges, setRanges] = useState<{ slug: string; name: string }[]>([]);

  const load = async () => {
    const { data } = await supabase.from("characters").select("*").order("sort_order");
    setList((data as Character[]) ?? []);
  };
  useEffect(() => {
    load();
    supabase.from("product_ranges").select("slug, name").order("sort_order").then(({ data }) => setRanges(data ?? []));
  }, []);

  const openNew = () => {
    setEditing({ id: "", name: "", role: "", range: "", description: "", pill_text: "", image_url: null, sort_order: list.length + 1, is_visible: true });
    setDrawerOpen(true);
  };
  const openEdit = (c: Character) => { setEditing({ ...c }); setDrawerOpen(true); };
  const close = () => { setDrawerOpen(false); setEditing(null); };

  const save = async () => {
    if (!editing || !editing.name.trim()) { toast.error("Name required"); return; }
    if (editing.id) {
      const { id, ...rest } = editing;
      const { error } = await supabase.from("characters").update(rest).eq("id", id);
      if (error) { toast.error(error.message); return; }
      logActivity("Character updated", editing.name, user?.email ?? null);
    } else {
      const { id, ...rest } = editing;
      const { error } = await supabase.from("characters").insert(rest);
      if (error) { toast.error(error.message); return; }
      logActivity("Character added", editing.name, user?.email ?? null);
    }
    toast.success("Saved");
    close(); load();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("characters").delete().eq("id", toDelete.id);
    if (error) { toast.error(error.message); return; }
    logActivity("Character deleted", toDelete.name, user?.email ?? null);
    toast.success("Deleted");
    setToDelete(null); load();
  };

  return (
    <AdminShell title="Characters">
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: "0 0 20px", maxWidth: 720 }}>
        Upload PNG mascots with transparent backgrounds. Images are not auto-processed — avoid black studio backgrounds in the file.
      </p>
      <div className="admin-section-head">
        <h2>Biscuit Gang</h2>
        <button className="admin-btn-red" onClick={openNew}>+ Add Character</button>
      </div>
      <div className="admin-product-grid">
        {list.map((c) => (
          <div key={c.id} className="admin-product-card">
            {c.image_url ? <img src={c.image_url} alt={c.name} /> : <div className="admin-img-placeholder">No image</div>}
            <h4>{c.name}</h4>
            <p>{c.role}{c.range ? ` · ${c.range}` : ""}</p>
            <div className="admin-product-card-foot">
              <span className={`admin-pill ${c.is_visible ? "" : "muted"}`}>{c.is_visible ? "Visible" : "Hidden"}</span>
              <div className="admin-product-card-actions">
                <button onClick={() => openEdit(c)}>Edit</button>
                <button className="delete" onClick={() => setToDelete(c)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Drawer open={drawerOpen && !!editing} onClose={close} title={editing?.id ? "Edit Character" : "New Character"}>
        {editing && (
          <>
            <div className="admin-field">
              <label className="admin-label">Image</label>
              <ImageUpload bucket="character-images" value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} prefix="char" />
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label className="admin-label">Name</label>
                <input className="admin-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Role</label>
                <input className="admin-input" value={editing.role ?? ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Range</label>
              <select className="admin-select" value={editing.range ?? ""} onChange={(e) => setEditing({ ...editing, range: e.target.value })}>
                <option value="">— Select range —</option>
                {ranges.map(r => <option key={r.slug} value={r.name}>{r.name}</option>)}
              </select>
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
        title="Delete character?"
        message={`Delete "${toDelete?.name}"? This cannot be undone.`}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </AdminShell>
  );
}
