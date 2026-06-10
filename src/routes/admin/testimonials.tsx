"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Toggle, Drawer, ConfirmModal } from "@/components/admin/Toggle";
import { logActivity, useAdminAuth } from "@/components/admin/AdminAuth";

export const Route = createFileRoute("/admin/testimonials")({
  component: TestimonialsAdmin,
});

type T = { id: string; quote: string; name: string; location: string | null; stars: number; is_visible: boolean; sort_order: number };

function TestimonialsAdmin() {
  const { user } = useAdminAuth();
  const [list, setList] = useState<T[]>([]);
  const [editing, setEditing] = useState<T | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toDelete, setToDelete] = useState<T | null>(null);

  const load = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setList((data as T[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing({ id: "", quote: "", name: "", location: "", stars: 5, is_visible: true, sort_order: list.length + 1 });
    setDrawerOpen(true);
  };

  const save = async () => {
    if (!editing || !editing.quote.trim() || !editing.name.trim()) { toast.error("Quote and name required"); return; }
    if (editing.id) {
      const { id, ...rest } = editing;
      const { error } = await supabase.from("testimonials").update(rest).eq("id", id);
      if (error) { toast.error(error.message); return; }
      logActivity("Testimonial updated", editing.name, user?.email ?? null);
    } else {
      const { id, ...rest } = editing;
      const { error } = await supabase.from("testimonials").insert(rest);
      if (error) { toast.error(error.message); return; }
      logActivity("Testimonial added", editing.name, user?.email ?? null);
    }
    toast.success("Saved");
    setDrawerOpen(false); setEditing(null); load();
  };

  const toggleVisible = async (row: T) => {
    const { error } = await supabase.from("testimonials").update({ is_visible: !row.is_visible }).eq("id", row.id);
    if (error) { toast.error(error.message); return; }
    load();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", toDelete.id);
    if (error) { toast.error(error.message); return; }
    logActivity("Testimonial deleted", toDelete.name, user?.email ?? null);
    setToDelete(null); load();
  };

  const visibleCount = list.filter(t => t.is_visible).length;

  return (
    <AdminShell title="Testimonials">
      <div className="admin-section-head">
        <div>
          <h2>Testimonials</h2>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
            {visibleCount} visible · max 6 shown on public site
          </div>
        </div>
        <button className="admin-btn-red" onClick={openNew}>+ Add Testimonial</button>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Quote</th><th>Name</th><th>Location</th><th>★</th><th>Visible</th><th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <tr key={t.id}>
                <td className="quote">“{t.quote}”</td>
                <td>{t.name}</td>
                <td style={{ color: "rgba(255,255,255,0.5)" }}>{t.location}</td>
                <td style={{ color: "var(--admin-gold)" }}>{"★".repeat(t.stars)}</td>
                <td><Toggle checked={t.is_visible} onChange={() => toggleVisible(t)} /></td>
                <td>
                  <div className="admin-product-card-actions">
                    <button onClick={() => { setEditing({ ...t }); setDrawerOpen(true); }}>Edit</button>
                    <button className="delete" onClick={() => setToDelete(t)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer open={drawerOpen && !!editing} onClose={() => { setDrawerOpen(false); setEditing(null); }} title={editing?.id ? "Edit Testimonial" : "New Testimonial"}>
        {editing && (
          <>
            <div className="admin-field">
              <label className="admin-label">Quote</label>
              <textarea className="admin-textarea" rows={4} value={editing.quote} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} />
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label className="admin-label">Name</label>
                <input className="admin-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Location</label>
                <input className="admin-input" value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
              </div>
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label className="admin-label">Stars (1-5)</label>
                <input className="admin-input" type="number" min={1} max={5} value={editing.stars} onChange={(e) => setEditing({ ...editing, stars: Math.max(1, Math.min(5, parseInt(e.target.value || "5", 10))) })} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Sort Order</label>
                <input className="admin-input" type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value || "0", 10) })} />
              </div>
            </div>
            <div className="admin-field">
              <Toggle checked={editing.is_visible} onChange={(v) => setEditing({ ...editing, is_visible: v })} label={editing.is_visible ? "Visible" : "Hidden"} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 24 }}>
              <button className="admin-btn-ghost" onClick={() => { setDrawerOpen(false); setEditing(null); }}>Cancel</button>
              <button className="admin-btn-red" onClick={save}>Save</button>
            </div>
          </>
        )}
      </Drawer>

      <ConfirmModal
        open={!!toDelete}
        title="Delete testimonial?"
        message={`Delete testimonial from "${toDelete?.name}"?`}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </AdminShell>
  );
}
