"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { logActivity, useAdminAuth } from "@/components/admin/AdminAuth";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsAdmin,
});

const SETTING_KEYS = [
  "ribbon_items",
  "footer_tagline",
  "heritage_ranges",
  "heritage_families",
  "home_ranges_subtitle",
] as const;

function SettingsAdmin() {
  const { user } = useAdminAuth();
  const [ribbon, setRibbon] = useState("");
  const [tagline, setTagline] = useState("Delight in every Bite. Baked in Lenasia since 1998.");
  const [heritageRanges, setHeritageRanges] = useState("11");
  const [heritageFamilies, setHeritageFamilies] = useState("5M+");
  const [homeRangesSubtitle, setHomeRangesSubtitle] = useState("11 ranges, baked in Lenasia and loved across all nine provinces.");

  useEffect(() => {
    supabase.from("site_settings").select("key,value").in("key", [...SETTING_KEYS]).then(({ data }) => {
      (data ?? []).forEach((r: { key: string; value: string | null }) => {
        if (r.key === "ribbon_items") setRibbon(r.value ?? "");
        if (r.key === "footer_tagline") setTagline(r.value && !/Lekker biscuits for every SA family|Delivering local lekkerness/i.test(r.value) ? r.value : "Delight in every Bite. Baked in Lenasia since 1998.");
        if (r.key === "heritage_ranges") setHeritageRanges(r.value ?? "11");
        if (r.key === "heritage_families") setHeritageFamilies(r.value ?? "5M+");
        if (r.key === "home_ranges_subtitle") setHomeRangesSubtitle(r.value ?? "");
      });
    });
  }, []);

  const save = async () => {
    const rows = [
      { key: "ribbon_items", value: ribbon },
      { key: "footer_tagline", value: tagline },
      { key: "heritage_ranges", value: heritageRanges },
      { key: "heritage_families", value: heritageFamilies },
      { key: "home_ranges_subtitle", value: homeRangesSubtitle },
    ];
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    if (error) { toast.error(error.message); return; }
    logActivity("Site settings updated", null, user?.email ?? null);
    toast.success("Settings saved");
  };

  return (
    <AdminShell title="Site Settings">
      <div className="admin-card" style={{ maxWidth: 760 }}>
        <h3 style={{ font: "400 18px 'Abril Fatface', serif", color: "#fff", margin: "0 0 16px" }}>Ribbon Items</h3>
        <div className="admin-field">
          <label className="admin-label">Separate each item with &quot; · &quot;</label>
          <textarea className="admin-textarea" rows={2} value={ribbon} onChange={(e) => setRibbon(e.target.value)} />
        </div>
        <div style={{ background: "var(--admin-bg)", padding: 12, borderRadius: 6, fontSize: 13, color: "var(--admin-gold)", marginBottom: 8, overflowX: "auto", whiteSpace: "nowrap" }}>
          {ribbon || <span style={{ color: "rgba(255,255,255,0.3)" }}>Preview will appear here</span>}
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: 760 }}>
        <h3 style={{ font: "400 18px 'Abril Fatface', serif", color: "#fff", margin: "0 0 16px" }}>Home Page Copy</h3>
        <div className="admin-field">
          <label className="admin-label">Our Ranges section subtitle</label>
          <textarea className="admin-textarea" rows={2} value={homeRangesSubtitle} onChange={(e) => setHomeRangesSubtitle(e.target.value)} />
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: 760 }}>
        <h3 style={{ font: "400 18px 'Abril Fatface', serif", color: "#fff", margin: "0 0 16px" }}>Heritage Stats</h3>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, margin: "0 0 16px" }}>
          Shown in the Our Heritage section on the home page.
        </p>
        <div className="admin-row">
          <div className="admin-field">
            <label className="admin-label">Ranges count</label>
            <input className="admin-input" value={heritageRanges} onChange={(e) => setHeritageRanges(e.target.value)} placeholder="11" />
          </div>
          <div className="admin-field">
            <label className="admin-label">Happy families</label>
            <input className="admin-input" value={heritageFamilies} onChange={(e) => setHeritageFamilies(e.target.value)} placeholder="5M+" />
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: 760 }}>
        <h3 style={{ font: "400 18px 'Abril Fatface', serif", color: "#fff", margin: "0 0 16px" }}>Footer Tagline</h3>
        <div className="admin-field">
          <label className="admin-label">Brand description shown in footer (max 200 chars)</label>
          <textarea className="admin-textarea" rows={3} maxLength={200} value={tagline} onChange={(e) => setTagline(e.target.value)} />
          <small style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, alignSelf: "flex-end" }}>{tagline.length}/200</small>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: 760 }}>
        <h3 style={{ font: "400 18px 'Abril Fatface', serif", color: "#fff", margin: "0 0 16px" }}>Admin Account</h3>
        <div className="admin-field">
          <label className="admin-label">Current email</label>
          <input className="admin-input" value={user?.email ?? ""} disabled />
        </div>
        <small style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>To add or change admin users, contact the developer.</small>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <button className="admin-btn-red" onClick={save}>Save All Settings</button>
      </div>
    </AdminShell>
  );
}
