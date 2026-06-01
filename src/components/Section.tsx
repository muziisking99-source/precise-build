import type { ReactNode } from "react";
import { SectionTag } from "./Layout";

type SectionVariant = "cream" | "warm" | "white" | "ink";

type SectionProps = {
  variant?: SectionVariant;
  children: ReactNode;
  className?: string;
};

export function Section({ variant = "cream", children, className = "" }: SectionProps) {
  return (
    <section className={`section section-${variant} ${className}`.trim()}>
      <div className="container">{children}</div>
    </section>
  );
};

type SectionHeadProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionHead({ eyebrow, title, subtitle, align = "left" }: SectionHeadProps) {
  return (
    <div className={`section-head section-head--${align}`}>
      <SectionTag>{eyebrow}</SectionTag>
      <h2>{title}</h2>
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </div>
  );
}
