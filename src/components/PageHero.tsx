import type { ReactNode } from "react";
import { SectionTag } from "./Layout";
import { PageHeroMotion } from "./motion/PageHeroMotion";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  visual?: ReactNode;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, visual, children }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-inner container">
        <PageHeroMotion className="page-hero-copy">
          {children}
          <SectionTag>{eyebrow}</SectionTag>
          <h1 className="page-hero-title">{title}</h1>
          {description && <p className="page-hero-desc">{description}</p>}
        </PageHeroMotion>
        {visual && <div className="page-hero-visual">{visual}</div>}
      </div>
    </section>
  );
}
