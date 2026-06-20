"use client";

import { CHARACTERS, SupaDupa } from "./Characters";
import { prefersReducedMotion } from "./motion/transitions";
import type { CharacterRow } from "@/lib/queries/fetchers";

type CharacterMarqueeProps = {
  characters: CharacterRow[];
};

function CharacterCard({ character }: { character: CharacterRow }) {
  const fallback = CHARACTERS.find(
    (x) => x.name === character.name || x.range === character.range,
  );
  const Comp = fallback?.Comp ?? SupaDupa;

  return (
    <article className="char-card">
      <div className="char-card-visual">
        {character.image_url ? (
          <img src={character.image_url} alt={character.name} className="char-card-img" />
        ) : (
          <Comp size={90} />
        )}
      </div>
      <div className="char-name">{character.name}</div>
      <div className="char-range">{character.range}</div>
      <p className="char-desc">{character.description}</p>
      <div className="char-pill">{character.pill_text}</div>
    </article>
  );
}

export function CharacterMarquee({ characters }: CharacterMarqueeProps) {
  if (!characters.length) return null;

  const reduced = prefersReducedMotion();
  const items = reduced ? characters : [...characters, ...characters];

  return (
    <div
      className={`char-marquee${reduced ? " char-marquee--static" : ""}`}
      aria-label="Meet the Biscuit Gang"
    >
      <div className="char-marquee-track">
        {items.map((character, index) => (
          <CharacterCard key={`${character.id}-${index}`} character={character} />
        ))}
      </div>
    </div>
  );
}
