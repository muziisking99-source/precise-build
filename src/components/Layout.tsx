import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "./Logo";

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <Link to="/" className="nav-brand" style={{ textDecoration: "none" }}>
        <Logo height={44} />
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
          <div className="footer-brand">
            <Logo height={72} />
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
      <a className="btn btn-green" href="#">{cta} →</a>
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
      <a className="btn btn-red" href="/products/single">{cta} →</a>
    </div>
  );
}
