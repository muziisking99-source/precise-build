import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Mail, MapPin, Factory, Clock, Phone } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Section, SectionHead } from "../components/Section";
import { Reveal } from "../components/Effects";
import { SiteSectionLoading } from "../components/SiteSectionLoading";
import {
  buildContactMailto,
  resolveContactInfo,
  resolveMapLinks,
  YUNMA_BRAND_LABEL,
} from "@/lib/siteCopy";
import { siteSettingsQueryOptions } from "@/lib/queries/options";

export const Route = createFileRoute("/contact")({
  loader: ({ context: { queryClient } }) => queryClient.fetchQuery(siteSettingsQueryOptions()),
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
  const { data: settings, isPending } = useQuery(siteSettingsQueryOptions());
  const cfg = resolveContactInfo(settings);
  const maps = resolveMapLinks(settings);

  const rows = [
    cfg.contact_email && { icon: Mail, text: cfg.contact_email, href: `mailto:${cfg.contact_email}` },
    cfg.contact_phone && { icon: Phone, text: cfg.contact_phone, href: `tel:${cfg.contact_phone.replace(/\s/g, "")}` },
    cfg.contact_address && { icon: MapPin, text: cfg.contact_address, href: maps.googleUrl },
    cfg.contact_hours && { icon: Clock, text: cfg.contact_hours },
    { icon: Factory, text: YUNMA_BRAND_LABEL },
  ].filter(Boolean) as { icon: typeof Mail; text: string; href?: string }[];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const mailto = buildContactMailto(cfg.contact_email, {
      name: String(data.get("name") ?? ""),
      fromEmail: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      subject: String(data.get("subject") ?? "General Enquiry"),
      message: String(data.get("message") ?? ""),
    });

    window.location.href = mailto;
    setSent(true);
  };

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
              {isPending ? (
                <SiteSectionLoading variant="contact" />
              ) : (
                rows.map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.text} className="contact-info-item">
                      <span className="contact-info-icon"><Icon strokeWidth={1.75} /></span>
                      {row.href ? (
                        <a href={row.href} className="contact-info-link" target={row.href.startsWith("http") ? "_blank" : undefined} rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                          {row.text}
                        </a>
                      ) : (
                        <span>{row.text}</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            {!isPending && (
              <div className="contact-social">
                <a href={cfg.facebook_url || "#"}>Facebook</a>
                <a href={cfg.instagram_url || "#"}>Instagram</a>
                <a href={cfg.tiktok_url || "#"}>TikTok</a>
              </div>
            )}
          </Reveal>

          <Reveal>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">Full Name</label>
                  <input id="name" name="name" required type="text" />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" name="email" required type="email" />
                  <span className="form-helper">We respond within two business days.</span>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" name="phone" type="tel" />
              </div>
              <div className="form-field">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" defaultValue="General Enquiry">
                  <option>General Enquiry</option>
                  <option>Become a Stockist</option>
                  <option>Distribution Partnership</option>
                  <option>Media Enquiry</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required />
              </div>
              <button type="submit" className="btn btn-red" style={{ width: "100%", justifyContent: "center" }}>
                {sent ? "Opening your email app…" : "Send Message →"}
              </button>
            </form>
          </Reveal>
        </div>
      </Section>

      <Section variant="warm">
        <div className="map-grid">
          <Reveal>
            <div className="map-box">
              <iframe
                title="Golden Fresh Biscuits on Google Maps"
                src={maps.embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="map-box-links">
                <a href={maps.googleUrl} className="map-box-link" target="_blank" rel="noopener noreferrer">
                  Open in Google Maps
                </a>
                <a href={maps.appleUrl} className="map-box-link" target="_blank" rel="noopener noreferrer">
                  Open in Apple Maps
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <SectionHead
              eyebrow="Find Us"
              title={<>Golden Fresh <span className="accent">Biscuits</span></>}
              subtitle="Find Golden Fresh Biscuits in Lenasia, at the heart of Johannesburg's south. We've been baking here since 1998 — and we're not going anywhere."
            />
            <p style={{ color: "var(--ink)", fontWeight: 600, marginTop: 16 }}>{cfg.contact_address}</p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
