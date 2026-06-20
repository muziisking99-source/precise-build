"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { logActivity, useAdminAuth } from "@/components/admin/AdminAuth";
import { queryKeys } from "@/lib/queries/keys";

export const Route = createFileRoute("/admin/contact-info")({
  component: ContactInfoAdmin,
});

const FIELDS: { key: string; label: string; type?: string; textarea?: boolean }[] = [
  { key: "contact_email", label: "Email address", type: "email" },
  { key: "contact_phone", label: "Phone number" },
  { key: "contact_address", label: "Bakery address", textarea: true },
  { key: "contact_hours", label: "Hours" },
  { key: "facebook_url", label: "Facebook URL", type: "url" },
  { key: "instagram_url", label: "Instagram URL", type: "url" },
  { key: "tiktok_url", label: "TikTok URL", type: "url" },
];

function ContactInfoAdmin() {
  const { user } = useAdminAuth();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("site_settings").select("key,value").in("key", FIELDS.map(f => f.key)).then(({ data }) => {
      const v: Record<string, string> = {};
      (data ?? []).forEach((r: any) => { v[r.key] = r.value ?? ""; });
      setValues(v);
    });
  }, []);

  const save = async () => {
    const rows = FIELDS.map(f => ({ key: f.key, value: values[f.key] ?? "" }));
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    if (error) { toast.error(error.message); return; }
    logActivity("Contact info updated", null, user?.email ?? null);
    void queryClient.invalidateQueries({ queryKey: queryKeys.siteSettings });
    toast.success("Contact info saved");
  };

  return (
    <AdminShell title="Contact Info">
      <div className="admin-card" style={{ maxWidth: 720 }}>
        {FIELDS.map(f => (
          <div className="admin-field" key={f.key}>
            <label className="admin-label">{f.label}</label>
            {f.textarea
              ? <textarea className="admin-textarea" rows={3} value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
              : <input className="admin-input" type={f.type ?? "text"} value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />}
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <button className="admin-btn-red" onClick={save}>Save Contact Info</button>
        </div>
      </div>
    </AdminShell>
  );
}
