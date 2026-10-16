"use strict";

/* ============================================================
   Font Feelings – teaching module (9 short lessons)
   Lessons 1–5 follow the workshop slides "Choosing Typefaces".
   Lessons 6–8 (weight & width, spacing, orientation) are added
   for comic titles and are NOT in the slides.
   Needs: content.js (FONT_LIST, TRAITS, STYLES, AXES, fontStack, FLEX)
   ============================================================ */

const bi = (L, en, id) => (L === "id" ? id : en);
const fontByName = (n) => (n === FLEX.n ? FLEX : FONT_LIST.find((f) => f.n === n) || FLEX);
const stackOf = (n) => fontStack(fontByName(n));
let demoTitle = "Moon Harbor";

const matchmakerState = {
  picked: new Set(),
  topFont: null,
  genre: "action",
};

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getRankedFonts(picked) {
  return FONT_LIST.map((f) => {
    const traits = Object.values(f.t).filter((p) => picked.has("p:" + p));
    const styles = f.s.filter((s) => picked.has("s:" + s));
    return { f, traits, styles, score: traits.length + styles.length * 1.5 };
  }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score || a.f.n.localeCompare(b.f.n));
}

function detectGenre(picked, topFont) {
  if (picked.has("s:futuristic") || picked.has("s:scientific")) return "scifi";
  if (picked.has("s:medieval")) return "medieval";
  if (picked.has("s:childish") || picked.has("s:funny")) return "childish";
  if (picked.has("s:rustic")) return "rustic";
  if (picked.has("s:natural") || picked.has("s:fresh")) return "natural";
  if (picked.has("s:artdeco") || picked.has("s:smart")) return "artdeco";
  if (picked.has("s:brutalist")) return "action";

  if (picked.has("p:cold") && (picked.has("p:hard") || picked.has("p:fast"))) return "scifi";
  if (picked.has("p:threatening") || (picked.has("p:old") && picked.has("p:hard"))) return "medieval";
  if (picked.has("p:friendly") && (picked.has("p:soft") || picked.has("p:young"))) return "childish";
  if (picked.has("p:delicate") || picked.has("p:feminine")) return "artdeco";
  if (picked.has("p:strong") || picked.has("p:fast") || picked.has("p:masculine")) return "action";

  if (topFont) {
    const s = topFont.s || [];
    const main = topFont.main;
    if (main === "futuristic" || main === "scientific" || s.includes("futuristic") || s.includes("scientific")) return "scifi";
    if (main === "medieval" || s.includes("medieval")) return "medieval";
    if (main === "childish" || main === "funny" || s.includes("childish") || s.includes("funny")) return "childish";
    if (main === "rustic" || s.includes("rustic")) return "rustic";
    if (main === "natural" || main === "fresh" || s.includes("natural") || s.includes("fresh")) return "natural";
    if (main === "artdeco" || main === "smart" || s.includes("artdeco") || s.includes("smart")) return "artdeco";
    if (main === "brutalist" || s.includes("brutalist")) return "action";
  }
  return "action";
}

const GENRES = {
  action: {
    en: "Superhero / Action Noir",
    id: "Pahlawan Super / Aksi Noir",
    heroDesc: { en: "the cloaked vigilante", id: "tokoh pahlawan bertopeng" },
    tagline: { en: "THE CITY NEVER SLEEPS", id: "KOTA TAK PERNAH TIDUR" },
    byline: "STORY: R. CHEN · ART: M. SOTO",
    issue: { tag: "OCT", price: "$3.99" },
    defaultFont: "Anton",
    presetTraits: ["strong", "hard"],
    presetStyles: ["brutalist"],
    renderSvg: (L, cleanTitle, font, fontSize, letterSpacing, byline) => `
      <defs>
        <linearGradient id="actionSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0b1329"/>
          <stop offset="50%" stop-color="#16203a"/>
          <stop offset="100%" stop-color="#24314e"/>
        </linearGradient>
        <filter id="actionTitleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.8"/>
        </filter>
      </defs>
      <rect width="240" height="330" rx="8" fill="url(#actionSky)"/>
      <circle cx="180" cy="75" r="26" fill="#fde68a" opacity="0.9"/>
      <polygon points="30,330 90,50 115,50 45,330" fill="#ffffff" opacity="0.06"/>
      <rect x="12" y="150" width="36" height="180" fill="#070c18"/>
      <rect x="52" y="180" width="38" height="150" fill="#050810"/>
      <rect x="150" y="130" width="42" height="200" fill="#070c18"/>
      <rect x="195" y="165" width="35" height="165" fill="#050810"/>
      <circle cx="22" cy="170" r="1.5" fill="#fef08a" opacity="0.7"/>
      <circle cx="32" cy="190" r="1.5" fill="#fef08a" opacity="0.7"/>
      <circle cx="162" cy="150" r="1.5" fill="#fef08a" opacity="0.7"/>
      <circle cx="172" cy="170" r="1.5" fill="#fef08a" opacity="0.7"/>
      <text x="120" y="78" fill="#f59e0b" font-family="${fontStack(font)}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="${letterSpacing}" filter="url(#actionTitleShadow)">${escapeXml(cleanTitle)}</text>
      <path d="M 65,330 L 95,245 L 145,245 L 175,330 Z" fill="#030712"/>
      <path d="M 120,195 C 90,205 65,235 45,280 C 70,265 100,255 115,248 Z" fill="#0c1322"/>
      <path d="M 120,195 C 150,205 180,235 205,280 C 175,265 145,255 125,248 Z" fill="#0c1322"/>
      <path d="M 105,198 C 105,168 112,150 120,144 C 128,150 135,168 135,198 Z" fill="#1e293b"/>
      <polygon points="112,152 116,132 120,145 124,132 128,152" fill="#0c1322"/>
      <ellipse cx="120" cy="148" rx="9" ry="11" fill="#0c1322"/>
      <ellipse cx="117" cy="146" rx="2" ry="1" fill="#38bdf8"/>
      <ellipse cx="123" cy="146" rx="2" ry="1" fill="#38bdf8"/>
      <text x="120" y="104" fill="#cbd5e1" font-family="'Figtree',sans-serif" font-size="7.5" font-weight="600" text-anchor="middle" letter-spacing="1.8">${escapeXml(bi(L, "THE CITY NEVER SLEEPS", "KOTA TAK PERNAH TIDUR"))}</text>
      <g transform="translate(10, 10)">
        <rect width="32" height="36" rx="3" fill="#090d16" stroke="#f59e0b" stroke-width="1.2"/>
        <text x="16" y="13" fill="#f59e0b" font-family="'Figtree',sans-serif" font-size="10" font-weight="800" text-anchor="middle">#1</text>
        <line x1="4" y1="16.5" x2="28" y2="16.5" stroke="#f59e0b" stroke-width="0.8"/>
        <text x="16" y="25" fill="#f8fafc" font-family="'Figtree',sans-serif" font-size="6.5" font-weight="700" text-anchor="middle">OCT</text>
        <text x="16" y="32.5" fill="#94a3b8" font-family="'Figtree',sans-serif" font-size="5.5" text-anchor="middle">$3.99</text>
      </g>
      <rect x="0" y="308" width="240" height="22" fill="#030712" opacity="0.9"/>
      <text x="120" y="322" fill="#94a3b8" font-family="'Figtree',sans-serif" font-size="7" font-weight="600" text-anchor="middle" letter-spacing="1">STORY: R. CHEN · ART: M. SOTO</text>
    `
  },
  scifi: {
    en: "Sci-Fi / Space Odyssey",
    id: "Fiksi Ilmiah / Luar Angkasa",
    heroDesc: { en: "the cyber astronaut", id: "penjelajah siber luar angkasa" },
    tagline: { en: "BEYOND THE KNOWN STARS", id: "MENEMBUS BATAS BINTANG" },
    byline: "STORY: A. VANCE · ART: K. TURING",
    issue: { tag: "VOL 1", price: "$4.99" },
    defaultFont: "Orbitron",
    presetTraits: ["cold", "hard"],
    presetStyles: ["futuristic"],
    renderSvg: (L, cleanTitle, font, fontSize, letterSpacing, byline) => `
      <defs>
        <linearGradient id="scifiSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#030712"/>
          <stop offset="40%" stop-color="#0f172a"/>
          <stop offset="75%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#312e81"/>
        </linearGradient>
        <filter id="scifiTitleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#06b6d4" flood-opacity="0.6"/>
        </filter>
      </defs>
      <rect width="240" height="330" rx="8" fill="url(#scifiSky)"/>
      <g fill="#ffffff" opacity="0.85">
        <circle cx="25" cy="35" r="1"/>
        <circle cx="70" cy="20" r="1.2"/>
        <circle cx="110" cy="40" r="0.8"/>
        <circle cx="150" cy="25" r="1"/>
        <circle cx="215" cy="45" r="1.3"/>
        <circle cx="45" cy="95" r="0.8"/>
        <circle cx="225" cy="115" r="1"/>
        <circle cx="85" cy="130" r="0.9"/>
      </g>
      <circle cx="185" cy="72" r="25" fill="#0284c7" opacity="0.85"/>
      <ellipse cx="185" cy="72" rx="44" ry="9" fill="none" stroke="#67e8f9" stroke-width="2.5" opacity="0.8" transform="rotate(-25 185 72)"/>
      <path d="M 0,265 L 240,265 M 0,285 L 240,285 M 0,305 L 240,305 M 120,245 L 15,330 M 120,245 L 75,330 M 120,245 L 165,330 M 120,245 L 225,330" stroke="#06b6d4" stroke-width="0.8" opacity="0.3"/>
      <polygon points="15,330 25,160 38,160 48,330" fill="#090e1a"/>
      <polygon points="195,330 205,145 218,145 228,330" fill="#090e1a"/>
      <circle cx="31" cy="165" r="1.5" fill="#06b6d4"/>
      <circle cx="211" cy="150" r="1.5" fill="#06b6d4"/>
      <text x="120" y="78" fill="#38bdf8" font-family="${fontStack(font)}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="${letterSpacing}" filter="url(#scifiTitleShadow)">${escapeXml(cleanTitle)}</text>
      <path d="M 55,330 L 85,240 L 155,240 L 185,330 Z" fill="#050a14"/>
      <path d="M 85,240 L 120,210 L 155,240 L 140,285 L 100,285 Z" fill="#0f172a"/>
      <circle cx="120" cy="165" r="22" fill="#050a14"/>
      <rect x="104" y="152" width="32" height="18" rx="7" fill="#06b6d4"/>
      <rect x="108" y="155" width="16" height="4" rx="2" fill="#ffffff" opacity="0.8"/>
      <line x1="94" y1="170" x2="94" y2="135" stroke="#38bdf8" stroke-width="1.5"/>
      <circle cx="94" cy="133" r="2.5" fill="#06b6d4"/>
      <text x="120" y="104" fill="#a5f3fc" font-family="'Figtree',sans-serif" font-size="7.5" font-weight="600" text-anchor="middle" letter-spacing="1.8">${escapeXml(bi(L, "BEYOND THE KNOWN STARS", "MENEMBUS BATAS BINTANG"))}</text>
      <g transform="translate(10, 10)">
        <rect width="32" height="36" rx="3" fill="#040812" stroke="#06b6d4" stroke-width="1.2"/>
        <text x="16" y="13" fill="#38bdf8" font-family="'Figtree',sans-serif" font-size="10" font-weight="800" text-anchor="middle">#1</text>
        <line x1="4" y1="16.5" x2="28" y2="16.5" stroke="#06b6d4" stroke-width="0.8"/>
        <text x="16" y="25" fill="#e0f2fe" font-family="'Figtree',sans-serif" font-size="6.5" font-weight="700" text-anchor="middle">VOL 1</text>
        <text x="16" y="32.5" fill="#38bdf8" font-family="'Figtree',sans-serif" font-size="5.5" text-anchor="middle">$4.99</text>
      </g>
      <rect x="0" y="308" width="240" height="22" fill="#040812" opacity="0.95"/>
      <text x="120" y="322" fill="#7dd3fc" font-family="'Figtree',sans-serif" font-size="7" font-weight="600" text-anchor="middle" letter-spacing="1">STORY: A. VANCE · ART: K. TURING</text>
    `
  },
  medieval: {
    en: "Dark Fantasy / Gothic",
    id: "Fantasi Gelap / Gotik",
    heroDesc: { en: "the hooded dark knight", id: "ksatria kegelapan bertudung" },
    tagline: { en: "THE ANCIENT CURSE AWAKENS", id: "KUTUKAN KUNO KEMBALI BANGKIT" },
    byline: "STORY: G. M. ROWEN · ART: L. D’ANGELO",
    issue: { tag: "TOME I", price: "$3.99" },
    defaultFont: "Pirata One",
    presetTraits: ["old", "threatening"],
    presetStyles: ["medieval"],
    renderSvg: (L, cleanTitle, font, fontSize, letterSpacing, byline) => `
      <defs>
        <linearGradient id="medievalSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#180509"/>
          <stop offset="45%" stop-color="#2c0b16"/>
          <stop offset="100%" stop-color="#450a1a"/>
        </linearGradient>
        <filter id="medievalTitleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.9"/>
        </filter>
      </defs>
      <rect width="240" height="330" rx="8" fill="url(#medievalSky)"/>
      <circle cx="180" cy="74" r="26" fill="#ef4444" opacity="0.85"/>
      <path d="M 60,45 Q 65,40 70,45 Q 75,40 80,45 Q 70,52 60,45 Z" fill="#090204"/>
      <path d="M 85,35 Q 89,31 93,35 Q 97,31 101,35 Q 93,40 85,35 Z" fill="#090204"/>
      <path d="M 45,60 Q 48,56 52,60 Q 56,56 59,60 Q 52,65 45,60 Z" fill="#090204"/>
      <polygon points="0,240 45,155 75,210 135,135 185,195 240,145 240,330 0,330" fill="#0d0306"/>
      <polygon points="40,158 45,115 50,158" fill="#0d0306"/>
      <polygon points="130,138 135,95 140,138" fill="#0d0306"/>
      <text x="120" y="78" fill="#fbbf24" font-family="${fontStack(font)}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="${letterSpacing}" filter="url(#medievalTitleShadow)">${escapeXml(cleanTitle)}</text>
      <path d="M 40,330 C 50,230 80,185 120,175 C 160,185 190,230 200,330 Z" fill="#080204"/>
      <path d="M 104,185 C 104,142 112,126 120,120 C 128,126 136,142 136,185 Z" fill="#140508"/>
      <ellipse cx="120" cy="155" rx="8" ry="11" fill="#080204"/>
      <circle cx="117" cy="153" r="1.5" fill="#f87171"/>
      <circle cx="123" cy="153" r="1.5" fill="#f87171"/>
      <rect x="118.5" y="105" width="3" height="75" fill="#cbd5e1"/>
      <polygon points="120,95 117,106 123,106" fill="#f8fafc"/>
      <rect x="110" y="145" width="20" height="4" rx="1.5" fill="#fbbf24"/>
      <circle cx="120" cy="183" r="3" fill="#fbbf24"/>
      <text x="120" y="104" fill="#fecaca" font-family="'Figtree',sans-serif" font-size="7" font-weight="600" text-anchor="middle" letter-spacing="1.5">${escapeXml(bi(L, "THE ANCIENT CURSE AWAKENS", "KUTUKAN KUNO KEMBALI BANGKIT"))}</text>
      <g transform="translate(10, 10)">
        <rect width="32" height="36" rx="3" fill="#120407" stroke="#fbbf24" stroke-width="1.2"/>
        <text x="16" y="13" fill="#fbbf24" font-family="'Figtree',sans-serif" font-size="10" font-weight="800" text-anchor="middle">#1</text>
        <line x1="4" y1="16.5" x2="28" y2="16.5" stroke="#fbbf24" stroke-width="0.8"/>
        <text x="16" y="25" fill="#fca5a5" font-family="'Figtree',sans-serif" font-size="6" font-weight="700" text-anchor="middle">TOME I</text>
        <text x="16" y="32.5" fill="#fbbf24" font-family="'Figtree',sans-serif" font-size="5.5" text-anchor="middle">$3.99</text>
      </g>
      <rect x="0" y="308" width="240" height="22" fill="#080204" opacity="0.95"/>
      <text x="120" y="322" fill="#fca5a5" font-family="'Figtree',sans-serif" font-size="7" font-weight="600" text-anchor="middle" letter-spacing="1">STORY: G. M. ROWEN · ART: L. D’ANGELO</text>
    `
  },
  childish: {
    en: "Cartoon / Playful Comedy",
    id: "Kartun / Komedi Ceria",
    heroDesc: { en: "the joyful cartoon buddy", id: "tokoh kartun ceria" },
    tagline: { en: "A SILLY & BUBBLY ESCAPADE", id: "PETUALANGAN CERIA & GOKIL" },
    byline: "STORY: T. PIPPIN · ART: B. TOODLES",
    issue: { tag: "FUN!", price: "$2.99" },
    defaultFont: "Fredoka",
    presetTraits: ["friendly", "soft"],
    presetStyles: ["childish"],
    renderSvg: (L, cleanTitle, font, fontSize, letterSpacing, byline) => `
      <defs>
        <linearGradient id="childishSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#7dd3fc"/>
          <stop offset="100%" stop-color="#fef08a"/>
        </linearGradient>
        <filter id="childishTitleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#ffffff" flood-opacity="0.9"/>
        </filter>
      </defs>
      <rect width="240" height="330" rx="8" fill="url(#childishSky)"/>
      <circle cx="185" cy="70" r="24" fill="#fde047" stroke="#fbbf24" stroke-width="2"/>
      <line x1="185" y1="40" x2="185" y2="34" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
      <line x1="215" y1="70" x2="221" y2="70" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
      <line x1="206" y1="49" x2="211" y2="44" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
      <circle cx="178" cy="67" r="2" fill="#78350f"/>
      <circle cx="192" cy="67" r="2" fill="#78350f"/>
      <path d="M 180,75 Q 185,80 190,75" stroke="#78350f" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <g fill="#ffffff" opacity="0.95">
        <circle cx="45" cy="60" r="16"/>
        <circle cx="62" cy="55" r="20"/>
        <circle cx="80" cy="60" r="15"/>
      </g>
      <path d="M 0,225 Q 70,185 140,215 T 240,195 L 240,330 L 0,330 Z" fill="#10b981"/>
      <path d="M 0,250 Q 80,220 160,255 T 240,240 L 240,330 L 0,330 Z" fill="#059669"/>
      <text x="120" y="78" fill="#e11d48" font-family="${fontStack(font)}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="${letterSpacing}" filter="url(#childishTitleShadow)">${escapeXml(cleanTitle)}</text>
      <ellipse cx="120" cy="225" rx="30" ry="36" fill="#f97316"/>
      <ellipse cx="120" cy="228" rx="20" ry="24" fill="#fef08a"/>
      <path d="M 94,215 Q 75,190 70,165" stroke="#f97316" stroke-width="9" stroke-linecap="round" fill="none"/>
      <path d="M 146,215 Q 165,190 170,165" stroke="#f97316" stroke-width="9" stroke-linecap="round" fill="none"/>
      <circle cx="120" cy="170" r="24" fill="#f97316"/>
      <path d="M 102,158 C 85,135 80,160 96,174 Z" fill="#c2410c"/>
      <path d="M 138,158 C 155,135 160,160 144,174 Z" fill="#c2410c"/>
      <ellipse cx="113" cy="166" rx="3" ry="4" fill="#1e293b"/>
      <ellipse cx="127" cy="166" rx="3" ry="4" fill="#1e293b"/>
      <circle cx="114" cy="165" r="1.2" fill="#ffffff"/>
      <circle cx="128" cy="165" r="1.2" fill="#ffffff"/>
      <ellipse cx="120" cy="173" rx="3" ry="2" fill="#78350f"/>
      <path d="M 115,178 Q 120,184 125,178" stroke="#78350f" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <text x="120" y="104" fill="#0f172a" font-family="'Figtree',sans-serif" font-size="7" font-weight="700" text-anchor="middle" letter-spacing="1.5">${escapeXml(bi(L, "A SILLY & BUBBLY ESCAPADE", "PETUALANGAN CERIA & GOKIL"))}</text>
      <g transform="translate(10, 10)">
        <rect width="32" height="36" rx="5" fill="#fef08a" stroke="#e11d48" stroke-width="1.5"/>
        <text x="16" y="13" fill="#e11d48" font-family="'Figtree',sans-serif" font-size="10" font-weight="900" text-anchor="middle">#1</text>
        <line x1="4" y1="16.5" x2="28" y2="16.5" stroke="#e11d48" stroke-width="1"/>
        <text x="16" y="25" fill="#e11d48" font-family="'Figtree',sans-serif" font-size="6.5" font-weight="800" text-anchor="middle">FUN!</text>
        <text x="16" y="32.5" fill="#c2410c" font-family="'Figtree',sans-serif" font-size="5.5" font-weight="700" text-anchor="middle">$2.99</text>
      </g>
      <rect x="0" y="308" width="240" height="22" fill="#065f46" opacity="0.95"/>
      <text x="120" y="322" fill="#d1fae5" font-family="'Figtree',sans-serif" font-size="7" font-weight="700" text-anchor="middle" letter-spacing="1">${byline}</text>
    `
  },
  rustic: {
    en: "Wild West / Desert Outlaw",
    id: "Wild West / Penjahat Gurun",
    heroDesc: { en: "the lone desert gunslinger", id: "koboi penembak legendaris" },
    tagline: { en: "HIGH NOON AT DUST CREEK", id: "TENGAH HARI DI LEMBAH DEBU" },
    byline: "STORY: J. DAKOTA · ART: C. HAWKINS",
    issue: { tag: "WILD", price: "$3.99" },
    defaultFont: "Rye",
    presetTraits: ["old", "strong"],
    presetStyles: ["rustic"],
    renderSvg: (L, cleanTitle, font, fontSize, letterSpacing, byline) => `
      <defs>
        <linearGradient id="rusticSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#451a03"/>
          <stop offset="35%" stop-color="#9a3412"/>
          <stop offset="70%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#fde047"/>
        </linearGradient>
        <filter id="rusticTitleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#451a03" flood-opacity="0.9"/>
        </filter>
      </defs>
      <rect width="240" height="330" rx="8" fill="url(#rusticSky)"/>
      <circle cx="120" cy="180" r="38" fill="#fef08a" opacity="0.95"/>
      <path d="M 50,45 Q 55,40 60,45 Q 65,40 70,45" stroke="#291203" stroke-width="1.8" fill="none"/>
      <path d="M 180,38 Q 184,34 188,38 Q 192,34 196,38" stroke="#291203" stroke-width="1.5" fill="none"/>
      <polygon points="0,230 40,205 90,205 110,235 155,200 205,200 240,230 240,330 0,330" fill="#291203"/>
      <g fill="#1a0c02">
        <rect x="25" y="190" width="6" height="50" rx="2"/>
        <path d="M 17,210 L 25,210 L 25,215 L 17,215 L 17,200 L 21,200 L 21,210 Z"/>
        <path d="M 31,218 L 38,218 L 38,206 L 34,206 L 34,214 L 31,214 Z"/>
        <rect x="205" y="175" width="6" height="65" rx="2"/>
        <path d="M 197,195 L 205,195 L 205,200 L 197,200 L 197,185 L 201,185 L 201,195 Z"/>
      </g>
      <text x="120" y="78" fill="#fef3c7" font-family="${fontStack(font)}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="${letterSpacing}" filter="url(#rusticTitleShadow)">${escapeXml(cleanTitle)}</text>
      <path d="M 60,330 L 85,250 L 155,250 L 180,330 Z" fill="#140802"/>
      <path d="M 85,250 C 70,210 80,185 120,180 C 160,185 170,210 155,250 Z" fill="#210e04"/>
      <ellipse cx="120" cy="162" rx="38" ry="7" fill="#140802"/>
      <path d="M 104,162 C 104,142 110,135 120,133 C 130,135 136,142 136,162 Z" fill="#261005"/>
      <rect x="105" y="159" width="30" height="3" fill="#ea580c"/>
      <text x="120" y="104" fill="#fed7aa" font-family="'Figtree',sans-serif" font-size="7.5" font-weight="700" text-anchor="middle" letter-spacing="1.8">${escapeXml(bi(L, "HIGH NOON AT DUST CREEK", "TENGAH HARI DI LEMBAH DEBU"))}</text>
      <g transform="translate(10, 10)">
        <rect width="32" height="36" rx="2" fill="#291203" stroke="#f59e0b" stroke-width="1.2"/>
        <text x="16" y="13" fill="#fef3c7" font-family="'Figtree',sans-serif" font-size="10" font-weight="800" text-anchor="middle">#1</text>
        <line x1="4" y1="16.5" x2="28" y2="16.5" stroke="#f59e0b" stroke-width="0.8"/>
        <text x="16" y="25" fill="#fde047" font-family="'Figtree',sans-serif" font-size="6.5" font-weight="700" text-anchor="middle">WILD</text>
        <text x="16" y="32.5" fill="#fed7aa" font-family="'Figtree',sans-serif" font-size="5.5" text-anchor="middle">$3.99</text>
      </g>
      <rect x="0" y="308" width="240" height="22" fill="#140802" opacity="0.95"/>
      <text x="120" y="322" fill="#fed7aa" font-family="'Figtree',sans-serif" font-size="7" font-weight="600" text-anchor="middle" letter-spacing="1">${byline}</text>
    `
  },
  natural: {
    en: "Nature / Forest Adventure",
    id: "Alam / Petualangan Hutan",
    heroDesc: { en: "the mountain trail wanderer", id: "penjelajah bukit dan rimba" },
    tagline: { en: "WHERE THE WILD BREEZE CALLS", id: "KEMANA ANGIN LIAR MEMANGGIL" },
    byline: "STORY: M. WILLOW · ART: S. GREEN",
    issue: { tag: "VOL 1", price: "$3.50" },
    defaultFont: "Amatic SC",
    presetTraits: ["delicate", "friendly"],
    presetStyles: ["natural"],
    renderSvg: (L, cleanTitle, font, fontSize, letterSpacing, byline) => `
      <defs>
        <linearGradient id="naturalSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#022c22"/>
          <stop offset="40%" stop-color="#064e3b"/>
          <stop offset="75%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#6ee7b7"/>
        </linearGradient>
        <filter id="naturalTitleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#022c22" flood-opacity="0.9"/>
        </filter>
      </defs>
      <rect width="240" height="330" rx="8" fill="url(#naturalSky)"/>
      <path d="M 190,55 A 18 18 0 1 0 190,85 A 14 14 0 1 1 190,55 Z" fill="#fef9c3" opacity="0.9"/>
      <circle cx="45" cy="115" r="2" fill="#fef08a" opacity="0.9"/>
      <circle cx="85" cy="140" r="1.5" fill="#fef08a" opacity="0.8"/>
      <circle cx="210" cy="120" r="2.2" fill="#fef08a" opacity="0.9"/>
      <circle cx="165" cy="155" r="1.8" fill="#fef08a" opacity="0.7"/>
      <polygon points="0,260 20,210 40,260 60,200 80,260 110,190 140,260 170,205 200,260 220,215 240,260 240,330 0,330" fill="#043c2e"/>
      <polygon points="0,280 35,235 70,280 115,225 160,280 205,240 240,280 240,330 0,330" fill="#02241b"/>
      <text x="120" y="78" fill="#ecfdf5" font-family="${fontStack(font)}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="${letterSpacing}" filter="url(#naturalTitleShadow)">${escapeXml(cleanTitle)}</text>
      <path d="M 50,330 L 95,235 L 145,235 L 190,330 Z" fill="#011812"/>
      <circle cx="120" cy="155" r="13" fill="#011812"/>
      <path d="M 125,152 Q 142,156 138,168" stroke="#011812" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M 108,168 L 132,168 L 138,235 L 102,235 Z" fill="#011812"/>
      <rect x="98" y="172" width="10" height="24" rx="4" fill="#011812"/>
      <line x1="145" y1="110" x2="140" y2="280" stroke="#a7f3d0" stroke-width="2" stroke-linecap="round"/>
      <text x="120" y="104" fill="#a7f3d0" font-family="'Figtree',sans-serif" font-size="7" font-weight="600" text-anchor="middle" letter-spacing="1.5">${escapeXml(bi(L, "WHERE THE WILD BREEZE CALLS", "KEMANA ANGIN LIAR MEMANGGIL"))}</text>
      <g transform="translate(10, 10)">
        <rect width="32" height="36" rx="4" fill="#022c22" stroke="#34d399" stroke-width="1.2"/>
        <text x="16" y="13" fill="#6ee7b7" font-family="'Figtree',sans-serif" font-size="10" font-weight="800" text-anchor="middle">#1</text>
        <line x1="4" y1="16.5" x2="28" y2="16.5" stroke="#34d399" stroke-width="0.8"/>
        <text x="16" y="25" fill="#ecfdf5" font-family="'Figtree',sans-serif" font-size="6.5" font-weight="700" text-anchor="middle">VOL 1</text>
        <text x="16" y="32.5" fill="#34d399" font-family="'Figtree',sans-serif" font-size="5.5" text-anchor="middle">$3.50</text>
      </g>
      <rect x="0" y="308" width="240" height="22" fill="#011812" opacity="0.95"/>
      <text x="120" y="322" fill="#6ee7b7" font-family="'Figtree',sans-serif" font-size="7" font-weight="600" text-anchor="middle" letter-spacing="1">${byline}</text>
    `
  },
  artdeco: {
    en: "Noir Glamour / 1920s Mystery",
    id: "Noir Glamor / Misteri Era 1920",
    heroDesc: { en: "the elegant fedora detective", id: "detektif elegan bertopi fedora" },
    tagline: { en: "SECRETS IN THE VELVET SHADOWS", id: "RAHASIA DI BALIK KELAM MALAM" },
    byline: "STORY: V. STERLING · ART: E. DELACROIX",
    issue: { tag: "OCT", price: "$4.50" },
    defaultFont: "Poiret One",
    presetTraits: ["delicate", "smart"],
    presetStyles: ["artdeco"],
    renderSvg: (L, cleanTitle, font, fontSize, letterSpacing, byline) => `
      <defs>
        <linearGradient id="artdecoSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#09090b"/>
          <stop offset="45%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#312e81"/>
        </linearGradient>
        <filter id="artdecoTitleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.9"/>
        </filter>
      </defs>
      <rect width="240" height="330" rx="8" fill="url(#artdecoSky)"/>
      <g stroke="#fbbf24" stroke-width="0.8" opacity="0.25">
        <line x1="120" y1="190" x2="0" y2="20"/>
        <line x1="120" y1="190" x2="40" y2="0"/>
        <line x1="120" y1="190" x2="80" y2="0"/>
        <line x1="120" y1="190" x2="120" y2="0"/>
        <line x1="120" y1="190" x2="160" y2="0"/>
        <line x1="120" y1="190" x2="200" y2="0"/>
        <line x1="120" y1="190" x2="240" y2="20"/>
        <circle cx="120" cy="190" r="110" fill="none"/>
        <circle cx="120" cy="190" r="70" fill="none"/>
      </g>
      <polygon points="10,330 10,210 25,210 25,180 40,180 40,330" fill="#08080f"/>
      <polygon points="200,330 200,180 215,180 215,210 230,210 230,330" fill="#08080f"/>
      <line x1="25" y1="190" x2="25" y2="330" stroke="#fbbf24" stroke-width="0.8" opacity="0.4"/>
      <line x1="215" y1="190" x2="215" y2="330" stroke="#fbbf24" stroke-width="0.8" opacity="0.4"/>
      <text x="120" y="78" fill="#fef08a" font-family="${fontStack(font)}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="${letterSpacing}" filter="url(#artdecoTitleShadow)">${escapeXml(cleanTitle)}</text>
      <path d="M 65,330 L 95,245 L 145,245 L 175,330 Z" fill="#06060c"/>
      <polygon points="120,200 98,180 106,230 120,220 134,230 142,180" fill="#131326"/>
      <circle cx="120" cy="165" r="14" fill="#06060c"/>
      <ellipse cx="120" cy="156" rx="28" ry="6" fill="#06060c" transform="rotate(-5 120 156)"/>
      <path d="M 106,155 C 106,140 112,132 120,132 C 128,132 134,140 134,155 Z" fill="#181830"/>
      <circle cx="127" cy="172" r="1.5" fill="#f97316"/>
      <path d="M 128,172 Q 134,150 128,130 T 136,105" stroke="#e2e8f0" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.6"/>
      <text x="120" y="104" fill="#fef9c3" font-family="'Figtree',sans-serif" font-size="6.8" font-weight="600" text-anchor="middle" letter-spacing="1.5">${escapeXml(bi(L, "SECRETS IN THE VELVET SHADOWS", "RAHASIA DI BALIK KELAM MALAM"))}</text>
      <g transform="translate(10, 10)">
        <rect width="32" height="36" rx="1" fill="#09090b" stroke="#fbbf24" stroke-width="1.2"/>
        <rect x="2" y="2" width="28" height="32" fill="none" stroke="#fbbf24" stroke-width="0.5"/>
        <text x="16" y="13" fill="#fef08a" font-family="'Figtree',sans-serif" font-size="10" font-weight="800" text-anchor="middle">#1</text>
        <line x1="5" y1="16.5" x2="27" y2="16.5" stroke="#fbbf24" stroke-width="0.8"/>
        <text x="16" y="25" fill="#fef08a" font-family="'Figtree',sans-serif" font-size="6.5" font-weight="700" text-anchor="middle">OCT</text>
        <text x="16" y="32.5" fill="#cbd5e1" font-family="'Figtree',sans-serif" font-size="5.5" text-anchor="middle">$4.50</text>
      </g>
      <rect x="0" y="308" width="240" height="22" fill="#06060c" opacity="0.95"/>
      <text x="120" y="322" fill="#fef08a" font-family="'Figtree',sans-serif" font-size="7" font-weight="600" text-anchor="middle" letter-spacing="1">${byline}</text>
    `
  }
};

function generateCoverSvg(L, title, font, genre) {
  const g = GENRES[genre] || GENRES.action;
  const f = font || fontByName(g.defaultFont);
  const cleanTitle = (title || "MOON HARBOR").trim().toUpperCase() || "MOON HARBOR";
  const len = cleanTitle.length;
  const fontSize = len <= 7 ? 32 : len <= 10 ? 27 : len <= 14 ? 22 : len <= 18 ? 18 : len <= 22 ? 15 : 13;
  const letterSpacing = len <= 8 ? "1.5" : len <= 14 ? "0.8" : "0.3";

  return `<svg viewBox="0 0 240 330" class="cover-svg" xmlns="http://www.w3.org/2000/svg" aria-label="Interactive Comic Cover Mockup">
    ${g.renderSvg(L, cleanTitle, f, fontSize, letterSpacing, g.byline)}
  </svg>`;
}


/** Tiny DOM builder: h("div", {class:"x"}, child, "text", ...) */
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => {
      if (v == null || v === false) return;
      if (k === "class") e.className = v;
      else if (k === "style") e.style.cssText = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    });
  }
  kids.flat().forEach((c) => {
    if (c == null || c === false) return;
    e.append(typeof c === "object" ? c : document.createTextNode(String(c)));
  });
  return e;
}
const para = (text, cls) => h("p", cls ? { class: cls } : null, text);
const quote = (text, who) => h("blockquote", { class: "quote" }, h("p", null, `“${text}”`), h("cite", null, `— ${who}`));
const callout = (title, text) => h("div", { class: "callout" }, title ? h("strong", null, title) : null, h("span", null, text));
const bullets = (items) => h("ul", { class: "bullets" }, items.map((t) => h("li", null, t)));
const raw = (html, cls) => { const el = h("div", cls ? { class: cls } : null); el.innerHTML = html; return el; };

/** A labelled range input. Calls onInput(value:number) immediately and on change. */
function slider(label, min, max, step, value, onInput, fmt) {
  const out = h("output", null, fmt ? fmt(value) : String(value));
  const input = h("input", { type: "range", min, max, step, value, "aria-label": label });
  const fire = () => { const v = Number(input.value); out.textContent = fmt ? fmt(v) : String(v); onInput(v); };
  const set = (v) => { input.value = String(v); out.textContent = fmt ? fmt(v) : String(v); };
  input.addEventListener("input", fire);
  const row = h("label", { class: "ctrl" }, h("span", { class: "ctrl-label" }, label), input, out);
  return { row, fire, input, out, set };
}
function titleInput(L, onChange) {
  const input = h("input", { type: "text", class: "demo-input", maxlength: "24", value: demoTitle, "aria-label": bi(L, "Your comic title", "Judul komikmu") });
  input.addEventListener("input", () => { demoTitle = input.value || " "; onChange(demoTitle); });
  return h("label", { class: "ctrl title-ctrl" }, h("span", { class: "ctrl-label" }, bi(L, "Try your own comic title", "Coba judul komikmu sendiri")), input);
}

/** Shared helper to build a real comic cover example card */
function makeCoverCard({ badge, badgeColor, title, coverSrc, alt, swatches, text, note }) {
  return h("div", { class: "color-cover-card" },
    h("div", { class: "color-cover-img-wrap" },
      h("img", { src: coverSrc, alt: alt || title, class: "color-cover-img", loading: "lazy" })
    ),
    h("div", { class: "color-cover-body" },
      badge ? h("span", { class: "color-badge", style: badgeColor ? `background:${badgeColor};color:#fff` : "" }, badge) : null,
      h("h4", { class: "color-card-title" }, title),
      swatches && swatches.length ? h("div", { class: "swatch-strip" },
        swatches.map((s) => h("span", { class: "swatch-chip", title: s.label },
          s.hex ? h("i", { class: "swatch-color", style: `background:${s.hex}` }) : null,
          s.label
        ))
      ) : null,
      h("p", { class: "color-card-text" }, text),
      note ? h("p", { class: "color-card-note" }, note) : null
    )
  );
}

/* ================= Lesson 1 ================= */
function lessonVoice(L) {
  const samples = [];
  const cards = [
    ["Anton", bi(L, "Loud and heavy. Action, urgency.", "Lantang dan berat. Aksi, kemendesakan.")],
    ["Cormorant Garamond", bi(L, "Elegant and delicate. Romance, period drama.", "Elegan dan halus. Romansa, drama periode.")],
    ["Fredoka", bi(L, "Round and friendly. Kids' stories, comedy.", "Bulat dan ramah. Cerita anak, komedi.")],
    ["Orbitron", bi(L, "Cold and technological. Sci-fi.", "Dingin dan teknologis. Fiksi ilmiah.")],
    ["Pirata One", bi(L, "Old and ominous. Dark fantasy.", "Kuno dan suram. Fantasi gelap.")],
    ["Rye", bi(L, "Weathered and rustic. Westerns.", "Usang dan rustik. Western.")],
  ].map(([n, d]) => {
    const s = h("span", { class: "sample", style: `font-family:${stackOf(n)}` }, demoTitle);
    samples.push(s);
    return h("div", { class: "fcard" }, s, h("p", { class: "cap" }, h("strong", null, n), d));
  });

  const voiceCoverExamples = [
    makeCoverCard({
      badge: bi(L, "Loud & Monolithic Voice", "Suara Lantang & Monolitik"),
      badgeColor: "#18181b",
      title: bi(L, "Lost Fantasy Vol. 1", "Lost Fantasy Vol. 1"),
      coverSrc: "covers/lost-fantasy-volume-1-9781534331303_xlg.jpg",
      swatches: [
        { hex: "#09090b", label: bi(L, "Heavy Block Sans", "Sans Balok Tebal") },
        { hex: "#facc15", label: bi(L, "Brutalist Impact", "Dampak Brutalis") }
      ],
      text: bi(L,
        "The gigantic, solid black block letters of LOST FANTASY speak with an unshakeable, thunderous voice—mirroring the massive stone giant looming behind the hero.",
        "Huruf balok hitam raksasa pada LOST FANTASY berbicara dengan suara menggelegar yang tak tergoyahkan—mencerminkan raksasa batu yang menjulang di belakang sang pahlawan."
      ),
      note: bi(L, "Voice: Unstoppable, heavy, modern epic.", "Suara: Tak terbendung, berat, epik modern.")
    }),
    makeCoverCard({
      badge: bi(L, "Graceful & Regal Voice", "Suara Anggun & Bangsawan"),
      badgeColor: "#be123c",
      title: bi(L, "Yona of the Dawn Vol. 1", "Yona of the Dawn Vol. 1"),
      coverSrc: "covers/yona-of-the-dawn-vol-1-9781421587813_hr.jpg",
      swatches: [
        { hex: "#e11d48", label: bi(L, "Calligraphic Serif", "Serif Kaligrafis") },
        { hex: "#f43f5e", label: bi(L, "Delicate Curves", "Lekuk Halus") }
      ],
      text: bi(L,
        "The sweeping, tapered serif strokes of YONA speak in a poised, noble voice. Even with a drawn sword, the typography tells us this is a story of royal lineage, heart, and destiny.",
        "Goresan serif meruncing yang mengalir pada YONA berbicara dengan nada anggun dan bangsawan. Meski sang tokoh memegang pedang, tipografinya menyampaikan kisah garis keturunan kerajaan dan takdir."
      ),
      note: bi(L, "Voice: Poetic, noble, historical romance.", "Suara: Puitis, mulia, romansa sejarah.")
    }),
    makeCoverCard({
      badge: bi(L, "Savage & Slashing Voice", "Suara Buas & Menyabet"),
      badgeColor: "#991b1b",
      title: bi(L, "Barbaric: The Long Death #1", "Barbaric: The Long Death #1"),
      coverSrc: "covers/ffeb36a3-b87c-45a3-bf4f-1a71f08ec63b_903x1400.jpeg",
      swatches: [
        { hex: "#dc2626", label: bi(L, "Spiky Blade Type", "Huruf Tajam Berduri") },
        { hex: "#18181b", label: bi(L, "Dark Fantasy", "Fantasi Gelap") }
      ],
      text: bi(L,
        "Every letter in BARBARIC ends in a wicked, hooked fang or axe-edge. The title literally screams savagery and dark humor before you even look at the blood-drenched berserker below.",
        "Setiap huruf pada BARBARIC berakhir dengan ujung taring atau mata kapak yang tajam. Judul ini langsung meneriakkan kebuasan dan fantasi gelap bahkan sebelum kamu melihat sosok petarung di bawahnya."
      ),
      note: bi(L, "Voice: Ferocious,loud, sword-and-sorcery.", "Suara: Beringas, lantang, pedang-dan-sihir.")
    })
  ];

  return h("div", null,
    quote(bi(L, "Typography exists to honor the content.", "Tipografi ada untuk menghormati isi."), "Robert Bringhurst"),
    para(bi(L,
      "Typography is not only about making words readable. It is the look, structure and feeling of text, and it brings the words to life. A designer always thinks about the relationship between how the text looks and what the text says.",
      "Tipografi bukan hanya soal membuat kata terbaca. Ia adalah tampilan, struktur, dan rasa dari teks, dan ia menghidupkan kata-kata. Desainer selalu memikirkan hubungan antara tampilan teks dan apa yang dikatakan teks itu.")),
    para(bi(L,
      "For a comic, the title is the first thing a reader sees. It should look the way your story feels. Same words, six different stories:",
      "Untuk komik, judul adalah hal pertama yang dilihat pembaca. Ia harus tampak seperti rasa ceritamu. Kata yang sama, enam cerita berbeda:")),
    titleInput(L, (v) => samples.forEach((s) => (s.textContent = v))),
    h("div", { class: "fgrid" }, cards),
    quote(bi(L, "Look for the typefaces that embody the qualities of the message you're trying to convey.", "Carilah font yang mewujudkan kualitas pesan yang ingin kamu sampaikan."), "Jason Santa Maria"),
    h("h3", null, bi(L, "Type voices on real comic covers", "Suara huruf pada sampul komik nyata")),
    para(bi(L,
      "Compare how these three real comic covers use completely different typographic voices to announce their genre at a single glance:",
      "Bandingkan bagaimana ketiga sampul komik nyata ini menggunakan suara tipografi yang sangat berbeda untuk mengumumkan genrenya dalam sekali pandang:")),
    h("div", { class: "color-cover-grid cols-3" }, voiceCoverExamples)
  );
}

/* ================= Lesson 2 ================= */
const PAIR_FONTS = {
  strong: "Anton", delicate: "Cormorant Garamond", fast: "Racing Sans One", slow: "Uncial Antiqua",
  hot: "Bangers", cold: "Orbitron", masculine: "Archivo Black", feminine: "Poiret One",
  soft: "Fredoka", hard: "Rubik Mono One", old: "Pirata One", young: "Poppins",
  friendly: "Chewy", threatening: "Black Ops One",
};
const STYLE_FONTS = {
  medieval: "Pirata One", natural: "Amatic SC", brutalist: "Archivo Black", humanist: "Lato", artdeco: "Limelight",
  neutral: "Arimo", childish: "Fredoka", futuristic: "Orbitron", traditional: "Libre Baskerville", rustic: "Rye",
  scientific: "IBM Plex Mono", fresh: "Quicksand", contemporary: "Montserrat", smart: "Cormorant Garamond", funny: "Bangers",
};

function lessonCharacter(L) {
  const pole = (p) => h("div", { class: "pole" },
    h("span", { class: "pole-word", style: `font-family:${stackOf(PAIR_FONTS[p])}` }, TRAITS[p][L].label),
    h("small", null, TRAITS[p][L].cues));
  const pairs = Object.values(AXES).map((ax) => h("div", { class: "pair" }, pole(ax.a), pole(ax.b)));
  const styles = Object.keys(STYLES).map((s) => h("details", { class: "style-item" },
    h("summary", null, h("span", { style: `font-family:${stackOf(STYLE_FONTS[s])}` }, STYLES[s][L].label)),
    h("p", null, STYLES[s][L].why),
    h("p", { class: "cap" }, h("strong", null, bi(L, "Look for: ", "Perhatikan: ")), STYLES[s][L].cues)));

  const charStyleCovers = [
    makeCoverCard({
      badge: bi(L, "Hard · Old · Mythic Medieval", "Keras · Tua · Mitologi Kuno"),
      badgeColor: "#9a3412",
      title: bi(L, "Absolute Wonder Woman", "Absolute Wonder Woman"),
      coverSrc: "covers/absolute-wonder-woman.jpg",
      swatches: [
        { hex: "#f8fafc", label: bi(L, "Chiseled Gothic", "Gotik Pahat") },
        { hex: "#b91c1c", label: bi(L, "Weathered Texture", "Tekstur Usang") }
      ],
      text: bi(L,
        "Sharp, stone-carved angles with distressed erosion give WONDER WOMAN a Hard, Old, and Threatening character—fitting a fierce warrior raised in the underworld.",
        "Sudut pahatan batu yang tajam dengan tekstur tergerus memberi WONDER WOMAN karakter Keras, Kuno, dan Mengancam—cocok untuk pejuang tangguh dari dunia bawah."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Fast · Hot · Hand-Brushed", "Cepat · Panas · Goresan Kuas"),
      badgeColor: "#ea580c",
      title: bi(L, "Naruto Vol. 47", "Naruto Vol. 47"),
      coverSrc: "covers/whats-your-favorite-manga-cover-v0-1z63aihyj9vc1.jpeg",
      swatches: [
        { hex: "#f97316", label: bi(L, "Hot & Energetic", "Panas & Berenergi") },
        { hex: "#1d4ed8", label: bi(L, "Organic Brush", "Kuas Organik") }
      ],
      text: bi(L,
        "Rough brush strokes, flared ends, and high-energy angles give NARUTO a Fast, Hot, and Young personality—radiating raw martial-arts momentum.",
        "Goresan kuas kasar dan sudut penuh energi memberi judul NARUTO kepribadian Cepat, Panas, dan Muda—memancarkan momentum bela diri yang meledak-ledak."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Style Contrast: Stencil vs. Retro Script", "Kontras Gaya: Stensil vs. Skrip Retro"),
      badgeColor: "#7f1d1d",
      title: bi(L, "The Punisher vs. Thunderbolts", "The Punisher vs. Thunderbolts"),
      coverSrc: "covers/md_7eee34353e54-punisher.jpg",
      swatches: [
        { hex: "#991b1b", label: bi(L, "1950s Diner Script", "Skrip Diner 1950-an") },
        { hex: "#18181b", label: bi(L, "Military Stencil", "Stensil Militer") }
      ],
      text: bi(L,
        "A brilliant style juxtaposition: THE PUNISHER uses a hard military stencil, while Thunderbolts uses a sweet, curvy 1950s milkshake-diner script—matching the ironic date-night shootout!",
        "Perpaduan dua gaya yang kontras: THE PUNISHER memakai stensil militer yang keras, sedangkan Thunderbolts memakai skrip restoran 1950-an yang manis—cocok dengan adegan kencan bersenjata yang ironis!"
      )
    })
  ];

  return h("div", null,
    para(bi(L,
      "Just like people, every typeface has a character. We can describe it with pairs of opposites. Each word below is set in a font that shows it:",
      "Seperti manusia, setiap font punya karakter. Kita bisa menggambarkannya dengan pasangan kata berlawanan. Setiap kata di bawah ditulis dengan font yang menunjukkannya:")),
    h("div", { class: "pairs" }, pairs),
    h("h3", null, bi(L, "Styles: the world a font comes from", "Gaya: dunia asal sebuah font")),
    para(bi(L,
      "Besides character, fonts have a style: an era, a place or a mood they belong to. Tap a style to read how to recognise it.",
      "Selain karakter, font punya gaya: zaman, tempat, atau suasana asalnya. Ketuk sebuah gaya untuk membaca cara mengenalinya.")),
    h("div", { class: "style-list" }, styles),
    callout(bi(L, "Mood is a blend", "Suasana adalah perpaduan"),
      bi(L,
        "A title's mood comes from the look of the typeface, plus how readable your design is, plus what the words themselves mean. These feelings are common tendencies, not strict rules: cultures differ and one font can carry several moods.",
        "Suasana judul berasal dari tampilan font, ditambah keterbacaan desainmu, ditambah makna kata-katanya sendiri. Perasaan ini adalah kecenderungan umum, bukan aturan mutlak: budaya berbeda dan satu font bisa membawa beberapa suasana.")),
    h("h3", null, bi(L, "Character & style on real comic covers", "Karakter & gaya pada sampul komik nyata")),
    para(bi(L,
      "See how professional comic covers combine character poles (hard/soft, fast/slow, old/young) with historical or cultural styles:",
      "Lihat bagaimana sampul komik profesional memadukan kutub karakter (keras/lembut, cepat/lambat, tua/muda) dengan gaya zaman atau budaya:")),
    h("div", { class: "color-cover-grid cols-3" }, charStyleCovers)
  );
}

/* ================= Lesson 3 ================= */
function lessonRoles(L) {
  const role = (name, n, desc, look) => h("div", { class: "rolecard" },
    h("span", { class: "role-name" }, name),
    h("span", { class: "sample", style: `font-family:${stackOf(n)}` }, n === "Libre Baskerville" ? "Aa Bb Cc" : demoTitle.slice(0, 12)),
    h("p", null, desc), h("p", { class: "cap" }, look));
  const a = h("span", { class: "sample-line", style: `font-family:${stackOf("Great Vibes")}` }, "Night Hawk");
  const b = h("span", { class: "sample-line", style: `font-family:${stackOf("Anton")}` }, "NIGHT HAWK");
  const cap = h("p", { class: "caption" });
  const s = slider(bi(L, "Cover size", "Ukuran sampul"), 14, 64, 1, 56, (v) => {
    a.style.fontSize = b.style.fontSize = v + "px";
    cap.textContent = v < 26
      ? bi(L, "At thumbnail size the decorative script is hard to read, while the display face still works. Legibility matters!", "Pada ukuran thumbnail, skrip dekoratif sulit dibaca, sementara display face masih terbaca. Keterbacaan itu penting!")
      : bi(L, "Now shrink the slider. Which title survives first?", "Sekarang kecilkan slider. Judul mana yang bertahan lebih dulu?");
  }, (v) => v + "px");
  s.fire();

  const roleCovers = [
    makeCoverCard({
      badge: bi(L, "Display Face Role", "Peran Display Face"),
      badgeColor: "#0284c7",
      title: bi(L, "Ultimate Spider-Man Vol. 3", "Ultimate Spider-Man Vol. 3"),
      coverSrc: "covers/ultimate-spider-man-volume-3.jpg",
      swatches: [
        { hex: "#f8fafc", label: bi(L, "Bold Display Sans", "Display Sans Tegas") },
        { hex: "#f59e0b", label: bi(L, "High Thumbnail Legibility", "Terbaca di Ukuran Kecil") }
      ],
      text: bi(L,
        "ULTIMATE SPIDER-MAN uses a clean, assertive display sans-serif. Even when shrunk to a tiny digital store thumbnail, every letterform remains crisp and unmistakable.",
        "ULTIMATE SPIDER-MAN menggunakan display sans-serif yang bersih dan tegas. Bahkan saat diperkecil ke ukuran thumbnail toko digital, setiap hurufnya tetap tajam dan mudah dibaca."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Decorative Face Role", "Peran Decorative Face"),
      badgeColor: "#ca8a04",
      title: bi(L, "One Piece Vol. 30", "One Piece Vol. 30"),
      coverSrc: "covers/yellowcover1.png",
      swatches: [
        { hex: "#0284c7", label: bi(L, "Novelty Pirate Logo", "Logo Bajak Laut Unik") },
        { hex: "#dc2626", label: bi(L, "Character-Driven Shapes", "Bentuk Berkarakter Kuat") }
      ],
      text: bi(L,
        "ONE PIECE turns letters into pirate symbols—a skull for the 'O', Luffy's silhouette for the 'I', and an anchor for the 'E'. Iconic for a main logo, though impossible to use for body text!",
        "ONE PIECE mengubah huruf menjadi simbol bajak laut—tengkorak untuk huruf 'O', siluet Luffy untuk 'I', dan jangkar untuk 'E'. Sangat ikonik sebagai logo utama, namun tak mungkin dipakai untuk teks bacaan!"
      )
    }),
    makeCoverCard({
      badge: bi(L, "Decorative Title + Clean Text Credits", "Judul Dekoratif + Teks Kredit Bersih"),
      badgeColor: "#0f766e",
      title: bi(L, "Creature from the Black Lagoon Lives!", "Creature from the Black Lagoon Lives!"),
      coverSrc: "covers/universal-monsters-creature-from-the-black-lagoon-lives-hc-vol-1-CVRA.jpg",
      swatches: [
        { hex: "#f59e0b", label: bi(L, "Dripping Monster Display", "Huruf Monster Meleleh") },
        { hex: "#f8fafc", label: bi(L, "Clean Sans Credits", "Kredit Sans Bersih") }
      ],
      text: bi(L,
        "Notice the smart pairing: the monster title uses a wild pulp-horror decorative font, while the creator names at the top use a quiet, conventional sans-serif so they don't compete.",
        "Perhatikan perpaduan cerdas ini: judul utama memakai font dekoratif horor yang liar, sedangkan nama kreator di bagian atas memakai sans-serif sederhana yang tenang agar tidak saling berebut perhatian."
      )
    })
  ];

  return h("div", null,
    para(bi(L,
      "One of the most useful ways to sort typefaces is by the role they play on the page: text, display and decorative.",
      "Salah satu cara paling berguna untuk menggolongkan font adalah lewat peran mereka di halaman: text, display, dan decorative.")),
    h("div", { class: "rolegrid" },
      role(bi(L, "Text face", "Text face"), "Libre Baskerville",
        bi(L, "Made for long passages, like books and magazines. The focus is readability: reading fast for a long time without tiring.", "Dibuat untuk bacaan panjang, seperti buku dan majalah. Fokusnya keterbacaan: membaca cepat dalam waktu lama tanpa lelah."),
        bi(L, "Quiet, even, conventional shapes.", "Bentuk tenang, rata, dan konvensional.")),
      role(bi(L, "Display face", "Display face"), "Anton",
        bi(L, "Made for larger sizes: headings, titles, headlines. Eye-catching yet still legible, and a good mixer with other fonts.", "Dibuat untuk ukuran besar: judul dan headline. Mencolok namun tetap terbaca, dan cocok dipadukan dengan font lain."),
        bi(L, "Assertive, but not so quirky that it competes.", "Tegas, tetapi tidak terlalu aneh sampai bersaing.")),
      role(bi(L, "Decorative face", "Decorative face"), "Pirata One",
        bi(L, "Character actors of typography. Their job is to grab attention at all cost, often including legibility. Most go in and out of style.", "Pemeran karakter dalam tipografi. Tugasnya menarik perhatian dengan segala cara, sering mengorbankan keterbacaan. Kebanyakan cepat ketinggalan zaman."),
        bi(L, "Novelty shapes, strong personality, less versatile.", "Bentuk baru dan unik, kepribadian kuat, kurang serbaguna."))),
    callout(bi(L, "For your comic", "Untuk komikmu"),
      bi(L,
        "Your title is display or decorative territory. Your speech balloons and captions are long reading, so keep them in a clear text-friendly font or clean comic lettering. Remember: text faces can also work big, but decorative faces rarely work small.",
        "Judulmu wilayah display atau decorative. Balon kata dan keteranganmu adalah bacaan panjang, jadi pakai font ramah baca atau lettering komik yang bersih. Ingat: text face juga bisa dipakai besar, tetapi decorative face jarang cocok kecil.")),
    h("h3", null, bi(L, "Three signs of legibility", "Tiga tanda keterbacaan")),
    bullets([
      bi(L, "Conventional letterforms: letters that look the way we expect.", "Bentuk huruf konvensional: huruf yang tampak seperti yang kita harapkan."),
      bi(L, "Generous spacing between letters and words.", "Jarak yang lega antar huruf dan kata."),
      bi(L, "A tall x-height: lowercase letters that are big compared with capitals.", "x-height tinggi: huruf kecil yang besar dibandingkan huruf kapital."),
    ]),
    h("h3", null, bi(L, "The thumbnail test", "Uji thumbnail")),
    h("div", { class: "demo demo-split" }, h("div", { class: "demo-stage" }, h("div", null, a), h("div", null, b)), h("div", { class: "demo-ctrls" }, s.row, cap)),
    h("h3", null, bi(L, "Display, Decorative & Text roles on real covers", "Peran Display, Decorative & Text pada sampul nyata")),
    para(bi(L,
      "Here is how real comic covers balance bold display faces, custom decorative logos, and clean supporting text:",
      "Berikut cara sampul komik nyata menyeimbangkan display face yang tegas, logo dekoratif kustom, dan teks pendukung yang bersih:")),
    h("div", { class: "color-cover-grid cols-3" }, roleCovers)
  );
}

/* ================= Lesson 4 ================= */
function lessonMatch(L) {
  const traitKeys = Object.keys(TRAITS), styleKeys = Object.keys(STYLES);
  const results = h("div", { class: "fgrid" });
  const hint = h("p", { class: "hint" });
  const sampleEls = [];
  const render = () => {
    results.innerHTML = ""; sampleEls.length = 0;
    const rankedAll = getRankedFonts(matchmakerState.picked);
    const ranked = rankedAll.slice(0, 4);
    matchmakerState.topFont = ranked.length ? ranked[0].f : null;
    matchmakerState.genre = detectGenre(matchmakerState.picked, matchmakerState.topFont);

    hint.textContent = matchmakerState.picked.size === 0
      ? bi(L, "Pick two to four words above to see fonts that carry them.", "Pilih dua sampai empat kata di atas untuk melihat font yang membawanya.")
      : ranked.length ? bi(L, "Fonts that match most of your words (these will generate your cover in Lesson 5!):", "Font yang cocok dengan sebagian besar katamu (ini akan membuat sampulmu di Pelajaran 5!):")
        : bi(L, "No font in our small library matches. Try fewer or different words.", "Tidak ada font di perpustakaan kecil kami yang cocok. Coba kata lain atau lebih sedikit.");
    ranked.forEach(({ f, traits, styles }) => {
      const s = h("span", { class: "sample", style: `font-family:${fontStack(f)}` }, demoTitle);
      sampleEls.push(s);
      results.append(h("div", { class: "fcard" }, s, h("p", { class: "cap" }, h("strong", null, f.n),
        [...styles.map((x) => STYLES[x][L].label), ...traits.map((x) => TRAITS[x][L].label)].join(" · "))));
    });
  };
  const chip = (key, text) => {
    const isPressed = matchmakerState.picked.has(key);
    const b = h("button", { type: "button", class: "chip-toggle", "aria-pressed": String(isPressed) }, text);
    b.addEventListener("click", () => {
      if (matchmakerState.picked.has(key)) matchmakerState.picked.delete(key); else matchmakerState.picked.add(key);
      b.setAttribute("aria-pressed", String(matchmakerState.picked.has(key)));
      render();
    });
    return b;
  };
  render();

  /* Visual specimen SVGs for Lesson 4 */
  const cooperSvg = `<svg viewBox="0 0 340 160" class="specimen-svg" xmlns="http://www.w3.org/2000/svg" aria-label="Cooper Black Specimen">
    <rect width="340" height="160" rx="8" fill="#fcf9f2" stroke="#e4ded0" stroke-width="1.2"/>
    <rect x="12" y="10" width="105" height="16" rx="3" fill="#2a2825"/>
    <text x="64.5" y="21" fill="#fcf9f2" font-family="'Figtree',sans-serif" font-size="8" font-weight="700" text-anchor="middle" letter-spacing="0.5">${bi(L, "COOPER BLACK (1922)", "COOPER BLACK (1922)")}</text>
    <text x="170" y="58" fill="#b8553a" font-family="serif" font-size="28" font-weight="900" text-anchor="middle" style="font-family:'Cooper Black','Fraunces',serif; font-weight:900;">Cooper Black</text>
    <g transform="translate(12, 72)">
      <rect width="152" height="74" rx="5" fill="#f4ece1" stroke="#dcd3c3"/>
      <text x="76" y="24" fill="#2a2825" font-family="serif" font-size="12" font-weight="900" text-anchor="middle" style="font-family:'Cooper Black','Fraunces',serif;">BAKERY &amp; CAFE</text>
      <line x1="12" y1="34" x2="140" y2="34" stroke="#dcd3c3"/>
      <text x="76" y="49" fill="#46745c" font-family="'Figtree',sans-serif" font-size="9" font-weight="700" text-anchor="middle">${bi(L, "✓ Intended: Signs & Posters", "✓ Tepat: Papan Nama & Poster")}</text>
      <text x="76" y="63" fill="#7b766c" font-family="'Figtree',sans-serif" font-size="8" text-anchor="middle">${bi(L, "Loud, warm, bold headline", "Lantang, hangat, menonjol")}</text>
    </g>
    <g transform="translate(176, 72)">
      <rect width="152" height="74" rx="5" fill="#f4ece1" stroke="#dcd3c3"/>
      <g fill="#2a2825" opacity="0.85">
        <rect x="14" y="12" width="124" height="4.5" rx="2"/>
        <rect x="14" y="19" width="120" height="4.5" rx="2"/>
        <rect x="14" y="26" width="112" height="4.5" rx="2"/>
      </g>
      <line x1="12" y1="36" x2="140" y2="36" stroke="#dcd3c3"/>
      <text x="76" y="51" fill="#a8483a" font-family="'Figtree',sans-serif" font-size="9" font-weight="700" text-anchor="middle">${bi(L, "✗ Misused: Novel Body Text", "✗ Salah: Teks Isi Buku")}</text>
      <text x="76" y="65" fill="#7b766c" font-family="'Figtree',sans-serif" font-size="8" text-anchor="middle">${bi(L, "Ink bloats; counters clog", "Tinta meluber, mata lelah")}</text>
    </g>
  </svg>`;

  const souvenirSvg = `<svg viewBox="0 0 340 160" class="specimen-svg" xmlns="http://www.w3.org/2000/svg" aria-label="ITC Souvenir Specimen">
    <rect width="340" height="160" rx="8" fill="#fcf9f2" stroke="#e4ded0" stroke-width="1.2"/>
    <rect x="12" y="10" width="100" height="16" rx="3" fill="#2a2825"/>
    <text x="62" y="21" fill="#fcf9f2" font-family="'Figtree',sans-serif" font-size="8" font-weight="700" text-anchor="middle" letter-spacing="0.5">${bi(L, "ITC SOUVENIR (1970)", "ITC SOUVENIR (1970)")}</text>
    <text x="170" y="58" fill="#b8553a" font-family="serif" font-size="26" font-style="italic" font-weight="600" text-anchor="middle" style="font-family:'ITC Souvenir','Cormorant Garamond',serif;">ITC Souvenir</text>
    <g transform="translate(12, 72)">
      <rect width="152" height="74" rx="5" fill="#f4ece1" stroke="#dcd3c3"/>
      <text x="76" y="24" fill="#2a2825" font-family="serif" font-size="11" font-style="italic" text-anchor="middle" style="font-family:'ITC Souvenir','Cormorant Garamond',serif;">First National Bank</text>
      <line x1="12" y1="34" x2="140" y2="34" stroke="#dcd3c3"/>
      <text x="76" y="49" fill="#a8483a" font-family="'Figtree',sans-serif" font-size="9" font-weight="700" text-anchor="middle">${bi(L, "✗ Corporate Bank Vault", "✗ Bank & Brankas Korporat")}</text>
      <text x="76" y="63" fill="#7b766c" font-family="'Figtree',sans-serif" font-size="8" text-anchor="middle">${bi(L, "Too flirty, relaxed & casual", "Terlalu santai & genit")}</text>
    </g>
    <g transform="translate(176, 72)">
      <rect width="152" height="74" rx="5" fill="#f4ece1" stroke="#dcd3c3"/>
      <text x="76" y="24" fill="#2a2825" font-family="serif" font-size="11.5" font-style="italic" text-anchor="middle" style="font-family:'ITC Souvenir','Cormorant Garamond',serif;">70s Folk Records</text>
      <line x1="12" y1="34" x2="140" y2="34" stroke="#dcd3c3"/>
      <text x="76" y="49" fill="#46745c" font-family="'Figtree',sans-serif" font-size="9" font-weight="700" text-anchor="middle">${bi(L, "✓ 70s Nostalgia & Cozy Tales", "✓ Nostalgia 70-an & Kisah Hangat")}</text>
      <text x="76" y="63" fill="#7b766c" font-family="'Figtree',sans-serif" font-size="8" text-anchor="middle">${bi(L, "Warm curves, gentle human touch", "Lengkung ramah, sentuhan manusia")}</text>
    </g>
  </svg>`;

  const moodTitle = bi(L, "THE LAST WITNESS", "SAKSI TERAKHIR");
  const moodCards = [
    {
      font: "Anton",
      name: "Anton (All-caps display)",
      genre: bi(L, "Crime Noir / Gritty Thriller", "Kriminal Noir / Cerita Menegangkan"),
      feel: bi(L, "Heavy, razor-sharp, urgent. The witness is on the run from ruthless assassins.", "Berat, tajam, mendesak. Saksi sedang diburu oleh pembunuh bayaran kejam.")
    },
    {
      font: "Chewy",
      name: "Chewy (Rounded cartoon)",
      genre: bi(L, "Slapstick Comedy / Cartoon", "Komedi Kartun / Petualangan Ceria"),
      feel: bi(L, "Bubbly, bouncy, cheerful. The only witness to the cookie heist is an innocent puppy!", "Bulat, lembut, membal. Satu-satunya saksi pencurian kue adalah anak anjing lucu!")
    },
    {
      font: "Pirata One",
      name: "Pirata One (Gothic blackletter)",
      genre: bi(L, "Supernatural Horror / Dark Fantasy", "Horor Supranatural / Fantasi Gelap"),
      feel: bi(L, "Spiky, ancient, ominous. The witness to an occult curse sealed in a haunted manor.", "Berduri, kuno, mencekam. Saksi kutukan kuno yang terkunci di puri berhantu.")
    }
  ].map((m) => h("div", { class: "mood-card" },
    h("span", { class: "mood-sample", style: `font-family:${stackOf(m.font)}` }, moodTitle),
    h("p", { class: "mood-genre" }, m.genre),
    h("p", { class: "mood-cap" }, h("strong", null, m.name + ": "), m.feel)
  ));

  const matchCovers = [
    makeCoverCard({
      badge: bi(L, "Ornate Art-Deco Fantasy", "Fantasi Art-Deco Ornamen"),
      badgeColor: "#991b1b",
      title: bi(L, "Monstress Vol. 10", "Monstress Vol. 10"),
      coverSrc: "covers/monstress-vol-10.jpg",
      swatches: [
        { hex: "#f5ebd6", label: bi(L, "Inline Gothic Serif", "Serif Gotik Bergaris Dalam") },
        { hex: "#b91c1c", label: bi(L, "Fierce & Arcane", "Garang & Mistis") }
      ],
      text: bi(L,
        "Character: fierce, ancient, arcane. The custom inline serif logo for MONSTRESS blends Art Deco luxury with sharp gothic spikes—matching Maika's eldritch monster bond.",
        "Karakter: garang, kuno, mistis. Logo serif bergaris dalam pada MONSTRESS memadukan kemewahan Art Deco dengan ujung tajam gotik—cocok dengan ikatan monster kuno sang tokoh."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Fractured Psychological Horror", "Horor Psikologis Terbelah"),
      badgeColor: "#be185d",
      title: bi(L, "Tokyo Ghoul Vol. 9", "Tokyo Ghoul Vol. 9"),
      coverSrc: "covers/yellowcover2.jpg",
      swatches: [
        { hex: "#e11d48", label: bi(L, "Bleeding Stencil Serif", "Serif Stensil Berdarah") },
        { hex: "#facc15", label: bi(L, "Unstable & Tragic", "Goyah & Tragis") }
      ],
      text: bi(L,
        "Character: torn between human and monster. The eroded, ink-dripping letters of TOKYO GHOUL visually express a fractured identity and psychological tension.",
        "Karakter: terbelah antara manusia dan monster. Huruf TOKYO GHOUL yang tergerus dan meneteskan tinta secara visual mengekspresikan identitas yang retak dan ketegangan batin."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Explosive Superhero Shonen", "Shonen Pahlawan Super Eksplosif"),
      badgeColor: "#15803d",
      title: bi(L, "My Hero Academia Vol. 1", "My Hero Academia Vol. 1"),
      coverSrc: "covers/yellowcover8.jpg",
      swatches: [
        { hex: "#dc2626", label: bi(L, "3D Extruded Block", "Huruf Balok 3D") },
        { hex: "#facc15", label: bi(L, "Bold & Hopeful", "Tegas & Penuh Harapan") }
      ],
      text: bi(L,
        "Character: young, determined, heroic. The thick 3D block letters bursting upward out of a comic emblem match Deku's dream of becoming the world's greatest hero.",
        "Karakter: muda, gigih, heroik. Huruf balok 3D tebal yang melesat ke atas dari lambang komik sangat cocok dengan impian Deku menjadi pahlawan nomor satu."
      )
    })
  ];

  return h("div", null,
    para(bi(L,
      "A typeface should suit the occasion, like dressing for an event. The slides give three things to check:",
      "Font harus sesuai dengan kesempatannya, seperti memilih pakaian untuk sebuah acara. Slide memberi tiga hal untuk diperiksa:")),
    h("div", { class: "rolegrid" },
      h("div", { class: "rolecard" },
        h("span", { class: "role-name" }, bi(L, "1. Design intent", "1. Tujuan desain")),
        raw(cooperSvg, "specimen-wrap"),
        h("p", null, bi(L, "A typeface designed for signage, like Cooper Black, probably will not work as the body text of a book. Always ask what the font was engineered to do.", "Font yang dirancang untuk papan nama, seperti Cooper Black, kemungkinan tidak cocok untuk teks isi buku. Selalu tanyakan untuk tujuan apa font itu dirancang."))),
      h("div", { class: "rolecard" },
        h("span", { class: "role-name" }, bi(L, "2. Aesthetics", "2. Estetika")),
        raw(souvenirSvg, "specimen-wrap"),
        h("p", null, bi(L, "A bank that sets its logo or ad campaign in Souvenir, a light-hearted, free-spirited font, feels a little too playful. Ask whether the visual voice matches who is speaking.", "Bank yang memakai Souvenir, font yang ringan dan bebas, untuk logo atau iklannya akan terasa terlalu ceria. Tanyakan apakah karakter visualnya cocok dengan siapa yang berbicara."))),
      h("div", { class: "rolecard" },
        h("span", { class: "role-name" }, bi(L, "3. Mood", "3. Suasana")),
        h("p", null, bi(L, "Mood is the typeface's aesthetics, plus the readability you designed, plus the perceived meaning of the words.", "Suasana adalah estetika font, ditambah keterbacaan yang kamu rancang, ditambah makna kata yang dirasakan.")),
        h("p", { class: "cap" }, bi(L, "A comic's mood sets reader expectations before they read page one. See the example below:", "Suasana komik menentukan ekspektasi pembaca sebelum mereka membaca halaman satu. Lihat contoh di bawah:")))),
    h("h3", null, bi(L, "Mood in action: One title, three distinct genres", "Suasana dalam aksi: Satu judul, tiga genre berbeda")),
    para(bi(L,
      "Look at how the exact same title words completely transform their storytelling genre just by switching the typeface:",
      "Perhatikan bagaimana kata judul yang persis sama berubah genrenya hanya dengan mengganti jenis font:")),
    h("div", { class: "mood-grid" }, moodCards),
    callout(bi(L, "The core takeaway", "Pelajaran utama"),
      bi(L,
        "Before the reader has even read page one or understood the story, the typeface's mood has already told them whether to laugh, tense up, or look over their shoulder.",
        "Sebelum pembaca mulai membaca halaman satu atau memahami ceritanya, suasana font sudah memberi tahu mereka apakah harus tertawa, tegang, atau waspada.")),
    h("h3", null, bi(L, "Real comic covers: Matching font to character", "Sampul komik nyata: Mencocokkan font dengan tokoh")),
    para(bi(L,
      "Look at how these three covers translate their main character's personality directly into the shape of the title logo:",
      "Perhatikan bagaimana ketiga sampul ini menerjemahkan kepribadian tokoh utamanya langsung ke dalam bentuk logo judul:")),
    h("div", { class: "color-cover-grid cols-3" }, matchCovers),
    h("h3", null, bi(L, "From character to font in three steps", "Dari karakter ke font dalam tiga langkah")),
    h("ol", { class: "steps" },
      h("li", null, bi(L, "Describe your story or main character in three words.", "Gambarkan ceritamu atau tokoh utamamu dalam tiga kata.")),
      h("li", null, bi(L, "Turn them into character and style words (lesson 2).", "Ubah menjadi kata karakter dan gaya (pelajaran 2).")),
      h("li", null, bi(L, "Test two or three fonts with your real title, then step back and squint.", "Uji dua atau tiga font dengan judul aslimu, lalu mundur dan sipitkan mata."))),
    callout(bi(L, "Example", "Contoh"),
      bi(L, "A shy girl who sees ghosts: delicate, soft, old. That points toward fine, flowing serif or script faces rather than heavy block letters.", "Gadis pemalu yang bisa melihat hantu: halus, lembut, tua. Itu mengarah ke font serif atau skrip yang halus dan mengalir, bukan huruf balok yang berat.")),
    h("h3", null, bi(L, "Try the matchmaker", "Coba pencocok font")),
    titleInput(L, (v) => sampleEls.forEach((s) => (s.textContent = v))),
    h("p", { class: "small-label" }, bi(L, "Character", "Karakter")),
    h("div", { class: "chipset" }, traitKeys.map((k) => chip("p:" + k, TRAITS[k][L].label))),
    h("p", { class: "small-label" }, bi(L, "Style", "Gaya")),
    h("div", { class: "chipset" }, styleKeys.map((k) => chip("s:" + k, STYLES[k][L].label))),
    hint, results,
  );
}

/* ================= Lesson 5 ================= */
function lessonHabits(L) {
  const getCoverParams = () => {
    const ranked = getRankedFonts(matchmakerState.picked);
    const font = matchmakerState.topFont || (ranked.length ? ranked[0].f : fontByName("Anton"));
    const genre = matchmakerState.genre || detectGenre(matchmakerState.picked, font);
    return { title: demoTitle || "MOON HARBOR", font, genre };
  };

  const coverContainer = h("div", { class: "cover-frame" });
  const statusNote = h("div", { class: "cover-sync-box" });
  const t1Note = h("p", null);
  const t2Note = h("p", null);
  const t3Note = h("p", null);

  const updateCover = () => {
    const { title, font, genre } = getCoverParams();
    const gInfo = GENRES[genre] || GENRES.action;
    coverContainer.innerHTML = generateCoverSvg(L, title, font, genre);

    // Update status bar
    const pickedLabels = [];
    matchmakerState.picked.forEach((k) => {
      if (k.startsWith("p:") && TRAITS[k.slice(2)]) pickedLabels.push(TRAITS[k.slice(2)][L].label);
      if (k.startsWith("s:") && STYLES[k.slice(2)]) pickedLabels.push(STYLES[k.slice(2)][L].label);
    });
    const tagSummary = pickedLabels.length
      ? pickedLabels.join(" · ")
      : bi(L, "Default: Strong · Brutalist", "Default: Kuat · Brutalis");

    statusNote.innerHTML = `
      <div class="cover-sync-header">
        <div class="cover-sync-badge">
          <span class="badge-dot"></span>
          <span>${bi(L, "Live Cover Generated from Lesson 4 Matchmaker", "Sampul Interaktif dari Pencocok Font Pelajaran 4")}</span>
        </div>
      </div>
      <div class="cover-sync-details">
        <strong>${escapeXml(title)}</strong>
        <span class="sync-sep">·</span>
        <span class="sync-font" style="font-family:${fontStack(font)}">${font.n}</span>
        <span class="sync-sep">·</span>
        <span class="sync-genre">${gInfo[L]}</span>
      </div>
      <div class="cover-sync-tags"><strong>${bi(L, "Tags applied: ", "Tag aktif: ")}</strong>${escapeXml(tagSummary)}</div>
    `;

    // Dynamic 3-tier cards
    t1Note.textContent = bi(
      L,
      `The illustration is the emotional hook (${gInfo.heroDesc[L]}). The title "${title}" in ${font.n} is the story's brand identity. Notice how the hero's silhouette overlaps slightly in front of the lower title letters, creating exciting 3D depth while keeping at least 80% of the letters clearly legible.`,
      `Ilustrasi adalah penarik emosi (${gInfo.heroDesc[L]}). Judul "${title}" dalam font ${font.n} adalah identitas merek cerita. Perhatikan bagaimana siluet tokoh menumpuk sedikit di depan huruf-huruf judul bagian bawah, menciptakan kedalaman 3D yang seru sambil menjaga huruf tetap terbaca.`
    );
    t2Note.textContent = bi(
      L,
      `A teaser phrase ("${gInfo.tagline[L]}"). Scaled to 25–35% of title size and placed in calm negative space between the title and art without crowding either.`,
      `Kalimat pemikat ("${gInfo.tagline[L]}"). Dibuat berukuran 25–35% dari ukuran judul dan ditaruh di ruang kosong yang tenang antara judul dan gambar tanpa membuatnya sesak.`
    );
    t3Note.textContent = bi(
      L,
      `Issue #1, price (${gInfo.issue.price}) and date (${gInfo.issue.tag}) belong in a compact Corner Box for collector reference. Creator names (${gInfo.byline}) rest in quiet margins. Never place metadata over the hero's face or focal action!`,
      `Nomor edisi (#1), harga (${gInfo.issue.price}), dan tanggal (${gInfo.issue.tag}) disimpan di Kotak Sudut yang rapi untuk rujukan kolektor. Nama kreator (${gInfo.byline}) ditaruh di tepi yang tenang. Jangan pernah menaruh teks di atas wajah atau aksi utama tokoh!`
    );
  };

  // Genre preset buttons so users can also switch themes directly on this page
  const genreButtonsContainer = h("div", { class: "chipset" });
  const genreBtnList = [];
  Object.entries(GENRES).forEach(([gKey, gVal]) => {
    const btn = h("button", {
      type: "button",
      class: "chip-toggle",
      "aria-pressed": String(matchmakerState.genre === gKey),
      onclick: () => {
        matchmakerState.picked.clear();
        gVal.presetTraits.forEach((t) => matchmakerState.picked.add("p:" + t));
        gVal.presetStyles.forEach((s) => matchmakerState.picked.add("s:" + s));
        matchmakerState.topFont = fontByName(gVal.defaultFont);
        matchmakerState.genre = gKey;
        genreBtnList.forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        updateCover();
      }
    }, gVal[L]);
    genreBtnList.push(btn);
    genreButtonsContainer.append(btn);
  });

  updateCover();

  const habitCovers = [
    makeCoverCard({
      badge: bi(L, "3D Depth Overlap & Clean Margins", "Tumpukan 3D & Tepi Rapi"),
      badgeColor: "#0284c7",
      title: bi(L, "Gundala: Son of Lightning #1", "Gundala: Putra Petir #1"),
      coverSrc: "covers/cover_GUNDALA_SON_OF_LIGHTNING_1.jpg",
      swatches: [
        { hex: "#0096d6", label: bi(L, "Tier 1: Sky Masthead", "Tingkat 1: Judul di Langit") },
        { hex: "#f8fafc", label: bi(L, "Tier 3: Quiet Bottom Credits", "Tingkat 3: Kredit di Tepi Bawah") }
      ],
      text: bi(L,
        "Gundala's helmet slightly overlaps the bottom of the GUNDALA logo for 3D depth while keeping the letters 95% legible. Issue #1 and creator names sit quietly in the outer corners.",
        "Helm Gundala menumpuk sedikit di bagian bawah logo GUNDALA untuk efek kedalaman 3D sambil menjaga huruf tetap 95% terbaca. Nomor edisi #1 dan nama kreator ditaruh rapi di sudut luar."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Wing Framing & Left-Aligned Stack", "Bingkai Sayap & Tumpukan Kiri"),
      badgeColor: "#b91c1c",
      title: bi(L, "Absolute Wonder Woman", "Absolute Wonder Woman"),
      coverSrc: "covers/absolute-wonder-woman.jpg",
      swatches: [
        { hex: "#f8fafc", label: bi(L, "Tier 1: Arched Title", "Tingkat 1: Judul Melengkung") },
        { hex: "#cbd5e1", label: bi(L, "Tier 2 & 3: Lower-Left Stack", "Tingkat 2 & 3: Tumpukan Kiri Bawah") }
      ],
      text: bi(L,
        "Pegasus's wings frame a calm sunset sky for the arched Tier 1 title. Tier 2 ('THE LAST AMAZON') and Tier 3 creator credits are tucked neatly into the lower-left cityscape negative space.",
        "Sayap Pegasus membingkai langit senja yang tenang untuk judul Tingkat 1. Tagline Tingkat 2 ('THE LAST AMAZON') dan nama kreator Tingkat 3 disusun rapi di ruang kosong kiri bawah."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Dedicated Header Zone & Corner Box", "Zona Header Khusus & Kotak Sudut"),
      badgeColor: "#ca8a04",
      title: bi(L, "Lost Fantasy #12", "Lost Fantasy #12"),
      coverSrc: "covers/large-1588852.jpg",
      swatches: [
        { hex: "#facc15", label: bi(L, "Top Masthead Banner", "Banner Judul Atas") },
        { hex: "#09090b", label: bi(L, "Left Corner Box (#12 · $4.99)", "Kotak Sudut Kiri (#12 · $4.99)") }
      ],
      text: bi(L,
        "By giving the title its own high-contrast yellow header zone at the top and a classic Image Comics Corner Box on the left, the dragon artwork below stays 100% uncluttered!",
        "Dengan memberi zona header kuning kontras tinggi di bagian atas untuk judul serta Kotak Sudut di sisi kiri, ilustrasi naga di bawahnya tampil 100% bebas gangguan teks!"
      )
    })
  ];

  return h("div", null,
    h("h3", null, bi(L, "Cover Hierarchy with Main Illustration", "Hierarki Sampul dengan Ilustrasi Utama")),
    para(bi(L,
      "In comic cover design, you almost never layout text on an empty canvas: you are orchestrating a relationship with a centerpiece cover illustration. Below is a live interactive cover generated from your Lesson 4 matchmaker choices:",
      "Dalam desain sampul komik, kamu hampir tidak pernah menata teks di kanvas kosong: kamu mengatur hubungan dengan ilustrasi sampul utama. Di bawah ini adalah sampul interaktif langsung yang dihasilkan dari pilihan pencocok font Pelajaran 4:")),
    statusNote,
    h("div", { class: "cover-controls-row" },
      titleInput(L, () => updateCover()),
      h("span", { class: "cover-genre-label" }, bi(L, "Quick Genre Presets:", "Preset Genre Cepat:")),
      genreButtonsContainer
    ),
    h("div", { class: "split cover-layout-split" },
      h("div", null,
        h("div", { class: "tier-card" },
          h("span", { class: "tier-badge t1" }, bi(L, "Tier 1: Illustration & Title Logo", "Tingkat 1: Ilustrasi & Logo Judul")),
          t1Note),
        h("div", { class: "tier-card" },
          h("span", { class: "tier-badge t2" }, bi(L, "Tier 2: Storyline Tagline", "Tingkat 2: Tagline Cerita")),
          t2Note),
        h("div", { class: "tier-card" },
          h("span", { class: "tier-badge t3" }, bi(L, "Tier 3: Issue Number & Creator Byline", "Tingkat 3: Nomor Edisi & Nama Kreator")),
          t3Note)),
      coverContainer),
    h("h3", null, bi(L, "Good habits for comic covers", "Kebiasaan baik sampul komik")),
    bullets([
      bi(L, "The Squint Test: Step back and squint. The illustration and title should be the only two dominant shapes. If an issue number or creator name screams louder, shrink it.", "Uji Sipit: Mundur dan sipitkan mata. Ilustrasi dan judul harus jadi dua bentuk paling dominan. Jika nomor edisi atau nama kreator lebih mencolok, perkecil ukurannya."),
      bi(L, "Respect the Negative Space: Place titles and metadata where the art has clean breathing room (sky, dark shadows, flat wash) or use an outline/drop shadow against busy textures.", "Hormati Ruang Kosong: Tempatkan judul dan teks di bagian gambar yang punya ruang lapang (langit, bayangan gelap) atau gunakan garis tepi/bayangan halus pada latar yang ramai."),
      bi(L, "Avoid anachronisms: A blackletter title on a futuristic mech story, or a space font on a Western, pulls readers right out of the comic.", "Hindari anakronisme: Judul blackletter untuk cerita robot masa depan, atau font sci-fi untuk Western, merusak imersi pembaca."),
      bi(L, "Avoid trite correlations: Look at what others have done. If every comedy uses the exact same goofy font, look for fresher ways to be playful.", "Hindari korelasi klise: Lihat apa yang sudah dilakukan orang lain. Jika semua komik lucu memakai font konyol yang sama, cari cara yang lebih segar."),
      bi(L, "Limit your palette: 1 expressive display font for the title, and 1 clean font family (with regular and bold weights) for all issue numbers, taglines, and creator credits.", "Batasi palet font: 1 font display ekspresif untuk judul, dan 1 keluarga font bersih (dengan variasi normal dan tebal) untuk semua nomor edisi, tagline, dan nama kreator."),
    ]),
    h("h3", null, bi(L, "Hierarchy & negative space on real comic covers", "Hierarki & ruang kosong pada sampul komik nyata")),
    para(bi(L,
      "Observe how these published covers organize Tier 1 (Title & Art), Tier 2 (Subtitle), and Tier 3 (Issue # & Credits) without ever blocking the focal action:",
      "Amati bagaimana sampul komik ini menata Tingkat 1 (Judul & Gambar), Tingkat 2 (Subjudul), dan Tingkat 3 (Nomor Edisi & Kredit) tanpa pernah menutupi aksi utama:")),
    h("div", { class: "color-cover-grid cols-3" }, habitCovers),
  );
}

/* ================= Lesson 6: Color in Comic Covers ================= */
function lessonColor(L) {
  /* ---- 1. Interactive Color Wheel (12 hues) ---- */
  const HUES = [
    { deg: 0, hex: "#e11d48", en: "Red", id: "Merah" },
    { deg: 30, hex: "#ea580c", en: "Red-Orange", id: "Merah-Oranye" },
    { deg: 60, hex: "#f59e0b", en: "Orange", id: "Oranye" },
    { deg: 90, hex: "#eab308", en: "Yellow-Orange", id: "Kuning-Oranye" },
    { deg: 120, hex: "#facc15", en: "Yellow", id: "Kuning" },
    { deg: 150, hex: "#84cc16", en: "Yellow-Green", id: "Kuning-Hijau" },
    { deg: 180, hex: "#16a34a", en: "Green", id: "Hijau" },
    { deg: 210, hex: "#0d9488", en: "Blue-Green (Teal)", id: "Hijau-Biru (Teal)" },
    { deg: 240, hex: "#0284c7", en: "Blue", id: "Biru" },
    { deg: 270, hex: "#4f46e5", en: "Blue-Violet (Indigo)", id: "Biru-Ungu (Indigo)" },
    { deg: 300, hex: "#9333ea", en: "Violet (Purple)", id: "Ungu (Violet)" },
    { deg: 330, hex: "#c026d3", en: "Red-Violet (Magenta)", id: "Merah-Ungu (Magenta)" }
  ];

  const HARMONIES = {
    analogous: {
      name: { en: "Analogous", id: "Analogus" },
      offsets: [-1, 0, 1],
      defaultBaseIdx: 4, // Yellow / Orange / Amber like Shaman King
      desc: {
        en: "Three neighboring hues side-by-side on the wheel. Because they share undertones, they create a smooth, unified atmosphere with zero visual jarring. Great for mood-driven or warm character covers.",
        id: "Tiga warna bertetangga yang berdampingan di roda warna. Karena berbagi nuansa dasar yang sama, ketiganya menciptakan suasana yang menyatu, harmonis, dan nyaman di mata."
      },
      roleTip: {
        en: "Cover tip: Use the lightest neighbor for the background, the middle hue for the character, and the deepest/warmest neighbor for the title logo.",
        id: "Tips sampul: Gunakan warna paling terang untuk latar, warna tengah untuk karakter, dan warna paling pekat/kontras untuk logo judul."
      }
    },
    complementary: {
      name: { en: "Complementary", id: "Komplementer" },
      offsets: [0, 6],
      defaultBaseIdx: 2, // Orange & Teal-Blue like Absolute Batman
      desc: {
        en: "Two hues directly opposite each other (180° apart). Warm vs. cool creates maximum visual contrast and dramatic tension—making the hero and title logo leap off the shelf.",
        id: "Dua warna yang berseberangan langsung (180°). Pertemuan warna hangat vs. dingin menghasilkan kontras visual tertinggi dan ketegangan dramatis—membuat tokoh dan judul langsung mencolok."
      },
      roleTip: {
        en: "Cover tip: Let one color dominate the environment (e.g., fiery orange sky) so its opposite (cool teal-blue armor & title) pops with electric clarity.",
        id: "Tips sampul: Biarkan satu warna mendominasi latar (mis. langit oranye menyala) agar warna lawannya (zirah & judul biru-teal dingin) langsung menonjol."
      }
    },
    split: {
      name: { en: "Split-Complementary", id: "Split-Komplementer" },
      offsets: [0, 5, 7],
      defaultBaseIdx: 7, // Teal-Green + Magenta + Amber-Gold like Black Lagoon / Ultimate Spider-Man
      desc: {
        en: "One base color paired with the two colors flanking its direct opposite (forming a narrow Y-shape). It delivers the high-voltage punch of complementary colors, but with three distinct color roles for background, hero, and title.",
        id: "Satu warna dasar dipadukan dengan dua warna yang mengapit lawan langsungnya (membentuk segitiga Y). Memberikan daya kejut sekuat komplementer, namun dengan tiga peran warna berbeda untuk latar, tokoh, dan judul."
      },
      roleTip: {
        en: "Cover tip: Assign the base hue to the main figure/monster, one split hue to the eerie backdrop, and the brightest split hue to the title masthead!",
        id: "Tips sampul: Berikan warna dasar pada sosok utama, satu warna seberang untuk latar, dan warna seberang paling terang untuk logo judul!"
      }
    }
  };

  let activeHarmony = "analogous";
  let baseIdx = HARMONIES.analogous.defaultBaseIdx;

  const wheelSvgBox = h("div", { class: "wheel-svg-wrap" });
  const wheelSwatches = h("div", { class: "wheel-swatches" });
  const wheelDesc = h("p", { class: "wheel-desc" });
  const wheelTip = h("p", { class: "wheel-tip" });

  const polar = (cx, cy, r, deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const renderWheel = () => {
    const harm = HARMONIES[activeHarmony];
    const activeIndices = harm.offsets.map((off) => (baseIdx + off + 12) % 12);
    const activeSet = new Set(activeIndices);

    const cx = 130, cy = 130, rOuter = 112, rInner = 64, rNode = 88;
    let wedges = "";
    for (let i = 0; i < 12; i++) {
      const startDeg = i * 30 - 13.5;
      const endDeg = i * 30 + 13.5;
      const p1 = polar(cx, cy, rOuter, startDeg);
      const p2 = polar(cx, cy, rOuter, endDeg);
      const p3 = polar(cx, cy, rInner, endDeg);
      const p4 = polar(cx, cy, rInner, startDeg);
      const isSelected = activeSet.has(i);
      const d = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${rOuter} ${rOuter} 0 0 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} L ${p3.x.toFixed(1)} ${p3.y.toFixed(1)} A ${rInner} ${rInner} 0 0 0 ${p4.x.toFixed(1)} ${p4.y.toFixed(1)} Z`;
      wedges += `<path d="${d}" fill="${HUES[i].hex}" opacity="${isSelected ? "1" : "0.26"}" stroke="${isSelected ? "#1e1b18" : "#fcf9f2"}" stroke-width="${isSelected ? "2.6" : "1"}" />`;
    }

    // Draw connecting geometry inside the inner circle
    const pts = activeIndices.map((idx) => polar(cx, cy, rInner - 4, idx * 30));
    let chordSvg = "";
    if (pts.length === 2) {
      chordSvg = `<line x1="${pts[0].x.toFixed(1)}" y1="${pts[0].y.toFixed(1)}" x2="${pts[1].x.toFixed(1)}" y2="${pts[1].y.toFixed(1)}" stroke="#1e1b18" stroke-width="3" stroke-linecap="round"/>`;
    } else if (pts.length === 3) {
      const polyPts = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
      chordSvg = `<polygon points="${polyPts}" fill="rgba(30,27,24,0.08)" stroke="#1e1b18" stroke-width="2.6" stroke-linejoin="round"/>`;
    }

    let nodesSvg = "";
    activeIndices.forEach((idx, rank) => {
      const np = polar(cx, cy, rNode, idx * 30);
      const cp = polar(cx, cy, rInner - 4, idx * 30);
      const isBase = idx === baseIdx;
      nodesSvg += `
        <circle cx="${np.x.toFixed(1)}" cy="${np.y.toFixed(1)}" r="${isBase ? 9 : 7}" fill="${HUES[idx].hex}" stroke="#ffffff" stroke-width="2.5"/>
        <circle cx="${cp.x.toFixed(1)}" cy="${cp.y.toFixed(1)}" r="4.5" fill="#1e1b18"/>
      `;
    });

    wheelSvgBox.innerHTML = `<svg viewBox="0 0 260 260" class="color-wheel-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${harm.name[L]} Color Wheel">
      <circle cx="${cx}" cy="${cy}" r="120" fill="#f5efe4" stroke="#e4ded0" stroke-width="1"/>
      ${wedges}
      <circle cx="${cx}" cy="${cy}" r="${rInner - 2}" fill="#fcf9f2" stroke="#e4ded0" stroke-width="1"/>
      ${chordSvg}
      ${nodesSvg}
      <text x="${cx}" y="${cy + 3}" text-anchor="middle" font-family="'Figtree',sans-serif" font-size="9.5" font-weight="800" fill="#2a2825">${harm.name[L].toUpperCase()}</text>
    </svg>`;

    // Allow clicking directly on any of the 12 color wheel wedges
    const paths = wheelSvgBox.querySelectorAll ? wheelSvgBox.querySelectorAll("path") : [];
    if (paths && paths.forEach) {
      paths.forEach((p, idx) => {
        p.style.cursor = "pointer";
        p.addEventListener("click", () => {
          baseIdx = idx;
          rotSlider.set(baseIdx);
          renderWheel();
        });
      });
    }

    wheelSwatches.innerHTML = "";
    const roleLabels = activeIndices.length === 2
      ? [bi(L, "Base (60% / 30%)", "Dasar (60% / 30%)"), bi(L, "Opposite Contrast (10%)", "Kontras Seberang (10%)")]
      : [bi(L, "Neighbor / Split 1", "Warna 1"), bi(L, "Base Hue", "Warna Dasar"), bi(L, "Neighbor / Split 2", "Warna 3")];

    activeIndices.forEach((idx, i) => {
      const hue = HUES[idx];
      wheelSwatches.append(
        h("div", { class: "wheel-swatch-pill" },
          h("span", { class: "swatch-dot", style: `background:${hue.hex}` }),
          h("div", { class: "swatch-meta" },
            h("strong", null, hue[L]),
            h("span", null, roleLabels[i] || "")
          )
        )
      );
    });

    wheelDesc.textContent = harm.desc[L];
    wheelTip.textContent = harm.roleTip[L];

    if (harmonyCardEls.length) {
      const keys = Object.keys(HARMONIES);
      harmonyCardEls.forEach((cardEl, idx) => {
        if (keys[idx] === activeHarmony) cardEl.classList.add("active-harmony-card");
        else cardEl.classList.remove("active-harmony-card");
      });
    }
  };

  const harmonyBtns = h("div", { class: "chipset" });
  const harmonyBtnList = [];
  const harmonyCardEls = [];
  const rotSlider = slider(
    bi(L, "Rotate base color around the wheel", "Putar warna dasar mengelilingi roda warna"),
    0, 11, 1, baseIdx,
    (v) => { baseIdx = v; renderWheel(); },
    (v) => HUES[v][L]
  );

  const selectHarmony = (k) => {
    const val = HARMONIES[k];
    if (!val) return;
    activeHarmony = k;
    baseIdx = val.defaultBaseIdx;
    rotSlider.set(baseIdx);
    harmonyBtnList.forEach(({ key, btn }) => {
      btn.setAttribute("aria-pressed", String(key === k));
    });
    renderWheel();
  };

  Object.entries(HARMONIES).forEach(([k, val]) => {
    const btn = h("button", {
      type: "button",
      class: "chip-toggle",
      "aria-pressed": String(k === activeHarmony),
      onclick: () => selectHarmony(k)
    }, val.name[L]);
    harmonyBtnList.push({ key: k, btn });
    harmonyBtns.append(btn);
  });

  /* ---- Aspect 1 Cards: Color Wheel Harmonies on Real Covers ---- */
  const harmonyCards = [
    {
      key: "analogous",
      card: makeCoverCard({
        badge: bi(L, "Analogous Harmony", "Harmoni Analogus"),
        badgeColor: "#d97706",
        title: bi(L, "Shaman King Vol. 16", "Shaman King Vol. 16"),
        coverSrc: "covers/yellowcover9.jpg",
        swatches: [
          { hex: "#f5b81c", label: bi(L, "Golden Yellow", "Kuning Emas") },
          { hex: "#f59331", label: bi(L, "Warm Orange", "Oranye Hangat") },
          { hex: "#5a3219", label: bi(L, "Amber Brown", "Cokelat Amber") }
        ],
        text: bi(L,
          "Yellow, orange, and warm amber-brown sit right next to each other on the warm side of the wheel. The entire cover glows with solar warmth and spiritual unity without a single harsh clash.",
          "Kuning, oranye, dan cokelat-amber berada berdampingan di sisi hangat roda warna. Seluruh sampul memancarkan kehangatan matahari dan kesatuan suasana tanpa tabrakan warna yang keras."
        ),
        note: bi(L, "Result: Warm, cohesive, and inviting.", "Hasil: Hangat, menyatu, dan ramah di mata.")
      })
    },
    {
      key: "complementary",
      card: makeCoverCard({
        badge: bi(L, "Complementary Harmony", "Harmoni Komplementer"),
        badgeColor: "#0284c7",
        title: bi(L, "Absolute Batman", "Absolute Batman"),
        coverSrc: "covers/absolute-batman.jpg",
        swatches: [
          { hex: "#df7a32", label: bi(L, "Blazing Orange", "Oranye Menyala") },
          { hex: "#5b808c", label: bi(L, "Slate Teal-Blue", "Biru-Teal Baja") },
          { hex: "#18181b", label: bi(L, "Deep Shadow", "Hitam Bayangan") }
        ],
        text: bi(L,
          "Directly opposite hues on the color wheel: a fiery orange sky behind cool slate-teal armor and matching teal title lettering. Because warm orange advances and cool blue-teal recedes, the hero and logo cut through the chaos.",
          "Warna yang berseberangan langsung di roda warna: langit oranye membara di belakang zirah biru-teal dingin serta huruf judul berwarna senada. Kontras panas-dingin ini membuat sosok pahlawan dan logo langsung melompat keluar."
        ),
        note: bi(L, "Result: Maximum contrast, explosive action, instant shelf impact.", "Hasil: Kontras maksimal, aksi eksplosif, langsung mencolok di rak.")
      })
    },
    {
      key: "split",
      card: makeCoverCard({
        badge: bi(L, "Split-Complementary", "Split-Komplementer"),
        badgeColor: "#0f766e",
        title: bi(L, "Creature from the Black Lagoon Lives!", "Creature from the Black Lagoon Lives!"),
        coverSrc: "covers/universal-monsters-creature-from-the-black-lagoon-lives-hc-vol-1-CVRA.jpg",
        swatches: [
          { hex: "#2c5e5a", label: bi(L, "Lagoon Teal-Green", "Hijau-Teal Rawa") },
          { hex: "#e0537c", label: bi(L, "Magenta-Pink", "Merah Muda-Magenta") },
          { hex: "#f59e0b", label: bi(L, "Amber-Yellow Title", "Kuning-Amber Judul") }
        ],
        text: bi(L,
          "Instead of pairing teal-green with pure red, the cover splits the opposite side into eerie magenta-pink (sky) and glowing amber-yellow (the title logo and creature's eyes). You get pulp tension plus clear separation between art and typography.",
          "Alih-alih memasangkan hijau-teal dengan merah murni, sampul ini memecah warna seberangnya menjadi magenta-pink (langit) dan kuning-amber menyala (logo judul & mata monster). Ketegangan pulp terasa kuat sekaligus memisahkan gambar dan tipografi dengan jelas."
        ),
        note: bi(L, "Result: Dynamic triad of monster, sky, and glowing title.", "Hasil: Tiga fokus warna dinamis antara monster, langit, dan judul.")
      })
    }
  ].map(({ key, card }) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => selectHarmony(key));
    harmonyCardEls.push(card);
    return card;
  });

  renderWheel();

  /* ---- Aspect 2 Cards: Color Expression (Emotional & Psychological Feel) ---- */
  const expressionCards = [
    makeCoverCard({
      badge: bi(L, "Red: Bravery, Fury & Passion", "Merah: Keberanian, Amarah & Gairah"),
      badgeColor: "#b91c1c",
      title: bi(L, "Monstress Vol. 10", "Monstress Vol. 10"),
      coverSrc: "covers/monstress-vol-10.jpg",
      swatches: [
        { hex: "#b91c1c", label: bi(L, "Crimson Fury", "Merah Crimson") },
        { hex: "#dc2626", label: bi(L, "Scarlet Pulse", "Merah Darah") },
        { hex: "#f5ebd6", label: bi(L, "Bone Gold", "Krem Emas") }
      ],
      text: bi(L,
        "Red is the most visceral color—it raises the reader's heartbeat. Flooding the backdrop with crimson expresses Maika's fearless bravery, fierce determination, and life-or-death danger before you read a single word.",
        "Merah adalah warna paling emosional dan memacu detak jantung. Membanjiri latar dengan merah tua mengekspresikan keberanian tak kenal takut, determinasi sengit, dan bahaya hidup-mati bahkan sebelum satu kata pun dibaca."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Blue: Sadness, Melancholy & Solitude", "Biru: Kesedihan, Melankoli & Kesepian"),
      badgeColor: "#1d4ed8",
      title: bi(L, "Lore Olympus Vol. 8", "Lore Olympus Vol. 8"),
      coverSrc: "covers/md_97cfcc3a34ab-lore-olypmus.jpg",
      swatches: [
        { hex: "#172554", label: bi(L, "Midnight Indigo", "Indigo Malam") },
        { hex: "#0284c7", label: bi(L, "Tearful Cyan", "Biru Hujan") },
        { hex: "#f472b6", label: bi(L, "Fragile Rose", "Merah Muda Pucat") }
      ],
      text: bi(L,
        "Blue lowers the temperature and turns emotion inward. Drenching the cover in deep indigo rain and cool cyan tones expresses sorrow, longing, emotional distance, and quiet heartbreak.",
        "Biru menurunkan suhu visual dan membawa emosi ke dalam batin. Merendam sampul dalam hujan indigo pekat dan biru dingin mengekspresikan kesedihan, kerinduan, jarak emosional, dan patah hati yang sunyi."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Yellow: Optimism, Youth & Heroic Energy", "Kuning: Optimisme, Energi & Semangat"),
      badgeColor: "#ca8a04",
      title: bi(L, "My Hero Academia Vol. 1", "My Hero Academia Vol. 1"),
      coverSrc: "covers/yellowcover8.jpg",
      swatches: [
        { hex: "#facc15", label: bi(L, "Canary Yellow", "Kuning Kenari") },
        { hex: "#15803d", label: bi(L, "Hero Green", "Hijau Pahlawan") },
        { hex: "#dc2626", label: bi(L, "Action Red", "Merah Aksi") }
      ],
      text: bi(L,
        "Yellow is the brightest, most outward-radiating hue in the spectrum. A bold canary-yellow cover radiates youthful optimism, explosive enthusiasm, and hopeful shonen courage.",
        "Kuning adalah warna paling terang dan memancar keluar dalam spektrum. Latar kuning kenari yang tegas memancarkan optimisme masa muda, antusiasme meledak-ledak, dan semangat kepahlawanan yang penuh harapan."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Green: Eerie Mystery & Uncanny Dread", "Hijau: Misteri Ganjil & Kengerian"),
      badgeColor: "#15803d",
      title: bi(L, "Dissolving Classroom (Junji Ito)", "Dissolving Classroom (Junji Ito)"),
      coverSrc: "covers/itodissolving.jpg",
      swatches: [
        { hex: "#14532d", label: bi(L, "Chalkboard Green", "Hijau Papan Tulis") },
        { hex: "#65a30d", label: bi(L, "Toxic Moss", "Hijau Asam") },
        { hex: "#be185d", label: bi(L, "Uncanny Magenta", "Magenta Ganjil") }
      ],
      text: bi(L,
        "While natural greens feel peaceful, sickly or shadowy greens express toxicity, mutation, and supernatural unease. Here, dark chalkboard green twists an everyday schoolroom into psychological horror.",
        "Jika hijau alami terasa damai, hijau pucat atau kelam justru mengekspresikan racun, mutasi, dan kegelisahan supranatural. Di sini, hijau papan tulis yang kelam mengubah ruang kelas biasa menjadi horor psikologis."
      )
    })
  ];

  /* ---- Aspect 3 Cards: Color Symbolism (Cultural & Narrative Meaning) ---- */
  const symbolismCards = [
    makeCoverCard({
      badge: bi(L, "White: Peace, Purity & Blank Canvas", "Putih: Kedamaian, Kemurnian & Kanvas Baru"),
      badgeColor: "#475569",
      title: bi(L, "Blue Period Vol. 2", "Blue Period Vol. 2"),
      coverSrc: "covers/blue-period-vol-2.png",
      swatches: [
        { hex: "#ffffff", label: bi(L, "Pure White", "Putih Murni") },
        { hex: "#bae6fd", label: bi(L, "Clear Sky Blue", "Biru Langit Cerah") },
        { hex: "#1e293b", label: bi(L, "Charcoal Ink", "Tinta Arang") }
      ],
      text: bi(L,
        "Symbolically, white stands for peace, honesty, purity, and an unwritten beginning. Surrounding the character with stark white space symbolizes a raw artistic canvas and quiet emotional clarity.",
        "Secara simbolis, putih melambangkan kedamaian, kejujuran, kemurnian, dan awal yang baru. Mengelilingi tokoh dengan ruang putih bersih melambangkan kanvas seni yang murni dan kejernihan batin yang tenang."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Black: Death, Evil & Obsession", "Hitam: Kematian, Kegelapan & Obsesi"),
      badgeColor: "#18181b",
      title: bi(L, "Detective Comics #880", "Detective Comics #880"),
      coverSrc: "covers/md_ce5bd970b088-detective.jpg",
      swatches: [
        { hex: "#09090b", label: bi(L, "Abyssal Black", "Hitam Pekat") },
        { hex: "#f8fafc", label: bi(L, "Stark Bone White", "Putih Tulang") },
        { hex: "#e04f33", label: bi(L, "Blood Orange", "Oranye Darah") }
      ],
      text: bi(L,
        "Black is the classic symbol of death, mortality, shadow, and madness. Artist Jock uses swarming black bats to form the Joker's hollow skull-like eyes and hair—making darkness literally consume his mind.",
        "Hitam adalah simbol klasik kematian, kefanaan, bayangan, dan kegilaan. Ilustrator Jock menyusun kawanan kelelawar hitam pekat untuk membentuk rongga mata tengkorak dan rambut Joker—membuat kegelapan seolah menelan pikirannya."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Purple & Gold: Royalty, Power & Sovereignty", "Ungu & Emas: Kebangsawanan & Kekuasaan"),
      badgeColor: "#7e22ce",
      title: bi(L, "Wolverine: The Complete Collection", "Wolverine: The Complete Collection"),
      coverSrc: "covers/md_ba4e8a61e05a-wolverine.jpg",
      swatches: [
        { hex: "#6b21a8", label: bi(L, "Imperial Purple", "Ungu Kerajaan") },
        { hex: "#eab308", label: bi(L, "Sovereign Gold", "Emas Berdaulat") },
        { hex: "#991b1b", label: bi(L, "Regal Crimson", "Merah Jubah") }
      ],
      text: bi(L,
        "Across history, purple dye and gold belonged to emperors and deities. Magneto's sweeping purple-and-crimson robes visually crown him as an untouchable monarch looming over Wolverine's golden suit.",
        "Sepanjang sejarah, warna ungu dan emas identik dengan kaisar dan dewa. Jubah ungu-merah Magneto yang menjulang secara visual memahkotainya sebagai penguasa mutlak di atas sosok Wolverine."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Red, White & Blue: Patriotism & Subversion", "Merah, Putih & Biru: Patriotisme & Subversi"),
      badgeColor: "#1e3a8a",
      title: bi(L, "Carnage U.S.A.", "Carnage U.S.A."),
      coverSrc: "covers/md_911447dc1372-carnage.jpg",
      swatches: [
        { hex: "#b91c1c", label: bi(L, "Flag Red", "Merah Bendera") },
        { hex: "#f8fafc", label: bi(L, "Peace White", "Putih Bersih") },
        { hex: "#1e3a8a", label: bi(L, "Patriot Navy", "Biru Dongker") }
      ],
      text: bi(L,
        "Cultural color symbols are so recognizable that comic artists can subvert them for instant irony. Wrapping a deadly symbiote in patriotic red, white, and blue turns national symbolism into a chilling warning.",
        "Simbol warna budaya begitu kuat sehingga desainer komik dapat membalikkannya untuk ironi instan. Membungkus monster mematikan dalam warna patriotik merah, putih, dan biru mengubah simbol negara menjadi teror yang mencekam."
      )
    })
  ];

  /* ---- Aspect 4: Interactive 60:30:10 Proportion Lab + Real Cover Breakdowns ---- */
  const RATIO_MODES = {
    balanced: {
      label: { en: "✓ Balanced 60 : 30 : 10 (Ideal)", id: "✓ Seimbang 60 : 30 : 10 (Ideal)" },
      weights: [60, 30, 10],
      bg: "#facc15", // 60% Golden Yellow
      fig: "#133a5e", // 30% Deep Indigo
      acc: "#d62828", // 10% Crimson Red
      verdict: {
        en: "60% warm yellow atmosphere gives breathing room, 30% deep indigo anchors the samurai's silhouette, and the 10% crimson accent makes the TITLE LOGO and sword hilt the undeniable focal point!",
        id: "60% latar kuning hangat memberi ruang bernapas, 30% biru indigo mengunci siluet samurai, dan 10% aksen merah tua membuat LOGO JUDUL menjadi pusat perhatian yang tak terbantahkan!"
      }
    },
    equal: {
      label: { en: "✗ Equal 34 : 33 : 33 (Noisy)", id: "✗ Rata 34 : 33 : 33 (Bising)" },
      weights: [34, 33, 33],
      bg: "#d62828",
      fig: "#facc15",
      acc: "#133a5e",
      verdict: {
        en: "When all three colors fight for equal 33% space, nothing feels special. The background screams as loudly as the character and the title logo gets lost in the visual noise.",
        id: "Ketika ketiga warna berebut porsi 33% yang sama besar, tidak ada yang terasa spesial. Latar berteriak sama kerasnya dengan karakter, dan logo judul tenggelam dalam kebisingan visual."
      }
    },
    inverted: {
      label: { en: "✗ Inverted 10 : 30 : 60 (Overwhelmed)", id: "✗ Terbalik 10 : 30 : 60 (Berlebihan)" },
      weights: [10, 30, 60],
      bg: "#d62828",
      fig: "#133a5e",
      acc: "#facc15",
      verdict: {
        en: "If your high-intensity accent color swallows 60% of the cover, it stops being an accent! The eye is fatigued by all-over red and no longer knows where to look first.",
        id: "Jika warna aksen yang tajam menelan 60% area sampul, ia berhenti menjadi aksen! Mata pembaca cepat lelah oleh warna merah yang mendominasi dan bingung harus melihat ke mana lebih dulu."
      }
    }
  };

  let activeRatio = "balanced";
  const ratioBarEl = h("div", { class: "ratio-live-bar" });
  const ratioSvgEl = h("div", { class: "ratio-mockup-wrap" });
  const ratioVerdictEl = h("p", { class: "ratio-verdict" });
  const ratioBtns = h("div", { class: "chipset" });
  const ratioBtnList = [];

  const renderRatioLab = () => {
    const m = RATIO_MODES[activeRatio];
    const isBalanced = activeRatio === "balanced";
    const isEqual = activeRatio === "equal";

    ratioBarEl.innerHTML = `
      <div class="ratio-seg" style="width:${m.weights[0]}%;background:#facc15;color:#1e1b18">
        <strong>${m.weights[0]}%</strong> <span>${bi(L, "Dominant (Yellow)", "Dominan (Kuning)")}</span>
      </div>
      <div class="ratio-seg" style="width:${m.weights[1]}%;background:#133a5e;color:#fff">
        <strong>${m.weights[1]}%</strong> <span>${bi(L, "Secondary (Indigo)", "Sekunder (Indigo)")}</span>
      </div>
      <div class="ratio-seg" style="width:${m.weights[2]}%;background:#d62828;color:#fff">
        <strong>${m.weights[2]}%</strong> <span>${bi(L, "Accent (Crimson)", "Aksen (Merah)")}</span>
      </div>
    `;

    // Mini SVG cover demonstrating how the proportion feels
    const skyFill = isBalanced ? "#facc15" : isEqual ? "#facc15" : "#d62828";
    const burstFill = isEqual ? "#d62828" : isBalanced ? "#fef08a" : "#b91c1c";
    const cloakFill = "#133a5e";
    const titleFill = isBalanced ? "#d62828" : "#facc15";
    const badgeText = isBalanced
      ? bi(L, "10% ACCENT POP!", "10% AKSEN MENONJOL!")
      : bi(L, "EYE IS OVERWHELMED", "MATA BINGUNG");

    ratioSvgEl.innerHTML = `<svg viewBox="0 0 220 290" class="ratio-mockup-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="290" rx="8" fill="${skyFill}"/>
      ${isEqual ? `<polygon points="0,0 220,0 220,145 0,210" fill="#d62828"/>` : ""}
      ${!isBalanced && !isEqual ? `<rect x="14" y="14" width="192" height="42" rx="4" fill="#facc15" opacity="0.22"/>` : ""}
      <circle cx="110" cy="165" r="68" fill="${burstFill}" opacity="${isBalanced ? "0.45" : "0.75"}"/>
      <!-- Samurai silhouette (30% Secondary Indigo) -->
      <path d="M45,290 L72,158 L110,142 L148,158 L175,290 Z" fill="${cloakFill}" stroke="#0f172a" stroke-width="2"/>
      <circle cx="110" cy="118" r="24" fill="${cloakFill}"/>
      <!-- Katana slash -->
      <line x1="34" y1="220" x2="192" y2="96" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
      <!-- 10% Accent Title & Maple Leaves -->
      <rect x="16" y="18" width="188" height="44" rx="5" fill="${titleFill}" stroke="#ffffff" stroke-width="2"/>
      <text x="110" y="47" text-anchor="middle" font-family="'Anton',sans-serif" font-size="24" fill="#ffffff" letter-spacing="1.5">${escapeXml((demoTitle || "KENSHIN").slice(0, 12).toUpperCase())}</text>
      <circle cx="48" cy="86" r="6" fill="#d62828"/>
      <circle cx="176" cy="188" r="7" fill="#d62828"/>
      <circle cx="64" cy="236" r="5" fill="#d62828"/>
      <rect x="35" y="254" width="150" height="22" rx="11" fill="#0f172a" opacity="0.88"/>
      <text x="110" y="269" text-anchor="middle" font-family="'Figtree',sans-serif" font-size="9" font-weight="800" fill="#ffffff" letter-spacing="0.6">${badgeText}</text>
    </svg>`;

    ratioVerdictEl.textContent = m.verdict[L];
  };

  Object.entries(RATIO_MODES).forEach(([k, val]) => {
    const btn = h("button", {
      type: "button",
      class: "chip-toggle",
      "aria-pressed": String(k === activeRatio),
      onclick: () => {
        activeRatio = k;
        ratioBtnList.forEach(({ key, b }) => b.setAttribute("aria-pressed", String(key === k)));
        renderRatioLab();
      }
    }, val.label[L]);
    ratioBtnList.push({ key: k, b: btn });
    ratioBtns.append(btn);
  });

  renderRatioLab();

  /* Real Cover 60:30:10 Breakdowns */
  const makeRatioCard = ({ title, coverSrc, c60, c30, c10 }) => {
    return h("div", { class: "ratio-cover-card" },
      h("div", { class: "color-cover-img-wrap" },
        h("img", { src: coverSrc, alt: title, class: "color-cover-img", loading: "lazy" })
      ),
      h("div", { class: "ratio-cover-body" },
        h("h4", { class: "color-card-title" }, title),
        h("div", { class: "mini-ratio-bar" },
          h("span", { style: `width:60%;background:${c60.hex};color:${c60.ink || "#fff"}` }, "60%"),
          h("span", { style: `width:30%;background:${c30.hex};color:${c30.ink || "#fff"}` }, "30%"),
          h("span", { style: `width:10%;background:${c10.hex};color:${c10.ink || "#fff"}` }, "10%")
        ),
        h("ul", { class: "ratio-list" },
          h("li", null,
            h("span", { class: "ratio-dot", style: `background:${c60.hex}` }),
            h("div", null, h("strong", null, "60% " + c60.role + ": "), c60.desc)
          ),
          h("li", null,
            h("span", { class: "ratio-dot", style: `background:${c30.hex}` }),
            h("div", null, h("strong", null, "30% " + c30.role + ": "), c30.desc)
          ),
          h("li", null,
            h("span", { class: "ratio-dot", style: `background:${c10.hex}` }),
            h("div", null, h("strong", null, "10% " + c10.role + ": "), c10.desc)
          )
        )
      )
    );
  };

  const ratioBreakdowns = [
    makeRatioCard({
      title: bi(L, "Rurouni Kenshin Vol. 1", "Rurouni Kenshin Vol. 1"),
      coverSrc: "covers/yellowcover3.jpg",
      c60: {
        hex: "#facc15", ink: "#1e1b18",
        role: bi(L, "Dominant (Golden Yellow)", "Dominan (Kuning Emas)"),
        desc: bi(L, "Warm yellow backdrop sets an energetic atmosphere and gives open breathing room.", "Latar kuning hangat membangun atmosfer berenergi dan ruang kosong yang lega.")
      },
      c30: {
        hex: "#133a5e", ink: "#ffffff",
        role: bi(L, "Secondary (Indigo & White)", "Sekunder (Indigo & Putih)"),
        desc: bi(L, "Deep indigo kimono and white hakama anchor the swordsman's calm figure in the center.", "Pakaian biru indigo tua dan hakama putih mengunci siluet tenang sang samurai di tengah.")
      },
      c10: {
        hex: "#d62828", ink: "#ffffff",
        role: bi(L, "Accent (Crimson Red)", "Aksen (Merah Tua)"),
        desc: bi(L, "Saved strictly for the Title Logo and falling autumn leaves—pulling your eye straight to the masthead!", "Disimpan khusus untuk Logo Judul dan guguran daun musim gugur—menarik mata langsung ke judul!")
      }
    }),
    makeRatioCard({
      title: bi(L, "Gundala: Son of Lightning #1", "Gundala: Putra Petir #1"),
      coverSrc: "covers/cover_GUNDALA_SON_OF_LIGHTNING_1.jpg",
      c60: {
        hex: "#333d5c", ink: "#ffffff",
        role: bi(L, "Dominant (Stormy Slate-Indigo)", "Dominan (Abu-Indigo Badai)"),
        desc: bi(L, "Overcast storm clouds and rainy rooftops establish a gritty, cinematic mood.", "Awan badai mendung dan atap kota yang basah membangun suasana sinematik yang kelam.")
      },
      c30: {
        hex: "#141824", ink: "#ffffff",
        role: bi(L, "Secondary (Charcoal Suit)", "Sekunder (Hitam Arang)"),
        desc: bi(L, "Dark tactical armor carves out the hero's grounded silhouette against the sky.", "Kostum taktis gelap membentuk siluet kokoh sang pahlawan di depan langit.")
      },
      c10: {
        hex: "#0096d6", ink: "#ffffff",
        role: bi(L, "Accent (Electric Cyan & Red)", "Aksen (Biru Petir & Merah)"),
        desc: bi(L, "Glowing cyan on the GUNDALA title logo, lightning bolts, and red gloves electrify the focal points.", "Cahaya sian elektrik pada logo judul GUNDALA, sambaran petir, dan sarung tangan merah menghidupkan titik fokus.")
      }
    }),
    makeRatioCard({
      title: bi(L, "Detective Comics #880", "Detective Comics #880"),
      coverSrc: "covers/md_ce5bd970b088-detective.jpg",
      c60: {
        hex: "#f1f5f9", ink: "#1e1b18",
        role: bi(L, "Dominant (Stark White Space)", "Dominan (Ruang Putih Bersih)"),
        desc: bi(L, "Expansive white negative space isolates the subject and creates chilling tension.", "Ruang kosong putih yang luas mengisolasi subjek dan menciptakan ketegangan dingin.")
      },
      c30: {
        hex: "#18181b", ink: "#ffffff",
        role: bi(L, "Secondary (Pitch Black Ink)", "Sekunder (Tinta Hitam Pekat)"),
        desc: bi(L, "Swarming black bats construct the Joker's hair, brow, and shadow silhouette.", "Kawanan kelelawar hitam membentuk rambut, alis, dan siluet bayangan Joker.")
      },
      c10: {
        hex: "#e04f33", ink: "#ffffff",
        role: bi(L, "Accent (Blood-Orange Red)", "Aksen (Merah-Oranye Darah)"),
        desc: bi(L, "Used only on the Title Logo, bat-eyes, and sinister grin—locking the viewer's gaze instantly.", "Dipakai hanya pada Logo Judul, mata kelelawar, dan seringai merah—mengunci tatapan pembaca seketika.")
      }
    })
  ];

  return h("div", null,
    para(bi(L,
      "Just like typefaces, colors speak before the reader reads a single word. On a comic book cover, color does four essential jobs: it builds harmony through the Color Wheel, expresses raw emotion, carries cultural symbolism, and directs the eye using the 60:30:10 proportion rule.",
      "Sama seperti jenis huruf, warna berbicara bahkan sebelum pembaca membaca satu kata pun. Pada sampul komik, warna melakukan empat tugas utama: membangun harmoni lewat Roda Warna, mengekspresikan emosi, membawa simbolisme budaya, dan mengarahkan mata lewat prinsip proporsi 60:30:10.")),

    /* ---- SECTION 1: COLOR WHEEL ---- */
    h("h3", null, bi(L, "1. The Color Wheel: Analogous, Complementary & Split-Complementary", "1. Roda Warna: Analogus, Komplementer & Split-Komplementer")),
    para(bi(L,
      "Comic cover artists rarely pick colors at random. They use geometric relationships on the 12-hue color wheel to control whether a cover feels peaceful and unified or explosive and high-contrast. Try switching harmonies and rotating the wheel below:",
      "Ilustrator dan desainer sampul komik jarang memilih warna secara acak. Mereka menggunakan hubungan geometris pada roda 12 warna untuk mengatur apakah sampul terasa tenang dan menyatu atau eksplosif dan penuh kontras. Coba ganti mode harmoni dan putar roda warna di bawah ini:")),

    h("div", { class: "demo demo-split color-wheel-demo" },
      h("div", { class: "demo-stage wheel-stage" }, wheelSvgBox),
      h("div", { class: "demo-ctrls wheel-ctrls" },
        h("span", { class: "small-label" }, bi(L, "Select Color Harmony:", "Pilih Harmoni Warna:")),
        harmonyBtns,
        rotSlider.row,
        wheelSwatches,
        wheelDesc,
        wheelTip
      )
    ),

    h("div", { class: "color-cover-grid cols-3" }, harmonyCards),

    /* ---- SECTION 2: COLOR EXPRESSION ---- */
    h("h3", null, bi(L, "2. Color Expression: How Colors Feel Emotionally", "2. Ekspresi Warna: Bagaimana Warna Menyampaikan Emosi")),
    para(bi(L,
      "Color expression is our instinctive, psychological response to a hue. Warm colors (red, orange, yellow) advance toward the viewer and feel active, brave, or intense; cool colors (blue, indigo, eerie green) recede and feel melancholic, solitary, or mysterious.",
      "Ekspresi warna adalah respons psikologis dan naluriah kita terhadap suatu rona warna. Warna hangat (merah, oranye, kuning) terasa maju mendekati pembaca dan memancarkan keberanian, aksi, atau intensitas; warna dingin (biru, indigo, hijau kelam) terasa mundur dan memancarkan kesedihan, kesunyian, atau misteri.")),

    h("div", { class: "color-cover-grid cols-2" }, expressionCards),

    /* ---- SECTION 3: COLOR SYMBOLISM ---- */
    h("h3", null, bi(L, "3. Color Symbolism: Cultural & Narrative Meaning", "3. Simbolisme Warna: Makna Budaya & Cerita")),
    para(bi(L,
      "While color expression is about visceral feeling, color symbolism is about learned cultural meaning—how colors act as visual shorthand for concepts like peace, death, royalty, or national identity:",
      "Jika ekspresi warna berkaitan dengan perasaan emosional, simbolisme warna berkaitan dengan makna budaya yang kita pelajari—bagaimana warna menjadi kode visual instan untuk konsep seperti kedamaian, kematian, kekuasaan bangsawan, atau identitas:")),

    h("div", { class: "color-cover-grid cols-2" }, symbolismCards),

    callout(
      bi(L, "Expression vs. Symbolism: What's the difference?", "Ekspresi vs. Simbolisme: Apa bedanya?"),
      bi(L,
        "Color Expression is what your gut feels immediately (Red feels hot, urgent, brave; Blue feels sad, cold, quiet). Color Symbolism is the conceptual message your mind decodes (White represents peace or a blank canvas; Black represents death; Purple & Gold represent royalty).",
        "Ekspresi Warna adalah apa yang langsung dirasakan nalurimu (Merah terasa panas, mendesak, berani; Biru terasa sedih, dingin, sunyi). Simbolisme Warna adalah pesan konseptual yang dibaca pikiranmu (Putih melambangkan kedamaian atau kanvas baru; Hitam melambangkan kematian; Ungu & Emas melambangkan bangsawan/kekuasaan)."
      )
    ),

    /* ---- SECTION 4: 60:30:10 PRINCIPLE ---- */
    h("h3", null, bi(L, "4. The 60:30:10 Principle of Color Balance", "4. Prinsip Proporsi Warna 60:30:10")),
    para(bi(L,
      "Even a great color palette falls apart if every color shouts at the same volume. Professional cover designers balance their colors using the 60:30:10 rule so the reader's eye knows exactly where to look first:",
      "Palet warna terbaik sekalipun akan berantakan jika semua warna berteriak dengan volume yang sama. Desainer sampul profesional menyeimbangkan warna menggunakan aturan 60:30:10 agar mata pembaca tahu persis harus melihat ke mana lebih dulu:")),

    h("div", { class: "rolegrid ratio-rolegrid" },
      h("div", { class: "rolecard ratio-rolecard r60" },
        h("span", { class: "role-name" }, bi(L, "60% Dominant Color", "60% Warna Dominan")),
        h("p", null, bi(L, "Sets the overall atmosphere and mood (usually the sky, backdrop, or negative space). It gives the viewer's eye a calm place to rest.", "Menentukan atmosfer dan suasana utama (biasanya langit, latar belakang, atau ruang kosong). Memberi tempat istirahat bagi mata pembaca."))),
      h("div", { class: "rolecard ratio-rolecard r30" },
        h("span", { class: "role-name" }, bi(L, "30% Secondary Color", "30% Warna Sekunder")),
        h("p", null, bi(L, "Supports the dominant color and defines the main character's costume, silhouette, or mid-ground architecture.", "Mendukung warna dominan dan membentuk siluet kostum tokoh utama atau elemen tengah sampul."))),
      h("div", { class: "rolecard ratio-rolecard r10" },
        h("span", { class: "role-name" }, bi(L, "10% Accent Color", "10% Warna Aksen")),
        h("p", null, bi(L, "The sharpest, highest-contrast pop reserved for the Title Logo and focal action (eyes, weapon glow, blood, lightning).", "Warna paling kontras dan menyala yang disimpan khusus untuk Logo Judul dan titik fokus utama (mata, kilatan senjata, petir).")))
    ),

    h("div", { class: "demo demo-split ratio-lab-demo" },
      h("div", { class: "demo-stage ratio-stage" }, ratioSvgEl),
      h("div", { class: "demo-ctrls ratio-ctrls" },
        h("span", { class: "small-label" }, bi(L, "Test the 60:30:10 Balance:", "Uji Keseimbangan 60:30:10:")),
        ratioBtns,
        ratioBarEl,
        ratioVerdictEl
      )
    ),

    h("h4", { class: "subhead-cover-examples" }, bi(L, "60:30:10 Breakdown on Real Comic Covers", "Bedah Proporsi 60:30:10 pada Sampul Komik Nyata")),
    h("div", { class: "color-cover-grid cols-3" }, ratioBreakdowns)
  );
}

/* ================= Lesson 7 ================= */
function lessonWeightWidth(L) {
  const sample = h("span", { class: "sample big", style: `font-family:${stackOf("Roboto Flex")}` }, demoTitle);
  const cap1 = h("p", { class: "caption" }), cap2 = h("p", { class: "caption" });
  let w = 700, wd = 100;
  const apply = () => { sample.style.fontWeight = String(w); sample.style.fontStretch = wd + "%"; };
  const sw = slider(bi(L, "Weight (thin to heavy)", "Ketebalan (tipis ke tebal)"), 100, 1000, 10, w, (v) => {
    w = v; apply();
    cap1.textContent = v <= 250 ? bi(L, "Very thin: delicate, quiet, elegant. Risky at small sizes.", "Sangat tipis: halus, tenang, elegan. Berisiko pada ukuran kecil.")
      : v <= 550 ? bi(L, "Light to regular: calm, neutral, easy-going.", "Ringan sampai normal: tenang, netral, santai.")
      : v <= 800 ? bi(L, "Bold: confident and clear.", "Tebal: percaya diri dan jelas.")
      : bi(L, "Extra heavy: loud, powerful, hard to ignore.", "Sangat tebal: lantang, kuat, sulit diabaikan.");
  });
  const sd = slider(bi(L, "Width (narrow to wide)", "Lebar (sempit ke lebar)"), 25, 151, 1, wd, (v) => {
    wd = v; apply();
    cap2.textContent = v <= 55 ? bi(L, "Very condensed: squeezed, tall, tense and urgent. Fits long titles into small spaces.", "Sangat sempit: terhimpit, tinggi, tegang, dan mendesak. Memuat judul panjang di ruang kecil.")
      : v <= 90 ? bi(L, "Slightly narrow: efficient and energetic.", "Agak sempit: efisien dan berenergi.")
      : v <= 115 ? bi(L, "Normal width: balanced and neutral.", "Lebar normal: seimbang dan netral.")
      : bi(L, "Extended: wide, steady, open and techy. Needs more space.", "Melebar: lebar, mantap, terbuka, dan teknis. Butuh lebih banyak ruang.");
  });
  sw.fire(); sd.fire();

  const weightWidthCovers = [
    makeCoverCard({
      badge: bi(L, "Heavy Condensed + Thin Extended", "Tebal Sempit + Tipis Melebar"),
      badgeColor: "#dc2626",
      title: bi(L, "Power Rangers Unlimited #1", "Power Rangers Unlimited #1"),
      coverSrc: "covers/pr_unlimited_coinless_001_cover_a_main_promo-170.jpg",
      swatches: [
        { hex: "#f8fafc", label: bi(L, "Heavy Bold: POWER RANGERS", "Tebal: POWER RANGERS") },
        { hex: "#cbd5e1", label: bi(L, "Thin Extended: UNLIMITED", "Tipis Lebar: UNLIMITED") }
      ],
      text: bi(L,
        "A textbook masterclass in weight and width contrast! POWER RANGERS uses an extra-heavy, compact italic for punch, while UNLIMITED right below uses a razor-thin, wide extended sans for sci-fi scale.",
        "Contoh sempurna kontras ketebalan dan lebar! POWER RANGERS memakai huruf super tebal dan padat untuk daya pukul, sedangkan UNLIMITED di bawahnya memakai huruf sangat tipis dan melebar (extended) untuk kesan fiksi ilmiah."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Ultra-Heavy Condensed", "Sangat Tebal & Sempit (Condensed)"),
      badgeColor: "#0284c7",
      title: bi(L, "Absolute Batman", "Absolute Batman"),
      coverSrc: "covers/absolute-batman.jpg",
      swatches: [
        { hex: "#5b808c", label: bi(L, "Tall Condensed Block", "Balok Tinggi Sempit") },
        { hex: "#df7a32", label: bi(L, "Brutal Mass", "Massa Kekar") }
      ],
      text: bi(L,
        "The tall, tightly squeezed, ultra-heavy letters of BATMAN pack maximum ink into a narrow vertical column—echoing this brute-force version of the Dark Knight.",
        "Huruf BATMAN yang tinggi, rapat terhimpit (condensed), dan sangat tebal memadatkan massa visual yang luar biasa—mencerminkan fisik Batman versi baru yang kekar bagai tembok."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Wide Extended Serif", "Serif Lebar Membentang (Extended)"),
      badgeColor: "#b45309",
      title: bi(L, "Elric: The Sleeping Sorceress", "Elric: The Sleeping Sorceress"),
      coverSrc: "covers/large-1861193.jpg",
      swatches: [
        { hex: "#f8fafc", label: bi(L, "Wide Extended 5-Letter Title", "Judul 5 Huruf Melebar") },
        { hex: "#f59e0b", label: bi(L, "Widescreen Grandeur", "Kemegahan Sinematik") }
      ],
      text: bi(L,
        "Because 'ELRIC' is only five letters long, setting it in an extra-wide extended serif lets it span edge-to-edge across the cover like a monumental widescreen movie title.",
        "Karena kata 'ELRIC' hanya terdiri dari lima huruf, pemakaian huruf serif yang melebar (extended) membuatnya membentang megah dari ujung ke ujung sampul bagaikan layar bioskop."
      )
    })
  ];

  return h("div", null,
    para(bi(L,
      "The same font can change character when you change its weight (how thick the strokes are) and its width (how wide the letters are). Many font families come with several weights and widths, such as thin, regular, bold, condensed and extended.",
      "Font yang sama bisa berubah karakter ketika ketebalan (seberapa tebal goresan) dan lebarnya (seberapa lebar huruf) diubah. Banyak keluarga font punya beberapa ketebalan dan lebar, seperti tipis, normal, tebal, condensed, dan extended.")),
    titleInput(L, (v) => (sample.textContent = v)),
    h("div", { class: "demo demo-split" }, h("div", { class: "demo-stage" }, sample), h("div", { class: "demo-ctrls" }, sw.row, cap1, sd.row, cap2)),
    bullets([
      bi(L, "Match weight to your hero's energy: a gentle character rarely wants an extra-heavy title.", "Sesuaikan ketebalan dengan energi tokohmu: tokoh lembut jarang cocok dengan judul sangat tebal."),
      bi(L, "Thin titles can vanish on busy artwork. Heavy ones stay visible from far away.", "Judul tipis bisa hilang di atas gambar yang ramai. Judul tebal tetap terlihat dari jauh."),
      bi(L, "Condensed letters help a long title fit; extended letters suit calm or high-tech stories.", "Huruf sempit membantu judul panjang muat; huruf lebar cocok untuk cerita yang tenang atau berteknologi tinggi."),
    ]),
    h("h3", null, bi(L, "Weight & width on real comic covers", "Ketebalan & lebar pada sampul komik nyata")),
    para(bi(L,
      "See how published covers use heavy condensed blocks versus wide extended letterforms to control energy and space:",
      "Lihat bagaimana sampul komik nyata memanfaatkan huruf tebal-sempit (condensed) maupun huruf melebar (extended) untuk mengatur energi dan ruang:")),
    h("div", { class: "color-cover-grid cols-3" }, weightWidthCovers)
  );
}

/* ================= Lesson 8 ================= */
function lessonSpacing(L) {
  /* Tracking */
  const trSample = h("span", { class: "sample big", style: `font-family:${stackOf("Roboto Flex")};font-weight:800` }, demoTitle);
  const trCap = h("p", { class: "caption" });
  const tr = slider(bi(L, "Tracking (letter spacing)", "Tracking (jarak huruf)"), -0.1, 0.5, 0.01, 0, (v) => {
    trSample.style.letterSpacing = v + "em";
    trCap.textContent = v < -0.03 ? bi(L, "Tight: crowded and compact. Dense, tense, intense. Too tight and letters collide.", "Rapat: sesak dan padat. Pekat, tegang, intens. Terlalu rapat dan huruf bertabrakan.")
      : v <= 0.08 ? bi(L, "Normal: balanced and neutral.", "Normal: seimbang dan netral.")
      : v <= 0.25 ? bi(L, "Loose: airy and calm. Cinematic, premium, quiet.", "Renggang: lapang dan tenang. Sinematik, premium, hening.")
      : bi(L, "Very loose: the word starts to fall apart into separate letters.", "Sangat renggang: kata mulai pecah menjadi huruf-huruf terpisah.");
  }, (v) => v.toFixed(2) + "em");
  tr.fire();

  /* Kerning lab */
  const word = "TAVERN";
  const diag = new Set(["A", "V", "W", "T", "Y"]);
  const messy = () => word.split("").map((ch, i) => (i > 0 && (diag.has(word[i - 1]) || diag.has(ch)) && word[i - 1] !== "R" && ch !== "R" ? 0.14 : 0));
  const kerned = () => word.split("").map((ch, i) => (i > 0 && (diag.has(word[i - 1]) || diag.has(ch)) && word[i - 1] !== "R" && ch !== "R" ? -0.03 : 0));
  let gaps = messy();
  const kernSample = h("span", { class: "sample big", style: `font-family:${stackOf("Roboto Flex")};font-weight:800;font-kerning:none` });
  const gapInputs = [];
  const drawKern = () => {
    kernSample.innerHTML = "";
    word.split("").forEach((ch, i) => kernSample.append(h("span", { style: `margin-left:${gaps[i]}em` }, ch)));
    gapInputs.forEach((g, i) => { g.input.value = gaps[i + 1]; g.out.textContent = gaps[i + 1].toFixed(2); });
  };
  const gapRows = word.slice(1).split("").map((ch, i) => {
    const out = h("output", null, "");
    const input = h("input", { type: "range", min: "-0.15", max: "0.3", step: "0.01", value: "0", "aria-label": `${word[i]}–${ch}` });
    input.addEventListener("input", () => { gaps[i + 1] = Number(input.value); out.textContent = gaps[i + 1].toFixed(2); drawKern2(); });
    gapInputs.push({ input, out });
    return h("label", { class: "ctrl mini" }, h("span", { class: "ctrl-label" }, `${word[i]}–${ch}`), input, out);
  });
  const drawKern2 = () => { // redraw letters only (keeps sliders in place while dragging)
    kernSample.innerHTML = "";
    word.split("").forEach((ch, i) => kernSample.append(h("span", { style: `margin-left:${gaps[i]}em` }, ch)));
  };
  drawKern();
  const resetBtn = h("button", { type: "button", class: "btn small", onclick: () => { gaps = messy(); drawKern(); } }, bi(L, "Reset to uneven", "Kembalikan ke tak rata"));
  const autoBtn = h("button", { type: "button", class: "btn small", onclick: () => { gaps = kerned(); drawKern(); } }, bi(L, "Show a fixed version", "Tampilkan versi yang sudah rapi"));

  /* Leading */
  const l1 = h("span", null, "STORM"), l2 = h("span", null, "CHASERS");
  const leadBox = h("div", { class: "lead-sample", style: `font-family:${stackOf("Anton")}` }, l1, h("br"), l2);
  const leadCap = h("p", { class: "caption" });
  const ld = slider(bi(L, "Leading (line spacing)", "Leading (jarak antar baris)"), 0.7, 1.8, 0.05, 1, (v) => {
    leadBox.style.lineHeight = String(v);
    leadCap.textContent = v < 0.9 ? bi(L, "Tight, stacked lines: punchy and compact, like a logo block. Lines may start to collide.", "Baris rapat bertumpuk: tegas dan padat, seperti blok logo. Baris bisa mulai bertabrakan.")
      : v <= 1.25 ? bi(L, "Balanced: the lines read as one title.", "Seimbang: baris terbaca sebagai satu judul.")
      : bi(L, "Loose: the lines separate into two phrases. Calmer, but less unified.", "Renggang: baris terpisah menjadi dua frasa. Lebih tenang, tetapi kurang menyatu.");
  }, (v) => v.toFixed(2));
  ld.fire();

  const spacingCovers = [
    makeCoverCard({
      badge: bi(L, "Loose Tracking (Cinematic & Poised)", "Tracking Renggang (Sinematik & Tenang)"),
      badgeColor: "#4f46e5",
      title: bi(L, "Killmonger #2", "Killmonger #2"),
      coverSrc: "covers/md_cf29d9358e59-killmonger.jpg",
      swatches: [
        { hex: "#475569", label: bi(L, "Wide Letter-Spacing", "Jarak Huruf Lebar") },
        { hex: "#f8fafc", label: bi(L, "Airy Top Margin", "Ruang Atas Lapang") }
      ],
      text: bi(L,
        "Notice the generous air between K-I-L-L-M-O-N-G-E-R across the top. Loose tracking gives the title a cold, calculated, movie-poster confidence.",
        "Perhatikan ruang lapang di antara huruf K-I-L-L-M-O-N-G-E-R di bagian atas. Tracking yang renggang memberi kesan dingin, penuh perhitungan, dan sinematik bagai poster film."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Optical Kerning on Diagonal Letters", "Kerning Optis pada Huruf Diagonal"),
      badgeColor: "#991b1b",
      title: bi(L, "Civil War #3", "Civil War #3"),
      coverSrc: "covers/md_cef2124c5670-civil-wae.jpg",
      swatches: [
        { hex: "#f8fafc", label: bi(L, "Tucked W-A-R Diagonal Pair", "Pasangan Diagonal W-A-R Rapi") },
        { hex: "#b91c1c", label: bi(L, "Tracked Event Tagline", "Tagline Renggang") }
      ],
      text: bi(L,
        "In CIVIL WAR, the diagonal 'W' and 'A' are tucked closely together (kerned) so no awkward gap splits the word, while 'WHOSE SIDE ARE YOU ON?' below uses calm, even tracking.",
        "Pada CIVIL WAR, pasangan huruf diagonal 'W' dan 'A' dirapatkan (dikern) agar tidak meninggalkan celah kosong yang janggal, sementara teks 'WHOSE SIDE ARE YOU ON?' di bawah memakai tracking yang rata."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Tight Tracking & Tight Leading", "Tracking Rapat & Leading Bertumpuk"),
      badgeColor: "#18181b",
      title: bi(L, "Lost Fantasy Vol. 1", "Lost Fantasy Vol. 1"),
      coverSrc: "covers/lost-fantasy-volume-1-9781534331303_xlg.jpg",
      swatches: [
        { hex: "#09090b", label: bi(L, "Zero Line Gap (Tight Leading)", "Baris Rapat Bertumpuk") },
        { hex: "#facc15", label: bi(L, "Compact Logo Block", "Blok Logo Padat") }
      ],
      text: bi(L,
        "Both the letter spacing (tracking) and the vertical space between LOST and FANTASY (leading) are compressed so tightly that the two lines fuse into a single heavy block.",
        "Baik jarak antarhuruf (tracking) maupun jarak antarbaris antara LOST dan FANTASY (leading) dirapatkan sedemikian rupa sehingga kedua baris menyatu menjadi satu blok logo yang kokoh."
      )
    })
  ];

  return h("div", null,
    para(bi(L,
      "Space is part of the letters. The way you space a title changes how it feels, even with the same font.",
      "Ruang adalah bagian dari huruf. Cara kamu mengatur jarak judul mengubah rasanya, bahkan dengan font yang sama.")),
    h("dl", { class: "terms" },
      h("dt", null, "Tracking"), h("dd", null, bi(L, "The space between all the letters, adjusted together.", "Jarak antara semua huruf, diatur bersamaan.")),
      h("dt", null, "Kerning"), h("dd", null, bi(L, "The space between one specific pair of letters.", "Jarak antara satu pasangan huruf tertentu.")),
      h("dt", null, "Leading"), h("dd", null, bi(L, "The space between lines of text.", "Jarak antar baris teks."))),
    h("h3", null, "Tracking"),
    titleInput(L, (v) => (trSample.textContent = v)),
    h("div", { class: "demo demo-split" }, h("div", { class: "demo-stage" }, trSample), h("div", { class: "demo-ctrls" }, tr.row, trCap)),
    h("h3", null, "Kerning"),
    para(bi(L,
      "Some letters, like T, A, V, W and Y, have diagonal or open shapes that leave bigger gaps next to other letters. Good kerning tucks them closer so that all the gaps look equally wide. Drag the sliders to fix the uneven gaps, then squint: the gaps should look evenly dark.",
      "Beberapa huruf, seperti T, A, V, W, dan Y, berbentuk diagonal atau terbuka sehingga meninggalkan celah lebih besar di samping huruf lain. Kerning yang baik merapatkan mereka agar semua celah tampak sama lebar. Geser slider untuk memperbaiki celah yang tak rata, lalu sipitkan mata: celah harus tampak sama gelapnya.")),
    h("div", { class: "demo" }, h("div", { class: "demo-stage" }, kernSample), h("div", { class: "gap-grid" }, gapRows), h("div", { class: "row left" }, resetBtn, autoBtn)),
    callout(bi(L, "How spacing changes character", "Bagaimana jarak mengubah karakter"),
      bi(L,
        "Tight spacing feels intense and urgent. Loose spacing feels calm, airy and cinematic. Uneven kerning makes a title look clumsy or unfinished, which is a quick way to look amateur.",
        "Jarak rapat terasa intens dan mendesak. Jarak renggang terasa tenang, lapang, dan sinematik. Kerning tak rata membuat judul tampak canggung atau belum selesai, cara cepat untuk terlihat amatir.")),
    h("h3", null, "Leading"),
    h("div", { class: "demo demo-split" }, h("div", { class: "demo-stage" }, leadBox), h("div", { class: "demo-ctrls" }, ld.row, leadCap)),
    h("h3", null, bi(L, "Tracking, kerning & leading on real comic covers", "Tracking, kerning & leading pada sampul komik nyata")),
    para(bi(L,
      "Compare how loose tracking, careful diagonal kerning, and tight stacked leading shape the mood of these three covers:",
      "Bandingkan bagaimana tracking renggang, kerning diagonal yang rapi, serta leading rapat bertumpuk membentuk suasana pada ketiga sampul ini:")),
    h("div", { class: "color-cover-grid cols-3" }, spacingCovers)
  );
}

/* ================= Lesson 9 ================= */
function lessonOrientation(L) {
  const word = demoTitle;
  const wrapper = h("span", { class: "orient", style: `font-family:${stackOf("Roboto Flex")};font-weight:800` });
  const cap1 = h("p", { class: "caption" }), cap2 = h("p", { class: "caption" }), cap3 = h("p", { class: "caption" });
  const seq = [-1, 1.2, -0.8, 1.5, -1.2, 0.6, -0.4, 1.1];
  let slant = 0, rot = 0, bounce = 0, text = word;
  const draw = () => {
    wrapper.innerHTML = "";
    text.split("").forEach((ch, i) => {
      const d = seq[i % seq.length] * bounce;
      wrapper.append(h("span", { class: "ch", style: `transform:rotate(${d}deg) translateY(${d * 0.35}px)` }, ch));
    });
    wrapper.style.transform = `rotate(${rot}deg) skewX(${-slant}deg)`;
  };
  const s1 = slider(bi(L, "Slant (back to forward)", "Kemiringan (ke belakang ke depan)"), -25, 25, 1, 0, (v) => {
    slant = v; draw();
    cap1.textContent = v > 6 ? bi(L, "Forward lean: speed, energy and momentum. Great for action.", "Condong ke depan: kecepatan, energi, dan momentum. Bagus untuk aksi.")
      : v < -6 ? bi(L, "Backward lean: awkward, hesitant, or deliberately odd.", "Condong ke belakang: canggung, ragu, atau sengaja aneh.")
      : bi(L, "Upright: steady and formal.", "Tegak: mantap dan formal.");
  }, (v) => v + "°");
  const s2 = slider(bi(L, "Rotation (whole title)", "Rotasi (seluruh judul)"), -25, 25, 1, 0, (v) => {
    rot = v; draw();
    cap2.textContent = Math.abs(v) < 1 ? bi(L, "Level: steady and orderly.", "Lurus: mantap dan teratur.")
      : Math.abs(v) < 4 ? bi(L, "Very slight tilt: this often looks like a mistake, not a choice.", "Kemiringan sangat kecil: ini sering terlihat seperti kesalahan, bukan pilihan.")
      : v < 0 ? bi(L, "Rising to the right: optimistic, energetic, lively.", "Naik ke kanan: optimis, berenergi, hidup.")
      : bi(L, "Falling to the right: tense, uneasy, sinking.", "Turun ke kanan: tegang, gelisah, tenggelam.");
  }, (v) => v + "°");
  const s3 = slider(bi(L, "Bounce (letter by letter)", "Lompatan (huruf demi huruf)"), 0, 10, 1, 0, (v) => {
    bounce = v; draw();
    cap3.textContent = v > 3 ? bi(L, "Bouncy baseline: hand-made, playful, comic.", "Garis dasar melompat: buatan tangan, ceria, jenaka.")
      : bi(L, "Letters sit on one baseline: orderly.", "Huruf berada di satu garis dasar: teratur.");
  }, (v) => String(v));
  s1.fire(); s2.fire(); s3.fire();

  const orientationCovers = [
    makeCoverCard({
      badge: bi(L, "Forward Slant + Baseline Bounce", "Condong ke Depan + Lompatan Huruf"),
      badgeColor: "#ea580c",
      title: bi(L, "Naruto Vol. 47", "Naruto Vol. 47"),
      coverSrc: "covers/whats-your-favorite-manga-cover-v0-1z63aihyj9vc1.jpeg",
      swatches: [
        { hex: "#f97316", label: bi(L, "Bouncy Letter Angles", "Sudut Huruf Melompat") },
        { hex: "#ec4899", label: bi(L, "Dynamic Swirl Motion", "Gerak Pusaran Dinamis") }
      ],
      text: bi(L,
        "Each letter in NARUTO tilts and bounces at a slightly different angle along a rising arc, giving the title a hand-drawn, kinetic ninja leap.",
        "Setiap huruf pada NARUTO miring dan melompat pada sudut yang sedikit berbeda di sepanjang lengkungan naik, memberi kesan lompatan ninja yang hidup dan dinamis."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Sharp Forward Slant & Perspektif", "Condong Tajam ke Depan"),
      badgeColor: "#db2777",
      title: bi(L, "JoJo's Bizarre Adventure Part 3", "JoJo's Bizarre Adventure Part 3"),
      coverSrc: "covers/yellowcover6.jpg",
      swatches: [
        { hex: "#ec4899", label: bi(L, "Slanted Display Logo", "Logo Miring ke Depan") },
        { hex: "#0284c7", label: bi(L, "Stacked Italic Subtitle", "Subjudul Miring Bertumpuk") }
      ],
      text: bi(L,
        "Both 'JoJo's' and 'Bizarre Adventure' lean aggressively forward to the right, matching Jotaro's dramatic pose and creating unstoppable visual momentum.",
        "Baik tulisan 'JoJo's' maupun 'Bizarre Adventure' condong tajam ke kanan depan, selaras dengan pose dramatis Jotaro dan menciptakan momentum visual yang kuat."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Upward Diagonal Rotation", "Rotasi Diagonal Menanjak"),
      badgeColor: "#d62828",
      title: bi(L, "Rurouni Kenshin Vol. 1", "Rurouni Kenshin Vol. 1"),
      coverSrc: "covers/yellowcover3.jpg",
      swatches: [
        { hex: "#d62828", label: bi(L, "Rising Diagonal Tilt (~8°)", "Kemiringan Naik (~8°)") },
        { hex: "#facc15", label: bi(L, "Matches Katana Angle", "Sejajar Arah Pedang") }
      ],
      text: bi(L,
        "The entire RUROUNI KENSHIN logo is rotated upward to the right (~8°), echoing the diagonal slash of Kenshin's katana and adding instant action energy.",
        "Seluruh blok logo RUROUNI KENSHIN diputar menanjak ke kanan (~8°), mengikuti garis diagonal tebasan katana Kenshin dan menambah energi aksi seketika."
      )
    })
  ];

  return h("div", null,
    para(bi(L,
      "Orientation is how the letters stand: upright, slanted or rotated. Slanting and rotating are the quickest ways to add movement to a flat title.",
      "Orientasi adalah cara huruf berdiri: tegak, miring, atau diputar. Memiringkan dan memutar adalah cara tercepat untuk menambah gerak pada judul yang datar.")),
    titleInput(L, (v) => { text = v; draw(); }),
    h("div", { class: "demo demo-split" }, h("div", { class: "demo-stage tall" }, wrapper), h("div", { class: "demo-ctrls" }, s1.row, cap1, s2.row, cap2, s3.row, cap3)),
    bullets([
      bi(L, "A tilt of about 5–10° looks intentional. A tilt of only 1–2° tends to look like a mistake.", "Kemiringan sekitar 5–10° terlihat disengaja. Kemiringan hanya 1–2° cenderung terlihat seperti kesalahan."),
      bi(L, "Make the slant match the action: a forward lean matches movement to the right.", "Samakan kemiringan dengan aksi: condong ke depan cocok dengan gerak ke kanan."),
      bi(L, "A real italic is redrawn by the type designer. Slanting a normal font just by skewing it distorts the strokes: fine for a bold display title, but check it with your eyes.", "Italic asli digambar ulang oleh perancang font. Memiringkan font biasa hanya dengan skew mengubah bentuk goresan: tidak masalah untuk judul display yang tebal, tetapi periksa dengan matamu."),
      bi(L, "Whatever you do, keep the title readable.", "Apa pun yang kamu lakukan, jaga agar judul tetap terbaca."),
    ]),
    h("h3", null, bi(L, "Slant, rotation & bounce on real comic covers", "Kemiringan, rotasi & lompatan pada sampul komik nyata")),
    para(bi(L,
      "Notice how these action covers use forward slant, upward diagonal rotation, and letter-by-letter bounce to bring their titles to life:",
      "Perhatikan bagaimana sampul-sampul aksi ini memakai kemiringan ke depan, rotasi diagonal menanjak, dan lompatan huruf untuk menghidupkan judulnya:")),
    h("div", { class: "color-cover-grid cols-3" }, orientationCovers)
  );
}

/* ================= Lesson 10 ================= */
function lessonChecklist(L) {
  const rules = [
    bi(L, "Describe your character or story in three words before you pick a font.", "Gambarkan tokoh atau ceritamu dalam tiga kata sebelum memilih font."),
    bi(L, "Use a display or decorative face for the title. Keep speech balloons in a clear, readable face.", "Pakai display atau decorative face untuk judul. Biarkan balon kata memakai font yang jelas dan mudah dibaca."),
    bi(L, "Check legibility: shrink the cover to thumbnail size.", "Periksa keterbacaan: kecilkan sampul ke ukuran thumbnail."),
    bi(L, "Match the era and world of your story. Avoid anachronisms and clichés.", "Samakan zaman dan dunia ceritamu. Hindari anachronism dan klise."),
    bi(L, "Color & 60:30:10 rule: pick an intentional harmony (analogous, complementary, or split-complementary), match expression & symbolism, and save the 10% high-contrast accent for your title logo and focal point.", "Warna & aturan 60:30:10: pilih harmoni warna (analogus, komplementer, atau split-komplementer), sesuaikan ekspresi & simbolisme, dan simpan 10% warna aksen kontras tinggi untuk logo judul serta titik fokus."),
    bi(L, "Weight and width: heavy feels strong, thin feels delicate, condensed feels tense, extended feels steady.", "Ketebalan dan lebar: tebal terasa kuat, tipis terasa halus, sempit terasa tegang, lebar terasa mantap."),
    bi(L, "Spacing: tight feels intense, loose feels calm. Kerning the diagonal pairs (T A V W Y) until the gaps look even.", "Jarak: rapat terasa intens, renggang terasa tenang. Rapikan kerning pasangan diagonal (T A V W Y) sampai celahnya tampak rata."),
    bi(L, "Orientation: a forward slant feels fast, a 5–10° tilt feels playful.", "Orientasi: miring ke depan terasa cepat, kemiringan 5–10° terasa ceria."),
    bi(L, "Use one or two fonts, plan the hierarchy, and trust your eyes.", "Pakai satu atau dua font, rencanakan hierarkinya, dan percayai matamu."),
  ];

  const checklistCovers = [
    makeCoverCard({
      badge: bi(L, "Complete Case Study 1", "Studi Kasus Utuh 1"),
      badgeColor: "#d97706",
      title: bi(L, "Shaman King Vol. 16", "Shaman King Vol. 16"),
      coverSrc: "covers/yellowcover9.jpg",
      swatches: [
        { hex: "#f5b81c", label: bi(L, "Analogous Warm Palette", "Palet Hangat Analogus") },
        { hex: "#f8fafc", label: bi(L, "Custom Brush-Slab Logo", "Logo Kuas-Slab Kustom") }
      ],
      text: bi(L,
        "Checks every box: a custom spiritual-action decorative logo, warm analogous yellow-orange harmony, and clean breathing room around the character.",
        "Memenuhi semua daftar periksa: logo dekoratif aksi-spiritual yang unik, harmoni warna kuning-oranye analogus yang hangat, serta ruang bernapas yang rapi."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Complete Case Study 2", "Studi Kasus Utuh 2"),
      badgeColor: "#18181b",
      title: bi(L, "Detective Comics #880", "Detective Comics #880"),
      coverSrc: "covers/md_ce5bd970b088-detective.jpg",
      swatches: [
        { hex: "#09090b", label: bi(L, "Bold Condensed Title", "Judul Tebal Sempit") },
        { hex: "#e04f33", label: bi(L, "10% Blood-Orange Accent", "10% Aksen Oranye Darah") }
      ],
      text: bi(L,
        "Masterful restraint: 60% stark white space, 30% symbolic black bats forming the skull-like portrait, and 10% blood-orange locking the title and eyes together.",
        "Pengendalian visual yang luar biasa: 60% ruang putih bersih, 30% kelelawar hitam simbolis pembentuk wajah, dan 10% aksen merah-oranye yang mengunci judul serta mata."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Complete Case Study 3", "Studi Kasus Utuh 3"),
      badgeColor: "#0284c7",
      title: bi(L, "Blue Period Vol. 2", "Blue Period Vol. 2"),
      coverSrc: "covers/blue-period-vol-2.png",
      swatches: [
        { hex: "#0284c7", label: bi(L, "Artistic Brush-Stencil Type", "Huruf Stensil-Kuas Artistik") },
        { hex: "#ffffff", label: bi(L, "Symbolic White Canvas", "Kanvas Putih Simbolis") }
      ],
      text: bi(L,
        "The stencil-cut serif title feels like paint on a studio canvas, paired with cool melancholic blue expression and pure white negative space.",
        "Judul serif berpotongan stensil terasa seperti sapuan cat di kanvas studio, berpadu dengan ekspresi biru yang tenang dan ruang kosong putih murni."
      )
    })
  ];

  return h("div", null,
    para(bi(L, "Here is everything in one list. The quiz that follows tests these ideas with real examples. Take your time: every answer comes with a short note.", "Ini semuanya dalam satu daftar. Kuis berikutnya menguji ide-ide ini dengan contoh nyata. Santai saja: setiap jawaban disertai catatan singkat.")),
    h("ol", { class: "checklist checklist-grid" }, rules.map((r) => h("li", null, r))),
    h("h3", null, bi(L, "Putting it all together on real covers", "Memadukan semuanya pada sampul nyata")),
    para(bi(L,
      "Before starting the quiz, look at how these three covers bring typography, hierarchy, and color together into one unforgettable design:",
      "Sebelum memulai kuis, lihat bagaimana ketiga sampul ini menyatukan tipografi, hierarki, dan warna menjadi satu kesatuan desain yang tak terlupakan:")),
    h("div", { class: "color-cover-grid cols-3" }, checklistCovers),
    h("p", { class: "hint" }, bi(L, "Lessons 1–5 are based on the workshop slides \"Choosing Typefaces\". Lesson 6 covers color harmony, expression, symbolism, and the 60:30:10 rule on comic covers. Lessons 7–9 add weight, width, spacing and orientation.", "Pelajaran 1–5 berdasarkan slide workshop \"Choosing Typefaces\". Pelajaran 6 membahas harmoni warna, ekspresi, simbolisme, dan prinsip 60:30:10 pada sampul komik. Pelajaran 7–9 menambahkan ketebalan, lebar, jarak, dan orientasi.")),
  );
}

/* ---------- Lesson list ---------- */
const LESSONS = [
  { title: { en: "Type has a voice", id: "Huruf punya suara" }, build: lessonVoice },
  { title: { en: "Every font has character and style", id: "Setiap font punya karakter dan gaya" }, build: lessonCharacter },
  { title: { en: "Text, display and decorative", id: "Text, display, dan decorative" }, build: lessonRoles },
  { title: { en: "Match the font to your character", id: "Cocokkan font dengan tokohmu" }, build: lessonMatch },
  { title: { en: "Good habits for covers", id: "Kebiasaan baik untuk sampul" }, build: lessonHabits },
  { title: { en: "Color in comic covers", id: "Warna pada sampul komik" }, build: lessonColor },
  { title: { en: "Weight and width", id: "Ketebalan dan lebar" }, build: lessonWeightWidth },
  { title: { en: "Kerning and spacing", id: "Kerning dan jarak" }, build: lessonSpacing },
  { title: { en: "Slant and rotation", id: "Kemiringan dan rotasi" }, build: lessonOrientation },
  { title: { en: "Your checklist", id: "Daftar periksamu" }, build: lessonChecklist },
];
