"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Toggle } from "@/components/admin/Toggle";
import { logActivity, useAdminAuth } from "@/components/admin/AdminAuth";

export const Route = createFileRoute("/admin/hero")({
  component: HeroAdmin,
});

type Panel = {
  id: string; panel_number: number;
  heading_1: string | null; heading_2: string | null; heading_3: string | null; heading_4: string | null;
  subtext: string | null; cta_1_text: string | null; cta_2_text: string | null; badge_text: string | null;
  card_1_label: string | null; card_2_label: string | null; card_3_label: string | null;
  image_url: string | null; is_active: boolean;
};

const NAMES = ["Brand Hero", "Products", "Biscuit Gang"];

function HeroAdmin() {
  const { user } = useAdminAuth();
  const [panels, setPanels] = useState<Panel[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    supabase.from("hero_panels").select("*").order("panel_number").then(({ data }) => setPanels((data as Panel[]) ?? []));
  }, []);

  const active = panels[activeIdx];
  const update = (patch: Partial<Panel>) => {
    setPanels(panels.map((p, i) => i === activeIdx ? { ...p, ...patch } : p));
  };

  const save = async () => {
    if (!active) return;
    const { id, ...rest } = active;
    const { error } = await supabase.from("hero_panels").update(rest).eq("id", id);
    if (error) { toast.error(error.message); return; }
    logActivity("Hero panel updated", `Panel ${active.panel_number} — ${NAMES[activeIdx]}`, user?.email ?? null);
    toast.success("Saved");
  };

  if (!active) return <AdminShell title="Hero Sections"><div>Loading…</div></AdminShell>;

  return (
    <AdminShell title="Hero Sections">
      <div className="admin-panel-tabs">
        {panels.map((p, i) => (
          <button key={p.id} className={`admin-panel-tab ${i === activeIdx ? "active" : ""}`} onClick={() => setActiveIdx(i)}>
            Panel {p.panel_number} — {NAMES[i]}
          </button>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-row">
          <div>
            <div className="admin-row">
              <div className="admin-field">
                <label className="admin-label">Heading line 1</label>
                <input className="admin-input" value={active.heading_1 ?? ""} onChange={(e) => update({ heading_1: e.target.value })} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Heading line 2</label>
                <input className="admin-input" value={active.heading_2 ?? ""} onChange={(e) => update({ heading_2: e.target.value })} />
              </div>
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label className="admin-label">Heading line 3</label>
                <input className="admin-input" value={active.heading_3 ?? ""} onChange={(e) => update({ heading_3: e.target.value })} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Heading line 4</label>
                <input className="admin-input" value={active.heading_4 ?? ""} onChange={(e) => update({ heading_4: e.target.value })} />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Subheading</label>
              <textarea className="admin-textarea" rows={3} value={active.subtext ?? ""} onChange={(e) => update({ subtext: e.target.value })} />
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label className="admin-label">CTA Button 1</label>
                <input className="admin-input" value={active.cta_1_text ?? ""} onChange={(e) => update({ cta_1_text: e.target.value })} />
              </div>
              <div className="admin-field">
                <label className="admin-label">CTA Button 2</label>
                <input className="admin-input" value={active.cta_2_text ?? ""} onChange={(e) => update({ cta_2_text: e.target.value })} />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Badge Text</label>
              <input className="admin-input" value={active.badge_text ?? ""} onChange={(e) => update({ badge_text: e.target.value })} />
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label className="admin-label">Card 1 label</label>
                <input className="admin-input" value={active.card_1_label ?? ""} onChange={(e) => update({ card_1_label: e.target.value })} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Card 2 label</label>
                <input className="admin-input" value={active.card_2_label ?? ""} onChange={(e) => update({ card_2_label: e.target.value })} />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Card 3 label</label>
              <input className="admin-input" value={active.card_3_label ?? ""} onChange={(e) => update({ card_3_label: e.target.value })} />
            </div>
          </div>

          <div>
            <div className="admin-field">
              <label className="admin-label">Background / Hero Image</label>
              <ImageUpload bucket="hero-images" value={active.image_url} onChange={(url) => update({ image_url: url })} prefix={`hero-p${active.panel_number}`} />
            </div>
            <div className="admin-field">
              <Toggle checked={active.is_active} onChange={(v) => update({ is_active: v })} label={active.is_active ? "Active on site" : "Hidden"} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16, borderTop: "1px solid var(--admin-border)", paddingTop: 20 }}>
          <button className="admin-btn-red" onClick={save}>Save Panel {active.panel_number}</button>
        </div>
      </div>
    </AdminShell>
  );
}
