"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AdminAuthState = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AdminAuthState | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const checkAdmin = async (uid: string | null) => {
      if (!uid) { if (mounted) setIsAdmin(false); return; }
      const { data } = await supabase.from("admin_users").select("user_id").eq("user_id", uid).maybeSingle();
      if (mounted) setIsAdmin(!!data);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      // defer to avoid deadlock with supabase
      setTimeout(() => checkAdmin(sess?.user.id ?? null), 0);
    });

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      await checkAdmin(data.session?.user.id ?? null);
      setLoading(false);
    });

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ user: session?.user ?? null, session, isAdmin, loading, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAdminAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return v;
}

export async function logActivity(action: string, itemName: string | null, userEmail: string | null) {
  try {
    await supabase.from("content_log").insert({ action, item_name: itemName, user_email: userEmail });
  } catch (e) { console.error(e); }
}
