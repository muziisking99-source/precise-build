import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden>
      <rect width="44" height="44" rx="8" fill="#C41C1C" />
      <line x1="22" y1="8" x2="22" y2="32" stroke="#F5A800" strokeWidth="2" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <ellipse cx="16" cy={12 + i * 6} rx="4" ry="2.2" fill="#F5A800" transform={`rotate(-30 16 ${12 + i * 6})`} />
          <ellipse cx="28" cy={12 + i * 6} rx="4" ry="2.2" fill="#F5A800" transform={`rotate(30 28 ${12 + i * 6})`} />
        </g>
      ))}
      <text x="22" y="40" textAnchor="middle" fontFamily="Abril Fatface, serif" fontSize="9" fill="#F5A800">GF</text>
    </svg>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <Link to="/" className="nav-brand" style={{ textDecoration: "none" }}>
        <LogoMark />
        <div className="nav-brand-text">
          <span className="nav-brand-name">Golden Fresh</span>
          <span className="nav-brand-sub">Est. 1998 · South Africa</span>
        </div>
      </Link>
      <div className={`nav-links ${open ? "open" : ""}`}>
        <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "active" }} onClick={() => setOpen(false)}>Home</Link>
        <Link to="/about" activeProps={{ className: "active" }} onClick={() => setOpen(false)}>About Us</Link>
        <Link to="/products" activeProps={{ className: "active" }} onClick={() => setOpen(false)}>Products</Link>
        <Link to="/contact" activeProps={{ className: "active" }} onClick={() => setOpen(false)}>Contact</Link>
      </div>
      <button className="nav-cta">Find a Store</button>
      <button className="nav-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
        <svg width="28" height="28" viewBox="0 0 28 28"><path d="M4 8h20M4 14h20M4 20h20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
      </button>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <LogoMark size={40} />
            <span style={{ fontFamily: "Abril Fatface, serif", fontSize: 22, color: "var(--gold)" }}>Golden Fresh</span>
          </div>
          <p className="footer-tag">Delivering local lekkerness since 1998. Proudly South African.</p>
          <div className="footer-social">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-head">Products</div>
          {["Glucose Energy","Just Ginger","Luv-A-Lot","Trio","All-Star","Joker","Marie","Supa Dupa","Cream Biscuits"].map(p => <a href="/products" key={p}>{p}</a>)}
        </div>
        <div className="footer-col">
          <div className="footer-col-head">Company</div>
          <a href="/about">About Us</a>
          <a href="/about">Our Story</a>
          <a href="#">Careers</a>
          <a href="#">News</a>
        </div>
        <div className="footer-col">
          <div className="footer-col-head">Contact</div>
          <p>info@goldenfresh.co.za</p>
          <p>Lenasia, Johannesburg</p>
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
      <a className="btn btn-gold" href="#">{cta} →</a>
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
      <a className="btn btn-red" href="/products">{cta} →</a>
    </div>
  );
}
