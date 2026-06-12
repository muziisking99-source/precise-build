"use client";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { Home, Package, Smile, Sparkles, MessageSquareQuote, Mail, Settings, LogOut, Menu, X } from "lucide-react";
import { useAdminAuth } from "./AdminAuth";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Home },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/characters", label: "Characters", icon: Smile },
  { to: "/admin/hero", label: "Hero Sections", icon: Sparkles },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/contact-info", label: "Contact Info", icon: Mail },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
] as const;

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const { user, isAdmin, loading, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return <div className="admin-loading">Loading…</div>;
  }
  if (!user) {
    // not signed in
    if (typeof window !== "undefined") navigate({ to: "/admin/login", replace: true });
    return <div className="admin-loading">Redirecting…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="admin-loading admin-denied">
        <div>
          <h2>Access denied</h2>
          <p>This account is not authorized to access the admin.</p>
          <button className="admin-btn-red" onClick={async () => { await signOut(); navigate({ to: "/admin/login", replace: true }); }}>Sign out</button>
        </div>
      </div>
    );
  }

  const initials = (user.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <div className="admin-root">
      <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="admin-logo">
          <Logo height={32} />
          <div>
            <div className="admin-brand">Golden Fresh</div>
            <div className="admin-eyebrow">Admin</div>
          </div>
        </div>
        <nav className="admin-nav">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link key={n.to} to={n.to} className={`admin-nav-item ${active ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                <Icon size={16} />
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          className="admin-nav-item admin-signout"
          onClick={async () => { await signOut(); navigate({ to: "/admin/login", replace: true }); }}
        >
          <LogOut size={16} /><span>Sign Out</span>
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-hamburger" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="admin-title">{title}</h1>
          <div className="admin-user">
            <span className="admin-email">{user.email}</span>
            <div className="admin-avatar">{initials}</div>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
      {mobileOpen && <div className="admin-overlay" onClick={() => setMobileOpen(false)} />}
    </div>
  );
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <rect x="4" y="4" width="56" height="56" rx="14" fill="#C41C1C" />
      <path d="M32 14 L32 50 M24 22 L32 28 L40 22 M22 32 L32 38 L42 32 M24 42 L32 48 L40 42" stroke="#D4920A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <text x="32" y="56" textAnchor="middle" fontFamily="Abril Fatface, serif" fontSize="10" fill="#FAF8F4">GF</text>
    </svg>
  );
}
