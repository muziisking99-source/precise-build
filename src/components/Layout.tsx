"use client";

import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Logo } from "./Logo";
import { SiteSectionLoading } from "./SiteSectionLoading";
import { resolveFooterTagline, resolveContactInfo, YUNMA_BRAND_LABEL } from "@/lib/siteCopy";
import {
  categoryHeroesQueryOptions,
  productCategoriesQueryOptions,
  siteSettingsQueryOptions,
  singleRangesQueryOptions,
} from "@/lib/queries/options";

export function Nav() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const prefetchProducts = () => {
    void queryClient.prefetchQuery(productCategoriesQueryOptions());
    void queryClient.prefetchQuery(categoryHeroesQueryOptions());
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <Link to="/" className="nav-brand nav-logo" style={{ textDecoration: "none" }}>
        <Logo height={44} />
      </Link>
      <div className={`nav-links ${open ? "open" : ""}`}>
        <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "active" }} onClick={() => setOpen(false)}>Home</Link>
        <Link to="/about" activeProps={{ className: "active" }} onClick={() => setOpen(false)}>About Us</Link>
        <Link
          to="/products"
          activeProps={{ className: "active" }}
          onClick={() => setOpen(false)}
          onMouseEnter={prefetchProducts}
          onFocus={prefetchProducts}
        >
          Products
        </Link>
        <Link to="/contact" activeProps={{ className: "active" }} onClick={() => setOpen(false)}>Contact</Link>
      </div>
      <button type="button" className="nav-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden><path d="M4 8h20M4 14h20M4 20h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
    </nav>
  );
}

export function Footer() {
  const { data: cfg = {} } = useQuery(siteSettingsQueryOptions());
  const { data: ranges = [], isPending: rangesLoading } = useQuery(singleRangesQueryOptions());

  const footerTagline = resolveFooterTagline(cfg.footer_tagline);
  const contact = resolveContactInfo(cfg);

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="footer-brand footer-logo">
            <Logo height={36} />
          </div>
          <p className="footer-tag">{footerTagline}</p>
          <div className="footer-social">
            <a href={contact.facebook_url} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href={contact.instagram_url} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href={contact.tiktok_url} aria-label="TikTok" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-head">Products</div>
          {rangesLoading ? (
            <SiteSectionLoading variant="footer-links" />
          ) : (
            ranges.map((r) => (
              <Link key={r.slug} to="/products/single" search={{ range: r.slug }}>
                {r.name}
              </Link>
            ))
          )}
        </div>
        <div className="footer-col">
          <div className="footer-col-head">Company</div>
          <Link to="/about">About Us</Link>
        </div>
        <div className="footer-col">
          <div className="footer-col-head">Contact</div>
          <p>{contact.contact_email}</p>
          {contact.contact_phone && <p>{contact.contact_phone}</p>}
          <p>{contact.contact_address}</p>
          {contact.contact_hours && <p>{contact.contact_hours}</p>}
          <p>{YUNMA_BRAND_LABEL}</p>
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
