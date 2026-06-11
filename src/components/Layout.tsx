import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { supabase } from "@/integrations/supabase/client";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <Link to="/" className="nav-brand" style={{ textDecoration: "none" }}>
        <Logo height={40} />
      </Link>
      <div className={`nav-links ${open ? "open" : ""}`}>
        <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "active" }} onClick={() => setOpen(false)}>Home</Link>
        <Link to="/about" activeProps={{ className: "active" }} onClick={() => setOpen(false)}>About Us</Link>
        <Link to="/products" activeProps={{ className: "active" }} onClick={() => setOpen(false)}>Products</Link>
        <Link to="/contact" activeProps={{ className: "active" }} onClick={() => setOpen(false)}>Contact</Link>
      </div>
      <button type="button" className="nav-cta">Find a Store</button>
      <button type="button" className="nav-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden><path d="M4 8h20M4 14h20M4 20h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
    </nav>
  );
}

const PRODUCT_LINKS = [
  "Glucose Energy", "Just Ginger", "Luv-A-Lot", "Trio", "All-Star",
  "Joker", "Marie", "Supa Dupa", "Cream Biscuits",
];

export function Footer() {
  const [cfg, setCfg] = useState<Record<string, string>>({});
  useEffect(() => {
    supabase.from("site_settings").select("key, value").then(({ data }) => {
      if (!data) return;
      const next: Record<string, string> = {};
      (data as { key: string; value: string }[]).forEach((s) => { if (s.value) next[s.key] = s.value; });
      setCfg(next);
    });
  }, []);

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="footer-brand">
            <Logo height={64} />
          </div>
          <p className="footer-tag">{cfg.footer_tagline ?? "Delivering local lekkerness since 1998. Proudly South African."}</p>
          <div className="footer-social">
            <a href={cfg.facebook_url || "#"}>Facebook</a>
            <a href={cfg.instagram_url || "#"}>Instagram</a>
            <a href="#">YouTube</a>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-head">Products</div>
          {PRODUCT_LINKS.map((p) => (
            <Link key={p} to="/products">{p}</Link>
          ))}
        </div>
        <div className="footer-col">
          <div className="footer-col-head">Company</div>
          <Link to="/about">About Us</Link>
          <Link to="/about">Our Story</Link>
          <a href="#">Careers</a>
          <a href="#">News</a>
        </div>
        <div className="footer-col">
          <div className="footer-col-head">Contact</div>
          {cfg.contact_email && <p>{cfg.contact_email}</p>}
          {cfg.contact_phone && <p>{cfg.contact_phone}</p>}
          <p>{cfg.contact_address ?? "Lenasia, Johannesburg"}</p>
          <p>A Yunma Foods Brand</p>
        </div>
      </div>
      <div className="footer-bot">
        <span>© 2024 Golden Fresh Biscuits. All rights reserved.</span>
        <span>Privacy Policy · Terms of Use</span>
      </div>
    </footer>
  );
}

export function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-tag">
      <div className="tag-line" />
      <span className="tag-text">{children}</span>
    </div>
  );
}

export function RedBand({ title, body, cta }: { title: string; body: string; cta: string }) {
  return (
    <div className="red-band">
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <a className="btn btn-red" href="#">{cta} →</a>
    </div>
  );
}

export function GoldBand({ title, body, cta }: { title: string; body: string; cta: string }) {
  return (
    <div className="gold-band">
      <div className="gold-band-text">
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <Link to="/products/single" className="btn btn-red">{cta} →</Link>
    </div>
  );
}
