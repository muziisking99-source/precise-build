import type { CSSProperties } from "react";

/** Muted product tile background for editorial UI (pack hex stays in data). */
export function productTopStyle(packColor: string): CSSProperties {
  return {
    background: `linear-gradient(165deg, var(--stone-100) 0%, color-mix(in srgb, ${packColor} 10%, var(--stone-100)) 100%)`,
  };
}
