"use client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Image, MessageSquareQuote, Smile, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

type Counts = { ranges: number; products: number; characters: number; testimonials: number; heroActive: number };
type LogRow = { id: string; action: string; item_name: string | null; created_at: string };

function Dashboard() {
  const [counts, setCounts] = useState<Counts>({ ranges: 0, products: 0, characters: 0, testimonials: 0, heroActive: 0 });
  const [log, setLog] = useState<LogRow[]>([]);

  useEffect(() => {
    (async () => {
      const [rg, p, c, t, h, l] = await Promise.all([
        supabase.from("product_ranges").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("characters").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("hero_panels").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("content_log").select("*").order("created_at", { ascending: false }).limit(5),
      ]);
      setCounts({
        ranges: rg.count ?? 0,
        products: p.count ?? 0,
        characters: c.count ?? 0,
        testimonials: t.count ?? 0,
        heroActive: h.count ?? 0,
      });
      setLog((l.data as LogRow[]) ?? []);
    })();
  }, []);

  return (
    <AdminShell title="Dashboard">
      <div className="admin-stat-grid">
        {[
          { n: counts.ranges, l: "Ranges" },
          { n: counts.products, l: "Products" },
          { n: counts.characters, l: "Characters" },
          { n: counts.testimonials, l: "Testimonials" },
        ].map((s) => (
          <div key={s.l} className="admin-stat">
            <div className="admin-stat-num">{s.n}</div>
            <div className="admin-stat-label">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3 style={{ font: "400 18px 'Abril Fatface', serif", color: "#fff", margin: "0 0 16px" }}>Recent Activity</h3>
        <div className="admin-activity">
          {log.length === 0 && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>No activity yet. Make changes to see them here.</div>}
          {log.map((row) => (
            <div key={row.id} className="admin-activity-row">
              <span>{row.action}{row.item_name ? ` — ${row.item_name}` : ""}</span>
              <span className="when">{timeAgo(row.created_at)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-quick-grid" style={{ marginTop: 28 }}>
        <Link to="/admin/products" className="admin-quick">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Image className="admin-quick-icon" size={24} />
            <span className="admin-quick-label">Upload Product Image</span>
          </div>
          <ArrowRight size={18} className="admin-quick-icon" />
        </Link>
        <Link to="/admin/testimonials" className="admin-quick">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <MessageSquareQuote className="admin-quick-icon" size={24} />
            <span className="admin-quick-label">Add Testimonial</span>
          </div>
          <ArrowRight size={18} className="admin-quick-icon" />
        </Link>
        <Link to="/admin/characters" className="admin-quick">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Smile className="admin-quick-icon" size={24} />
            <span className="admin-quick-label">Manage Characters</span>
          </div>
          <ArrowRight size={18} className="admin-quick-icon" />
        </Link>
        <Link to="/admin/hero" className="admin-quick">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Sparkles className="admin-quick-icon" size={24} />
            <span className="admin-quick-label">Update Hero</span>
          </div>
          <ArrowRight size={18} className="admin-quick-icon" />
        </Link>
      </div>
    </AdminShell>
  );
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
