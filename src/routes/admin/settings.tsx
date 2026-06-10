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

function SettingsAdmin() {
  const { user } = useAdminAuth();
  const [ribbon, setRibbon] = useState("");
  const [tagline, setTagline] = useState("");
  const [findUrl, setFindUrl] = useState("");
  const [findText, setFindText] = useState("");

  useEffect(() => {
    supabase.from("site_settings").select("key,value").in("key", ["ribbon_items","footer_tagline","find_store_url","find_store_text"]).then(({ data }) => {
      (data ?? []).forEach((r: any) => {
        if (r.key === "ribbon_items") setRibbon(r.value ?? "");
        if (r.key === "footer_tagline") setTagline(r.value ?? "");
        if (r.key === "find_store_url") setFindUrl(r.value ?? "");
        if (r.key === "find_store_text") setFindText(r.value ?? "");
      });
    });
  }, []);

  const save = async () => {
    const rows = [
      { key: "ribbon_items", value: ribbon },
      { key: "footer_tagline", value: tagline },
      { key: "find_store_url", value: findUrl },
      { key: "find_store_text", value: findText },
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
          <label className="admin-label">Separate each item with " · "</label>
          <textarea className="admin-textarea" rows={2} value={ribbon} onChange={(e) => setRibbon(e.target.value)} />
        </div>
        <div style={{ background: "var(--admin-bg)", padding: 12, borderRadius: 6, fontSize: 13, color: "var(--admin-gold)", marginBottom: 8, overflowX: "auto", whiteSpace: "nowrap" }}>
          {ribbon || <span style={{ color: "rgba(255,255,255,0.3)" }}>Preview will appear here</span>}
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
        <h3 style={{ font: "400 18px 'Abril Fatface', serif", color: "#fff", margin: "0 0 16px" }}>“Find a Store” Button</h3>
        <div className="admin-row">
          <div className="admin-field">
            <label className="admin-label">Button text</label>
            <input className="admin-input" value={findText} onChange={(e) => setFindText(e.target.value)} />
          </div>
          <div className="admin-field">
            <label className="admin-label">URL</label>
            <input className="admin-input" type="url" value={findUrl} onChange={(e) => setFindUrl(e.target.value)} />
          </div>
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
