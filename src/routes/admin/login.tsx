"use client";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/components/admin/AdminAuth";
import { LogoMark } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate({ to: "/admin/dashboard", replace: true });
  }, [user, isAdmin, loading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) { setErr("Incorrect email or password. Please try again."); return; }
    // auth state listener will redirect when isAdmin resolves
    navigate({ to: "/admin/dashboard", replace: true });
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <LogoMark size={56} />
        <div className="brand">Golden Fresh</div>
        <div className="eyebrow">Admin Portal</div>
        <hr />
        <form onSubmit={onSubmit}>
          <div className="admin-field">
            <label className="admin-label">Email</label>
            <input className="admin-input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Password</label>
            <div style={{ position: "relative" }}>
              <input className="admin-input" type={showPwd ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: "absolute", right: 8, top: 8, background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {err && <div className="admin-error">{err}</div>}
          <button className="admin-btn-red" type="submit" disabled={busy} style={{ width: "100%", justifyContent: "center", marginTop: 8, padding: "14px" }}>
            {busy ? "Signing In…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
