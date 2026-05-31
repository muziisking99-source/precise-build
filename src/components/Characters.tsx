export function SupaDupa({ size = 110 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      {/* sunburst */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="60" y1="60" x2="60" y2="10" stroke="#FFF766" strokeWidth="3" transform={`rotate(${i * 30} 60 60)`} opacity="0.55" />
      ))}
      <circle cx="60" cy="60" r="36" fill="#FFF200" opacity="0.18" />
      {/* cape */}
      <path d="M40 50 L60 110 L80 50 Z" fill="#ED1C24" />
      {/* body */}
      <rect x="48" y="48" width="24" height="40" rx="4" fill="#1A4B8C" />
      {/* head */}
      <circle cx="60" cy="42" r="11" fill="#F2C99B" />
      <path d="M52 40 q8 -6 16 0" stroke="#1A1208" strokeWidth="1.5" fill="none" />
      <circle cx="56" cy="41" r="1.4" fill="#1A1208" />
      <circle cx="64" cy="41" r="1.4" fill="#1A1208" />
      <path d="M55 46 q5 4 10 0" stroke="#1A1208" strokeWidth="1.5" fill="none" />
      {/* fist raised */}
      <path d="M50 56 L40 36 L48 30 L58 50 Z" fill="#F2C99B" />
      <circle cx="40" cy="30" r="6" fill="#F2C99B" />
      {/* belt */}
      <rect x="48" y="72" width="24" height="5" fill="#FFF200" />
      {/* SD chest emblem */}
      <text x="60" y="68" textAnchor="middle" fontFamily="Abril Fatface, serif" fontSize="9" fill="#FFF200">SD</text>
    </svg>
  );
}

export function GingerMan({ size = 110 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="60" r="46" fill="#1A4B8C" opacity="0.12" />
      {/* head */}
      <circle cx="60" cy="34" r="14" fill="#A0623A" />
      {/* body */}
      <path d="M48 44 L72 44 L78 70 L70 90 L60 80 L50 90 L42 70 Z" fill="#A0623A" />
      {/* arms */}
      <path d="M48 50 L30 60 L34 70 L52 60 Z" fill="#A0623A" />
      <path d="M72 50 L92 42 L96 50 L76 60 Z" fill="#A0623A" />
      {/* icing */}
      <path d="M50 58 q10 -4 20 0 M48 66 q12 -4 24 0" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="55" cy="74" r="1.6" fill="white" />
      <circle cx="65" cy="74" r="1.6" fill="white" />
      {/* face */}
      <circle cx="55" cy="32" r="1.8" fill="#1A1208" />
      <circle cx="65" cy="32" r="1.8" fill="#1A1208" />
      <path d="M53 38 q7 5 14 0" stroke="#1A1208" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="36" r="2" fill="#F04449" opacity="0.5" />
      <circle cx="70" cy="36" r="2" fill="#F04449" opacity="0.5" />
      {/* bow tie */}
      <path d="M52 46 L60 50 L68 46 L66 52 L60 50 L54 52 Z" fill="#E8751A" />
    </svg>
  );
}

export function LuvALotGirl({ size = 110 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="60" r="46" fill="#D4237A" opacity="0.12" />
      {/* hair back */}
      <ellipse cx="60" cy="36" rx="18" ry="14" fill="#5C2F1B" />
      {/* head */}
      <circle cx="60" cy="40" r="13" fill="#F2C99B" />
      {/* pigtails */}
      <ellipse cx="42" cy="44" rx="6" ry="10" fill="#5C2F1B" />
      <ellipse cx="78" cy="44" rx="6" ry="10" fill="#5C2F1B" />
      <circle cx="42" cy="34" r="3" fill="#D4237A" />
      <circle cx="78" cy="34" r="3" fill="#D4237A" />
      {/* face */}
      <circle cx="55" cy="40" r="1.6" fill="#1A1208" />
      <circle cx="65" cy="40" r="1.6" fill="#1A1208" />
      <path d="M54 45 q6 4 12 0" stroke="#1A1208" strokeWidth="1.4" fill="none" />
      <circle cx="51" cy="44" r="1.8" fill="#F04449" opacity="0.6" />
      <circle cx="69" cy="44" r="1.8" fill="#F04449" opacity="0.6" />
      {/* dress */}
      <path d="M46 54 L74 54 L82 90 L38 90 Z" fill="#D4237A" />
      <rect x="56" y="54" width="8" height="6" fill="white" />
      {/* biscuit */}
      <circle cx="60" cy="74" r="10" fill="#E8D4A0" stroke="#C9BE00" strokeWidth="1.5" />
      <circle cx="56" cy="71" r="1" fill="#7A5C2A" />
      <circle cx="63" cy="74" r="1" fill="#7A5C2A" />
      <circle cx="59" cy="78" r="1" fill="#7A5C2A" />
      {/* hearts */}
      <path d="M30 30 q-3 -4 -6 0 q3 4 6 8 q3 -4 6 -8 q-3 -4 -6 0" fill="#ED1C24" />
      <path d="M94 50 q-2 -3 -4 0 q2 3 4 6 q2 -3 4 -6 q-2 -3 -4 0" fill="#ED1C24" />
    </svg>
  );
}

export function AllStarFootballer({ size = 110 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="60" r="46" fill="#ED1C24" opacity="0.12" />
      {/* stars */}
      <polygon points="20,30 22,36 28,36 23,40 25,46 20,42 15,46 17,40 12,36 18,36" fill="#FFF200" />
      <polygon points="100,30 102,36 108,36 103,40 105,46 100,42 95,46 97,40 92,36 98,36" fill="#FFF200" />
      {/* head */}
      <circle cx="55" cy="32" r="10" fill="#F2C99B" />
      <path d="M48 28 q7 -6 14 0 L62 24 L48 24 Z" fill="#1A1208" />
      <circle cx="52" cy="32" r="1.4" fill="#1A1208" />
      <circle cx="58" cy="32" r="1.4" fill="#1A1208" />
      {/* body kit */}
      <path d="M44 42 L66 42 L70 70 L40 70 Z" fill="#ED1C24" />
      <rect x="50" y="42" width="4" height="28" fill="white" />
      <rect x="58" y="42" width="4" height="28" fill="white" />
      {/* arms */}
      <path d="M44 46 L30 58 L34 64 L48 54 Z" fill="#ED1C24" />
      <path d="M66 46 L82 40 L84 48 L70 56 Z" fill="#F2C99B" />
      {/* legs */}
      <path d="M44 70 L42 92 L52 92 L54 72 Z" fill="#F2C99B" />
      <path d="M58 70 L72 88 L80 82 L66 68 Z" fill="#F2C99B" />
      {/* sock + boot */}
      <rect x="68" y="84" width="14" height="5" fill="white" stroke="#1A1208" strokeWidth="0.8" />
      <ellipse cx="82" cy="92" rx="8" ry="4" fill="#1A1208" />
      <ellipse cx="46" cy="94" rx="7" ry="4" fill="#1A1208" />
      {/* ball */}
      <circle cx="92" cy="92" r="8" fill="white" stroke="#1A1208" strokeWidth="1.2" />
      <polygon points="92,86 95,90 93,94 89,94 87,90" fill="#1A1208" />
      {/* motion */}
      <path d="M15 70 h10 M12 78 h14" stroke="#FFF200" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function JokerHat({ size = 110 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <circle cx="60" cy="60" r="46" fill="#FFF200" opacity="0.14" />
      {/* hat band */}
      <rect x="28" y="68" width="64" height="8" rx="2" fill="#0A0A0A" />
      {/* three points */}
      <path d="M30 68 L40 28 L52 68 Z" fill="#ED1C24" />
      <path d="M52 68 L60 20 L68 68 Z" fill="#1A4B8C" />
      <path d="M68 68 L80 30 L90 68 Z" fill="#00A651" />
      {/* bells */}
      <circle cx="40" cy="26" r="4" fill="#FFF200" stroke="#C9BE00" strokeWidth="1" />
      <circle cx="60" cy="18" r="4" fill="#FFF200" stroke="#C9BE00" strokeWidth="1" />
      <circle cx="80" cy="28" r="4" fill="#FFF200" stroke="#C9BE00" strokeWidth="1" />
      {/* sparkles */}
      <g fill="#FFF766">
        <polygon points="20,52 22,56 26,56 23,58 24,62 20,60 16,62 17,58 14,56 18,56" />
        <polygon points="100,54 102,58 106,58 103,60 104,64 100,62 96,64 97,60 94,58 98,58" />
      </g>
      {/* JOKER text */}
      <text x="60" y="92" textAnchor="middle" fontFamily="Abril Fatface, serif" fontSize="14" fill="#0A0A0A">JOKER</text>
    </svg>
  );
}

export const CHARACTERS = [
  { Comp: SupaDupa, name: "Supa Dupa", range: "Supa Dupa", desc: "Caped crusader of energy. Powers up every lunchbox.", tag: "Hero Energy" },
  { Comp: GingerMan, name: "Just Ginger Man", range: "Just Ginger", desc: "Warm, spicy and full of character — the original gingerbread mate.", tag: "Spice Classic" },
  { Comp: LuvALotGirl, name: "Luv-A-Lot Girl", range: "Luv-A-Lot", desc: "School-bag bestie. Sweet, smart and packed with energy.", tag: "Kids' Favourite" },
  { Comp: AllStarFootballer, name: "All-Star Footballer", range: "All-Star", desc: "Goals on goals on goals. The MVP of the snack drawer.", tag: "Game Day" },
  { Comp: JokerHat, name: "Joker", range: "Joker", desc: "Three colours, one cheeky grin. Always up for a flavour party.", tag: "Playful" },
];
