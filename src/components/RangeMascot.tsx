import type { ComponentType } from "react";
import { SupaDupa } from "./Characters";
import type { RangeCharacter } from "@/lib/rangeCharacter";

const RANGE_MASCOT_FALLBACK: Record<string, ComponentType<{ size?: number }>> = {
  glucose: SupaDupa,
  supadupa: SupaDupa,
  trio: SupaDupa,
};

type RangeMascotProps = {
  slug: string;
  mascot?: RangeCharacter | null;
  size?: number;
};

export function RangeMascot({ slug, mascot, size = 120 }: RangeMascotProps) {
  const Mascot = mascot?.Comp ?? RANGE_MASCOT_FALLBACK[slug];

  if (!mascot?.image_url && !Mascot) return null;

  return (
    <div className="range-mascot">
      <div className="range-mascot-stage">
        {mascot?.image_url ? (
          <img src={mascot.image_url} alt={mascot.name} className="range-mascot-img" />
        ) : Mascot ? (
          <Mascot size={size} />
        ) : null}
      </div>
    </div>
  );
}

export function ProductMascotFallback({
  mascot,
  color,
  name,
}: {
  mascot?: RangeCharacter | null;
  color: string;
  name: string;
}) {
  if (mascot?.Comp) {
    const Mascot = mascot.Comp;
    return <Mascot size={90} />;
  }

  if (mascot?.image_url) {
    return <img src={mascot.image_url} alt={mascot.name} className="range-mascot-img" style={{ maxHeight: 90 }} />;
  }

  return (
    <span className="prod-initial" style={{ color, borderColor: color }}>
      {name.charAt(0)}
    </span>
  );
}
