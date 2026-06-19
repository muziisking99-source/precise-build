"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Toggle } from "@/components/admin/Toggle";
import { logActivity, useAdminAuth } from "@/components/admin/AdminAuth";
import { DEFAULT_HERO_PANELS, HERO_PANEL_LABELS, legacySyncPayload, panelsNeedLegacySync, resolveHeroPanelsFromDb, type HeroPanelRow } from "@/data/heroDefaults";

export const Route = createFileRoute("/admin/hero")({
  component: HeroAdmin,
});

async function ensureHeroPanels(): Promise<HeroPanelRow[]> {
  const { data } = await supabase.from("hero_panels").select("*").order("panel_number");
  let rows = (data as HeroPanelRow[] | null)?.filter((p) => p.panel_number === 1 || p.panel_number === 2) ?? [];

  if (rows.length === 0) {
    const { data: inserted, error } = await supabase.from("hero_panels").insert(DEFAULT_HERO_PANELS).select("*");
    if (error) throw error;
    rows = ((inserted as HeroPanelRow[]) ?? []).filter((p) => p.panel_number === 1 || p.panel_number === 2);
  }

  const stale = panelsNeedLegacySync(rows);
  if (stale.length) {
    await Promise.all(
      stale.map((p) => supabase.from("hero_panels").update(legacySyncPayload(p)).eq("id", p.id!))
    );
    const { data: refreshed } = await supabase.from("hero_panels").select("*").order("panel_number");
    rows = (refreshed as HeroPanelRow[] | null)?.filter((p) => p.panel_number === 1 || p.panel_number === 2) ?? rows;
  }

  return resolveHeroPanelsFromDb(rows);
}

function HeroAdmin() {
  const { user } = useAdminAuth();
  const [panels, setPanels] = useState<HeroPanelRow[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureHeroPanels()
      .then(setPanels)
      .catch((e) => toast.error(e.message ?? "Could not load hero panels"))
      .finally(() => setLoading(false));
  }, []);

  const active = panels[activeIdx];
  const update = (patch: Partial<HeroPanelRow>) => {
    setPanels(panels.map((p, i) => (i === activeIdx ? { ...p, ...patch } : p)));
  };

  const save = async () => {
    if (!active?.id) return;
    const { id, ...rest } = active;
    const { error } = await supabase.from("hero_panels").update(rest).eq("id", id);
    if (error) { toast.error(error.message); return; }
    logActivity("Hero panel updated", `Panel ${active.panel_number} — ${HERO_PANEL_LABELS[activeIdx] ?? "Hero"}`, user?.email ?? null);
    toast.success("Saved — changes appear on the home page");
  };

  if (loading) return <AdminShell title="Hero Sections"><div>Loading…</div></AdminShell>;
  if (!active) return <AdminShell title="Hero Sections"><div>No hero panels found.</div></AdminShell>;

  const isBrandPanel = active.panel_number === 1;

  return (
    <AdminShell title="Hero Sections">
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: "0 0 20px", maxWidth: 720 }}>
        Edits here update the scroll hero on the home page. Panel 1 uses gold / white / red headline colours automatically.
      </p>

      <div className="admin-panel-tabs">
        {panels.filter((p) => p.panel_number <= 2).map((p, i) => (
          <button key={p.id ?? p.panel_number} className={`admin-panel-tab ${i === activeIdx ? "active" : ""}`} onClick={() => setActiveIdx(i)}>
            Panel {p.panel_number} — {HERO_PANEL_LABELS[i] ?? "Hero"}
          </button>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-field">
          <label className="admin-label">Badge text</label>
          <input className="admin-input" value={active.badge_text ?? ""} onChange={(e) => update({ badge_text: e.target.value })} />
        </div>

        <div className="admin-row">
          <div className="admin-field">
            <label className="admin-label">{isBrandPanel ? "Headline line 1 (gold)" : "Headline line 1"}</label>
            <input className="admin-input" value={active.heading_1 ?? ""} onChange={(e) => update({ heading_1: e.target.value })} />
          </div>
          <div className="admin-field">
            <label className="admin-label">{isBrandPanel ? "Headline line 2 (white)" : "Headline line 2 (red accent)"}</label>
            <input className="admin-input" value={active.heading_2 ?? ""} onChange={(e) => update({ heading_2: e.target.value })} />
          </div>
        </div>

        {isBrandPanel && (
          <div className="admin-field">
            <label className="admin-label">Headline line 3 (red accent)</label>
            <input className="admin-input" value={active.heading_3 ?? ""} onChange={(e) => update({ heading_3: e.target.value })} />
          </div>
        )}

        <div className="admin-field">
          <label className="admin-label">Subheading</label>
          <textarea className="admin-textarea" rows={3} value={active.subtext ?? ""} onChange={(e) => update({ subtext: e.target.value })} />
        </div>

        {isBrandPanel && (
          <div className="admin-field">
            <label className="admin-label">Secondary CTA text (links to About)</label>
            <input className="admin-input" value={active.cta_2_text ?? ""} onChange={(e) => update({ cta_2_text: e.target.value })} placeholder="Our Story →" />
          </div>
        )}

        <div className="admin-field">
          <Toggle checked={active.is_active} onChange={(v) => update({ is_active: v })} label={active.is_active ? "Visible on home page" : "Hidden"} />
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16, borderTop: "1px solid var(--admin-border)", paddingTop: 20 }}>
          <button className="admin-btn-red" onClick={save}>Save Panel {active.panel_number}</button>
        </div>
      </div>
    </AdminShell>
  );
}
