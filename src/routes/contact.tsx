import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionTag, RedBand } from "../components/Layout";
import { Reveal } from "../components/Effects";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Golden Fresh Biscuits" },
      { name: "description", content: "Get in touch with Golden Fresh Biscuits — stockists, distributors, media or fans. Lenasia, Johannesburg." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="contact-hero">
        <SectionTag>Reach Us</SectionTag>
        <h1>Get In <span className="accent">Touch</span></h1>
        <p>We'd love to hear from you — whether you're a stockist, distributor, or just a fan.</p>
      </section>

      <section className="section section-cream">
        <div className="contact-grid">
          <Reveal>
            <SectionTag>Reach Us</SectionTag>
            <h2 style={{ fontSize: "clamp(36px, 4vw, 48px)" }}>Let's <span style={{ color: "var(--red)" }}>Talk</span></h2>
            <div style={{ marginTop: 28 }}>
              <div className="contact-info-item"><span className="contact-info-icon">📧</span><span>info@goldenfresh.co.za</span></div>
              <div className="contact-info-item"><span className="contact-info-icon">📍</span><span>Lenasia, Johannesburg, South Africa</span></div>
              <div className="contact-info-item"><span className="contact-info-icon">🏭</span><span>A Yunma Foods Brand</span></div>
              <div className="contact-info-item"><span className="contact-info-icon">🕐</span><span>Monday – Friday, 8am – 5pm</span></div>
            </div>
            <div className="contact-social">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">YouTube</a>
            </div>
          </Reveal>

          <Reveal>
            <form className="contact-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="form-row">
                <div className="form-field"><label>Full Name</label><input required type="text" /></div>
                <div className="form-field"><label>Email Address</label><input required type="email" /></div>
              </div>
              <div className="form-field"><label>Phone Number</label><input type="tel" /></div>
              <div className="form-field">
                <label>Subject</label>
                <select>
                  <option>General Enquiry</option>
                  <option>Become a Stockist</option>
                  <option>Distribution Partnership</option>
                  <option>Media Enquiry</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-field"><label>Message</label><textarea required /></div>
              <button type="submit" className="btn btn-red" style={{ width: "100%", justifyContent: "center" }}>
                {sent ? "Thanks — We'll Be In Touch ✓" : "Send Message →"}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="section section-warm">
        <div className="map-grid">
          <Reveal>
            <div className="map-box">
              <svg width="80" height="100" viewBox="0 0 80 100" aria-hidden>
                <path d="M40 5 C20 5 8 20 8 38 C8 60 40 95 40 95 C40 95 72 60 72 38 C72 20 60 5 40 5 Z" fill="#FFF200" stroke="#00A651" strokeWidth="2" />
                <circle cx="40" cy="38" r="12" fill="#7A5C2A" />
              </svg>
            </div>
          </Reveal>
          <Reveal>
            <SectionTag>Find Us</SectionTag>
            <h2 style={{ fontSize: "clamp(32px, 3.6vw, 44px)" }}>The <span style={{ color: "var(--red)" }}>Lenasia</span> Bakery</h2>
            <p style={{ color: "var(--mid)", lineHeight: 1.7, marginTop: 16, fontSize: 16 }}>
              Find us in Lenasia, at the heart of Johannesburg's south. Our bakery has been here since 1998 — and we're not going anywhere.
            </p>
            <p style={{ color: "var(--ink)", fontWeight: 700, marginTop: 16 }}>Lenasia, Johannesburg · South Africa</p>
          </Reveal>
        </div>
      </section>

      <RedBand title="Want to stock Golden Fresh?" body="We partner with spaza shops, supermarkets, and wholesalers nationwide." cta="Become a Stockist" />
    </>
  );
}
