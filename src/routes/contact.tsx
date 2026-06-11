import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, MapPin, Factory, Clock, Phone } from "lucide-react";
import { RedBand } from "../components/Layout";
import { PageHero } from "../components/PageHero";
import { Section, SectionHead } from "../components/Section";
import { Reveal } from "../components/Effects";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Golden Fresh Biscuits" },
      { name: "description", content: "Get in touch with Golden Fresh Biscuits — stockists, distributors, media or fans. Lenasia, Johannesburg." },
    ],
  }),
  component: Contact,
});

const DEFAULTS: Record<string, string> = {
  contact_email: "info@goldenfresh.co.za",
  contact_phone: "",
  contact_address: "Lenasia, Johannesburg, South Africa",
  contact_hours: "Monday – Friday, 8am – 5pm",
  facebook_url: "#",
  instagram_url: "#",
};

function Contact() {
  const [sent, setSent] = useState(false);
  const [cfg, setCfg] = useState<Record<string, string>>(DEFAULTS);

  useEffect(() => {
    supabase.from("site_settings").select("key, value").then(({ data }) => {
      if (!data) return;
      const next = { ...DEFAULTS };
      (data as { key: string; value: string }[]).forEach((s) => { if (s.value) next[s.key] = s.value; });
      setCfg(next);
    });
  }, []);

  const rows = [
    cfg.contact_email && { icon: Mail, text: cfg.contact_email },
    cfg.contact_phone && { icon: Phone, text: cfg.contact_phone },
    cfg.contact_address && { icon: MapPin, text: cfg.contact_address },
    cfg.contact_hours && { icon: Clock, text: cfg.contact_hours },
    { icon: Factory, text: "A Yunma Foods Brand" },
  ].filter(Boolean) as { icon: typeof Mail; text: string }[];

  return (
    <>
      <PageHero
        eyebrow="Reach Us"
        title={<>Get In <span className="accent">Touch</span></>}
        description="We'd love to hear from you — whether you're a stockist, distributor, or just a fan."
      />

      <Section variant="cream">
        <div className="contact-grid">
          <Reveal>
            <SectionHead
              eyebrow="Reach Us"
              title={<>Let&apos;s <span className="accent">Talk</span></>}
            />
            <div style={{ marginTop: 28 }}>
              {rows.map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.text} className="contact-info-item">
                    <span className="contact-info-icon"><Icon strokeWidth={1.75} /></span>
                    <span>{row.text}</span>
                  </div>
                );
              })}
            </div>
            <div className="contact-social">
              <a href={cfg.facebook_url || "#"}>Facebook</a>
              <a href={cfg.instagram_url || "#"}>Instagram</a>
              <a href="#">YouTube</a>
            </div>
          </Reveal>


          <Reveal>
            <form className="contact-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">Full Name</label>
                  <input id="name" required type="text" />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" required type="email" />
                  <span className="form-helper">We respond within two business days.</span>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" type="tel" />
              </div>
              <div className="form-field">
                <label htmlFor="subject">Subject</label>
                <select id="subject">
                  <option>General Enquiry</option>
                  <option>Become a Stockist</option>
                  <option>Distribution Partnership</option>
                  <option>Media Enquiry</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="message">Message</label>
                <textarea id="message" required />
              </div>
              <button type="submit" className="btn btn-red" style={{ width: "100%", justifyContent: "center" }}>
                {sent ? "Thanks — we'll be in touch" : "Send Message →"}
              </button>
            </form>
          </Reveal>
        </div>
      </Section>

      <Section variant="warm">
        <div className="map-grid">
          <Reveal>
            <div className="map-box">
              <svg width="64" height="80" viewBox="0 0 80 100" aria-hidden>
                <path d="M40 5 C20 5 8 20 8 38 C8 60 40 95 40 95 C40 95 72 60 72 38 C72 20 60 5 40 5 Z" fill="var(--gold)" stroke="var(--green)" strokeWidth="1.5" />
                <circle cx="40" cy="38" r="10" fill="var(--mid)" />
              </svg>
              <p className="map-box-title">Map coming soon</p>
              <p className="map-box-desc">Interactive directions to our Lenasia bakery will appear here.</p>
            </div>
          </Reveal>
          <Reveal>
            <SectionHead
              eyebrow="Find Us"
              title={<>The <span className="accent">Lenasia</span> Bakery</>}
              subtitle="Find us in Lenasia, at the heart of Johannesburg's south. Our bakery has been here since 1998 — and we're not going anywhere."
            />
            <p style={{ color: "var(--ink)", fontWeight: 600, marginTop: 16 }}>Lenasia, Johannesburg · South Africa</p>
          </Reveal>
        </div>
      </Section>

      <RedBand title="Want to stock Golden Fresh?" body="We partner with spaza shops, supermarkets, and wholesalers nationwide." cta="Become a Stockist" />
    </>
  );
}
