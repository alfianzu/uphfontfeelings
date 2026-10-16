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
let demoTagline = "";
let demoIssue = "1";
let demoCreator = "";

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

function resolveCoverMeta(L, defaultTaglineEn, defaultTaglineId, byline, customTagline, customIssue, customCreator) {
  const activeTagline = (customTagline && customTagline.trim())
    ? escapeXml(customTagline.trim().toUpperCase())
    : escapeXml(bi(L, defaultTaglineEn, defaultTaglineId));
  const activeIssue = (customIssue && customIssue.trim())
    ? escapeXml(customIssue.trim().startsWith("#") ? customIssue.trim() : "#" + customIssue.trim())
    : "#1";
  const activeByline = (customCreator && customCreator.trim())
    ? escapeXml(customCreator.trim().toUpperCase())
    : byline;
  const taglineSize = activeTagline.length > 32 ? "5.8" : activeTagline.length > 24 ? "6.4" : "7.2";
  const issueSize = activeIssue.length > 4 ? "8" : activeIssue.length > 3 ? "9.5" : "11";
  const bylineSize = activeByline.length > 32 ? "5.6" : activeByline.length > 24 ? "6.2" : "6.8";
  return { activeTagline, activeIssue, activeByline, taglineSize, issueSize, bylineSize };
}

const GENRES = {
  action: {
    en: "Superhero / Action Noir",
    id: "Pahlawan Super / Aksi Noir",
    heroDesc: { en: "the cloaked vigilante leaping across rainy Gotham-style rooftops", id: "sosok pahlawan bertopeng di atas atap kota yang diguyur hujan" },
    tagline: { en: "THE CITY NEVER SLEEPS", id: "KOTA TAK PERNAH TIDUR" },
    byline: "R. CHEN · M. SOTO · COLOR: D. VALE",
    publisher: "APEX COMICS",
    issue: { tag: "OCT", price: "$3.99" },
    defaultFont: "Anton",
    presetTraits: ["strong", "hard"],
    presetStyles: ["brutalist"],
    renderSvg: (L, cleanTitle, font, fontSize, letterSpacing, byline, customTagline, customIssue, customCreator) => {
      const { activeTagline, activeIssue, activeByline, taglineSize, issueSize, bylineSize } = resolveCoverMeta(
        L, "THE CITY NEVER SLEEPS", "KOTA TAK PERNAH TIDUR", byline, customTagline, customIssue, customCreator
      );
      return `
      <defs>
        <linearGradient id="actionSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#060b19"/>
          <stop offset="45%" stop-color="#111c38"/>
          <stop offset="85%" stop-color="#1e2f56"/>
          <stop offset="100%" stop-color="#2c3e6b"/>
        </linearGradient>
        <radialGradient id="actionMoon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef9c3"/>
          <stop offset="65%" stop-color="#fde047" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="actionCape" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="45%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <filter id="actionTitleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.9"/>
        </filter>
      </defs>
      <rect width="240" height="330" rx="8" fill="url(#actionSky)"/>
      <!-- Atmospheric Moon & Searchlight Beam -->
      <circle cx="176" cy="118" r="46" fill="url(#actionMoon)"/>
      <polygon points="10,330 88,40 124,40 50,330" fill="#bae6fd" opacity="0.08"/>
      <!-- Lightning bolt in storm sky -->
      <polyline points="192,42 180,76 190,78 173,115" fill="none" stroke="#e0f2fe" stroke-width="1.6" opacity="0.7"/>
      <!-- Detailed Gothic Skyline -->
      <polygon points="6,330 6,162 22,146 38,162 38,330" fill="#070d1d"/>
      <rect x="36" y="182" width="32" height="148" fill="#050914"/>
      <polygon points="154,330 154,138 172,116 190,138 190,330" fill="#070d1d"/>
      <rect x="188" y="168" width="44" height="162" fill="#050914"/>
      <!-- Lit skyscraper windows -->
      <g fill="#fde68a" opacity="0.65">
        <rect x="13" y="172" width="4" height="7"/><rect x="21" y="172" width="4" height="7"/>
        <rect x="13" y="185" width="4" height="7"/><rect x="21" y="198" width="4" height="7"/>
        <rect x="164" y="148" width="4" height="8"/><rect x="174" y="148" width="4" height="8"/>
        <rect x="164" y="162" width="4" height="8"/><rect x="174" y="176" width="4" height="8"/>
        <rect x="200" y="182" width="5" height="6"/><rect x="212" y="196" width="5" height="6"/>
      </g>
      <!-- Rain streaks -->
      <g stroke="#93c5fd" stroke-width="0.6" opacity="0.28">
        <line x1="28" y1="80" x2="14" y2="130"/><line x1="74" y1="110" x2="60" y2="160"/>
        <line x1="210" y1="90" x2="196" y2="140"/><line x1="150" y1="70" x2="136" y2="120"/>
      </g>
      <!-- Title Masthead -->
      <text x="120" y="74" fill="#f59e0b" font-family="${fontStack(font)}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="${letterSpacing}" filter="url(#actionTitleShadow)">${escapeXml(cleanTitle)}</text>
      <!-- Story Tagline -->
      <rect x="44" y="85" width="152" height="14" rx="3" fill="#090d16" opacity="0.72"/>
      <text x="120" y="95" fill="#e2e8f0" font-family="'Figtree',sans-serif" font-size="${taglineSize}" font-weight="700" text-anchor="middle" letter-spacing="1.6">${activeTagline}</text>
      <!-- Dramatic Billowing Cape & Vigilante Hero -->
      <path d="M 24,282 C 42,212 72,182 108,174 L 132,174 C 168,182 202,216 220,278 C 190,264 166,268 148,284 C 132,268 108,268 92,284 C 72,268 48,268 24,282 Z" fill="url(#actionCape)" stroke="#38bdf8" stroke-width="0.9" stroke-opacity="0.45"/>
      <!-- Muscular Armored Torso & Shoulders -->
      <path d="M 78,295 L 92,186 L 120,172 L 148,186 L 162,295 Z" fill="#0f172a" stroke="#475569" stroke-width="1"/>
      <!-- Chest Emblem (Golden Raptor/Bat Shield) -->
      <polygon points="102,202 120,194 138,202 130,216 120,211 110,216" fill="#f59e0b"/>
      <!-- Chest Armor Plates & Utility Belt -->
      <path d="M 98,224 L 118,228 L 118,248 L 96,242 Z" fill="#1e293b"/>
      <path d="M 142,224 L 122,228 L 122,248 L 144,242 Z" fill="#1e293b"/>
      <rect x="90" y="256" width="60" height="9" rx="2" fill="#d97706" stroke="#fef08a" stroke-width="0.7"/>
      <rect x="114" y="254" width="12" height="13" rx="2" fill="#fbbf24"/>
      <!-- Cowl & Glowing Eyes -->
      <path d="M 103,182 L 106,138 L 113,152 L 120,148 L 127,152 L 134,138 L 137,182 Z" fill="#090d16" stroke="#64748b" stroke-width="0.8"/>
      <polygon points="110,162 118,165 111,167" fill="#38bdf8"/>
      <polygon points="130,162 122,165 129,167" fill="#38bdf8"/>
      <!-- Foreground Gargoyle Ledge -->
      <polygon points="0,308 64,284 176,284 240,308 240,330 0,330" fill="#030712"/>
      <polyline points="64,284 120,290 176,284" fill="none" stroke="#334155" stroke-width="1.5"/>
      <!-- Issue Number Box (Top Left) -->
      <g transform="translate(10, 10)">
        <rect width="32" height="36" rx="3" fill="#090d16" stroke="#f59e0b" stroke-width="1.3"/>
        <text x="16" y="14" fill="#f59e0b" font-family="'Figtree',sans-serif" font-size="${issueSize}" font-weight="800" text-anchor="middle">${activeIssue}</text>
        <line x1="4" y1="17.5" x2="28" y2="17.5" stroke="#f59e0b" stroke-width="0.8"/>
        <text x="16" y="25.5" fill="#f8fafc" font-family="'Figtree',sans-serif" font-size="6.2" font-weight="700" text-anchor="middle">OCT</text>
        <text x="16" y="33" fill="#94a3b8" font-family="'Figtree',sans-serif" font-size="5.5" text-anchor="middle">$3.99</text>
      </g>
      <!-- Mandatory Publisher Logo (Top Right) -->
      <g transform="translate(196, 10)">
        <rect width="34" height="24" rx="4" fill="#dc2626" stroke="#ffffff" stroke-width="1.2"/>
        <text x="17" y="11" fill="#ffffff" font-family="'Figtree',sans-serif" font-size="6.5" font-weight="900" text-anchor="middle" letter-spacing="0.5">APEX</text>
        <text x="17" y="19" fill="#fde047" font-family="'Figtree',sans-serif" font-size="5" font-weight="800" text-anchor="middle">COMICS</text>
      </g>
      <!-- Creator Byline & Mandatory Barcode Strip (Bottom) -->
      <rect x="0" y="304" width="240" height="26" fill="#020617" opacity="0.95"/>
      <g transform="translate(8, 308)">
        <rect width="34" height="18" rx="1.5" fill="#f8fafc"/>
        <path d="M4,3 v12 M7,3 v12 M9,3 v12 M13,3 v12 M16,3 v12 M18,3 v12 M22,3 v12 M25,3 v12 M29,3 v12" stroke="#0f172a" stroke-width="1.2"/>
      </g>
      <text x="138" y="320" fill="#cbd5e1" font-family="'Figtree',sans-serif" font-size="${bylineSize}" font-weight="700" text-anchor="middle" letter-spacing="0.8">${activeByline}</text>
    `;
    }
  },
  scifi: {
    en: "Sci-Fi / Space Odyssey",
    id: "Fiksi Ilmiah / Penjelajahan Antariksa",
    heroDesc: { en: "the cyber-astronaut commander in front of a ringed exoplanet", id: "komandan astronot siber di depan planet bercincin neon" },
    tagline: { en: "BEYOND THE KNOWN STARS", id: "MELAMPAUI BATAS BINTANG" },
    byline: "A. VANCE · K. TURING · COLOR: N. NOVA",
    publisher: "NOVA PRESS",
    issue: { tag: "VOL 1", price: "$4.99" },
    defaultFont: "Orbitron",
    presetTraits: ["cold", "hard"],
    presetStyles: ["futuristic"],
    renderSvg: (L, cleanTitle, font, fontSize, letterSpacing, byline, customTagline, customIssue, customCreator) => {
      const { activeTagline, activeIssue, activeByline, taglineSize, issueSize, bylineSize } = resolveCoverMeta(
        L, "BEYOND THE KNOWN STARS", "MELAMPAUI BATAS BINTANG", byline, customTagline, customIssue, customCreator
      );
      return `
      <defs>
        <linearGradient id="scifiSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="40%" stop-color="#0f172a"/>
          <stop offset="75%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#31104b"/>
        </linearGradient>
        <radialGradient id="scifiNebula" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.45"/>
          <stop offset="55%" stop-color="#a855f7" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
        </radialGradient>
        <filter id="scifiTitleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3.5" flood-color="#06b6d4" flood-opacity="0.75"/>
        </filter>
      </defs>
      <rect width="240" height="330" rx="8" fill="url(#scifiSky)"/>
      <circle cx="120" cy="155" r="115" fill="url(#scifiNebula)"/>
      <!-- Starfield -->
      <g fill="#ffffff" opacity="0.85">
        <circle cx="22" cy="48" r="1"/><circle cx="68" cy="22" r="1.3"/><circle cx="114" cy="36" r="0.9"/>
        <circle cx="156" cy="26" r="1.1"/><circle cx="52" cy="112" r="1"/><circle cx="218" cy="108" r="1.3"/>
        <circle cx="30" cy="154" r="1.2"/><circle cx="198" cy="148" r="0.9"/>
      </g>
      <!-- Ringed Exoplanet -->
      <circle cx="176" cy="116" r="24" fill="#0284c7"/>
      <path d="M 156,108 A 24,24 0 0 1 196,124" fill="none" stroke="#38bdf8" stroke-width="4" opacity="0.5"/>
      <ellipse cx="176" cy="116" rx="44" ry="9" fill="none" stroke="#67e8f9" stroke-width="2.4" opacity="0.85" transform="rotate(-22 176 116)"/>
      <!-- Cyber Horizon Grid -->
      <path d="M 0,262 L 240,262 M 0,280 L 240,280 M 0,298 L 240,298 M 120,244 L 10,330 M 120,244 L 72,330 M 120,244 L 168,330 M 120,244 L 230,330" stroke="#22d3ee" stroke-width="0.8" opacity="0.32"/>
      <!-- Title Masthead -->
      <text x="120" y="74" fill="#38bdf8" font-family="${fontStack(font)}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="${letterSpacing}" filter="url(#scifiTitleShadow)">${escapeXml(cleanTitle)}</text>
      <!-- Story Tagline -->
      <rect x="42" y="85" width="156" height="14" rx="3" fill="#040814" opacity="0.78" stroke="#06b6d4" stroke-width="0.6"/>
      <text x="120" y="95" fill="#a5f3fc" font-family="'Figtree',sans-serif" font-size="${taglineSize}" font-weight="700" text-anchor="middle" letter-spacing="1.6">${activeTagline}</text>
      <!-- Detailed Astronaut Hero -->
      <!-- Jetpack & Telemetry Antenna -->
      <rect x="82" y="176" width="76" height="72" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
      <line x1="88" y1="176" x2="88" y2="126" stroke="#67e8f9" stroke-width="2"/>
      <circle cx="88" cy="124" r="3.5" fill="#22d3ee"/>
      <!-- Exosuit Shoulders & Torso -->
      <path d="M 52,304 L 74,208 L 120,194 L 166,208 L 188,304 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
      <path d="M 86,210 L 154,210 L 144,274 L 96,274 Z" fill="#1e293b" stroke="#64748b" stroke-width="0.9"/>
      <!-- Glowing Reactor Core -->
      <circle cx="120" cy="238" r="13" fill="#083344" stroke="#22d3ee" stroke-width="1.8"/>
      <circle cx="120" cy="238" r="7" fill="#67e8f9"/>
      <!-- Astronaut Helmet & Reflective Visor -->
      <circle cx="120" cy="166" r="28" fill="#e2e8f0" stroke="#38bdf8" stroke-width="1.5"/>
      <rect x="97" y="150" width="46" height="25" rx="11" fill="#083344" stroke="#22d3ee" stroke-width="1.4"/>
      <path d="M 103,155 Q 120,149 135,156" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
      <circle cx="110" cy="164" r="2" fill="#f472b6" opacity="0.8"/>
      <!-- Issue Number Box (Top Left) -->
      <g transform="translate(10, 10)">
        <rect width="32" height="36" rx="3" fill="#040812" stroke="#06b6d4" stroke-width="1.3"/>
        <text x="16" y="14" fill="#38bdf8" font-family="'Figtree',sans-serif" font-size="${issueSize}" font-weight="800" text-anchor="middle">${activeIssue}</text>
        <line x1="4" y1="17.5" x2="28" y2="17.5" stroke="#06b6d4" stroke-width="0.8"/>
        <text x="16" y="25.5" fill="#e0f2fe" font-family="'Figtree',sans-serif" font-size="6.2" font-weight="700" text-anchor="middle">VOL 1</text>
        <text x="16" y="33" fill="#38bdf8" font-family="'Figtree',sans-serif" font-size="5.5" text-anchor="middle">$4.99</text>
      </g>
      <!-- Mandatory Publisher Logo (Top Right) -->
      <g transform="translate(196, 10)">
        <rect width="34" height="24" rx="4" fill="#083344" stroke="#22d3ee" stroke-width="1.2"/>
        <text x="17" y="11" fill="#67e8f9" font-family="'Figtree',sans-serif" font-size="6.5" font-weight="900" text-anchor="middle" letter-spacing="0.5">NOVA</text>
        <text x="17" y="19" fill="#e0f2fe" font-family="'Figtree',sans-serif" font-size="5" font-weight="700" text-anchor="middle">PRESS</text>
      </g>
      <!-- Creator Byline & Mandatory Barcode Strip (Bottom) -->
      <rect x="0" y="304" width="240" height="26" fill="#020617" opacity="0.95"/>
      <g transform="translate(8, 308)">
        <rect width="34" height="18" rx="1.5" fill="#f8fafc"/>
        <path d="M4,3 v12 M7,3 v12 M9,3 v12 M13,3 v12 M16,3 v12 M18,3 v12 M22,3 v12 M25,3 v12 M29,3 v12" stroke="#0f172a" stroke-width="1.2"/>
      </g>
      <text x="138" y="320" fill="#7dd3fc" font-family="'Figtree',sans-serif" font-size="${bylineSize}" font-weight="700" text-anchor="middle" letter-spacing="0.8">${activeByline}</text>
    `;
    }
  },
  medieval: {
    en: "Dark Fantasy / Gothic",
    id: "Fantasi Gelap / Gotik",
    heroDesc: { en: "the cursed dark knight wielding a glowing runeblade", id: "ksatria kegelapan berpedang rune di depan bulan darah" },
    tagline: { en: "THE ANCIENT CURSE AWAKENS", id: "KUTUKAN KUNO KEMBALI BANGKIT" },
    byline: "G. M. ROWEN · L. D’ANGELO",
    publisher: "WYRM BOOKS",
    issue: { tag: "TOME I", price: "$3.99" },
    defaultFont: "Pirata One",
    presetTraits: ["old", "threatening"],
    presetStyles: ["medieval"],
    renderSvg: (L, cleanTitle, font, fontSize, letterSpacing, byline, customTagline, customIssue, customCreator) => {
      const { activeTagline, activeIssue, activeByline, taglineSize, issueSize, bylineSize } = resolveCoverMeta(
        L, "THE ANCIENT CURSE AWAKENS", "KUTUKAN KUNO KEMBALI BANGKIT", byline, customTagline, customIssue, customCreator
      );
      return `
      <defs>
        <linearGradient id="medievalSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#140408"/>
          <stop offset="45%" stop-color="#2d0914"/>
          <stop offset="100%" stop-color="#4c0519"/>
        </linearGradient>
        <radialGradient id="bloodMoon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fecaca"/>
          <stop offset="55%" stop-color="#ef4444"/>
          <stop offset="100%" stop-color="#7f1d1d" stop-opacity="0"/>
        </radialGradient>
        <filter id="medievalTitleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3" flood-color="#000000" flood-opacity="0.95"/>
        </filter>
      </defs>
      <rect width="240" height="330" rx="8" fill="url(#medievalSky)"/>
      <!-- Blood Moon & Gothic Spire Silhouettes -->
      <circle cx="120" cy="148" r="56" fill="url(#bloodMoon)"/>
      <polygon points="0,255 32,140 54,210 92,155 152,165 192,125 216,205 240,155 240,330 0,330" fill="#0f0306"/>
      <polygon points="28,142 32,102 36,142" fill="#0f0306"/>
      <polygon points="188,128 192,92 196,128" fill="#0f0306"/>
      <!-- Title Masthead -->
      <text x="120" y="74" fill="#fbbf24" font-family="${fontStack(font)}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="${letterSpacing}" filter="url(#medievalTitleShadow)">${escapeXml(cleanTitle)}</text>
      <!-- Story Tagline -->
      <rect x="38" y="85" width="164" height="14" rx="3" fill="#180409" opacity="0.82" stroke="#fbbf24" stroke-width="0.6"/>
      <text x="120" y="95" fill="#fecaca" font-family="'Figtree',sans-serif" font-size="${taglineSize}" font-weight="700" text-anchor="middle" letter-spacing="1.4">${activeTagline}</text>
      <!-- Dark Knight & Runeblade -->
      <!-- Tattered Cloak & Pauldrons -->
      <path d="M 38,308 C 52,224 78,190 120,182 C 162,190 188,224 202,308 Z" fill="#090204" stroke="#991b1b" stroke-width="1"/>
      <path d="M 68,208 Q 90,182 112,198 L 96,232 Z" fill="#1f0910" stroke="#fbbf24" stroke-width="0.9"/>
      <path d="M 172,208 Q 150,182 128,198 L 144,232 Z" fill="#1f0910" stroke="#fbbf24" stroke-width="0.9"/>
      <!-- Horned Greathelm -->
      <path d="M 96,148 C 82,126 78,112 86,104 C 92,116 98,126 105,138 Z" fill="#d4d4d8"/>
      <path d="M 144,148 C 158,126 162,112 154,104 C 148,116 142,126 135,138 Z" fill="#d4d4d8"/>
      <path d="M 102,186 L 102,140 L 120,128 L 138,140 L 138,186 Z" fill="#18181b" stroke="#a1a1aa" stroke-width="1"/>
      <polygon points="108,158 117,161 110,164" fill="#ef4444"/>
      <polygon points="132,158 123,161 130,164" fill="#ef4444"/>
      <!-- Raised Glowing Greatsword -->
      <polygon points="120,112 115,126 116,256 124,256 125,126" fill="#f8fafc" stroke="#fbbf24" stroke-width="0.9"/>
      <path d="M 96,246 L 144,246 L 138,254 L 102,254 Z" fill="#fbbf24"/>
      <circle cx="120" cy="272" r="5" fill="#fbbf24"/>
      <!-- Issue Number Box (Top Left) -->
      <g transform="translate(10, 10)">
        <rect width="32" height="36" rx="3" fill="#120407" stroke="#fbbf24" stroke-width="1.3"/>
        <text x="16" y="14" fill="#fbbf24" font-family="'Figtree',sans-serif" font-size="${issueSize}" font-weight="800" text-anchor="middle">${activeIssue}</text>
        <line x1="4" y1="17.5" x2="28" y2="17.5" stroke="#fbbf24" stroke-width="0.8"/>
        <text x="16" y="25.5" fill="#fca5a5" font-family="'Figtree',sans-serif" font-size="5.8" font-weight="700" text-anchor="middle">TOME I</text>
        <text x="16" y="33" fill="#fbbf24" font-family="'Figtree',sans-serif" font-size="5.5" text-anchor="middle">$3.99</text>
      </g>
      <!-- Mandatory Publisher Logo (Top Right) -->
      <g transform="translate(196, 10)">
        <rect width="34" height="24" rx="4" fill="#2d0914" stroke="#fbbf24" stroke-width="1.2"/>
        <text x="17" y="11" fill="#fbbf24" font-family="'Figtree',sans-serif" font-size="6.2" font-weight="900" text-anchor="middle">WYRM</text>
        <text x="17" y="19" fill="#fecaca" font-family="'Figtree',sans-serif" font-size="5" font-weight="700" text-anchor="middle">BOOKS</text>
      </g>
      <!-- Creator Byline & Mandatory Barcode Strip (Bottom) -->
      <rect x="0" y="304" width="240" height="26" fill="#080204" opacity="0.95"/>
      <g transform="translate(8, 308)">
        <rect width="34" height="18" rx="1.5" fill="#f8fafc"/>
        <path d="M4,3 v12 M7,3 v12 M9,3 v12 M13,3 v12 M16,3 v12 M18,3 v12 M22,3 v12 M25,3 v12 M29,3 v12" stroke="#0f172a" stroke-width="1.2"/>
      </g>
      <text x="138" y="320" fill="#fca5a5" font-family="'Figtree',sans-serif" font-size="${bylineSize}" font-weight="700" text-anchor="middle" letter-spacing="0.8">${activeByline}</text>
    `;
    }
  },
  childish: {
    en: "Cartoon / Playful Comedy",
    id: "Kartun / Komedi Ceria",
    heroDesc: { en: "the bouncy cartoon fox mascot leaping over rainbow hills", id: "maskot rubah kartun ceria yang melompat gembira" },
    tagline: { en: "A SILLY & BUBBLY ESCAPADE", id: "PETUALANGAN CERIA & JENAKA" },
    byline: "T. PIPPIN · B. TOODLES",
    publisher: "POP! KIDS",
    issue: { tag: "FUN!", price: "$2.99" },
    defaultFont: "Fredoka",
    presetTraits: ["friendly", "soft"],
    presetStyles: ["childish"],
    renderSvg: (L, cleanTitle, font, fontSize, letterSpacing, byline, customTagline, customIssue, customCreator) => {
      const { activeTagline, activeIssue, activeByline, taglineSize, issueSize, bylineSize } = resolveCoverMeta(
        L, "A SILLY & BUBBLY ESCAPADE", "PETUALANGAN CERIA & JENAKA", byline, customTagline, customIssue, customCreator
      );
      return `
      <defs>
        <linearGradient id="childishSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="55%" stop-color="#bae6fd"/>
          <stop offset="100%" stop-color="#fef08a"/>
        </linearGradient>
        <filter id="childishTitleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="0" flood-color="#ffffff" flood-opacity="1"/>
        </filter>
      </defs>
      <rect width="240" height="330" rx="8" fill="url(#childishSky)"/>
      <!-- Rainbow Arc & Fluffy Clouds -->
      <path d="M 15,240 A 110,110 0 0 1 225,240" fill="none" stroke="#fb7185" stroke-width="8" opacity="0.45"/>
      <path d="M 23,240 A 102,102 0 0 1 217,240" fill="none" stroke="#facc15" stroke-width="8" opacity="0.45"/>
      <path d="M 31,240 A 94,94 0 0 1 209,240" fill="none" stroke="#4ade80" stroke-width="8" opacity="0.45"/>
      <g fill="#ffffff" opacity="0.95">
        <circle cx="46" cy="118" r="14"/><circle cx="62" cy="113" r="18"/><circle cx="78" cy="118" r="13"/>
        <circle cx="178" cy="126" r="13"/><circle cx="194" cy="121" r="16"/><circle cx="208" cy="126" r="12"/>
      </g>
      <!-- Rolling Green Hills -->
      <path d="M 0,234 Q 65,196 135,226 T 240,210 L 240,330 L 0,330 Z" fill="#22c55e"/>
      <path d="M 0,260 Q 90,232 170,264 T 240,248 L 240,330 L 0,330 Z" fill="#16a34a"/>
      <!-- Title Masthead -->
      <text x="120" y="74" fill="#e11d48" font-family="${fontStack(font)}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="${letterSpacing}" filter="url(#childishTitleShadow)">${escapeXml(cleanTitle)}</text>
      <!-- Story Tagline -->
      <rect x="40" y="84" width="160" height="15" rx="7" fill="#fef08a" stroke="#e11d48" stroke-width="1"/>
      <text x="120" y="94.5" fill="#be123c" font-family="'Figtree',sans-serif" font-size="${taglineSize}" font-weight="800" text-anchor="middle" letter-spacing="1.2">${activeTagline}</text>
      <!-- Expressive Cartoon Mascot Hero -->
      <!-- Action Starburst behind character -->
      <polygon points="120,126 132,148 158,140 144,164 168,178 142,188 152,212 126,202 120,226 114,202 88,212 98,188 72,178 96,164 82,140 108,148" fill="#fef08a" stroke="#f59e0b" stroke-width="1.2"/>
      <!-- Fox Ears, Head & Big Sparkling Eyes -->
      <polygon points="92,162 84,126 112,146" fill="#f97316" stroke="#7c2d12" stroke-width="1.5"/>
      <polygon points="148,162 156,126 128,146" fill="#f97316" stroke="#7c2d12" stroke-width="1.5"/>
      <ellipse cx="120" cy="232" rx="30" ry="34" fill="#f97316" stroke="#7c2d12" stroke-width="1.5"/>
      <ellipse cx="120" cy="234" rx="19" ry="23" fill="#fef3c7"/>
      <circle cx="120" cy="174" r="27" fill="#f97316" stroke="#7c2d12" stroke-width="1.5"/>
      <ellipse cx="109" cy="170" rx="5.5" ry="7" fill="#1e293b"/>
      <ellipse cx="131" cy="170" rx="5.5" ry="7" fill="#1e293b"/>
      <circle cx="111" cy="167.5" r="2.2" fill="#ffffff"/>
      <circle cx="133" cy="167.5" r="2.2" fill="#ffffff"/>
      <ellipse cx="120" cy="178" rx="4" ry="2.8" fill="#7c2d12"/>
      <path d="M 111,184 Q 120,194 129,184 Z" fill="#e11d48" stroke="#7c2d12" stroke-width="1.2"/>
      <!-- Issue Number Box (Top Left) -->
      <g transform="translate(10, 10)">
        <rect width="32" height="36" rx="5" fill="#fef08a" stroke="#e11d48" stroke-width="1.5"/>
        <text x="16" y="14" fill="#e11d48" font-family="'Figtree',sans-serif" font-size="${issueSize}" font-weight="900" text-anchor="middle">${activeIssue}</text>
        <line x1="4" y1="17.5" x2="28" y2="17.5" stroke="#e11d48" stroke-width="1"/>
        <text x="16" y="25.5" fill="#be123c" font-family="'Figtree',sans-serif" font-size="6.5" font-weight="800" text-anchor="middle">FUN!</text>
        <text x="16" y="33" fill="#c2410c" font-family="'Figtree',sans-serif" font-size="5.5" font-weight="700" text-anchor="middle">$2.99</text>
      </g>
      <!-- Mandatory Publisher Logo (Top Right) -->
      <g transform="translate(196, 10)">
        <rect width="34" height="24" rx="6" fill="#e11d48" stroke="#ffffff" stroke-width="1.4"/>
        <text x="17" y="11" fill="#fef08a" font-family="'Figtree',sans-serif" font-size="7" font-weight="900" text-anchor="middle">POP!</text>
        <text x="17" y="19" fill="#ffffff" font-family="'Figtree',sans-serif" font-size="5.2" font-weight="800" text-anchor="middle">KIDS</text>
      </g>
      <!-- Creator Byline & Mandatory Barcode Strip (Bottom) -->
      <rect x="0" y="304" width="240" height="26" fill="#065f46" opacity="0.96"/>
      <g transform="translate(8, 308)">
        <rect width="34" height="18" rx="1.5" fill="#f8fafc"/>
        <path d="M4,3 v12 M7,3 v12 M9,3 v12 M13,3 v12 M16,3 v12 M18,3 v12 M22,3 v12 M25,3 v12 M29,3 v12" stroke="#0f172a" stroke-width="1.2"/>
      </g>
      <text x="138" y="320" fill="#ecfdf5" font-family="'Figtree',sans-serif" font-size="${bylineSize}" font-weight="700" text-anchor="middle" letter-spacing="0.8">${activeByline}</text>
    `;
    }
  },
  rustic: {
    en: "Wild West / Desert Outlaw",
    id: "Wild West / Koboi Gurun",
    heroDesc: { en: "the lone desert gunslinger against a blazing canyon sunset", id: "koboi pengembara di bawah matahari senja lembah gurun" },
    tagline: { en: "HIGH NOON AT DUST CREEK", id: "DUEL TENGAH HARI DI LEMBAH DEBU" },
    byline: "J. DAKOTA · C. HAWKINS",
    publisher: "SPUR PRESS",
    issue: { tag: "WEST", price: "$3.99" },
    defaultFont: "Rye",
    presetTraits: ["old", "strong"],
    presetStyles: ["rustic"],
    renderSvg: (L, cleanTitle, font, fontSize, letterSpacing, byline, customTagline, customIssue, customCreator) => {
      const { activeTagline, activeIssue, activeByline, taglineSize, issueSize, bylineSize } = resolveCoverMeta(
        L, "HIGH NOON AT DUST CREEK", "DUEL TENGAH HARI DI LEMBAH DEBU", byline, customTagline, customIssue, customCreator
      );
      return `
      <defs>
        <linearGradient id="rusticSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#451a03"/>
          <stop offset="40%" stop-color="#9a3412"/>
          <stop offset="75%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#fde047"/>
        </linearGradient>
        <filter id="rusticTitleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#291203" flood-opacity="0.95"/>
        </filter>
      </defs>
      <rect width="240" height="330" rx="8" fill="url(#rusticSky)"/>
      <!-- Blazing Desert Sun -->
      <circle cx="120" cy="182" r="46" fill="#fef08a" opacity="0.92"/>
      <!-- Red Rock Mesas & Saguaro Cacti -->
      <polygon points="0,238 34,196 78,196 96,232 148,192 198,192 240,234 240,330 0,330" fill="#291203"/>
      <g fill="#1a0c02">
        <rect x="22" y="182" width="6" height="58" rx="2"/>
        <path d="M 14,202 L 22,202 L 22,207 L 14,207 L 14,190 L 18,190 L 18,202 Z"/>
        <rect x="206" y="172" width="6" height="66" rx="2"/>
        <path d="M 198,192 L 206,192 L 206,197 L 198,197 L 198,180 L 202,180 L 202,192 Z"/>
      </g>
      <!-- Title Masthead -->
      <text x="120" y="74" fill="#fef3c7" font-family="${fontStack(font)}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="${letterSpacing}" filter="url(#rusticTitleShadow)">${escapeXml(cleanTitle)}</text>
      <!-- Story Tagline -->
      <rect x="38" y="85" width="164" height="14" rx="2" fill="#291203" opacity="0.85" stroke="#f59e0b" stroke-width="0.7"/>
      <text x="120" y="95" fill="#fed7aa" font-family="'Figtree',sans-serif" font-size="${taglineSize}" font-weight="700" text-anchor="middle" letter-spacing="1.4">${activeTagline}</text>
      <!-- Detailed Cowboy Gunslinger Hero -->
      <!-- Poncho & Duster Coat -->
      <path d="M 56,304 L 82,196 L 120,186 L 158,196 L 184,304 Z" fill="#1c0d04" stroke="#f59e0b" stroke-width="0.9"/>
      <polygon points="80,198 120,236 160,198 148,188 92,188" fill="#7c2d12" stroke="#fbbf24" stroke-width="0.8"/>
      <!-- Sheriff Star Badge -->
      <polygon points="140,210 142,215 147,215 143,218 145,223 140,220 135,223 137,218 133,215 138,215" fill="#facc15"/>
      <!-- Red Bandana & Stetson Hat -->
      <polygon points="104,184 136,184 120,204" fill="#dc2626"/>
      <circle cx="120" cy="166" r="15" fill="#291203"/>
      <ellipse cx="120" cy="156" rx="42" ry="7.5" fill="#1c0d04" stroke="#fbbf24" stroke-width="0.8"/>
      <path d="M 98,156 C 100,132 110,128 120,132 C 130,128 140,132 142,156 Z" fill="#291203"/>
      <rect x="99" y="152" width="42" height="3.5" fill="#dc2626"/>
      <!-- Issue Number Box (Top Left) -->
      <g transform="translate(10, 10)">
        <rect width="32" height="36" rx="2" fill="#291203" stroke="#f59e0b" stroke-width="1.3"/>
        <text x="16" y="14" fill="#fef3c7" font-family="'Figtree',sans-serif" font-size="${issueSize}" font-weight="800" text-anchor="middle">${activeIssue}</text>
        <line x1="4" y1="17.5" x2="28" y2="17.5" stroke="#f59e0b" stroke-width="0.8"/>
        <text x="16" y="25.5" fill="#fde047" font-family="'Figtree',sans-serif" font-size="6.2" font-weight="700" text-anchor="middle">WEST</text>
        <text x="16" y="33" fill="#fed7aa" font-family="'Figtree',sans-serif" font-size="5.5" text-anchor="middle">$3.99</text>
      </g>
      <!-- Mandatory Publisher Logo (Top Right) -->
      <g transform="translate(196, 10)">
        <rect width="34" height="24" rx="3" fill="#7c2d12" stroke="#fde047" stroke-width="1.2"/>
        <text x="17" y="11" fill="#fef08a" font-family="'Figtree',sans-serif" font-size="6.5" font-weight="900" text-anchor="middle">SPUR</text>
        <text x="17" y="19" fill="#fed7aa" font-family="'Figtree',sans-serif" font-size="5" font-weight="700" text-anchor="middle">PRESS</text>
      </g>
      <!-- Creator Byline & Mandatory Barcode Strip (Bottom) -->
      <rect x="0" y="304" width="240" height="26" fill="#140802" opacity="0.96"/>
      <g transform="translate(8, 308)">
        <rect width="34" height="18" rx="1.5" fill="#f8fafc"/>
        <path d="M4,3 v12 M7,3 v12 M9,3 v12 M13,3 v12 M16,3 v12 M18,3 v12 M22,3 v12 M25,3 v12 M29,3 v12" stroke="#0f172a" stroke-width="1.2"/>
      </g>
      <text x="138" y="320" fill="#fed7aa" font-family="'Figtree',sans-serif" font-size="${bylineSize}" font-weight="700" text-anchor="middle" letter-spacing="0.8">${activeByline}</text>
    `;
    }
  },
  natural: {
    en: "Nature / Forest Adventure",
    id: "Alam / Petualangan Rimba",
    heroDesc: { en: "the forest wanderer with a glowing lantern among misty pines", id: "penjelajah hutan pembawa lentera di tengah kabut rimba" },
    tagline: { en: "WHERE THE WILD BREEZE CALLS", id: "KALA ANGIN RIMBA MEMANGGIL" },
    byline: "M. WILLOW · S. GREEN",
    publisher: "LEAF COMICS",
    issue: { tag: "VOL 1", price: "$3.50" },
    defaultFont: "Amatic SC",
    presetTraits: ["delicate", "friendly"],
    presetStyles: ["natural"],
    renderSvg: (L, cleanTitle, font, fontSize, letterSpacing, byline, customTagline, customIssue, customCreator) => {
      const { activeTagline, activeIssue, activeByline, taglineSize, issueSize, bylineSize } = resolveCoverMeta(
        L, "WHERE THE WILD BREEZE CALLS", "KALA ANGIN RIMBA MEMANGGIL", byline, customTagline, customIssue, customCreator
      );
      return `
      <defs>
        <linearGradient id="naturalSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#022c22"/>
          <stop offset="45%" stop-color="#065f46"/>
          <stop offset="80%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#a7f3d0"/>
        </linearGradient>
        <filter id="naturalTitleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#022c22" flood-opacity="0.95"/>
        </filter>
      </defs>
      <rect width="240" height="330" rx="8" fill="url(#naturalSky)"/>
      <!-- Layered Pine Forest & Fireflies -->
      <polygon points="0,255 24,195 48,255 72,185 96,255 144,185 168,255 194,195 218,255 240,210 240,330 0,330" fill="#064e3b"/>
      <polygon points="0,275 35,225 70,275 115,215 160,275 205,230 240,275 240,330 0,330" fill="#022c22"/>
      <g fill="#fef08a">
        <circle cx="48" cy="136" r="2.2"/><circle cx="188" cy="144" r="2.4"/><circle cx="72" cy="168" r="1.8"/>
      </g>
      <!-- Title Masthead -->
      <text x="120" y="74" fill="#ecfdf5" font-family="${fontStack(font)}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="${letterSpacing}" filter="url(#naturalTitleShadow)">${escapeXml(cleanTitle)}</text>
      <!-- Story Tagline -->
      <rect x="40" y="85" width="160" height="14" rx="4" fill="#022c22" opacity="0.8" stroke="#34d399" stroke-width="0.6"/>
      <text x="120" y="95" fill="#a7f3d0" font-family="'Figtree',sans-serif" font-size="${taglineSize}" font-weight="700" text-anchor="middle" letter-spacing="1.4">${activeTagline}</text>
      <!-- Detailed Forest Traveler Hero with Staff & Lantern -->
      <path d="M 68,304 L 94,196 L 138,196 L 164,304 Z" fill="#042f2e" stroke="#34d399" stroke-width="0.9"/>
      <path d="M 88,194 Q 116,176 144,198 L 134,230 L 96,230 Z" fill="#0f766e"/>
      <circle cx="116" cy="164" r="15" fill="#042f2e"/>
      <!-- Wooden Walking Staff & Glowing Firefly Lantern -->
      <line x1="154" y1="126" x2="144" y2="300" stroke="#fde68a" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="166" cy="148" r="10" fill="#fef08a" opacity="0.9"/>
      <rect x="161" y="141" width="10" height="14" rx="2" fill="none" stroke="#78350f" stroke-width="1.4"/>
      <!-- Issue Number Box (Top Left) -->
      <g transform="translate(10, 10)">
        <rect width="32" height="36" rx="4" fill="#022c22" stroke="#34d399" stroke-width="1.3"/>
        <text x="16" y="14" fill="#6ee7b7" font-family="'Figtree',sans-serif" font-size="${issueSize}" font-weight="800" text-anchor="middle">${activeIssue}</text>
        <line x1="4" y1="17.5" x2="28" y2="17.5" stroke="#34d399" stroke-width="0.8"/>
        <text x="16" y="25.5" fill="#ecfdf5" font-family="'Figtree',sans-serif" font-size="6.2" font-weight="700" text-anchor="middle">VOL 1</text>
        <text x="16" y="33" fill="#34d399" font-family="'Figtree',sans-serif" font-size="5.5" text-anchor="middle">$3.50</text>
      </g>
      <!-- Mandatory Publisher Logo (Top Right) -->
      <g transform="translate(196, 10)">
        <rect width="34" height="24" rx="4" fill="#064e3b" stroke="#6ee7b7" stroke-width="1.2"/>
        <text x="17" y="11" fill="#a7f3d0" font-family="'Figtree',sans-serif" font-size="6.5" font-weight="900" text-anchor="middle">LEAF</text>
        <text x="17" y="19" fill="#ecfdf5" font-family="'Figtree',sans-serif" font-size="5" font-weight="700" text-anchor="middle">COMICS</text>
      </g>
      <!-- Creator Byline & Mandatory Barcode Strip (Bottom) -->
      <rect x="0" y="304" width="240" height="26" fill="#011812" opacity="0.96"/>
      <g transform="translate(8, 308)">
        <rect width="34" height="18" rx="1.5" fill="#f8fafc"/>
        <path d="M4,3 v12 M7,3 v12 M9,3 v12 M13,3 v12 M16,3 v12 M18,3 v12 M22,3 v12 M25,3 v12 M29,3 v12" stroke="#0f172a" stroke-width="1.2"/>
      </g>
      <text x="138" y="320" fill="#6ee7b7" font-family="'Figtree',sans-serif" font-size="${bylineSize}" font-weight="700" text-anchor="middle" letter-spacing="0.8">${activeByline}</text>
    `;
    }
  },
  artdeco: {
    en: "Noir Glamour / 1920s Mystery",
    id: "Noir Glamor / Misteri Era 1920-an",
    heroDesc: { en: "the sharp-suited 1920s detective framed by golden Art Deco geometry", id: "detektif era 1920-an berbalut jas dan topi fedora di bawah ornamen emas Art Deco" },
    tagline: { en: "SECRETS IN THE VELVET SHADOWS", id: "RAHASIA DI BALIK BAYANGAN MALAM" },
    byline: "V. STERLING · E. DELACROIX",
    publisher: "LUXE NOIR",
    issue: { tag: "OCT", price: "$4.50" },
    defaultFont: "Poiret One",
    presetTraits: ["delicate", "smart"],
    presetStyles: ["artdeco"],
    renderSvg: (L, cleanTitle, font, fontSize, letterSpacing, byline, customTagline, customIssue, customCreator) => {
      const { activeTagline, activeIssue, activeByline, taglineSize, issueSize, bylineSize } = resolveCoverMeta(
        L, "SECRETS IN THE VELVET SHADOWS", "RAHASIA DI BALIK BAYANGAN MALAM", byline, customTagline, customIssue, customCreator
      );
      return `
      <defs>
        <linearGradient id="artdecoSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#09090b"/>
          <stop offset="50%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#312e81"/>
        </linearGradient>
        <filter id="artdecoTitleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.95"/>
        </filter>
      </defs>
      <rect width="240" height="330" rx="8" fill="url(#artdecoSky)"/>
      <!-- Ornate Art Deco Geometric Sunburst & Arches -->
      <g stroke="#fbbf24" stroke-width="0.9" opacity="0.32" fill="none">
        <circle cx="120" cy="185" r="96"/>
        <circle cx="120" cy="185" r="68"/>
        <line x1="120" y1="185" x2="10" y2="40"/><line x1="120" y1="185" x2="60" y2="10"/>
        <line x1="120" y1="185" x2="120" y2="5"/><line x1="120" y1="185" x2="180" y2="10"/>
        <line x1="120" y1="185" x2="230" y2="40"/>
      </g>
      <!-- Stepped Deco Skyscraper Columns -->
      <polygon points="8,330 8,200 22,200 22,170 36,170 36,330" fill="#07070d" stroke="#fbbf24" stroke-width="0.6"/>
      <polygon points="204,330 204,170 218,170 218,200 232,200 232,330" fill="#07070d" stroke="#fbbf24" stroke-width="0.6"/>
      <!-- Title Masthead -->
      <text x="120" y="74" fill="#fef08a" font-family="${fontStack(font)}" font-size="${fontSize}" font-weight="900" text-anchor="middle" letter-spacing="${letterSpacing}" filter="url(#artdecoTitleShadow)">${escapeXml(cleanTitle)}</text>
      <!-- Story Tagline -->
      <rect x="34" y="85" width="172" height="14" rx="2" fill="#09090b" opacity="0.85" stroke="#fbbf24" stroke-width="0.7"/>
      <text x="120" y="95" fill="#fef9c3" font-family="'Figtree',sans-serif" font-size="${taglineSize}" font-weight="700" text-anchor="middle" letter-spacing="1.4">${activeTagline}</text>
      <!-- Detailed 1920s Noir Detective -->
      <path d="M 62,304 L 88,196 L 152,196 L 178,304 Z" fill="#090912" stroke="#fbbf24" stroke-width="0.9"/>
      <!-- Trenchcoat Lapels & Golden Tie -->
      <polygon points="94,196 120,236 146,196" fill="#1e1b4b" stroke="#fbbf24" stroke-width="0.8"/>
      <polygon points="117,202 123,202 124,232 120,238 116,232" fill="#f59e0b"/>
      <!-- Fedora Hat & Chiaroscuro Face -->
      <circle cx="120" cy="166" r="15" fill="#090912"/>
      <ellipse cx="120" cy="156" rx="34" ry="6.5" fill="#090912" stroke="#fbbf24" stroke-width="0.9" transform="rotate(-5 120 156)"/>
      <path d="M 102,155 C 104,136 112,130 120,132 C 128,130 136,136 138,155 Z" fill="#181828" stroke="#fbbf24" stroke-width="0.7"/>
      <!-- Issue Number Box (Top Left) -->
      <g transform="translate(10, 10)">
        <rect width="32" height="36" rx="1" fill="#09090b" stroke="#fbbf24" stroke-width="1.3"/>
        <text x="16" y="14" fill="#fef08a" font-family="'Figtree',sans-serif" font-size="${issueSize}" font-weight="800" text-anchor="middle">${activeIssue}</text>
        <line x1="5" y1="17.5" x2="27" y2="17.5" stroke="#fbbf24" stroke-width="0.8"/>
        <text x="16" y="25.5" fill="#fef08a" font-family="'Figtree',sans-serif" font-size="6.2" font-weight="700" text-anchor="middle">OCT</text>
        <text x="16" y="33" fill="#cbd5e1" font-family="'Figtree',sans-serif" font-size="5.5" text-anchor="middle">$4.50</text>
      </g>
      <!-- Mandatory Publisher Logo (Top Right) -->
      <g transform="translate(196, 10)">
        <rect width="34" height="24" rx="2" fill="#09090b" stroke="#fbbf24" stroke-width="1.2"/>
        <text x="17" y="11" fill="#fef08a" font-family="'Figtree',sans-serif" font-size="6.2" font-weight="900" text-anchor="middle">LUXE</text>
        <text x="17" y="19" fill="#cbd5e1" font-family="'Figtree',sans-serif" font-size="5" font-weight="700" text-anchor="middle">NOIR</text>
      </g>
      <!-- Creator Byline & Mandatory Barcode Strip (Bottom) -->
      <rect x="0" y="304" width="240" height="26" fill="#06060c" opacity="0.96"/>
      <g transform="translate(8, 308)">
        <rect width="34" height="18" rx="1.5" fill="#f8fafc"/>
        <path d="M4,3 v12 M7,3 v12 M9,3 v12 M13,3 v12 M16,3 v12 M18,3 v12 M22,3 v12 M25,3 v12 M29,3 v12" stroke="#0f172a" stroke-width="1.2"/>
      </g>
      <text x="138" y="320" fill="#fef08a" font-family="'Figtree',sans-serif" font-size="${bylineSize}" font-weight="700" text-anchor="middle" letter-spacing="0.8">${activeByline}</text>
    `;
    }
  }
};

const EYE_TRACK_FLOW = {
  name: {
    en: "Art-First Reading Flow",
    id: "Alur Baca Berpusat pada Ilustrasi (Art-First)"
  },
  subtitle: {
    en: "1. Illustration → 2. Title → 3. Story Tagline → 4. Issue Number → 5. Creator Byline → 6. Mandatories (Logo & Barcode)",
    id: "1. Ilustrasi Utama → 2. Judul Komik → 3. Tagline Cerita → 4. Nomor Edisi → 5. Nama Kreator → 6. Mandatori (Logo & Barcode)"
  },
  steps: [
    { key: "illustration", x: 120, y: 192, label: { en: "Illustration", id: "Ilustrasi Utama" } },
    { key: "title",        x: 120, y: 66,  label: { en: "Title", id: "Judul Komik" } },
    { key: "tagline",      x: 120, y: 92,  label: { en: "Story Tagline", id: "Tagline Cerita" } },
    { key: "issue",        x: 26,  y: 28,  label: { en: "Issue Number", id: "Nomor Edisi" } },
    { key: "byline",       x: 138, y: 317, label: { en: "Creator Byline", id: "Nama Kreator" } },
    { key: "mandatories",  x: 213, y: 22,  label: { en: "Mandatories (Logo)", id: "Mandatori (Logo)" } },
  ]
};

function renderEyeTrackSvg(L) {
  const pts = EYE_TRACK_FLOW.steps;
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const nodes = pts.map((p, i) => {
    return `
      <g class="eye-node" transform="translate(${p.x}, ${p.y})">
        <circle r="9.5" fill="#1e1b18" stroke="#fffdf8" stroke-width="2"/>
        <text y="3.5" text-anchor="middle" font-family="'Figtree',sans-serif" font-size="8.5" font-weight="800" fill="#fffdf8">${i + 1}</text>
      </g>
    `;
  }).join("");

  return `
    <g class="eye-track-layer">
      <path d="${pathD}" fill="none" stroke="rgba(255, 253, 248, 0.85)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${pathD}" fill="none" stroke="#b8553a" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round" stroke-linejoin="round"/>
      ${nodes}
      <g class="eye-gaze-puck">
        <circle r="14" fill="rgba(245, 158, 11, 0.32)" stroke="#fef08a" stroke-width="1.5">
          <animateMotion dur="7.2s" repeatCount="indefinite" path="${pathD}" calcMode="linear"/>
        </circle>
        <circle r="5" fill="#fef08a" stroke="#b8553a" stroke-width="2">
          <animateMotion dur="7.2s" repeatCount="indefinite" path="${pathD}" calcMode="linear"/>
        </circle>
      </g>
    </g>
  `;
}

function generateCoverSvg(L, title, font, genre, showEyeTrack = false, customTagline = "", customIssue = "", customCreator = "") {
  const g = GENRES[genre] || GENRES.action;
  const f = font || fontByName(g.defaultFont);
  const cleanTitle = (title || "MOON HARBOR").trim().toUpperCase() || "MOON HARBOR";
  const len = cleanTitle.length;
  const fontSize = len <= 7 ? 32 : len <= 10 ? 27 : len <= 14 ? 22 : len <= 18 ? 18 : len <= 22 ? 15 : 13;
  const letterSpacing = len <= 8 ? "1.5" : len <= 14 ? "0.8" : "0.3";

  return `<svg viewBox="0 0 240 330" class="cover-svg" xmlns="http://www.w3.org/2000/svg" aria-label="Interactive Comic Cover Mockup">
    ${g.renderSvg(L, cleanTitle, f, fontSize, letterSpacing, g.byline, customTagline, customIssue, customCreator)}
    ${showEyeTrack ? renderEyeTrackSvg(L) : ""}
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
    ["Anton", bi(L, "Loud and heavy. Action, urgency.", "Lantang dan tegas. Aksi, ketegangan.")],
    ["Cormorant Garamond", bi(L, "Elegant and delicate. Romance, period drama.", "Anggun dan halus. Romansa, drama sejarah.")],
    ["Fredoka", bi(L, "Round and friendly. Kids' stories, comedy.", "Membulat dan ramah. Cerita anak, komedi.")],
    ["Orbitron", bi(L, "Cold and technological. Sci-fi.", "Dingin dan berkesan teknologi. Fiksi ilmiah.")],
    ["Pirata One", bi(L, "Old and ominous. Dark fantasy.", "Kuno dan mencekam. Fantasi gelap.")],
    ["Rye", bi(L, "Weathered and rustic. Westerns.", " Klasik dan bertekstur kayu. Tema koboi/Western.")],
  ].map(([n, d]) => {
    const s = h("span", { class: "sample", style: `font-family:${stackOf(n)}` }, demoTitle);
    samples.push(s);
    return h("div", { class: "fcard" }, s, h("p", { class: "cap" }, h("strong", null, n), d));
  });

  const voiceCoverExamples = [
    makeCoverCard({
      badge: bi(L, "Loud & Monolithic Voice", "Suara Visual Lantang & Monolitik"),
      badgeColor: "#18181b",
      title: bi(L, "Lost Fantasy Vol. 1", "Lost Fantasy Vol. 1"),
      coverSrc: "covers/lost-fantasy-volume-1-9781534331303_xlg.jpg",
      swatches: [
        { hex: "#09090b", label: bi(L, "Heavy Block Sans", "Sans Balok Tebal") },
        { hex: "#facc15", label: bi(L, "Brutalist Impact", "Dampak Brutalis") }
      ],
      text: bi(L,
        "The gigantic, solid black block letters of LOST FANTASY speak with an unshakeable, thunderous voice—mirroring the massive stone giant looming behind the hero.",
        "Huruf balok hitam raksasa pada LOST FANTASY berbicara dengan suara visual menggelegar yang tak tergoyahkan—mencerminkan raksasa batu yang menjulang di belakang sang pahlawan."
      ),
      note: bi(L, "Voice: Unstoppable, heavy, modern epic.", "Karakter suara: Tak terbendung, berat, epik modern.")
    }),
    makeCoverCard({
      badge: bi(L, "Graceful & Regal Voice", "Suara Visual Anggun & Bangsawan"),
      badgeColor: "#be123c",
      title: bi(L, "Yona of the Dawn Vol. 1", "Yona of the Dawn Vol. 1"),
      coverSrc: "covers/yona-of-the-dawn-vol-1-9781421587813_hr.jpg",
      swatches: [
        { hex: "#e11d48", label: bi(L, "Calligraphic Serif", "Serif Kaligrafis") },
        { hex: "#f43f5e", label: bi(L, "Delicate Curves", "Lekuk Halus") }
      ],
      text: bi(L,
        "The sweeping, tapered serif strokes of YONA speak in a poised, noble voice. Even with a drawn sword, the typography tells us this is a story of royal lineage, heart, and destiny.",
        "Goresan serif meruncing yang mengalir pada YONA berbicara dengan nada anggun dan berwibawa. Meski sang tokoh memegang pedang, tipografinya menyampaikan kisah garis keturunan kerajaan dan takdir."
      ),
      note: bi(L, "Voice: Poetic, noble, historical romance.", "Karakter suara: Puitis, mulia, romansa sejarah.")
    }),
    makeCoverCard({
      badge: bi(L, "Savage & Slashing Voice", "Suara Visual Buas & Menyabet"),
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
      note: bi(L, "Voice: Ferocious, loud, sword-and-sorcery.", "Karakter suara: Beringas, lantang, pedang-dan-sihir.")
    })
  ];

  return h("div", null,
    quote(bi(L, "Look for the typefaces that embody the qualities of the message you're trying to convey.", "Carilah rupa huruf (typeface) yang mewakili kualitas pesan yang ingin kamu sampaikan."), "Jason Santa Maria"),
    para(bi(L,
      "Typography is not only about making words readable. It is the look, structure and feeling of text, and it brings the words to life. A designer always thinks about the relationship between how the text looks and what the text says.",
      "Tipografi bukan sekadar membuat kata-kata dapat dibaca. Tipografi adalah tampilan visual, struktur, dan rasa dari sebuah teks yang menghidupkan makna kata. Seorang desainer selalu memikirkan keselarasan antara rupa visual teks dan isi pesan yang disampaikan.")),
    para(bi(L,
      "For a comic, the title is the first thing a reader sees. It should look the way your story feels. Same words, six different stories:",
      "Pada sampul komik, judul adalah elemen pertama yang menyapa pembaca. Tampilan hurufnya harus mencerminkan suasana ceritamu. Kata yang sama, enam nuansa cerita yang berbeda:")),
    titleInput(L, (v) => samples.forEach((s) => (s.textContent = v))),
    h("div", { class: "fgrid" }, cards),
    h("h3", null, bi(L, "Type voices on real comic covers", "Suara tipografi pada sampul komik nyata")),
    para(bi(L,
      "Compare how these three real comic covers use completely different typographic voices to announce their genre at a single glance:",
      "Bandingkan bagaimana ketiga sampul komik ini menggunakan karakter suara tipografi yang sangat berbeda untuk menyampaikan genrenya dalam sekali pandang:")),
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
    h("p", { class: "cap" }, h("strong", null, bi(L, "Look for: ", "Ciri visual: ")), STYLES[s][L].cues)));

  const charStyleCovers = [
    makeCoverCard({
      badge: bi(L, "Hard · Old · Mythic Medieval", "Keras · Kuno · Mitologi Abad Pertengahan"),
      badgeColor: "#9a3412",
      title: bi(L, "Absolute Wonder Woman", "Absolute Wonder Woman"),
      coverSrc: "covers/absolute-wonder-woman.jpg",
      swatches: [
        { hex: "#f8fafc", label: bi(L, "Chiseled Gothic", "Gotik Pahat") },
        { hex: "#b91c1c", label: bi(L, "Weathered Texture", "Tekstur Aus") }
      ],
      text: bi(L,
        "Sharp, stone-carved angles with distressed erosion give WONDER WOMAN a Hard, Old, and Threatening character—fitting a fierce warrior raised in the underworld.",
        "Sudut pahatan batu yang tajam dengan tekstur aus memberi WONDER WOMAN karakter Keras, Kuno, dan Mengancam—sangat pas untuk pejuang tangguh yang tumbuh di dunia bawah."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Fast · Hot · Hand-Brushed", "Cepat · Panas · Sapuan Kuas"),
      badgeColor: "#ea580c",
      title: bi(L, "Naruto Vol. 47", "Naruto Vol. 47"),
      coverSrc: "covers/whats-your-favorite-manga-cover-v0-1z63aihyj9vc1.jpeg",
      swatches: [
        { hex: "#f97316", label: bi(L, "Hot & Energetic", "Panas & Berenergi") },
        { hex: "#1d4ed8", label: bi(L, "Organic Brush", "Kuas Organik") }
      ],
      text: bi(L,
        "Rough brush strokes, flared ends, and high-energy angles give NARUTO a Fast, Hot, and Young personality—radiating raw martial-arts momentum.",
        "Sapuan kuas kasar dan sudut miring penuh energi memberi judul NARUTO kepribadian Cepat, Panas, dan Muda—memancarkan dinamika aksi bela diri yang meledak-ledak."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Style Contrast: Stencil vs. Retro Script", "Kontras Gaya: Stensil vs. Skrip Retro"),
      badgeColor: "#7f1d1d",
      title: bi(L, "The Punisher vs. Thunderbolts", "The Punisher vs. Thunderbolts"),
      coverSrc: "covers/md_7eee34353e54-punisher.jpg",
      swatches: [
        { hex: "#991b1b", label: bi(L, "1950s Diner Script", "Skrip Restoran 1950-an") },
        { hex: "#18181b", label: bi(L, "Military Stencil", "Stensil Militer") }
      ],
      text: bi(L,
        "A brilliant style juxtaposition: THE PUNISHER uses a hard military stencil, while Thunderbolts uses a sweet, curvy 1950s milkshake-diner script—matching the ironic date-night shootout!",
        "Perpaduan dua gaya yang kontras: THE PUNISHER memakai stensil militer yang keras, sedangkan Thunderbolts memakai skrip restoran retro 1950-an yang manis—selaras dengan adegan kencan bersenjata yang ironis!"
      )
    })
  ];

  return h("div", null,
    para(bi(L,
      "Just like people, every typeface has a character. We can describe it with pairs of opposites. Each word below is set in a font that shows it:",
      "Layaknya manusia, setiap rupa huruf memiliki kepribadian atau karakter. Kita dapat mengenalinya lewat pasangan sifat yang berlawanan. Setiap kata di bawah ini ditampilkan dengan huruf yang mewakili sifatnya:")),
    h("div", { class: "pairs" }, pairs),
    h("h3", null, bi(L, "Styles: the world a font comes from", "Gaya: latar dunia dan zaman sebuah huruf")),
    para(bi(L,
      "Besides character, fonts have a style: an era, a place or a mood they belong to. Tap a style to read how to recognise it.",
      "Selain karakter sifat, huruf juga memiliki gaya: latar zaman, budaya, atau suasana tempat huruf itu berasal. Klik salah satu gaya di bawah untuk mempelajari ciri-cirinya.")),
    h("div", { class: "style-list" }, styles),
    callout(bi(L, "Mood is a blend", "Suasana (mood) adalah perpaduan"),
      bi(L,
        "A title's mood comes from the look of the typeface, plus how readable your design is, plus what the words themselves mean. These feelings are common tendencies, not strict rules: cultures differ and one font can carry several moods.",
        "Suasana sebuah judul lahir dari perpaduan estetika huruf, tingkat keterbacaan desainmu, serta makna kata itu sendiri. Kesan ini bersifat kecenderungan visual, bukan aturan kaku: konteks budaya bisa berbeda dan satu huruf dapat membawakan beberapa nuansa sekaligus.")),
    h("h3", null, bi(L, "Character & style on real comic covers", "Karakter & gaya pada sampul komik nyata")),
    para(bi(L,
      "See how professional comic covers combine character poles (hard/soft, fast/slow, old/young) with historical or cultural styles:",
      "Lihat bagaimana sampul komik profesional memadukan kutub karakter (keras/lembut, cepat/lambat, kuno/muda) dengan gaya zaman atau budaya tertentu:")),
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
  const s = slider(bi(L, "Cover size", "Ukuran tampilan sampul"), 14, 64, 1, 56, (v) => {
    a.style.fontSize = b.style.fontSize = v + "px";
    cap.textContent = v < 26
      ? bi(L, "At thumbnail size the decorative script is hard to read, while the display face still works. Legibility matters!", "Pada ukuran kecil (thumbnail), huruf skrip dekoratif menjadi sulit dikenali, sementara huruf display tetap terbaca jelas. Keterbacaan (legibility) sangat penting!")
      : bi(L, "Now shrink the slider. Which title survives first?", "Sekarang geser untuk memperkecil ukuran. Judul mana yang tetap terbaca jelas?");
  }, (v) => v + "px");
  s.fire();

  const roleCovers = [
    makeCoverCard({
      badge: bi(L, "Display Face Role", "Peran Huruf Display (Display Face)"),
      badgeColor: "#0284c7",
      title: bi(L, "Ultimate Spider-Man Vol. 3", "Ultimate Spider-Man Vol. 3"),
      coverSrc: "covers/ultimate-spider-man-volume-3.jpg",
      swatches: [
        { hex: "#f8fafc", label: bi(L, "Bold Display Sans", "Display Sans Tegas") },
        { hex: "#f59e0b", label: bi(L, "High Thumbnail Legibility", "Terbaca di Ukuran Kecil") }
      ],
      text: bi(L,
        "ULTIMATE SPIDER-MAN uses a clean, assertive display sans-serif. Even when shrunk to a tiny digital store thumbnail, every letterform remains crisp and unmistakable.",
        "ULTIMATE SPIDER-MAN menggunakan huruf display sans-serif yang lugas dan tegas. Bahkan saat diperkecil ke ukuran katalog digital di ponsel, setiap hurufnya tetap tajam dan mudah dikenali."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Decorative Face Role", "Peran Huruf Dekoratif (Decorative Face)"),
      badgeColor: "#ca8a04",
      title: bi(L, "One Piece Vol. 30", "One Piece Vol. 30"),
      coverSrc: "covers/yellowcover1.png",
      swatches: [
        { hex: "#0284c7", label: bi(L, "Novelty Pirate Logo", "Logo Bajak Laut Unik") },
        { hex: "#dc2626", label: bi(L, "Character-Driven Shapes", "Bentuk Berkarakter Kuat") }
      ],
      text: bi(L,
        "ONE PIECE turns letters into pirate symbols—a skull for the 'O', Luffy's silhouette for the 'I', and an anchor for the 'E'. Iconic for a main logo, though impossible to use for body text!",
        "ONE PIECE mengubah huruf menjadi simbol bajak laut—tengkorak untuk huruf 'O', siluet Luffy untuk 'I', dan jangkar untuk 'E'. Sangat ikonik sebagai logo utama, namun tidak mungkin dipakai untuk teks paragraf!"
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
        "Perhatikan perpaduan cerdas ini: judul utama memakai huruf dekoratif horor yang ekspresif, sedangkan nama kreator di bagian atas memakai sans-serif sederhana yang tenang agar tidak saling berebut perhatian."
      )
    })
  ];

  return h("div", null,
    para(bi(L,
      "One of the most useful ways to sort typefaces is by the role they play on the page: text, display and decorative.",
      "Salah satu cara paling praktis untuk mengelompokkan rupa huruf adalah berdasarkan fungsi dan perannya pada halaman: huruf teks (text type), huruf judul (display type), dan huruf dekoratif (decorative type).")),
    h("div", { class: "rolegrid" },
      role(bi(L, "Text face", "Text face (Huruf Teks)"), "Libre Baskerville",
        bi(L, "Made for long passages, like books and magazines. The focus is readability: reading fast for a long time without tiring.", "Dirancang untuk bacaan panjang seperti isi buku, balon dialog, dan narasi. Fokus utamanya adalah kenyamanan baca (readability) agar mata tidak cepat lelah."),
        bi(L, "Quiet, even, conventional shapes.", "Bentuk hurufnya tenang, proporsional, dan familier.")),
      role(bi(L, "Display face", "Display face (Huruf Judul)"), "Anton",
        bi(L, "Made for larger sizes: headings, titles, headlines. Eye-catching yet still legible, and a good mixer with other fonts.", "Dirancang untuk ukuran besar seperti judul sampul dan tajuk utama. Mencolok sekaligus tetap jelas terbaca, serta mudah dipadukan dengan huruf pendamping."),
        bi(L, "Assertive, but not so quirky that it competes.", "Tegas dan berwibawa tanpa mengorbankan kejelasan bentuk.")),
      role(bi(L, "Decorative face", "Decorative face (Huruf Dekoratif)"), "Pirata One",
        bi(L, "Character actors of typography. Their job is to grab attention at all cost, often including legibility. Most go in and out of style.", "Aktor berkarakter kuat dalam tipografi. Tugasnya memikat perhatian secara instan dan membangun tema spesifik, meski terkadang mengurangi keterbacaan pada ukuran kecil."),
        bi(L, "Novelty shapes, strong personality, less versatile.", "Bentuk unik, kepribadian sangat tematik, hanya untuk judul pendek."))),
    callout(bi(L, "For your comic", "Penerapan pada komikmu"),
      bi(L,
        "Your title is display or decorative territory. Your speech balloons and captions are long reading, so keep them in a clear text-friendly font or clean comic lettering. Remember: text faces can also work big, but decorative faces rarely work small.",
        "Judul sampul komik adalah ranah huruf display atau dekoratif. Sebaliknya, balon dialog, subjudul panjang, dan nama kreator membutuhkan huruf teks yang bersih dan mudah dibaca. Ingat: huruf teks tetap bagus saat diperbesar, tetapi huruf dekoratif hampir selalu hancur saat diperkecil.")),
    h("h3", null, bi(L, "Three signs of legibility", "Tiga kunci keterbacaan huruf (legibility)")),
    bullets([
      bi(L, "Conventional letterforms: letters that look the way we expect.", "Bentuk anatomi huruf yang familier: huruf langsung dikenali tanpa membuat pembaca menebak-nebak."),
      bi(L, "Generous spacing between letters and words.", "Ruang dalam huruf (counter) dan jarak antarhuruf yang cukup lega sehingga tidak saling menempel."),
      bi(L, "A tall x-height: lowercase letters that are big compared with capitals.", "Tinggi huruf kecil (x-height) yang proporsional dan terbuka sehingga tetap jelas pada ukuran kecil."),
    ]),
    h("h3", null, bi(L, "The thumbnail test", "Uji ukuran kecil (Thumbnail Test)")),
    h("div", { class: "demo demo-split" }, h("div", { class: "demo-stage" }, h("div", null, a), h("div", null, b)), h("div", { class: "demo-ctrls" }, s.row, cap)),
    h("h3", null, bi(L, "Display, Decorative & Text roles on real covers", "Peran Display, Decorative & Text pada sampul nyata")),
    para(bi(L,
      "Here is how real comic covers balance bold display faces, custom decorative logos, and clean supporting text:",
      "Berikut cara sampul komik profesional menyeimbangkan huruf display yang tegas, logo dekoratif kustom, dan teks pendukung yang bersih:")),
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
      ? bi(L, "Pick two to four words above to see fonts that carry them.", "Pilih dua hingga empat kata sifat di atas untuk melihat rekomendasi huruf yang sesuai.")
      : ranked.length ? bi(L, "Fonts that match most of your words (these will generate your cover in Lesson 5!):", "Rupa huruf yang paling cocok dengan pilihanmu (otomatis diterapkan ke sampul interaktif di Pelajaran 5!):")
        : bi(L, "No font in our small library matches. Try fewer or different words.", "Belum ada huruf di koleksi ini yang cocok dengan kombinasi tersebut. Coba kurangi atau ganti kata pilihanmu.");
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

  /* Large, high-legibility specimen SVGs for Lesson 4 (Design Intent, Aesthetics, and Mood) */
  const cooperSvg = `<svg viewBox="0 0 320 252" class="specimen-svg" xmlns="http://www.w3.org/2000/svg" aria-label="Cooper Black Specimen">
    <rect width="320" height="252" rx="10" fill="#fcf9f2" stroke="#dcd3c3" stroke-width="1.5"/>
    <rect x="14" y="12" width="156" height="22" rx="4" fill="#2a2825"/>
    <text x="92" y="27" fill="#fcf9f2" font-family="'Figtree',sans-serif" font-size="11" font-weight="800" text-anchor="middle" letter-spacing="0.5">COOPER BLACK (1922)</text>
    <text x="18" y="66" fill="#b8553a" font-family="'Fraunces',Georgia,serif" font-size="32" font-weight="900" text-anchor="start">Cooper Black</text>
    <!-- Top box: Intended Use -->
    <g transform="translate(12, 80)">
      <rect width="296" height="74" rx="7" fill="#eef6f0" stroke="#74a889" stroke-width="1.5"/>
      <text x="16" y="25" fill="#1e1b18" font-family="'Fraunces',Georgia,serif" font-size="17" font-weight="900" text-anchor="start">BAKERY &amp; POSTERS</text>
      <text x="16" y="46" fill="#25603e" font-family="'Figtree',sans-serif" font-size="12.5" font-weight="800" text-anchor="start">${bi(L, "✓ INTENDED: Big Signs & Headlines", "✓ TEPAT: Papan Nama & Judul Besar")}</text>
      <text x="16" y="64" fill="#475569" font-family="'Figtree',sans-serif" font-size="11.5" font-weight="600" text-anchor="start">${bi(L, "Warm, bold & clear at large display sizes", "Hangat, tebal & jelas pada ukuran besar")}</text>
    </g>
    <!-- Bottom box: Misused -->
    <g transform="translate(12, 164)">
      <rect width="296" height="74" rx="7" fill="#fdf1ef" stroke="#d48478" stroke-width="1.5"/>
      <text x="16" y="24" fill="#2a2825" font-family="'Fraunces',Georgia,serif" font-size="11.5" font-weight="900" text-anchor="start" letter-spacing="-0.3">${bi(L, "Tiny body text clogs up and tires the eyes fast...", "Teks paragraf kecil menjadi penuh dan melelahkan mata...")}</text>
      <text x="16" y="46" fill="#9e2a1c" font-family="'Figtree',sans-serif" font-size="12.5" font-weight="800" text-anchor="start">${bi(L, "✗ MISUSED: Small Book Body Text", "✗ SALAH: Teks Isi Buku Berukuran Kecil")}</text>
      <text x="16" y="64" fill="#475569" font-family="'Figtree',sans-serif" font-size="11.5" font-weight="600" text-anchor="start">${bi(L, "Heavy strokes blot together at small sizes", "Goresan tebal saling menutup di ukuran kecil")}</text>
    </g>
  </svg>`;

  const souvenirSvg = `<svg viewBox="0 0 320 252" class="specimen-svg" xmlns="http://www.w3.org/2000/svg" aria-label="ITC Souvenir Specimen">
    <rect width="320" height="252" rx="10" fill="#fcf9f2" stroke="#dcd3c3" stroke-width="1.5"/>
    <rect x="14" y="12" width="156" height="22" rx="4" fill="#2a2825"/>
    <text x="92" y="27" fill="#fcf9f2" font-family="'Figtree',sans-serif" font-size="11" font-weight="800" text-anchor="middle" letter-spacing="0.5">ITC SOUVENIR (1970)</text>
    <text x="18" y="66" fill="#b8553a" font-family="'Cormorant Garamond',Georgia,serif" font-size="33" font-style="italic" font-weight="700" text-anchor="start">ITC Souvenir</text>
    <!-- Top box: Wrong aesthetic match -->
    <g transform="translate(12, 80)">
      <rect width="296" height="74" rx="7" fill="#fdf1ef" stroke="#d48478" stroke-width="1.5"/>
      <text x="16" y="25" fill="#1e1b18" font-family="'Fredoka','Cormorant Garamond',serif" font-size="16.5" font-weight="600" text-anchor="start">First National Bank Vault</text>
      <text x="16" y="46" fill="#9e2a1c" font-family="'Figtree',sans-serif" font-size="12.5" font-weight="800" text-anchor="start">${bi(L, "✗ MISMATCH: Corporate Security Bank", "✗ TIDAK COCOK: Bank & Brankas Korporat")}</text>
      <text x="16" y="64" fill="#475569" font-family="'Figtree',sans-serif" font-size="11.5" font-weight="600" text-anchor="start">${bi(L, "Soft, bouncy curves feel too casual & playful", "Lekuk membulat terasa terlalu santai & kurang serius")}</text>
    </g>
    <!-- Bottom box: Right aesthetic match -->
    <g transform="translate(12, 164)">
      <rect width="296" height="74" rx="7" fill="#eef6f0" stroke="#74a889" stroke-width="1.5"/>
      <text x="16" y="25" fill="#1e1b18" font-family="'Fredoka','Cormorant Garamond',serif" font-size="16.5" font-weight="600" text-anchor="start">70s Folk Music &amp; Cozy Tales</text>
      <text x="16" y="46" fill="#25603e" font-family="'Figtree',sans-serif" font-size="12.5" font-weight="800" text-anchor="start">${bi(L, "✓ MATCH: Warm Nostalgia & Slice-of-Life", "✓ COCOK: Nostalgia 70-an & Kisah Hangat")}</text>
      <text x="16" y="64" fill="#475569" font-family="'Figtree',sans-serif" font-size="11.5" font-weight="600" text-anchor="start">${bi(L, "Friendly, relaxed voice fits warm storytelling", "Karakter ramah & akrab selaras dengan cerita hangat")}</text>
    </g>
  </svg>`;

  const moodSvg = `<svg viewBox="0 0 320 252" class="specimen-svg" xmlns="http://www.w3.org/2000/svg" aria-label="Mood Specimen Comparison">
    <rect width="320" height="252" rx="10" fill="#fcf9f2" stroke="#dcd3c3" stroke-width="1.5"/>
    <rect x="14" y="12" width="180" height="22" rx="4" fill="#2a2825"/>
    <text x="104" y="27" fill="#fcf9f2" font-family="'Figtree',sans-serif" font-size="11" font-weight="800" text-anchor="middle" letter-spacing="0.4">${bi(L, "SAME WORDS · 2 MOODS", "KATA SAMA · 2 SUASANA")}</text>
    <!-- Mood A: Sweet Romance -->
    <g transform="translate(12, 42)">
      <rect width="296" height="96" rx="7" fill="#fff1f2" stroke="#f43f5e" stroke-width="1.5"/>
      <text x="16" y="30" fill="#be123c" font-family="'Cormorant Garamond',Georgia,serif" font-size="24" font-style="italic" font-weight="700" text-anchor="start">${bi(L, "See You Tonight", "Sampai Jumpa Malam Ini")}</text>
      <text x="16" y="58" fill="#9f1239" font-family="'Figtree',sans-serif" font-size="12.5" font-weight="800" text-anchor="start">${bi(L, "♥ MOOD A: Warm Romantic Promise", "♥ SUASANA A: Janji Romantis yang Hangat")}</text>
      <text x="16" y="78" fill="#475569" font-family="'Figtree',sans-serif" font-size="11.5" font-weight="600" text-anchor="start">${bi(L, "Flowing serif + airy spacing = gentle & intimate", "Serif mengalir + jarak lapang = lembut & intim")}</text>
    </g>
    <!-- Mood B: Slasher Horror -->
    <g transform="translate(12, 146)">
      <rect width="296" height="96" rx="7" fill="#18181b" stroke="#dc2626" stroke-width="1.5"/>
      <text x="16" y="32" fill="#ef4444" font-family="'Pirata One',serif" font-size="25" text-anchor="start" letter-spacing="1.2">${bi(L, "SEE YOU TONIGHT", "SAMPAI JUMPA MALAM INI")}</text>
      <text x="16" y="60" fill="#fca5a5" font-family="'Figtree',sans-serif" font-size="12.5" font-weight="800" text-anchor="start">${bi(L, "☠ MOOD B: Chilling Horror Threat!", "☠ SUASANA B: Ancaman Horor Mencekam!")}</text>
      <text x="16" y="80" fill="#cbd5e1" font-family="'Figtree',sans-serif" font-size="11.5" font-weight="600" text-anchor="start">${bi(L, "Spiky gothic + dark contrast = sinister stalker", "Gotik tajam + kontras gelap = teror mencekam")}</text>
    </g>
  </svg>`;

  const moodTitle = bi(L, "THE LAST WITNESS", "SAKSI TERAKHIR");
  const moodCards = [
    {
      font: "Anton",
      name: "Anton (All-caps display)",
      genre: bi(L, "Crime Noir / Gritty Thriller", "Kriminal Noir / Thriller Menegangkan"),
      feel: bi(L, "Heavy, razor-sharp, urgent. The witness is on the run from ruthless assassins.", "Berat, tajam, mendesak. Sang saksi sedang diburu oleh pembunuh bayaran kejam.")
    },
    {
      font: "Chewy",
      name: "Chewy (Rounded cartoon)",
      genre: bi(L, "Slapstick Comedy / Cartoon", "Komedi Kartun / Petualangan Ceria"),
      feel: bi(L, "Bubbly, bouncy, cheerful. The only witness to the cookie heist is an innocent puppy!", "Bulat, lentur, ceria. Satu-satunya saksi pencurian kue adalah anak anjing yang polos!")
    },
    {
      font: "Pirata One",
      name: "Pirata One (Gothic blackletter)",
      genre: bi(L, "Supernatural Horror / Dark Fantasy", "Horor Supranatural / Fantasi Gelap"),
      feel: bi(L, "Spiky, ancient, ominous. The witness to an occult curse sealed in a haunted manor.", "Berduri, kuno, mencekam. Saksi kutukan gaib yang terkunci di dalam puri tua berhantu.")
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
      "Rupa huruf harus sesuai dengan konteks penggunaannya, ibarat mengenakan pakaian yang tepat untuk suatu acara. Ada tiga aspek utama yang perlu diperiksa:")),
    h("div", { class: "rolegrid" },
      h("div", { class: "rolecard" },
        h("span", { class: "role-name" }, bi(L, "1. Design intent", "1. Tujuan Perancangan (Design Intent)")),
        raw(cooperSvg, "specimen-wrap"),
        h("p", null, bi(L, "A typeface designed for signage, like Cooper Black, probably will not work as the body text of a book. Always ask what the font was engineered to do.", "Huruf yang dirancang khusus untuk papan nama atau poster besar, seperti Cooper Black, tentu tidak cocok dijadikan teks paragraf buku. Selalu kenali tujuan awal huruf tersebut dibuat."))),
      h("div", { class: "rolecard" },
        h("span", { class: "role-name" }, bi(L, "2. Aesthetics", "2. Estetika Visual (Aesthetics)")),
        raw(souvenirSvg, "specimen-wrap"),
        h("p", null, bi(L, "A bank that sets its logo or ad campaign in Souvenir, a light-hearted, free-spirited font, feels a little too playful. Ask whether the visual voice matches who is speaking.", "Sebuah bank yang memakai ITC Souvenir—huruf yang membulat, santai, dan berjiwa bebas—akan terasa kurang berwibawa. Pastikan kepribadian visual huruf selaras dengan siapa yang berbicara."))),
      h("div", { class: "rolecard" },
        h("span", { class: "role-name" }, bi(L, "3. Mood", "3. Suasana Cerita (Mood)")),
        raw(moodSvg, "specimen-wrap"),
        h("p", null, bi(L, "Mood = Typeface Aesthetics + Designed Readability + Word Meaning. Look how 'See You Tonight' turns from a sweet romance into a chilling threat just by changing the font and treatment!", "Suasana = Estetika Huruf + Keterbacaan + Makna Kata. Lihat bagaimana kalimat 'Sampai Jumpa Malam Ini' berubah drastis dari janji romantis menjadi ancaman horor hanya karena pergantian huruf!")))),
    h("h3", null, bi(L, "Mood in action: One title, three distinct genres", "Suasana dalam aksi: Satu judul, tiga genre berbeda")),
    para(bi(L,
      "Look at how the exact same title words completely transform their storytelling genre just by switching the typeface:",
      "Perhatikan bagaimana kata judul yang persis sama berubah genrenya secara total hanya dengan mengganti rupa hurufnya:")),
    h("div", { class: "mood-grid" }, moodCards),
    callout(bi(L, "The core takeaway", "Inti pelajaran"),
      bi(L,
        "Before the reader has even read page one or understood the story, the typeface's mood has already told them whether to laugh, tense up, or look over their shoulder.",
        "Bahkan sebelum pembaca membuka halaman pertama, suasana rupa huruf pada sampul sudah memberi sinyal apakah mereka akan tertawa, menahan napas tegang, atau merinding.")),
    h("h3", null, bi(L, "Real comic covers: Matching font to character", "Sampul komik nyata: Menyelaraskan huruf dengan tokoh")),
    para(bi(L,
      "Look at how these three covers translate their main character's personality directly into the shape of the title logo:",
      "Perhatikan bagaimana ketiga sampul ini menerjemahkan kepribadian tokoh utamanya langsung ke dalam bentuk anatomi logo judul:")),
    h("div", { class: "color-cover-grid cols-3" }, matchCovers),
    h("h3", null, bi(L, "From character to font in three steps", "Dari karakter tokoh ke pilihan huruf dalam tiga langkah")),
    h("ol", { class: "steps" },
      h("li", null, bi(L, "Describe your story or main character in three words.", "Deskripsikan cerita atau sifat tokoh utamamu dalam tiga kata kunci.")),
      h("li", null, bi(L, "Turn them into character and style words (lesson 2).", "Terjemahkan ke dalam kata kunci karakter dan gaya huruf (Pelajaran 2).")),
      h("li", null, bi(L, "Test two or three fonts with your real title, then step back and squint.", "Uji dua atau tiga rupa huruf pada judul aslimu, lalu mundur selangkah dan sipitkan mata."))),
    callout(bi(L, "Example", "Contoh penerapan"),
      bi(L, "A shy girl who sees ghosts: delicate, soft, old. That points toward fine, flowing serif or script faces rather than heavy block letters.", "Seorang gadis pemalu yang bisa melihat hantu: halus, lembut, kuno. Karakter ini mengarah pada huruf serif atau skrip yang ramping dan mengalir, bukan huruf balok yang tebal dan kaku.")),
    h("h3", null, bi(L, "Try the matchmaker", "Coba pencocok huruf (Font Matchmaker)")),
    titleInput(L, (v) => sampleEls.forEach((s) => (s.textContent = v))),
    h("p", { class: "small-label" }, bi(L, "Character", "Karakter Sifat")),
    h("div", { class: "chipset" }, traitKeys.map((k) => chip("p:" + k, TRAITS[k][L].label))),
    h("p", { class: "small-label" }, bi(L, "Style", "Gaya Visual")),
    h("div", { class: "chipset" }, styleKeys.map((k) => chip("s:" + k, STYLES[k][L].label))),
    hint, results,
  );
}

/* ================= Lesson 5 ================= */
function lessonHabits(L) {
  let showEyeTrack = false;

  const getCoverParams = () => {
    const ranked = getRankedFonts(matchmakerState.picked);
    const font = matchmakerState.topFont || (ranked.length ? ranked[0].f : fontByName("Anton"));
    const genre = matchmakerState.genre || detectGenre(matchmakerState.picked, font);
    const gInfo = GENRES[genre] || GENRES.action;
    const title = demoTitle || "MOON HARBOR";
    const tagline = demoTagline.trim() || bi(L, gInfo.tagline.en, gInfo.tagline.id);
    const issueNum = demoIssue.trim() || "1";
    const creatorName = demoCreator.trim() || gInfo.byline;
    return { title, font, genre, tagline, issueNum, creatorName };
  };

  const coverContainer = h("div", { class: "cover-frame" });
  const statusNote = h("div", { class: "cover-sync-box" });
  const tierContainer = h("div", { class: "tier-unified-card" });

  const buildTierDescriptions = (title, font, gInfo, tagline, issueNum, creatorName) => [
    {
      step: 1,
      title: bi(L, "Tier 1 · Illustration", "Tingkat 1 · Ilustrasi Utama"),
      text: bi(
        L,
        `The centerpiece artwork (${gInfo.heroDesc[L]}) hooks the reader emotionally and draws the eye upward.`,
        `Ilustrasi utama (${gInfo.heroDesc[L]}) memikat pembaca secara emosional dan mengarahkan pandangan ke atas.`
      )
    },
    {
      step: 2,
      title: bi(L, "Tier 2 · Title", "Tingkat 2 · Judul Komik"),
      text: bi(
        L,
        `The gaze locks onto the main title "${title}" in ${font.n}, layered cleanly with the art.`,
        `Pandangan mengunci judul utama "${title}" dalam huruf ${font.n}, tersusun selaras dengan ilustrasi.`
      )
    },
    {
      step: 3,
      title: bi(L, "Tier 3 · Story Tagline", "Tingkat 3 · Tagline Cerita"),
      text: bi(
        L,
        `The story teaser ("${tagline}") is read in calm negative space at 25–35% title size.`,
        `Kalimat pemikat ("${tagline}") dibaca di ruang negatif yang tenang dengan ukuran 25–35% judul.`
      )
    },
    {
      step: 4,
      title: bi(L, "Tier 4 · Issue Number", "Tingkat 4 · Nomor Edisi"),
      text: bi(
        L,
        `The corner box marks Issue #${issueNum.replace(/^#/, "")}, price (${gInfo.issue.price}), and rating (${gInfo.issue.tag}).`,
        `Kotak sudut memuat edisi #${issueNum.replace(/^#/, "")}, harga (${gInfo.issue.price}), dan klasifikasi (${gInfo.issue.tag}).`
      )
    },
    {
      step: 5,
      title: bi(L, "Tier 5 · Creator Byline", "Tingkat 5 · Nama Kreator"),
      text: bi(
        L,
        `Creator credits ("${creatorName}") rest cleanly in a readable text face along the margin.`,
        `Nama kreator ("${creatorName}") tertata rapi dengan huruf teks yang bersih di batas tepi.`
      )
    },
    {
      step: 6,
      title: bi(L, "Tier 6 · Mandatories (Logo & Barcode)", "Tingkat 6 · Mandatori (Logo & Barcode)"),
      text: bi(
        L,
        `Publisher logo (${gInfo.publisher}) and UPC barcode sit neatly in outer corners without fighting the artwork.`,
        `Logo penerbit (${gInfo.publisher}) dan barcode ditempatkan rapi di sudut luar tanpa mengganggu ilustrasi utama.`
      )
    }
  ];

  const updateCover = () => {
    const { title, font, genre, tagline, issueNum, creatorName } = getCoverParams();
    const gInfo = GENRES[genre] || GENRES.action;

    coverContainer.innerHTML = generateCoverSvg(L, title, font, genre, showEyeTrack, demoTagline, demoIssue, demoCreator);

    const pickedLabels = [];
    matchmakerState.picked.forEach((k) => {
      if (k.startsWith("p:") && TRAITS[k.slice(2)]) pickedLabels.push(TRAITS[k.slice(2)][L].label);
      if (k.startsWith("s:") && STYLES[k.slice(2)]) pickedLabels.push(STYLES[k.slice(2)][L].label);
    });
    const tagSummary = pickedLabels.length
      ? pickedLabels.join(" · ")
      : bi(L, "Default: Strong · Brutalist", "Bawaan: Kuat · Brutalis");

    statusNote.innerHTML = `
      <div class="cover-sync-header">
        <div class="cover-sync-badge">
          <span class="badge-dot"></span>
          <span>${bi(L, "Live Cover Generated from Lesson 4 Matchmaker", "Sampul Interaktif dari Pencocok Huruf Pelajaran 4")}</span>
        </div>
      </div>
      <div class="cover-sync-details">
        <strong>${escapeXml(title)}</strong>
        <span class="sync-sep">·</span>
        <span class="sync-font" style="font-family:${fontStack(font)}">${font.n}</span>
        <span class="sync-sep">·</span>
        <span class="sync-genre">${gInfo[L]}</span>
      </div>
      <div class="cover-sync-tags"><strong>${bi(L, "Tags applied: ", "Kata kunci aktif: ")}</strong>${escapeXml(tagSummary)}</div>
    `;

    tierContainer.innerHTML = "";
    const tierHead = h("div", { class: "tier-unified-head" },
      h("h4", { class: "tier-unified-title" }, bi(L, "6 Tiers of Reading Flow", "6 Tingkatan Alur Baca")),
      h("span", { class: "tier-unified-badge" }, bi(L, "Art-First Hierarchy", "Hierarki Art-First"))
    );
    const tierList = h("div", { class: "tier-unified-list" });
    const tierData = buildTierDescriptions(title, font, gInfo, tagline, issueNum, creatorName);
    tierData.forEach((item) => {
      const row = h("div", { class: "tier-row" },
        h("div", { class: "tier-row-badge" },
          h("span", { class: `tier-pill t${item.step}` }, String(item.step))
        ),
        h("div", { class: "tier-row-body" },
          h("strong", { class: "tier-row-heading" }, item.title),
          h("p", { class: "tier-row-text" }, item.text)
        )
      );
      tierList.append(row);
    });
    tierContainer.append(tierHead, tierList);
  };

  const eyeToggleBtn = h("button", {
    type: "button",
    class: "eye-toggle-chip",
    "aria-pressed": String(showEyeTrack),
    onclick: () => {
      showEyeTrack = !showEyeTrack;
      eyeToggleBtn.setAttribute("aria-pressed", String(showEyeTrack));
      updateCover();
    }
  }, bi(L, "👁 Eye-Tracking Simulation", "👁 Simulasi Gerak Mata"));

  // 4 inputs for Lesson 5: Title, Tagline, Issue #, Creator Name
  const titleIn = h("input", {
    type: "text",
    class: "demo-input",
    maxlength: "24",
    value: demoTitle,
    placeholder: "MOON HARBOR",
    "aria-label": bi(L, "Comic Title", "Judul Komik"),
    oninput: () => {
      demoTitle = titleIn.value || " ";
      updateCover();
    }
  });

  const taglineIn = h("input", {
    type: "text",
    class: "demo-input",
    maxlength: "40",
    value: demoTagline,
    placeholder: bi(L, "e.g. THE CITY NEVER SLEEPS", "mis. KOTA TAK PERNAH TIDUR"),
    "aria-label": bi(L, "Story Tagline", "Tagline Cerita"),
    oninput: () => {
      demoTagline = taglineIn.value;
      updateCover();
    }
  });

  const issueIn = h("input", {
    type: "text",
    class: "demo-input",
    maxlength: "8",
    value: demoIssue,
    placeholder: "1",
    "aria-label": bi(L, "Issue Number", "Nomor Edisi"),
    oninput: () => {
      demoIssue = issueIn.value;
      updateCover();
    }
  });

  const creatorIn = h("input", {
    type: "text",
    class: "demo-input",
    maxlength: "36",
    value: demoCreator,
    placeholder: bi(L, "e.g. STAN SAKAI", "mis. HASMI & WID NS"),
    "aria-label": bi(L, "Creator Name", "Nama Kreator"),
    oninput: () => {
      demoCreator = creatorIn.value;
      updateCover();
    }
  });

  const inputsGrid = h("div", { class: "cover-inputs-grid" },
    h("label", { class: "cover-input-ctrl" },
      h("span", { class: "ctrl-label" }, bi(L, "1. Comic Title", "1. Judul Komik")),
      titleIn
    ),
    h("label", { class: "cover-input-ctrl" },
      h("span", { class: "ctrl-label" }, bi(L, "2. Story Tagline", "2. Tagline Cerita")),
      taglineIn
    ),
    h("label", { class: "cover-input-ctrl" },
      h("span", { class: "ctrl-label" }, bi(L, "3. Issue / Edition #", "3. Nomor Edisi")),
      issueIn
    ),
    h("label", { class: "cover-input-ctrl" },
      h("span", { class: "ctrl-label" }, bi(L, "4. Creator Name", "4. Nama Kreator")),
      creatorIn
    )
  );

  // Genre preset buttons
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
      badge: bi(L, "Art-First Reading Flow", "Alur Baca Art-First"),
      badgeColor: "#334155",
      title: bi(L, "Gundala: Son of Lightning #1", "Gundala: Putra Petir #1"),
      coverSrc: "covers/cover_GUNDALA_SON_OF_LIGHTNING_1.jpg",
      swatches: [
        { hex: "#333d5c", label: bi(L, "1. Art → 2. Title", "1. Ilustrasi → 2. Judul") },
        { hex: "#0096d6", label: bi(L, "3. Tagline → 4. #1", "3. Tagline → 4. Nomor #1") },
        { hex: "#dc2626", label: bi(L, "5. Byline → 6. Logo", "5. Kreator → 6. Logo Penerbit") }
      ],
      text: bi(L,
        "The crouching hero guides the eye upward to the glowing title.",
        "Sosok tokoh mengarahkan pandangan naik ke judul yang menyala."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Negative Space Framing", "Pembingkaian Ruang Negatif"),
      badgeColor: "#475569",
      title: bi(L, "Absolute Wonder Woman", "Absolute Wonder Woman"),
      coverSrc: "covers/absolute-wonder-woman.jpg",
      swatches: [
        { hex: "#b91c1c", label: bi(L, "1. Art → 2. Title", "1. Ilustrasi → 2. Judul") },
        { hex: "#f8fafc", label: bi(L, "3. Tagline", "3. Tagline") },
        { hex: "#64748b", label: bi(L, "5. Byline → 6. Logo", "5. Kreator → 6. Logo DC") }
      ],
      text: bi(L,
        "Wing silhouettes frame the sky, guiding the eye up to the arched title.",
        "Bentang sayap membingkai ruang kosong yang mengarahkan mata ke judul melengkung."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Art-First Centerpiece", "Pusat Aksi Art-First"),
      badgeColor: "#3f3f46",
      title: bi(L, "Lost Fantasy #12", "Lost Fantasy #12"),
      coverSrc: "covers/large-1588852.jpg",
      swatches: [
        { hex: "#facc15", label: bi(L, "1. Art → 2. Title", "1. Ilustrasi → 2. Judul") },
        { hex: "#09090b", label: bi(L, "3. Issue #12", "3. Edisi #12") },
        { hex: "#e11d48", label: bi(L, "4. Mandatories", "4. Mandatori") }
      ],
      text: bi(L,
        "The fiery dragon confrontation commands attention before leading the gaze to the masthead.",
        "Pertarungan naga berapi langsung menyita perhatian sebelum mengarahkan pandangan ke logo judul."
      )
    })
  ];

  return h("div", null,
    h("h3", null, bi(L, "Cover Hierarchy: Art-First Reading Flow", "Hierarki Sampul: Alur Baca Berpusat pada Ilustrasi (Art-First)")),
    para(bi(L,
      "In comic cover design, the artwork is the primary emotional hook. Guide the reader's eye smoothly across six distinct tiers of information:",
      "Dalam desain sampul komik, ilustrasi adalah penarik emosi utama. Arahkan gerak mata pembaca secara alami melewati enam tingkatan (tier) informasi:")),
    statusNote,
    inputsGrid,
    h("div", { class: "cover-genre-presets" },
      h("span", { class: "cover-genre-label" }, bi(L, "Quick Genre Presets:", "Preset Genre Cepat:")),
      genreButtonsContainer
    ),
    h("div", { class: "flow-switch-panel" },
      h("div", { class: "flow-switch-top" },
        h("span", { class: "small-label" }, bi(L, "Art-First Flow: 1. Illustration → 2. Title → 3. Tagline → 4. Issue # → 5. Byline → 6. Mandatories", "Alur Art-First: 1. Ilustrasi → 2. Judul → 3. Tagline → 4. Nomor Edisi → 5. Kreator → 6. Mandatori")),
        eyeToggleBtn
      )
    ),
    h("div", { class: "split cover-layout-split" },
      tierContainer,
      coverContainer),
    h("h3", null, bi(L, "Good habits for comic covers", "Kebiasaan baik dalam merancang sampul komik")),
    bullets([
      bi(L, "Respect the Negative Space: Place titles, taglines, and mandatories where the art has clean breathing room (sky, dark shadows, flat wash) or use a clean outline/drop shadow against busy textures.", "Hormati Ruang Kosong (Negative Space): Tempatkan judul, tagline, dan elemen mandatori pada area gambar yang memiliki ruang lapang (langit, bayangan gelap) atau tambahkan garis tepi/bayangan halus di atas latar yang ramai."),
      bi(L, "Avoid anachronisms: A blackletter title on a futuristic mech story, or a space font on a Western, pulls readers right out of the comic.", "Hindari anakronisme: Judul bergaya gotik abad pertengahan untuk cerita robot masa depan, atau huruf fiksi ilmiah untuk tema koboi, akan merusak imersi pembaca."),
      bi(L, "Avoid trite correlations: Look at what others have done. If every comedy uses the exact same goofy font, look for fresher ways to be playful.", "Hindari pilihan yang klise: Amati karya yang sudah ada. Jika semua komik komedi memakai rupa huruf konyol yang sama, carilah pendekatan visual yang lebih segar."),
    ]),
    h("h3", null, bi(L, "The Art-First Hierarchy on Real Comic Covers", "Hierarki Art-First pada Sampul Komik Nyata")),
    para(bi(L,
      "Notice how the centerpiece artwork commands attention first and guides the reader's gaze across these three published comic covers:",
      "Perhatikan bagaimana ilustrasi utama menjadi pemikat pertama yang mengarahkan pandangan pembaca pada ketiga sampul komik nyata berikut:")),
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
        role: bi(L, "Dominant (Stormy Slate-Indigo)", "Dominan (Biru-Indigo Badai)"),
        desc: bi(L, "Overcast storm clouds, lightning sky, and rainy rooftops establish a gritty, cinematic atmosphere.", "Awan badai mendung, langit petir, dan atap kota yang basah membangun atmosfer sinematik yang kelam.")
      },
      c30: {
        hex: "#141824", ink: "#ffffff",
        role: bi(L, "Secondary (Charcoal Suit)", "Sekunder (Hitam Arang Kostum)"),
        desc: bi(L, "Dark tactical armor carves out the hero's grounded silhouette against the stormy sky.", "Kostum taktis gelap membentuk siluet kokoh sang pahlawan di depan langit badai.")
      },
      c10: {
        hex: "#dc2626", ink: "#ffffff",
        role: bi(L, "Accent (Vibrant Red)", "Aksen (Merah Menyala)"),
        desc: bi(L, "Vibrant red on Gundala's gloves, boots, chest trim, and the top-right Koloni 'K' logo creates a sharp 10% warm accent against the cool storm!", "Warna merah menyala pada sarung tangan, sepatu, aksen dada Gundala, dan logo Koloni 'K' di kanan atas menciptakan aksen hangat 10% yang tajam di tengah suasana badai yang dingin!")
      }
    }),
    makeRatioCard({
      title: bi(L, "Detective Comics #880", "Detective Comics #880"),
      coverSrc: "covers/md_ce5bd970b088-detective.jpg",
      c60: {
        hex: "#f1f5f9", ink: "#1e1b18",
        role: bi(L, "Dominant (Stark White Space)", "Dominan (Ruang Putih Bersih)"),
        desc: bi(L, "Expansive white negative space isolates the subject and creates chilling tension.", "Ruang kosong putih yang luas mengisolasi subjek dan menciptakan ketegangan psikologis.")
      },
      c30: {
        hex: "#18181b", ink: "#ffffff",
        role: bi(L, "Secondary (Pitch Black Ink)", "Sekunder (Tinta Hitam Pekat)"),
        desc: bi(L, "Swarming black bats construct the Joker's hair, brow, and shadow silhouette.", "Kawanan kelelawar hitam membentuk rambut, alis, dan siluet bayangan Joker.")
      },
      c10: {
        hex: "#e04f33", ink: "#ffffff",
        role: bi(L, "Accent (Blood-Orange Red)", "Aksen (Merah-Oranye Darah)"),
        desc: bi(L, "Used only on the Title Logo, bat-eyes, and sinister grin—locking the viewer's gaze instantly.", "Dipakai khusus pada Logo Judul, mata kelelawar, dan seringai merah—mengunci tatapan pembaca seketika.")
      }
    })
  ];

  return h("div", null,
    para(bi(L,
      "Just like typefaces, colors speak before the reader reads a single word. On a comic book cover, color does four essential jobs: it builds harmony through the Color Wheel, expresses raw emotion, carries cultural symbolism, and directs the eye using the 60:30:10 proportion rule.",
      "Sama seperti rupa huruf, warna berbicara bahkan sebelum pembaca mengeja satu kata pun. Pada sampul komik, warna menjalankan empat fungsi utama: membangun harmoni lewat Roda Warna, mengekspresikan emosi, menyampaikan simbolisme budaya, dan mengarahkan fokus mata melalui prinsip proporsi 60:30:10.")),

    /* ---- SECTION 1: COLOR WHEEL ---- */
    h("h3", null, bi(L, "1. The Color Wheel: Analogous, Complementary & Split-Complementary", "1. Roda Warna: Harmoni Analogus, Komplementer & Split-Komplementer")),
    para(bi(L,
      "Comic cover artists rarely pick colors at random. They use geometric relationships on the 12-hue color wheel to control whether a cover feels peaceful and unified or explosive and high-contrast. Try switching harmonies and rotating the wheel below:",
      "Ilustrator dan desainer sampul komik jarang memilih warna secara acak. Mereka menggunakan hubungan geometris pada roda 12 warna untuk mengatur apakah sampul terasa teduh dan menyatu atau eksplosif dan kontras. Coba ganti skema harmoni dan putar roda warna di bawah ini:")),

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
    h("h3", null, bi(L, "2. Color Expression: How Colors Feel Emotionally", "2. Ekspresi Warna: Psikologi & Rasa Emosional Warna")),
    para(bi(L,
      "Color expression is our instinctive, psychological response to a hue. Warm colors (red, orange, yellow) advance toward the viewer and feel active, brave, or intense; cool colors (blue, indigo, eerie green) recede and feel melancholic, solitary, or mysterious.",
      "Ekspresi warna adalah respons psikologis dan naluriah kita terhadap suatu rona warna. Warna hangat (merah, oranye, kuning) terasa bergerak maju mendekati pembaca serta memancarkan keberanian, aksi, atau semangat; warna dingin (biru, indigo, hijau kelam) terasa mundur dan memancarkan kesedihan, kesunyian, atau misteri.")),

    h("div", { class: "color-cover-grid cols-2" }, expressionCards),

    /* ---- SECTION 3: COLOR SYMBOLISM ---- */
    h("h3", null, bi(L, "3. Color Symbolism: Cultural & Narrative Meaning", "3. Simbolisme Warna: Makna Budaya & Narasi")),
    para(bi(L,
      "While color expression is about visceral feeling, color symbolism is about learned cultural meaning—how colors act as visual shorthand for concepts like peace, death, royalty, or national identity:",
      "Jika ekspresi warna berkaitan dengan getaran emosi, simbolisme warna berkaitan dengan kesepakatan makna budaya—bagaimana warna menjadi perlambang visual untuk konsep seperti kedamaian, kematian, kekuasaan bangsawan, atau identitas:")),

    h("div", { class: "color-cover-grid cols-2" }, symbolismCards),

    callout(
      bi(L, "Expression vs. Symbolism: What's the difference?", "Ekspresi vs. Simbolisme: Apa perbedaannya?"),
      bi(L,
        "Color Expression is what your gut feels immediately (Red feels hot, urgent, brave; Blue feels sad, cold, quiet). Color Symbolism is the conceptual message your mind decodes (White represents peace or a blank canvas; Black represents death; Purple & Gold represent royalty).",
        "Ekspresi Warna adalah sensasi emosional yang langsung dirasakan naluri (Merah terasa membara, berani, mendesak; Biru terasa sendu, dingin, sunyi). Simbolisme Warna adalah makna konseptual yang dipahami pikiran (Putih melambangkan kedamaian atau kanvas baru; Hitam melambangkan kematian; Ungu & Emas melambangkan kemuliaan/kekuasaan)."
      )
    ),

    /* ---- SECTION 4: 60:30:10 PRINCIPLE ---- */
    h("h3", null, bi(L, "4. The 60:30:10 Principle of Color Balance", "4. Prinsip Proporsi Warna 60:30:10")),
    para(bi(L,
      "Even a great color palette falls apart if every color shouts at the same volume. Professional cover designers balance their colors using the 60:30:10 rule so the reader's eye knows exactly where to look first:",
      "Palet warna terbaik sekalipun akan tampak kacau jika semua warna berteriak dengan porsi yang sama. Desainer sampul profesional mengatur keseimbangan komposisi warna dengan prinsip 60:30:10 agar mata pembaca langsung terarah ke titik fokus:")),

    h("div", { class: "rolegrid ratio-rolegrid" },
      h("div", { class: "rolecard ratio-rolecard r60" },
        h("span", { class: "role-name" }, bi(L, "60% Dominant Color", "60% Warna Dominan")),
        h("p", null, bi(L, "Sets the overall atmosphere and mood (usually the sky, backdrop, or negative space). It gives the viewer's eye a calm place to rest.", "Membangun atmosfer dan suasana keseluruhan (biasanya langit, latar belakang, atau ruang kosong). Memberi ruang istirahat bagi mata pembaca."))),
      h("div", { class: "rolecard ratio-rolecard r30" },
        h("span", { class: "role-name" }, bi(L, "30% Secondary Color", "30% Warna Sekunder")),
        h("p", null, bi(L, "Supports the dominant color and defines the main character's costume, silhouette, or mid-ground architecture.", "Menopang warna dominan serta mempertegas siluet kostum tokoh utama atau elemen latar tengah."))),
      h("div", { class: "rolecard ratio-rolecard r10" },
        h("span", { class: "role-name" }, bi(L, "10% Accent Color", "10% Warna Aksen")),
        h("p", null, bi(L, "The sharpest, highest-contrast pop reserved for the Title Logo and focal action (eyes, weapon glow, red gloves, lightning).", "Warna paling kontras dan mencolok yang disimpan khusus untuk Logo Judul atau titik fokus utama (sorot mata, kilatan senjata, aksen kostum).")))
    ),

    h("div", { class: "demo demo-split ratio-lab-demo" },
      h("div", { class: "demo-stage ratio-stage" }, ratioSvgEl),
      h("div", { class: "demo-ctrls ratio-ctrls" },
        h("span", { class: "small-label" }, bi(L, "Test the 60:30:10 Balance:", "Uji Proporsi 60:30:10:")),
        ratioBtns,
        ratioBarEl,
        ratioVerdictEl
      )
    ),

    h("h4", { class: "subhead-cover-examples" }, bi(L, "60:30:10 Breakdown on Real Comic Covers", "Bedah Proporsi 60:30:10 pada Sampul Komik Nyata")),
    h("div", { class: "color-cover-grid cols-3" }, ratioBreakdowns)
  );
}

/* ================= Lesson 6: Weight and Width ================= */
function lessonWeightWidth(L) {
  const sample = h("span", { class: "sample big", style: `font-family:${stackOf("Roboto Flex")}` }, demoTitle);
  const cap1 = h("p", { class: "caption" }), cap2 = h("p", { class: "caption" });
  let w = 700, wd = 100;
  const apply = () => { sample.style.fontWeight = String(w); sample.style.fontStretch = wd + "%"; };
  const sw = slider(bi(L, "Weight (thin to heavy)", "Ketebalan / Weight (tipis ke tebal)"), 100, 1000, 10, w, (v) => {
    w = v; apply();
    cap1.textContent = v <= 250 ? bi(L, "Very thin: delicate, quiet, elegant. Risky at small sizes.", "Sangat tipis (thin/light): halus, hening, anggun. Berisiko hilang pada ukuran kecil.")
      : v <= 550 ? bi(L, "Light to regular: calm, neutral, easy-going.", "Ringan hingga reguler: tenang, netral, nyaman dibaca.")
      : v <= 800 ? bi(L, "Bold: confident and clear.", "Tebal (bold): tegas, percaya diri, dan jelas.")
      : bi(L, "Extra heavy: loud, powerful, hard to ignore.", " Ekstra tebal (black/heavy): lantang, bertenaga, dan mendominasi ruang.");
  });
  const sd = slider(bi(L, "Width (narrow to wide)", "Proporsi Lebar / Width (sempit ke lebar)"), 25, 151, 1, wd, (v) => {
    wd = v; apply();
    cap2.textContent = v <= 55 ? bi(L, "Very condensed: squeezed, tall, tense and urgent. Fits long titles into small spaces.", "Sangat sempit (ultra-condensed): ramping menjulang, padat, dan mendesak. Cocok untuk memuat judul panjang di ruang terbatas.")
      : v <= 90 ? bi(L, "Slightly narrow: efficient and energetic.", "Agak sempit (condensed): ringkas dan berenergi.")
      : v <= 115 ? bi(L, "Normal width: balanced and neutral.", "Lebar normal: proporsional dan seimbang.")
      : bi(L, "Extended: wide, steady, open and techy. Needs more space.", "Melebar (extended/expanded): lapang, stabil, sinematik, dan futuristis. Membutuhkan ruang horizontal yang luas.");
  });
  sw.fire(); sd.fire();

  const weightWidthCovers = [
    makeCoverCard({
      badge: bi(L, "Heavy Condensed + Thin Extended", "Tebal Sempit + Tipis Melebar"),
      badgeColor: "#dc2626",
      title: bi(L, "Power Rangers Unlimited #1", "Power Rangers Unlimited #1"),
      coverSrc: "covers/pr_unlimited_coinless_001_cover_a_main_promo-170.jpg",
      swatches: [
        { hex: "#f8fafc", label: bi(L, "Heavy Bold: POWER RANGERS", "Tebal Padat: POWER RANGERS") },
        { hex: "#cbd5e1", label: bi(L, "Thin Extended: UNLIMITED", "Tipis Melebar: UNLIMITED") }
      ],
      text: bi(L,
        "A textbook masterclass in weight and width contrast! POWER RANGERS uses an extra-heavy, compact italic for punch, while UNLIMITED right below uses a razor-thin, wide extended sans for sci-fi scale.",
        "Contoh kontras ketebalan dan lebar yang brilian! POWER RANGERS memakai huruf ekstra tebal yang padat untuk daya hentak, sedangkan UNLIMITED di bawahnya memakai huruf tipis yang melebar (extended) untuk kesan skala ruang angkasa."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Ultra-Heavy Condensed", "Sangat Tebal & Sempit (Condensed)"),
      badgeColor: "#0284c7",
      title: bi(L, "Absolute Batman", "Absolute Batman"),
      coverSrc: "covers/absolute-batman.jpg",
      swatches: [
        { hex: "#5b808c", label: bi(L, "Tall Condensed Block", "Balok Tinggi Ramping") },
        { hex: "#df7a32", label: bi(L, "Brutal Mass", "Massa Visual Kekar") }
      ],
      text: bi(L,
        "The tall, tightly squeezed, ultra-heavy letters of BATMAN pack maximum ink into a narrow vertical column—echoing this brute-force version of the Dark Knight.",
        "Huruf BATMAN yang tinggi menjulang, rapat (condensed), dan ekstra tebal memadatkan massa visual yang luar biasa—mencerminkan fisik Batman versi baru yang kekar bagai benteng."
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
        "Karena kata 'ELRIC' hanya terdiri dari lima huruf, pemakaian huruf serif yang melebar (extended) membuatnya membentang megah dari ujung ke ujung sampul bagaikan layar sinema."
      )
    })
  ];

  return h("div", null,
    para(bi(L,
      "The same font can change character when you change its weight (how thick the strokes are) and its width (how wide the letters are). Many font families come with several weights and widths, such as thin, regular, bold, condensed and extended.",
      "Satu keluarga huruf yang sama dapat berubah karakternya secara drastis saat kamu mengatur ketebalan (weight) dan proporsi lebarnya (width). Banyak keluarga huruf menyediakan ragam variasi mulai dari thin, regular, bold, hingga condensed (sempit) dan extended (melebar).")),
    titleInput(L, (v) => (sample.textContent = v)),
    h("div", { class: "demo demo-split" }, h("div", { class: "demo-stage" }, sample), h("div", { class: "demo-ctrls" }, sw.row, cap1, sd.row, cap2)),
    bullets([
      bi(L, "Match weight to your hero's energy: a gentle character rarely wants an extra-heavy title.", "Selaraskan ketebalan huruf dengan energi tokohmu: kisah yang lembut jarang cocok menggunakan judul ekstra tebal."),
      bi(L, "Thin titles can vanish on busy artwork. Heavy ones stay visible from far away.", "Huruf yang terlalu tipis mudah tenggelam di atas ilustrasi yang ramai, sedangkan huruf tebal tetap terbaca jelas dari jauh."),
      bi(L, "Condensed letters help a long title fit; extended letters suit calm or high-tech stories.", "Huruf sempit (condensed) membantu judul panjang muat dengan rapi; huruf melebar (extended) memberi kesan tenang, megah, atau futuristis."),
    ]),
    h("h3", null, bi(L, "Weight & width on real comic covers", "Ketebalan & lebar huruf pada sampul komik nyata")),
    para(bi(L,
      "See how published covers use heavy condensed blocks versus wide extended letterforms to control energy and space:",
      "Lihat bagaimana sampul komik profesional memanfaatkan huruf tebal-sempit (condensed) maupun huruf melebar (extended) untuk mengendalikan ketegangan dan ruang:")),
    h("div", { class: "color-cover-grid cols-3" }, weightWidthCovers)
  );
}

/* ================= Lesson 7: Kerning and Spacing ================= */
function lessonSpacing(L) {
  /* Tracking */
  const trSample = h("span", { class: "sample big", style: `font-family:${stackOf("Roboto Flex")};font-weight:800` }, demoTitle);
  const trCap = h("p", { class: "caption" });
  const tr = slider(bi(L, "Tracking (letter spacing)", "Tracking (jarak antarhuruf merata)"), -0.1, 0.5, 0.01, 0, (v) => {
    trSample.style.letterSpacing = v + "em";
    trCap.textContent = v < -0.03 ? bi(L, "Tight: crowded and compact. Dense, tense, intense. Too tight and letters collide.", "Rapat: padat dan mengimpit. Terasa intens dan mendesak, namun jika berlebihan huruf akan saling bertabrakan.")
      : v <= 0.08 ? bi(L, "Normal: balanced and neutral.", "Normal: seimbang, nyaman, dan netral.")
      : v <= 0.25 ? bi(L, "Loose: airy and calm. Cinematic, premium, quiet.", "Renggang: lapang dan tenang. Memberi kesan sinematik, elegan, dan hening.")
      : bi(L, "Very loose: the word starts to fall apart into separate letters.", "Sangat renggang: kesatuan kata mulai terpecah menjadi huruf-huruf yang berdiri sendiri.");
  }, (v) => v.toFixed(2) + "em");
  tr.fire();

  /* Kerning lab */
  const word = "TAVERN";
  const diag = new Set(["A", "V", "W", "T", "Y"]);
  const messy = () => word.split("").map((ch, i) => (i > 0 && (diag.has(word[i - 1]) || diag.has(ch)) && word[i - 1] !== "R" && ch !== "R" ? 0.14 : 0));
  // Balanced solution: T-A -0.03, A-V 0.00, V-E 0.07, E-R 0.07, R-N 0.06
  const kernedBalanced = () => [0, -0.03, 0.00, 0.07, 0.07, 0.06];
  // Tight solution: T-A -0.13, A-V -0.11, V-E -0.03, E-R 0.00, R-N 0.00
  const kernedTight = () => [0, -0.13, -0.11, -0.03, 0.00, 0.00];
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
  const resetBtn = h("button", { type: "button", class: "btn small", onclick: () => { gaps = messy(); drawKern(); } }, bi(L, "Reset to uneven", "Kembalikan ke awal"));
  const autoBtn = h("button", { type: "button", class: "btn small", onclick: () => { gaps = kernedBalanced(); drawKern(); } }, bi(L, "Show a fixed version (Balanced)", "Versi rapi (Seimbang)"));
  const autoTightBtn = h("button", { type: "button", class: "btn small", onclick: () => { gaps = kernedTight(); drawKern(); } }, bi(L, "Show a fixed version (Tight)", "Versi rapi (Rapat)"));

  /* Leading */
  const l1 = h("span", null, "STORM"), l2 = h("span", null, "CHASERS");
  const leadBox = h("div", { class: "lead-sample", style: `font-family:${stackOf("Anton")}` }, l1, h("br"), l2);
  const leadCap = h("p", { class: "caption" });
  const ld = slider(bi(L, "Leading (line spacing)", "Leading (jarak antarbaris)"), 0.7, 1.8, 0.05, 1, (v) => {
    leadBox.style.lineHeight = String(v);
    leadCap.textContent = v < 0.9 ? bi(L, "Tight, stacked lines: punchy and compact, like a logo block. Lines may start to collide.", "Baris rapat bertumpuk: padat dan menyatu layaknya blok logo, namun hati-hati jangan sampai baris saling bertabrakan.")
      : v <= 1.25 ? bi(L, "Balanced: the lines read as one title.", "Seimbang: kedua baris menyatu dan nyaman dibaca sebagai satu kesatuan judul.")
      : bi(L, "Loose: the lines separate into two phrases. Calmer, but less unified.", "Renggang: baris mulai terpisah menjadi dua frasa. Terasa lebih tenang, tetapi kurang menyatu sebagai logo.");
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
        "Perhatikan ruang lapang di antara huruf K-I-L-L-M-O-N-G-E-R di bagian atas. Tracking yang renggang memberi kesan dingin, penuh perhitungan, dan berwibawa layaknya poster film."
      )
    }),
    makeCoverCard({
      badge: bi(L, "Optical Kerning on Diagonal Letters", "Kerning Optis pada Huruf Diagonal"),
      badgeColor: "#991b1b",
      title: bi(L, "Civil War #3", "Civil War #3"),
      coverSrc: "covers/md_cef2124c5670-civil-wae.jpg",
      swatches: [
        { hex: "#f8fafc", label: bi(L, "Tucked W-A-R Diagonal Pair", "Pasangan Diagonal W-A-R Rapi") },
        { hex: "#b91c1c", label: bi(L, "Tracked Event Tagline", "Tagline Renggang Merata") }
      ],
      text: bi(L,
        "In CIVIL WAR, the diagonal 'W' and 'A' are tucked closely together (kerned) so no awkward gap splits the word, while 'WHOSE SIDE ARE YOU ON?' below uses calm, even tracking.",
        "Pada CIVIL WAR, pasangan huruf diagonal 'W' dan 'A' dirapatkan secara optis (kerning) agar tidak menimbulkan celah kosong yang janggal, sementara teks 'WHOSE SIDE ARE YOU ON?' di bawahnya memakai tracking yang rata."
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
        "Baik jarak antarhuruf (tracking) maupun jarak antarbaris antara LOST dan FANTASY (leading) dirapatkan sedemikian rupa sehingga kedua baris menyatu menjadi satu kesatuan blok logo yang kokoh."
      )
    })
  ];

  return h("div", null,
    para(bi(L,
      "Space is part of the letters. The way you space a title changes how it feels, even with the same font.",
      "Ruang kosong di sekitar huruf sama pentingnya dengan bentuk huruf itu sendiri. Cara kamu mengatur jarak pada judul akan mengubah suasananya, meskipun menggunakan rupa huruf yang sama.")),
    h("dl", { class: "terms" },
      h("dt", null, "Tracking"), h("dd", null, bi(L, "The space between all the letters, adjusted together.", "Pengaturan jarak antarhuruf secara serentak dan merata pada seluruh kata atau baris.")),
      h("dt", null, "Kerning"), h("dd", null, bi(L, "The space between one specific pair of letters.", "Penyesuaian jarak optis di antara sepasang huruf tertentu agar tampak seimbang.")),
      h("dt", null, "Leading"), h("dd", null, bi(L, "The space between lines of text.", "Jarak vertikal antarbaris teks (diukur dari garis dasar/baseline ke garis dasar berikutnya)."))),
    h("h3", null, "Tracking"),
    titleInput(L, (v) => (trSample.textContent = v)),
    h("div", { class: "demo demo-split" }, h("div", { class: "demo-stage" }, trSample), h("div", { class: "demo-ctrls" }, tr.row, trCap)),
    h("h3", null, "Kerning"),
    para(bi(L,
      "Some letters, like T, A, V, W and Y, have diagonal or open shapes that leave bigger gaps next to other letters. Good kerning tucks them closer so that all the gaps look equally wide. Drag the sliders to fix the uneven gaps, then squint: the gaps should look evenly dark.",
      "Beberapa huruf seperti T, A, V, W, dan Y memiliki sisi miring atau ruang terbuka yang menyisakan celah berlebih saat berdampingan dengan huruf lain. Kerning yang baik mengatur pasangan huruf tersebut agar volume ruang antarhuruf terlihat sama rata secara optis. Geser pengatur di bawah atau coba dua solusi kerning (Seimbang vs. Rapat):")),
    h("div", { class: "demo" }, h("div", { class: "demo-stage" }, kernSample), h("div", { class: "gap-grid" }, gapRows), h("div", { class: "row left" }, resetBtn, autoBtn, autoTightBtn)),
    callout(bi(L, "How spacing changes character", "Bagaimana pengaturan jarak mengubah karakter"),
      bi(L,
        "Tight spacing feels intense and urgent. Loose spacing feels calm, airy and cinematic. Uneven kerning makes a title look clumsy or unfinished, which is a quick way to look amateur.",
        "Jarak yang rapat memberi kesan padat, tegang, dan mendesak. Jarak yang renggang memberi kesan tenang, lapang, dan sinematik. Sebaliknya, kerning yang tidak rata membuat judul tampak canggung dan belum matang.")),
    h("h3", null, "Leading"),
    h("div", { class: "demo demo-split" }, h("div", { class: "demo-stage" }, leadBox), h("div", { class: "demo-ctrls" }, ld.row, leadCap)),
    h("h3", null, bi(L, "Tracking, kerning & leading on real comic covers", "Tracking, kerning & leading pada sampul komik nyata")),
    para(bi(L,
      "Compare how loose tracking, careful diagonal kerning, and tight stacked leading shape the mood of these three covers:",
      "Bandingkan bagaimana tracking renggang, kerning diagonal yang presisi, serta leading rapat bertumpuk membentuk karakter visual pada ketiga sampul ini:")),
    h("div", { class: "color-cover-grid cols-3" }, spacingCovers)
  );
}

/* ================= Lesson 8: Slant and Rotation ================= */
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
  const s1 = slider(bi(L, "Slant (back to forward)", "Kemiringan Huruf / Slant (belakang ke depan)"), -25, 25, 1, 0, (v) => {
    slant = v; draw();
    cap1.textContent = v > 6 ? bi(L, "Forward lean: speed, energy and momentum. Great for action.", "Condong ke depan: memancarkan kecepatan, laju gerak, dan energi aksi.")
      : v < -6 ? bi(L, "Backward lean: awkward, hesitant, or deliberately odd.", "Condong ke belakang (backslant): terasa menahan laju, janggal, atau sengaja dibuat eksentrik.")
      : bi(L, "Upright: steady and formal.", "Tegak lurus (roman): stabil, kokoh, dan formal.");
  }, (v) => v + "°");
  const s2 = slider(bi(L, "Rotation (whole title)", "Rotasi Diagonal (seluruh blok judul)"), -25, 25, 1, 0, (v) => {
    rot = v; draw();
    cap2.textContent = Math.abs(v) < 1 ? bi(L, "Level: steady and orderly.", "Mendatar (horizontal): tenang, seimbang, dan teratur.")
      : Math.abs(v) < 4 ? bi(L, "Very slight tilt: this often looks like a mistake, not a choice.", "Kemiringan terlalu tanggung (1–3°): sering terlihat seperti pemasangan yang miring tanpa sengaja, bukan keputusan desain.")
      : v < 0 ? bi(L, "Rising to the right: optimistic, energetic, lively.", "Menanjak ke kanan atas: dinamis, optimis, dan penuh daya dorong.")
      : bi(L, "Falling to the right: tense, uneasy, sinking.", "Menurun ke kanan bawah: terasa berat, tertekan, atau jatuh.");
  }, (v) => v + "°");
  const s3 = slider(bi(L, "Bounce (letter by letter)", "Ayunan Garis Dasar / Bounce (huruf demi huruf)"), 0, 10, 1, 0, (v) => {
    bounce = v; draw();
    cap3.textContent = v > 3 ? bi(L, "Bouncy baseline: hand-made, playful, comic.", "Garis dasar berayun (bouncy baseline): terasa organik, jenaka, dan ekspresif.")
      : bi(L, "Letters sit on one baseline: orderly.", "Huruf berjajar rapi di atas satu garis dasar (baseline).");
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
      badge: bi(L, "Sharp Forward Slant & Perspective", "Condong Tajam ke Depan"),
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
      badge: bi(L, "Upward Diagonal Rotation (~10°)", "Rotasi Diagonal Menanjak (~10°)"),
      badgeColor: "#0f766e",
      title: bi(L, "Creature from the Black Lagoon Lives!", "Creature from the Black Lagoon Lives!"),
      coverSrc: "covers/universal-monsters-creature-from-the-black-lagoon-lives-hc-vol-1-CVRA.jpg",
      swatches: [
        { hex: "#f59e0b", label: bi(L, "Tilted Multi-Line Masthead", "Blok Judul Miring Menanjak") },
        { hex: "#e0537c", label: bi(L, "Pulp Horror Energy", "Energi Horor Klasik") }
      ],
      text: bi(L,
        "The entire multi-line title block ('CREATURE FROM THE BLACK LAGOON LIVES!') is rotated upward to the right at a bold ~10° diagonal angle—injecting classic pulp-monster urgency right across the sky!",
        "Seluruh blok judul ('CREATURE FROM THE BLACK LAGOON LIVES!') diputar miring menanjak ke kanan atas dengan sudut diagonal sekitar 10°—langsung menyuntikkan ketegangan horor klasik yang dramatis di bagian atas sampul!"
      )
    })
  ];

  return h("div", null,
    para(bi(L,
      "Orientation is how the letters stand: upright, slanted or rotated. Slanting and rotating are the quickest ways to add movement to a flat title.",
      "Orientasi adalah bagaimana posisi huruf berdiri di atas bidang sampul: tegak lurus, dimiringkan (slant/italic), atau diputar secara diagonal (rotation). Memiringkan dan memutar judul adalah cara paling efektif untuk menghadirkan kesan gerak pada tata letak yang statis.")),
    titleInput(L, (v) => { text = v; draw(); }),
    h("div", { class: "demo demo-split" }, h("div", { class: "demo-stage tall" }, wrapper), h("div", { class: "demo-ctrls" }, s1.row, cap1, s2.row, cap2, s3.row, cap3)),
    bullets([
      bi(L, "A tilt of about 5–10° looks intentional. A tilt of only 1–2° tends to look like a mistake.", "Rotasi diagonal sekitar 5–10° terlihat tegas dan disengaja. Kemiringan tanggung sebesar 1–2° justru terlihat seperti kesalahan pasang."),
      bi(L, "Make the slant match the action: a forward lean matches movement to the right.", "Selaraskan arah kemiringan dengan arah gerak gambar: huruf yang condong ke kanan depan mendukung laju aksi yang bergerak maju."),
      bi(L, "A real italic is redrawn by the type designer. Slanting a normal font just by skewing it distorts the strokes: fine for a bold display title, but check it with your eyes.", "Huruf italic asli digambar khusus oleh perancang huruf. Memiringkan huruf tegak secara paksa (skew/oblique) dapat mengubah proporsi goresannya—masih aman untuk judul tebal, tetapi selalu periksa hasilnya secara visual."),
      bi(L, "Whatever you do, keep the title readable.", "Seberapa ekspresif pun rotasi dan ayunan hurufnya, pastikan judul utama tetap mudah dibaca."),
    ]),
    h("h3", null, bi(L, "Slant, rotation & bounce on real comic covers", "Kemiringan, rotasi diagonal & ayunan huruf pada sampul nyata")),
    para(bi(L,
      "Notice how these action covers use forward slant, upward diagonal rotation, and letter-by-letter bounce to bring their titles to life:",
      "Perhatikan bagaimana sampul-sampul komik ini menerapkan kemiringan ke depan, rotasi diagonal menanjak, serta ayunan huruf untuk menghidupkan judulnya:")),
    h("div", { class: "color-cover-grid cols-3" }, orientationCovers)
  );
}

/* ================= Lesson 10: Your Checklist ================= */
function lessonChecklist(L) {
  const rules = [
    bi(L,
      "Type Has a Voice: Every typeface speaks with a visual tone before a single word is read—make sure your title's look embodies the spirit of your story.",
      "Huruf Punya Suara: Setiap rupa huruf memancarkan nada bicara visual bahkan sebelum dibaca—pastikan tampilan judulmu mewakili jiwa ceritamu."
    ),
    bi(L,
      "Character & Style: Translate your story into character poles (strong/delicate, fast/slow, hard/soft) and an authentic era or cultural style.",
      "Karakter & Gaya: Terjemahkan sifat tokoh dan latar ceritamu ke dalam kutub karakter (kuat/halus, cepat/lambat, keras/lembut) serta gaya zaman yang tepat."
    ),
    bi(L,
      "Text, Display & Decorative Roles: Use an eye-catching display or decorative face for the cover title, keep credits and balloons in a clean text face, and always verify legibility with the Thumbnail Test.",
      "Peran Huruf Teks, Judul & Dekoratif: Gunakan huruf display atau dekoratif untuk logo judul, pakai huruf teks yang bersih untuk balon kata dan kredit, serta uji keterbacaannya pada ukuran kecil (Thumbnail Test)."
    ),
    bi(L,
      "Match Font to Character: Check all three pillars—Design Intent (what the font was built for), Aesthetics (who is speaking), and Mood (aesthetics + readability + word meaning).",
      "Selaraskan Huruf dengan Tokoh: Periksa tiga pilar utama—Tujuan Perancangan (Design Intent), Estetika Visual (Aesthetics), dan Suasana Cerita (Mood)."
    ),
    bi(L,
      "Cover Hierarchy & Eye-Tracking: Guide the reader's gaze through the Art-First flow (1. Illustration → 2. Title → 3. Tagline → 4. Issue # → 5. Byline → 6. Mandatories) while respecting negative space.",
      "Hierarki Sampul & Alur Baca: Arahkan gerak mata pembaca melalui alur Art-First (1. Ilustrasi → 2. Judul → 3. Tagline → 4. Nomor Edisi → 5. Kreator → 6. Mandatori/Logo) dengan menghormati ruang kosong."
    ),
    bi(L,
      "Weight & Width: Match stroke thickness (thin vs. heavy) to your hero's energy, and use width (condensed vs. extended) to control tension, scale, and space.",
      "Ketebalan (Weight) & Lebar (Width): Sesuaikan ketebalan goresan (tipis vs. tebal) dengan energi cerita, dan manfaatkan proporsi lebar (condensed vs. extended) untuk mengatur ketegangan serta ruang."
    ),
    bi(L,
      "Kerning, Tracking & Leading: Use tight or loose tracking to set the pacing, compact leading to lock multi-line titles together, and optical kerning on diagonal pairs (T, A, V, W, Y) so gaps look even.",
      "Kerning, Tracking & Leading: Atur kerapatan tracking dan leading untuk membangun ritme blok judul, serta rapikan kerning pada pasangan huruf diagonal (T, A, V, W, Y) agar jarak optisnya seimbang."
    ),
    bi(L,
      "Slant, Rotation & Bounce: Add kinetic energy with a forward lean, an intentional 5–10° diagonal rotation, or a bouncy baseline—never a clumsy 1–2° accidental tilt.",
      "Kemiringan, Rotasi & Ayunan: Tambahkan dinamika gerak lewat kemiringan ke depan (slant), rotasi diagonal 5–10° yang tegas, atau garis dasar berayun (bounce)—hindari kemiringan tanggung 1–2°."
    ),
    bi(L,
      "Color in Comic Covers: Choose a clear color wheel harmony (analogous, complementary, or split-complementary), align emotional expression and cultural symbolism, and balance proportions with the 60:30:10 rule so the 10% accent makes your title and focal action pop.",
      "Warna pada Sampul Komik: Pilih skema harmoni roda warna (analogus, komplementer, atau split-komplementer), selaraskan ekspresi emosi dan simbolisme budaya, serta terapkan proporsi 60:30:10 agar 10% warna aksen membuat judul dan titik fokus menyala."
    ),
  ];

  const checklistCovers = [
    makeCoverCard({
      badge: bi(L, "STUDY CASE 1", "STUDI KASUS 1"),
      badgeColor: "#d97706",
      title: bi(L, "Shaman King Vol. 16", "Shaman King Vol. 16"),
      coverSrc: "covers/yellowcover9.jpg",
      swatches: [
        { hex: "#f5b81c", label: bi(L, "Analogous Warm Palette", "Palet Hangat Analogus") },
        { hex: "#f8fafc", label: bi(L, "Custom Brush-Slab Logo", "Logo Kuas-Slab Kustom") }
      ],
      text: bi(L,
        "Checks every box: a custom spiritual-action decorative logo, warm analogous yellow-orange harmony, and clean breathing room around the character.",
        "Memenuhi seluruh prinsip: logo dekoratif aksi-spiritual yang berkarakter kuat, harmoni warna kuning-oranye analogus yang hangat, serta ruang bernapas yang rapi."
      )
    }),
    makeCoverCard({
      badge: bi(L, "STUDY CASE 2", "STUDI KASUS 2"),
      badgeColor: "#0284c7",
      title: bi(L, "Usagi Yojimbo #21", "Usagi Yojimbo #21"),
      coverSrc: "covers/usagi-yojimbo-21.jpg",
      swatches: [
        { hex: "#ffffff", label: bi(L, "Brush Japanese Display Title", "Judul Kuas Jepang Display") },
        { hex: "#0284c7", label: bi(L, "Warm Peach & Cyan Harmony", "Harmoni Peach Hangat & Cyan") }
      ],
      text: bi(L,
        "Masterful complete anatomy: the diagonal sword slash leads the eye to the hand-drawn brush title, balanced by a neat corner box (#21), publisher logo, and Stan Sakai creator byline in clear negative space.",
        "Anatomi desain yang utuh: tebasan pedang diagonal mengarahkan pandangan ke logo judul kuas kaligrafi, berpadu dengan kotak sudut edisi #21, logo penerbit, dan byline Stan Sakai di ruang negatif yang rapi."
      )
    }),
    makeCoverCard({
      badge: bi(L, "STUDY CASE 3", "STUDI KASUS 3"),
      badgeColor: "#0284c7",
      title: bi(L, "Blue Period Vol. 2", "Blue Period Vol. 2"),
      coverSrc: "covers/blue-period-vol-2.png",
      swatches: [
        { hex: "#0284c7", label: bi(L, "Artistic Brush-Stencil Type", "Huruf Stensil-Kuas Artistik") },
        { hex: "#ffffff", label: bi(L, "Symbolic White Canvas", "Kanvas Putih Simbolis") }
      ],
      text: bi(L,
        "The stencil-cut serif title feels like paint on a studio canvas, paired with cool melancholic blue expression and pure white negative space.",
        "Judul serif berpotongan stensil terasa seperti sapuan kuas di atas kanvas studio, berpadu dengan ekspresi biru yang tenang dan ruang kosong putih murni."
      )
    })
  ];

  return h("div", null,
    quote(bi(L, "Typography exists to honor the content.", "Tipografi hadir untuk memuliakan isi pesan."), "Robert Bringhurst"),
    h("p", null,
      bi(L,
        "Here is the essence of all nine lessons in one complete checklist. The quiz that follows tests these ideas with real comic cover scenarios. ",
        "Berikut adalah intisari dari kesembilan pelajaran dalam satu daftar periksa utuh. Kuis setelah halaman ini akan menguji kepekaan desainmu lewat berbagai skenario sampul komik. "
      ),
      h("em", null, bi(L, "Take your time: every answer comes with a short design note.", "Santai saja: setiap jawaban dilengkapi ulasan singkat."))
    ),
    h("div", { class: "checklist-wrap" },
      h("ol", { class: "checklist-col" }, rules.slice(0, 5).map((r) => h("li", null, r))),
      h("ol", { class: "checklist-col", start: 6 }, rules.slice(5).map((r) => h("li", null, r)))
    ),
    h("h3", null, bi(L, "Putting it all together on real covers", "Memadukan seluruh prinsip pada sampul nyata")),
    para(bi(L,
      "Before starting the quiz, look at how these three covers bring typography, hierarchy, spacing, orientation, and color together into one unforgettable design:",
      "Sebelum memulai kuis, amati bagaimana ketiga sampul ini menyatukan karakter huruf, hierarki alur baca, pengaturan ruang, dan proporsi warna menjadi satu kesatuan desain yang ikonik:")),
    h("div", { class: "color-cover-grid cols-3" }, checklistCovers),
    h("p", { class: "hint" }, bi(L, "Lessons 1–5 are based on the workshop slides \"Choosing Typefaces\". Lessons 6–8 cover weight, width, kerning, spacing, and orientation. Lesson 9 covers color harmony, expression, symbolism, and the 60:30:10 rule on comic covers.", "Pelajaran 1–5 diadaptasi dari materi lokakarya \"Choosing Typefaces\". Pelajaran 6–8 membahas ketebalan, proporsi lebar, kerning, jarak baris, dan orientasi. Pelajaran 9 membahas harmoni roda warna, ekspresi, simbolisme, serta prinsip proporsi 60:30:10 pada sampul komik.")),
  );
}

/* ---------- Lesson list ---------- */
const LESSONS = [
  { title: { en: "Type has a voice", id: "Huruf punya suara" }, build: lessonVoice },
  { title: { en: "Every font has character and style", id: "Setiap huruf punya karakter dan gaya" }, build: lessonCharacter },
  { title: { en: "Text, display and decorative", id: "Huruf teks, judul, dan dekoratif" }, build: lessonRoles },
  { title: { en: "Match the font to your character", id: "Selaraskan huruf dengan tokohmu" }, build: lessonMatch },
  { title: { en: "Good habits for covers", id: "Hierarki & kebiasaan baik sampul" }, build: lessonHabits },
  { title: { en: "Weight and width", id: "Ketebalan dan proporsi lebar" }, build: lessonWeightWidth },
  { title: { en: "Kerning and spacing", id: "Kerning dan pengaturan jarak" }, build: lessonSpacing },
  { title: { en: "Slant and rotation", id: "Kemiringan dan rotasi" }, build: lessonOrientation },
  { title: { en: "Color in comic covers", id: "Warna pada sampul komik" }, build: lessonColor },
  { title: { en: "Your checklist", id: "Checklist Kamu" }, build: lessonChecklist },
];
