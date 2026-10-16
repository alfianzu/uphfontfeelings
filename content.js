"use strict";

/* ============================================================
   Font Feelings – content & question generator (no DOM here)
   For a comic-cover workshop: choosing a title font that suits
   the story / main character, and how weight, width, spacing
   and orientation change a title's character.
   ============================================================ */

const TOTAL_QUESTIONS = 15;

/* ---------- Character axes (each axis has two opposite poles) ---------- */
const AXES = {
  str:    { a: "strong",    b: "delicate" },
  pace:   { a: "fast",      b: "slow" },
  temp:   { a: "hot",       b: "cold" },
  gender: { a: "masculine", b: "feminine" },
  soft:   { a: "soft",      b: "hard" },
  age:    { a: "old",       b: "young" },
  vibe:   { a: "friendly",  b: "threatening" },
};
const POLE_AXIS = {};
Object.entries(AXES).forEach(([ax, { a, b }]) => { POLE_AXIS[a] = ax; POLE_AXIS[b] = ax; });
const opposite = (p) => { const x = AXES[POLE_AXIS[p]]; return x.a === p ? x.b : x.a; };

/* ---------- Character words ---------- */
const TRAITS = {
  strong: {
    en: { label: "Strong", why: "Thick strokes and solid, blocky shapes look heavy and sturdy, like something that is hard to push over. That is why we read them as powerful.", cues: "heavy strokes · wide, compact shapes · little empty space" },
    id: { label: "Kuat & Tegas", why: "Goresan tebal dan bentuk padat menyerupai balok memberikan kesan berbobot dan kokoh, layaknya struktur yang tak mudah goyah. Itulah sebabnya mata kita menangkap kesan bertenaga.", cues: "goresan tebal · bentuk lebar dan padat · ruang dalam huruf sempit" },
  },
  delicate: {
    en: { label: "Delicate", why: "Thin, light strokes look like they could break easily, which gives a feeling of fragility, refinement and care.", cues: "hairline strokes · slim shapes · lots of white space" },
    id: { label: "Halus & Anggun", why: "Goresan tipis dan ringan memberikan kesan lembut, rapuh, serta dikerjakan dengan penuh ketelitian.", cues: "goresan tipis (hairline) · proporsi ramping · ruang kosong yang lega" },
  },
  fast: {
    en: { label: "Fast", why: "Slanted, narrow or streamlined letters seem to lean forward, like something that is already in motion.", cues: "slanted or leaning letters · sharp, streamlined cuts · stretched horizontal lines" },
    id: { label: "Cepat & Dinamis", why: "Huruf yang miring, ramping, atau aerodinamis tampak condong ke depan, seolah sedang melesat dalam kecepatan tinggi.", cues: "kemiringan ke depan · potongan sudut tajam · tarikan garis horizontal dinamis" },
  },
  slow: {
    en: { label: "Slow", why: "Wide, round, open letters with calm, flowing curves invite the eye to take its time.", cues: "wide, open forms · gentle curves · generous spacing · calligraphic rhythm" },
    id: { label: "Tenang & Mengalir", why: "Bentuk huruf yang lebar, membulat, dan terbuka dengan lengkungan halus mengajak mata pembaca menikmati teks secara perlahan.", cues: "proporsi lebar dan terbuka · lengkungan lembut · spasi lega · irama kaligrafis" },
  },
  hot: {
    en: { label: "Hot", why: "Energetic, bold and exuberant shapes feel loud and passionate, like fire or a warm summer day.", cues: "bold, lively shapes · uneven or exaggerated details · strong personality" },
    id: { label: "Berapi-api & Ekspresif", why: "Bentuk yang tebal, meledak-ledak, dan penuh energi terasa lantang serta bergairah, bagaikan kobaran api.", cues: "bentuk tebal yang ekspresif · detail dinamis · karakter visual mencolok" },
  },
  cold: {
    en: { label: "Cold", why: "Precise, geometric, evenly spaced shapes feel clinical and technical, with little emotion, like steel or ice.", cues: "geometric precision · even strokes · straight lines and sharp angles" },
    id: { label: "Dingin & Teknis", why: "Bentuk geometris yang presisi dengan jarak seragam terasa klinis, objektif, dan minim luapan emosi—layaknya baja atau es.", cues: "presisi geometris · ketebalan goresan seragam · garis lurus dan sudut siku" },
  },
  masculine: {
    en: { label: "Masculine", why: "Heavy, angular, compact letters with sturdy corners are traditionally linked with toughness and force. This is a common association, not a rule.", cues: "thick, square or angular shapes · compact build · strong corners" },
    id: { label: "Maskulin", why: "Huruf berbobot tebal, bersudut tegas, dan berstruktur padat secara konvensional sering diasosiasikan dengan ketangguhan fisik. Ini adalah kecenderungan persepsi visual, bukan aturan mutlak.", cues: "bentuk kotak atau bersudut tegas · struktur padat · sudut kokoh" },
  },
  feminine: {
    en: { label: "Feminine", why: "Slender, curved, flowing strokes, often with contrast or flourishes, are traditionally linked with grace and elegance. This is a common association, not a rule.", cues: "slim, curvy forms · high contrast between thick and thin · flourishes" },
    id: { label: "Feminin", why: "Goresan ramping yang melengkung luwes—sering kali memiliki kontras tebal-tipis atau lekuk dekoratif—umumnya diasosiasikan dengan keanggunan. Ini adalah kecenderungan visual, bukan aturan baku.", cues: "proporsi ramping melengkung · kontras tebal-tipis tinggi · ujung huruf luwes" },
  },
  soft: {
    en: { label: "Soft", why: "Rounded corners and gentle curves feel safe to touch, like a pillow, so the font feels gentle.", cues: "rounded corners · curves instead of angles · uneven, hand-made edges" },
    id: { label: "Lembut", why: "Sudut yang tumpul membulat dan lengkungan halus terasa nyaman di mata, menciptakan kesan akrab dan bersahabat.", cues: "sudut membulat (rounded) · dominasi garis lengkung · tepian organik" },
  },
  hard: {
    en: { label: "Hard", why: "Sharp corners, straight lines and rigid angles feel like they could cut or resist, so the font feels firm.", cues: "sharp corners · straight edges · rigid, geometric structure" },
    id: { label: "Keras & Kaku", why: "Sudut yang tajam, garis lurus, dan konstruksi kaku memberi kesan tegas, tajam, serta tak kenal kompromi.", cues: "sudut lancip · tepian lurus · konstruksi geometris yang kaku" },
  },
  old: {
    en: { label: "Old", why: "Details inherited from history (pen-drawn strokes, blackletter, classic serifs, typewriter wear) make us think of the past.", cues: "calligraphic, pen-like strokes · ornate or worn details · classic serif shapes" },
    id: { label: "Klasik & Kuno", why: "Detail yang berakar dari sejarah—seperti goresan pena kaligrafi, huruf Gotik (blackletter), serif klasik, atau tekstur ketikan lama—langsung membangkitkan nuansa masa lampau.", cues: "goresan pena kaligrafi · detail ornamen atau tekstur usang · bentuk serif klasik" },
  },
  young: {
    en: { label: "Young", why: "Simple, rounded or geometric shapes without historical decoration feel new, light and full of energy.", cues: "simple geometric forms · no traditional decoration · playful or technological shapes" },
    id: { label: "Muda & Segar", why: "Bentuk geometris atau membulat yang lugas tanpa ornamen tradisional terasa baru, ringan, dan penuh semangat muda.", cues: "bentuk geometris sederhana · tanpa ornamen klasik · karakter lincah atau modern" },
  },
  friendly: {
    en: { label: "Friendly", why: "Round, open, relaxed letters feel like a smile or a wave. They invite you in.", cues: "round, open shapes · relaxed, slightly uneven rhythm · no sharp points" },
    id: { label: "Ramah & Akrab", why: "Bentuk huruf yang membulat, terbuka, dan santai terasa hangat mengundang pembaca untuk masuk ke dalam cerita.", cues: "ruang dalam huruf terbuka · irama santai dan organik · tanpa sudut runcing" },
  },
  threatening: {
    en: { label: "Threatening", why: "Spiky points and very heavy, tight, aggressive shapes echo warning signs and weapons, so they feel intimidating.", cues: "sharp spikes · very heavy or military-style blocks · tight, dark shapes" },
    id: { label: "Mencekam & Mengancam", why: "Ujung-ujung meruncing atau blok huruf yang berat, rapat, dan agresif mengingatkan kita pada senjata atau tanda bahaya, sehingga terasa mengintimidasi.", cues: "ujung berduri/runcing · balok berat bergaya militer · siluet gelap dan rapat" },
  },
};

/* ---------- Style words ---------- */
const STYLES = {
  medieval: {
    en: { label: "Medieval", why: "Medieval fonts copy the hand lettering of monks and scribes from the Middle Ages. They feel like castles, legends and old books.", cues: "pointed, blackletter shapes · pen-made strokes · dense, ornate forms" },
    id: { label: "Abad Pertengahan (Medieval)", why: "Gaya ini mengadaptasi kaligrafi para juru tulis Abad Pertengahan. Sangat lekat dengan suasana kastil, legenda ksatria, sihir, dan naskah kuno.", cues: "bentuk runcing bergaya Gotik (blackletter) · tarikan pena · padat dan berornamen" },
  },
  natural: {
    en: { label: "Natural", why: "Natural fonts look hand-drawn, with slight irregularities, as if made by a person rather than a machine. They suit organic, handmade and eco-friendly things.", cues: "hand-drawn lines · irregular shapes · thin, light, organic strokes" },
    id: { label: "Alami & Organik", why: "Font bergaya alami tampak seperti goresan tangan manusia dengan ketidakteraturan yang wajar, bukan hasil cetakan mesin. Cocok untuk tema alam, keseharian, dan karya personal.", cues: "tarikan garis gambar tangan · bentuk organik · goresan ringan dan luwes" },
  },
  brutalist: {
    en: { label: "Brutalist", why: "Brutalist fonts are raw, blunt and heavy, like exposed concrete. They have almost no decoration and make a bold statement.", cues: "ultra-heavy blocks · rough, blunt shapes · no decoration" },
    id: { label: "Brutalis", why: "Font brutalis tampil mentah, lugas, dan sangat tebal layaknya beton ekspos. Tanpa basa-basi dekorasi, gaya ini langsung menghantam perhatian pembaca.", cues: "blok huruf ekstra tebal · potongan lugas dan padat · tanpa dekorasi" },
  },
  humanist: {
    en: { label: "Humanist", why: "Humanist fonts are based on handwriting and pen strokes, so they feel warm and natural to read, like a thoughtful person talking.", cues: "slight pen-like variations · open, readable shapes · calm, warm proportions" },
    id: { label: "Humanis", why: "Font humanis memadukan struktur rapi dengan jejak proporsi tulisan tangan manusia, sehingga terasa hangat, jelas, dan nyaman dibaca lama.", cues: "variasi goresan halus · ruang huruf terbuka · proporsi hangat dan mudah dibaca" },
  },
  artdeco: {
    en: { label: "Art Deco", why: "Art Deco fonts come from the glamorous 1920s and 30s: geometric, symmetrical and elegant, often with strong thick–thin contrast. They feel luxurious and stylish.", cues: "geometric shapes · thick and thin contrast · symmetry and glamour" },
    id: { label: "Art Deco", why: "Berakar dari era glamor 1920–1930-an: memadukan geometri simetris, garis vertikal tinggi, atau kontras tebal-tipis yang elegan. Memancarkan kesan mewah, klasik, dan teatrikal.", cues: "konstruksi geometris · kontras tebal-tipis · simetris dan glamor" },
  },
  neutral: {
    en: { label: "Neutral", why: "Neutral fonts try not to have a personality of their own, so the words can do the talking. They feel clear, plain and trustworthy.", cues: "plain, even shapes · no decoration · consistent, quiet rhythm" },
    id: { label: "Netral", why: "Font netral dirancang agar tidak menonjolkan emosi tertentu, sehingga isi pesan dapat berbicara dengan jernih, objektif, dan rapi.", cues: "bentuk lugas dan seragam · tanpa ornamen · irama baca yang tenang" },
  },
  childish: {
    en: { label: "Childish", why: "Childish fonts are round, bouncy and simple, like a child's drawing or a toy. They feel innocent, playful and cheerful.", cues: "round, bubbly shapes · bouncy, uneven rhythm · simple, drawn forms" },
    id: { label: "Dunia Anak (Playful)", why: "Bentuknya bulat menggembung, membal, dan sederhana seperti mainan atau gambar anak-anak. Memancarkan kepolosan, keceriaan, dan rasa aman.", cues: "bentuk bulat menggembung · irama melompat · konstruksi sederhana dan ramah" },
  },
  futuristic: {
    en: { label: "Futuristic", why: "Futuristic fonts look engineered: wide, squared-off and technological, as if from a spaceship dashboard. They feel like science fiction and innovation.", cues: "wide, squared curves · tech-like geometry · clean, sharp cuts" },
    id: { label: "Futuristik", why: "Tampak dirancang secara presisi: melebar, berlengkung kotak (squarish), dan bernuansa teknologi tinggi layaknya antarmuka pesawat antariksa.", cues: "lengkung bersudut kotak · geometri teknologis · potongan sudut tajam dan bersih" },
  },
  traditional: {
    en: { label: "Traditional", why: "Traditional fonts follow classic book-printing shapes, with serifs and graceful contrast. They feel serious, respectable and timeless.", cues: "serifs · thick–thin stroke contrast · classic, balanced proportions" },
    id: { label: "Tradisional & Klasik", why: "Mengikuti tradisi tipografi cetak buku klasik dengan kait (serif) dan kontras tebal-tipis yang anggun. Terasa berwibawa, sastrawi, dan tak lekang waktu.", cues: "kait huruf (serif) · kontras tebal-tipis · proporsi klasik yang seimbang" },
  },
  rustic: {
    en: { label: "Rustic", why: "Rustic fonts look weathered and rough, like painted signs, wood type or old typewriters. They feel countryside, vintage and down-to-earth.", cues: "worn or uneven edges · chunky, wood-type shapes · vintage details" },
    id: { label: "Rustik & Vintage", why: "Tampak bertekstur kasar atau klasik, seperti papan kayu era Wild West, poster cetak tua, atau ketikan mesin tik lama.", cues: "tepian bertekstur/usang · serif balok ala cetakan kayu · detail bernuansa lawas" },
  },
  scientific: {
    en: { label: "Scientific", why: "Scientific fonts are precise and technical, often monospaced, like data, formulas and lab notes. They feel exact, rational and objective.", cues: "even, mechanical spacing · monospaced shapes · precise, technical details" },
    id: { label: "Ilmiah & Teknis", why: "Presisi dan sistematis—sering kali berlebar tetap (monospace) seperti kode komputer, data telemetri, atau laporan laboratorium.", cues: "lebar huruf mekanis (monospace) · bentuk presisi · nuansa data dan sains" },
  },
  fresh: {
    en: { label: "Fresh", why: "Fresh fonts are light, round and clean, with an upbeat modern look. They feel youthful, new and energetic, like a new start.", cues: "light, clean shapes · gentle rounded curves · bright, open feel" },
    id: { label: "Segar & Cerah", why: "Ringan, membulat bersih, dan bernuansa modern. Memberi kesan muda, optimis, dan menyegarkan.", cues: "goresan ringan dan bersih · lengkungan bulat lembut · ruang dalam huruf terbuka" },
  },
  contemporary: {
    en: { label: "Contemporary", why: "Contemporary fonts look current: clean, geometric and simple, made for screens and today's brands. They feel modern, confident and up to date.", cues: "clean geometry · simple forms, no decoration · modern proportions" },
    id: { label: "Kontemporer", why: "Mewakili estetika desain masa kini: geometris bersih, lugas, serta dirancang agar tampil tajam di berbagai media modern.", cues: "geometri bersih · bentuk lugas tanpa dekorasi · proporsi modern" },
  },
  smart: {
    en: { label: "Smart", why: "Smart fonts feel intelligent and bookish: refined serifs that suggest knowledge, study and careful thinking.", cues: "refined details · classic serif forms · balanced, careful proportions" },
    id: { label: "Intelek & Cendekia", why: "Memancarkan kesan cerdas dan literat lewat bentuk serif yang tajam, proporsional, serta penuh pemikiran.", cues: "detail serif yang halus · proporsi buku klasik · kesan akademis dan elegan" },
  },
  funny: {
    en: { label: "Funny", why: "Funny fonts are exaggerated, bouncy and cartoon-like, so they make us smile before we even read the words. They feel playful and humorous.", cues: "exaggerated, cartoonish shapes · bouncy, uneven rhythm · bold outlines" },
    id: { label: "Jenaka & Komikal", why: "Proporsinya dilebih-lebihkan, dinamis, dan bergaya kartun sehingga memancing senyum pembaca bahkan sebelum kata-katanya dibaca.", cues: "proporsi ekspresif ala kartun · irama huruf melompat · kesan humoris" },
  },
};
const STYLE_KEYS = Object.keys(STYLES);

/* Styles that look alike. Used so wrong answers are never "almost right". */
const ADJ = (() => {
  const raw = {
    medieval: ["traditional", "rustic"],
    natural: ["rustic", "humanist", "fresh", "childish"],
    brutalist: ["contemporary", "futuristic"],
    humanist: ["natural", "neutral", "fresh", "contemporary", "childish", "traditional"],
    artdeco: ["traditional", "contemporary", "smart"],
    neutral: ["humanist", "contemporary", "scientific", "smart"],
    childish: ["funny", "fresh", "natural", "humanist"],
    futuristic: ["scientific", "contemporary", "brutalist", "fresh"],
    traditional: ["medieval", "smart", "artdeco", "rustic", "humanist"],
    rustic: ["traditional", "natural", "medieval"],
    scientific: ["futuristic", "neutral", "smart", "contemporary"],
    fresh: ["contemporary", "childish", "natural", "humanist", "futuristic"],
    contemporary: ["neutral", "fresh", "futuristic", "humanist", "brutalist", "smart", "scientific", "artdeco"],
    smart: ["traditional", "scientific", "neutral", "contemporary", "artdeco"],
    funny: ["childish", "fresh"],
  };
  const out = {};
  STYLE_KEYS.forEach((k) => (out[k] = new Set(raw[k] || [])));
  STYLE_KEYS.forEach((k) => (raw[k] || []).forEach((o) => out[o].add(k)));
  return out;
})();

/* ---------- Roles (from the workshop slides: text, display, decorative) ---------- */
const ROLES = {
  text:       { en: "Text face", id: "Text face (Font teks bacaan)" },
  display:    { en: "Display face", id: "Display face (Font judul utama)" },
  decorative: { en: "Decorative face", id: "Decorative face (Font dekoratif)" },
  flex:       { en: "Versatile", id: "Serbaguna (Multifungsi)" },
};

/* ---------- Font library ----------
   n = Google font name, g = generic fallback,
   main = best-fit style (only on fonts clear enough to be used in style / scenario questions),
   s = styles it clearly expresses, t = characters it clearly shows, role = text | display | decorative | flex. */
const FONT_LIST = [
  { n: "Pirata One", g: "fantasy", main: "medieval", s: ["medieval"], t: { str: "strong", soft: "hard", age: "old", vibe: "threatening" }, role: "decorative" },
  { n: "Uncial Antiqua", g: "fantasy", main: "medieval", s: ["medieval"], t: { age: "old", pace: "slow", soft: "soft" }, role: "decorative" },
  { n: "Poiret One", g: "sans-serif", main: "artdeco", s: ["artdeco"], t: { str: "delicate", gender: "feminine" }, role: "display" },
  { n: "Limelight", g: "serif", main: "artdeco", s: ["artdeco"], t: {}, role: "display" },
  { n: "Rubik Mono One", g: "sans-serif", main: "brutalist", s: ["brutalist", "contemporary"], t: { str: "strong", soft: "hard", gender: "masculine" }, role: "display" },
  { n: "Archivo Black", g: "sans-serif", main: "brutalist", s: ["brutalist", "contemporary"], t: { str: "strong", soft: "hard", gender: "masculine" }, role: "display" },
  { n: "Anton", g: "sans-serif", main: "brutalist", s: ["brutalist", "contemporary"], t: { str: "strong", soft: "hard", gender: "masculine" }, role: "display" },
  { n: "Black Ops One", g: "fantasy", s: [], t: { str: "strong", soft: "hard", gender: "masculine", vibe: "threatening" }, role: "decorative" },
  { n: "Racing Sans One", g: "sans-serif", s: [], t: { pace: "fast", str: "strong", age: "young", temp: "hot" }, role: "decorative" },
  { n: "Amatic SC", g: "cursive", main: "natural", s: ["natural"], t: { str: "delicate", soft: "soft", age: "young", vibe: "friendly" }, role: "display" },
  { n: "Caveat", g: "cursive", main: "natural", s: ["natural"], t: { vibe: "friendly", soft: "soft", age: "young" }, role: "flex" },
  { n: "Rye", g: "fantasy", main: "rustic", s: ["rustic"], t: { str: "strong", age: "old", temp: "hot" }, role: "decorative" },
  { n: "Special Elite", g: "monospace", main: "rustic", s: ["rustic"], t: { age: "old", pace: "slow" }, role: "flex" },
  { n: "Lato", g: "sans-serif", main: "humanist", s: ["humanist", "neutral", "contemporary"], t: { vibe: "friendly", soft: "soft" }, role: "text" },
  { n: "Nunito", g: "sans-serif", main: "fresh", s: ["fresh"], t: { vibe: "friendly", soft: "soft", age: "young" }, role: "text" },
  { n: "Open Sans", g: "sans-serif", main: "humanist", s: ["humanist", "neutral", "contemporary"], t: { vibe: "friendly" }, role: "text" },
  { n: "Inter", g: "sans-serif", main: "neutral", s: ["neutral", "contemporary"], t: {}, role: "text" },
  { n: "Arimo", g: "sans-serif", main: "neutral", s: ["neutral"], t: {}, role: "text" },
  { n: "Fredoka", g: "sans-serif", main: "childish", s: ["childish"], t: { vibe: "friendly", soft: "soft", age: "young" }, role: "display" },
  { n: "Chewy", g: "cursive", main: "childish", s: ["childish", "funny"], t: { vibe: "friendly", soft: "soft", age: "young", temp: "hot" }, role: "decorative" },
  { n: "Bangers", g: "fantasy", main: "funny", s: ["funny"], t: { pace: "fast", temp: "hot", str: "strong", age: "young" }, role: "decorative" },
  { n: "Orbitron", g: "sans-serif", main: "futuristic", s: ["futuristic"], t: { temp: "cold", soft: "hard", age: "young" }, role: "display" },
  { n: "Audiowide", g: "sans-serif", main: "futuristic", s: ["futuristic"], t: { age: "young", temp: "cold" }, role: "display" },
  { n: "Libre Baskerville", g: "serif", main: "traditional", s: ["traditional", "smart"], t: { age: "old", pace: "slow" }, role: "text" },
  { n: "Playfair Display", g: "serif", main: "traditional", s: ["traditional", "smart"], t: { pace: "slow", age: "old", gender: "feminine" }, role: "display" },
  { n: "Cormorant Garamond", g: "serif", main: "traditional", s: ["traditional", "smart"], t: { str: "delicate", pace: "slow", age: "old", gender: "feminine" }, role: "display" },
  { n: "Great Vibes", g: "cursive", s: ["traditional"], t: { gender: "feminine", str: "delicate", soft: "soft", pace: "slow" }, role: "decorative" },
  { n: "IBM Plex Mono", g: "monospace", main: "scientific", s: ["scientific"], t: { temp: "cold", soft: "hard" }, role: "text" },
  { n: "Space Mono", g: "monospace", main: "scientific", s: ["scientific", "futuristic"], t: { temp: "cold", age: "young" }, role: "display" },
  { n: "Montserrat", g: "sans-serif", main: "contemporary", s: ["contemporary"], t: { age: "young" }, role: "flex" },
  { n: "Poppins", g: "sans-serif", main: "contemporary", s: ["contemporary", "fresh"], t: { age: "young", vibe: "friendly" }, role: "flex" },
  { n: "Quicksand", g: "sans-serif", main: "fresh", s: ["fresh"], t: { soft: "soft", vibe: "friendly", age: "young", str: "delicate" }, role: "flex" },
];
const fontStack = (f) => `"${f.n}", ${f.g}`;
const FLEX = { n: "Roboto Flex", g: "sans-serif" }; // variable font used for weight / width / spacing / orientation demos

/* ---------- Sample text ---------- */
const PHRASES = {
  en: ["Hello there", "A quiet morning", "Nice to meet you", "Open the door"],
  id: ["Halo semuanya", "Pagi yang tenang", "Senang bertemu", "Buka pintunya"],
};
const TITLES = ["NIGHT HAWK", "STORM CHASERS", "LITTLE MOON", "IRON DAWN", "MIDNIGHT CLUB"];
const SHORT_TITLES = ["IRON DAWN", "NIGHT HAWK", "LOST MOON"];
const KERN_WORDS = ["TAVERN", "AVATAR", "TOWER"];

/* ---------- Comic scenarios (keyed by the style that fits) ---------- */
const SCENARIOS = {
  childish:    { en: "Your comic is a gentle picture-book story for toddlers about a baby dinosaur. Which font fits the cover title best?", id: "Komikmu adalah cerita bergambar untuk anak-anak tentang petualangan bayi dinosaurus yang lucu. Font mana yang paling tepat untuk judul sampulnya?" },
  scientific:  { en: "Your comic is a hard sci-fi story about a lab, data and a rogue AI. Which font fits the cover title best?", id: "Komikmu mengangkat kisah fiksi ilmiah tentang riset laboratorium, enkripsi data, dan akal imitasi (AI). Font mana yang paling tepat untuk judul sampulnya?" },
  artdeco:     { en: "Your comic is a glamorous 1930s jazz-age detective story. Which font fits the cover title best?", id: "Komikmu bercerita tentang detektif era jazz 1930-an yang glamor dan penuh misteri. Font mana yang paling tepat untuk judul sampulnya?" },
  medieval:    { en: "Your comic is a fantasy adventure of knights, castles and dragons. Which font fits the cover title best?", id: "Komikmu bertema petualangan fantasi tentang ksatria, benteng kerajaan, dan naga kuno. Font mana yang paling tepat untuk judul sampulnya?" },
  natural:     { en: "Your comic is a quiet, hand-drawn diary about life on a small organic farm. Which font fits the cover title best?", id: "Komikmu adalah jurnal ilustrasi yang hangat tentang kehidupan sederhana di kebun organik. Font mana yang paling tepat untuk judul sampulnya?" },
  fresh:       { en: "Your comic is a light, sunny slice-of-life story about teenagers in summer. Which font fits the cover title best?", id: "Komikmu mengangkat kisah keseharian (slice-of-life) remaja yang ceria dan penuh semangat muda. Font mana yang paling tepat untuk judul sampulnya?" },
  futuristic:  { en: "Your comic is a space adventure about a crew exploring distant planets. Which font fits the cover title best?", id: "Komikmu bertema penjelajahan antariksa melintasi galaksi masa depan. Font mana yang paling tepat untuk judul sampulnya?" },
  funny:       { en: "Your comic is a silly gag comic that wants readers to laugh before they read a word. Which font fits the cover title best?", id: "Komikmu adalah komedi situasi yang ingin langsung memancing tawa pembaca sejak melihat sampulnya. Font mana yang paling tepat untuk judulnya?" },
  rustic:      { en: "Your comic is a dusty Wild West tale of outlaws and sheriffs. Which font fits the cover title best?", id: "Komikmu berlatar padang gurun Wild West tentang duel para koboi dan sheriff. Font mana yang paling tepat untuk judul sampulnya?" },
  brutalist:   { en: "Your comic is a raw, gritty street story with blunt, heavy energy. Which font fits the cover title best?", id: "Komikmu mengangkat kisah aksi jalanan yang keras, lugas, dan penuh benturan fisik. Font mana yang paling tepat untuk judul sampulnya?" },
  traditional: { en: "Your comic is a classic literary adaptation of a nineteenth-century novel. Which font fits the cover title best?", id: "Komikmu merupakan adaptasi sastra klasik dari novel sejarah abad ke-19. Font mana yang paling tepat untuk judul sampulnya?" },
};
const FIT_STYLES = Object.keys(SCENARIOS);

const SCENARIO_EXTRA = {
  en: "Before you decide: a title face grabs attention, but if it hurts legibility, readers will not get the title. Shrink your cover to thumbnail size and check that it still reads.",
  id: "Catatan penting: font judul memang bertugas memikat mata, tetapi jika keterbacaannya (legibility) buruk, pesan ceritamu tidak akan tersampaikan. Selalu uji sampulmu pada ukuran kecil (thumbnail).",
};

/* ---------- Anachronism scenarios ---------- */
const ANACH = {
  medieval: {
    out: ["futuristic", "scientific"], fit: ["medieval", "traditional", "rustic"],
    en: "Your comic is set in the Middle Ages, with knights and castles. Which font would feel out of place on the cover?",
    id: "Komikmu berlatar Abad Pertengahan dengan ksatria dan kastil. Font mana yang akan terasa janggal (anakronistis) bila dipasang pada sampul?",
    world: { en: "a medieval world", id: "latar Abad Pertengahan" },
  },
  futuristic: {
    out: ["medieval", "rustic"], fit: ["futuristic", "scientific"],
    en: "Your comic is set in a high-tech space future. Which font would feel out of place on the cover?",
    id: "Komikmu berlatar masa depan antariksa berteknologi tinggi. Font mana yang akan terasa janggal (anakronistis) bila dipasang pada sampul?",
    world: { en: "a high-tech future", id: "masa depan berteknologi tinggi" },
  },
  rustic: {
    out: ["futuristic", "scientific"], fit: ["rustic", "traditional"],
    en: "Your comic is set in the dusty Wild West. Which font would feel out of place on the cover?",
    id: "Komikmu berlatar era koboi Wild West yang berdebu. Font mana yang akan terasa janggal (anakronistis) bila dipasang pada sampul?",
    world: { en: "the Wild West", id: "era Wild West" },
  },
};

/* ---------- Effects of weight, width, spacing and orientation ---------- */
const FX = {
  heavy: {
    en: { label: "Heavy weight", prompt: "Which version of the title feels stronger and louder?", why: "Thick strokes add visual mass, so the title feels powerful, loud and confident. Heavy weights are also easy to see from far away, which is great for covers.", cues: "thick strokes · small inner spaces · dense, dark colour on the page", summary: "Heavy weight feels strong and loud" },
    id: { label: "Ketebalan tinggi (Heavy)", prompt: "Versi judul mana yang terasa lebih kuat dan lantang?", why: "Goresan tebal menambah bobot visual sehingga judul terasa kokoh, lantang, dan dominan. Ketebalan tinggi juga membuat judul tetap jelas terlihat dari kejauhan.", cues: "goresan tebal · ruang dalam huruf sempit · blok visual padat", summary: "Ketebalan tinggi (heavy) memberi kesan kuat dan lantang" },
  },
  thin: {
    en: { label: "Thin weight", prompt: "Which version of the title feels more delicate and quiet?", why: "Thin strokes take up little visual space, so the title feels quiet, elegant or fragile. On a busy cover or at thumbnail size, thin type can disappear.", cues: "hairline strokes · lots of white space · light colour on the page", summary: "Thin weight feels delicate and quiet" },
    id: { label: "Ketebalan tipis (Thin)", prompt: "Versi judul mana yang terasa lebih halus dan hening?", why: "Goresan tipis menempati ruang visual yang ringan sehingga judul terasa anggun, tenang, atau rapuh. Namun hati-hati: di atas ilustrasi yang ramai, huruf tipis mudah tenggelam.", cues: "goresan tipis · ruang kosong luas · bobot visual ringan", summary: "Ketebalan tipis (thin) memberi kesan halus dan tenang" },
  },
  condensed: {
    en: { label: "Condensed (narrow)", prompt: "Which version feels more compressed, tall and urgent?", why: "Narrow letters feel squeezed and tall, like a crowd pressing in. They create tension and urgency, and they fit long titles into small spaces.", cues: "narrow letters · tall proportions · tight rhythm", summary: "Condensed letters feel tense and urgent" },
    id: { label: "Proporsi sempit (Condensed)", prompt: "Versi mana yang terasa lebih padat, menjulang, dan mendesak?", why: "Huruf berproporsi sempit (condensed) terasa terhimpit secara horizontal dan menjulang tinggi. Proporsi ini menciptakan ketegangan dramatis sekaligus efektif memuat judul panjang.", cues: "proporsi huruf ramping · tampak menjulang vertikal · irama padat", summary: "Proporsi sempit (condensed) menciptakan kesan tegang dan mendesak" },
  },
  extended: {
    en: { label: "Extended (wide)", prompt: "Which version feels more open, steady and grounded?", why: "Wide letters feel stable and grounded, as if they have room to breathe. They read as calm, open or technological, but they take up more space.", cues: "wide letters · low, broad proportions · open rhythm", summary: "Extended letters feel open and steady" },
    id: { label: "Proporsi melebar (Extended)", prompt: "Versi mana yang terasa lebih lapang, stabil, dan megah?", why: "Huruf berproporsi melebar (extended) berpijak secara luas dan stabil. Sangat efektif untuk membangun suasana sinematik, megah, atau futuristik.", cues: "proporsi huruf melebar · tampak stabil dan membentang · irama terbuka", summary: "Proporsi melebar (extended) memberi kesan lapang dan mantap" },
  },
  tight: {
    en: { label: "Tight letter spacing", prompt: "Which version feels more tense and intense?", why: "Tight tracking (little space between letters) makes letters feel crowded and compact: dense, tense, intense. Too tight and the letters collide, which hurts legibility.", cues: "letters almost touching · dark, dense word shape", summary: "Tight spacing feels dense and intense" },
    id: { label: "Tracking rapat", prompt: "Versi mana yang terasa lebih padat dan intens?", why: "Tracking rapat (jarak antarhuruf yang sempit) menyatukan huruf menjadi blok yang padat dan penuh tekanan. Namun jika terlalu rapat hingga saling bertabrakan, keterbacaannya akan menurun.", cues: "antarhuruf nyaris bersentuhan · siluet kata padat dan menyatu", summary: "Tracking rapat memberi kesan padat dan intens" },
  },
  loose: {
    en: { label: "Loose letter spacing", prompt: "Which version feels calmer, airier and more cinematic?", why: "Loose tracking (extra space between letters) makes the title feel airy, calm and spacious. It often feels cinematic, premium or quiet. Too loose and the word falls apart into separate letters.", cues: "visible gaps between letters · light, open word shape · slower reading", summary: "Loose spacing feels airy and calm" },
    id: { label: "Tracking renggang", prompt: "Versi mana yang terasa lebih tenang, lapang, dan sinematik?", why: "Tracking renggang memberi ruang bernapas di sela-sela huruf sehingga judul terasa elegan, hening, dan sinematik layaknya poster film. Namun jika terlalu renggang, kesatuan kata bisa terpecah.", cues: "jarak antarhuruf lega · komposisi terbuka · tempo baca lebih tenang", summary: "Tracking renggang memberi kesan lapang dan sinematik" },
  },
  even: {
    en: { label: "Well kerned", prompt: "Which version has more even, well-kerned spacing?", why: "Kerning is the space between one specific pair of letters. Letters like T, A, V and W have diagonal or open shapes that leave bigger gaps. Good kerning tucks these pairs closer so every gap looks equally wide. Uneven gaps look clumsy and make a title feel unfinished.", cues: "gaps that look equal · diagonal letters tucked together · no holes and no collisions", summary: "Even kerning looks polished" },
    id: { label: "Kerning optis yang seimbang", prompt: "Versi mana yang memiliki kerapatan antarhuruf (kerning) paling seimbang?", why: "Kerning adalah pengaturan jarak khusus di antara pasangan huruf tertentu. Huruf berbidang miring atau terbuka seperti T, A, V, dan W sering menyisakan celah kosong yang tampak bolong. Kerning yang baik menyeimbangkan celah tersebut secara optis agar ritme kata terlihat utuh dan profesional.", cues: "volume celah antarhuruf tampak seragam · pasangan huruf diagonal dirapatkan secara optis · tidak tampak bolong", summary: "Kerning yang seimbang membuat judul tampak rapi dan profesional" },
  },
  uneven: {
    en: { label: "Uneven gaps", summary: "Uneven gaps look clumsy" },
    id: { label: "Celah antarhuruf timpang", summary: "Celah antarhuruf yang timpang membuat judul tampak belum matang" },
  },
  slant: {
    en: { label: "Forward slant", prompt: "Which version feels faster and more energetic?", why: "A forward slant (leaning right, in the direction we read) makes letters look like they are leaning into motion. It adds speed, energy and momentum, which suits action comics.", cues: "letters leaning right · diagonal energy · feels like movement", summary: "Forward slant feels fast and energetic" },
    id: { label: "Condong ke depan (Forward slant)", prompt: "Versi mana yang terasa lebih cepat dan penuh akselerasi?", why: "Kemiringan ke kanan (searah gerak mata membaca) membuat huruf tampak sedang melaju. Efek ini langsung menyuntikkan kecepatan, aksi, dan momentum pada judul komik.", cues: "batang huruf condong ke kanan · garis energi diagonal · kesan melesat", summary: "Kemiringan ke depan memberi kesan cepat dan bertenaga" },
  },
  tilt: {
    en: { label: "Tilted title", prompt: "Which version feels more playful and casual?", why: "Tilting the whole title makes it feel casual, lively and a little unstable, as if it was placed by hand. About 5–10° looks intentional; only 1–2° tends to look like a mistake.", cues: "title on a diagonal · baseline rising or falling · casual, lively feel", summary: "A tilted title feels playful and casual" },
    id: { label: "Rotasi diagonal", prompt: "Versi mana yang terasa lebih dinamis dan ekspresif?", why: "Memutar seluruh garis dasar (baseline) judul secara diagonal menciptakan kesan dinamis dan spontan. Gunakan sudut sekitar 5–10° agar tampak disengaja; kemiringan tanggung 1–2° justru terlihat seperti salah pasang.", cues: "seluruh judul berotasi diagonal · garis dasar menanjak · kesan spontan dan hidup", summary: "Rotasi diagonal membuat judul terasa dinamis dan ekspresif" },
  },
  upright: {
    en: { label: "Upright and level", prompt: "Which version feels steadier, calmer and more formal?", why: "Letters standing straight on a level baseline feel steady, calm and formal, like a building. That is a safe choice for serious or classic stories.", cues: "vertical letters · level baseline · stable, orderly feel", summary: "Upright, level type feels steady and formal" },
    id: { label: "Tegak dan mendatar (Upright)", prompt: "Versi mana yang terasa lebih stabil, tenang, dan formal?", why: "Huruf yang berdiri tegak lurus di atas garis dasar mendatar memberikan kesan kokoh, teratur, dan berwibawa layaknya pilar arsitektur.", cues: "batang huruf vertikal · garis dasar mendatar · komposisi stabil", summary: "Orientasi tegak lurus memberi kesan stabil dan berwibawa" },
  },
};
const FX_CSS = {
  heavy: "font-weight:1000;font-stretch:100%",
  thin: "font-weight:100;font-stretch:100%",
  condensed: "font-weight:700;font-stretch:30%",
  extended: "font-weight:700;font-stretch:150%",
  tight: "font-weight:800;letter-spacing:-0.06em",
  loose: "font-weight:800;letter-spacing:0.32em",
  slant: "font-weight:800;transform:skewX(-14deg)",
  upright: "font-weight:800",
  tilt: "font-weight:800;transform:rotate(-7deg)",
  even: "font-weight:800;font-kerning:normal",
  uneven: "font-weight:800;font-kerning:none",
};

/* ---------- Role question text ---------- */
const ROLE_TEXT = {
  en: {
    prompt: "Which of these fonts is a text face, made for comfortable long reading?",
    why: "Text faces are designed for long passages, like those in books and magazines. They focus on readability, so you can read quickly for a long time without tiring. Display faces are made for large titles and headlines, and decorative faces are made to grab attention, even at the cost of legibility.",
    cues: "conventional letterforms · generous spacing · tall x-height · quiet, even shapes",
    extra: "For your comic: use a text-friendly font (or clear comic lettering) for speech balloons and captions, and save display or decorative faces for the title.",
  },
  id: {
    prompt: "Manakah dari font berikut yang tergolong text face (font teks untuk kenyamanan bacaan panjang)?",
    why: "Text face dirancang khusus untuk paragraf panjang seperti isi buku atau dialog, dengan mengutamakan kenyamanan baca (readability) agar mata tidak cepat lelah. Sebaliknya, display face dan decorative face dirancang untuk menarik perhatian pada ukuran besar sebagai judul.",
    cues: "bentuk huruf konvensional · spasi yang lega · x-height proporsional · irama bentuk yang tenang",
    extra: "Tips komik: gunakan font teks yang bersih untuk balon dialog dan narasi, lalu simpan display face atau decorative face untuk logo judul utama.",
  },
};

/* ---------- General tips shown in the notes ---------- */
const TIPS = [
  { en: "A font speaks before the words do: we feel its mood before we read a single word.", id: "Rupa huruf berbicara sebelum kata-katanya dibaca: mata kita menangkap suasananya terlebih dahulu." },
  { en: "Personality comes from shapes: stroke thickness, roundness, width, slant and small details.", id: "Karakter huruf lahir dari anatominya: ketebalan goresan, kelengkungan sudut, proporsi lebar, hingga kemiringannya." },
  { en: "Round shapes tend to feel friendly; sharp angles tend to feel serious or even dangerous.", id: "Bentuk membulat cenderung memberi kesan ramah, sedangkan sudut lancip memancarkan ketegangan atau bahaya." },
  { en: "Look for typefaces that embody the qualities of the message you want to convey.", id: "Pilihlah rupa huruf (typeface) yang paling mewakili jiwa dan pesan ceritamu." },
  { en: "One font can carry several moods at once, for example both friendly and young.", id: "Satu jenis huruf dapat memancarkan beberapa nuansa sekaligus—misalnya terasa ramah sekaligus berjiwa muda." },
  { en: "Mood is a blend: the look of the font, how readable your design is, and what the words mean.", id: "Suasana (mood) adalah perpaduan antara estetika huruf, tingkat keterbacaan desainmu, dan makna kata itu sendiri." },
  { en: "Culture and context shape these feelings too. They are common associations, not strict rules.", id: "Konteks budaya turut membentuk persepsi visual. Prinsip-prinsip ini adalah panduan kepekaan, bukan aturan kaku." },
  { en: "Legibility comes first: if readers cannot read the title, its mood does not matter.", id: "Keterbacaan (legibility) tetap utama: seindah apa pun hurufnya, pesan gagal jika pembaca kesulitan mengeja judulmu." },
  { en: "A limited palette looks confident: one or two fonts are usually enough for a cover.", id: "Kombinasi font yang hemat tampak lebih matang: cukup satu font ekspresif untuk judul dan satu font bersih untuk teks pendukung." },
  { en: "Typography is about eyeballing: step back, squint, and trust what you see.", id: "Tipografi mengandalkan kepekaan optis: mundur sejenak, sipitkan mata (squint test), dan amati keseimbangan visualnya." },
];

/* ---------- Helpers ---------- */
const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const rint = (n) => Math.floor(Math.random() * n);
const lab = (p, L) => TRAITS[p][L].label;
const slab = (s, L) => STYLES[s][L].label;
const pickFresh = (arr, used) => { const fresh = arr.filter((f) => !used.has(f.n)); return pick(fresh.length ? fresh : arr); };
const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

/** Chips describing a font: its styles first, then its characters. */
function tagsOf(font, L) {
  return {
    styles: font.s.map((s) => slab(s, L)),
    traits: Object.values(font.t).map((p) => lab(p, L)),
  };
}
/** Default caption under a revealed font card. */
const fontMeta = (f) => (L) => {
  const tg = tagsOf(f, L);
  return { title: f.n, text: [...tg.styles, ...tg.traits].join(" · ") };
};

/* ---------- Question factories ----------
   Every question: { sec, phrase, layout, specimen, options[] (exactly one correct),
   prompt(L), answer(L), why(L), cues(L), extra?(L), profile?, summary(L), tip }
   Card options: { font, correct, meta(L)->{title,text}, text?, css?, letters? } */

// 1) Which of two fonts feels more X?
function makeCompare(axis, used) {
  const pole = pick([AXES[axis].a, AXES[axis].b]);
  const opp = opposite(pole);
  const A = pickFresh(FONT_LIST.filter((f) => f.t[axis] === pole), used);
  const B = pickFresh(FONT_LIST.filter((f) => f.t[axis] === opp), used);
  used.add(A.n); used.add(B.n);
  return {
    sec: "compare", phrase: rint(PHRASES.en.length), layout: "cards", specimen: null,
    options: shuffle([{ font: A, correct: true, meta: fontMeta(A) }, { font: B, correct: false, meta: fontMeta(B) }]),
    prompt: (L) => L === "id"
      ? `Mana dari dua font ini yang terasa lebih ${lab(pole, L).toLowerCase()}?`
      : `Which of these two fonts feels more ${lab(pole, L).toLowerCase()}?`,
    answer: () => A.n,
    why: (L) => TRAITS[pole][L].why,
    cues: (L) => TRAITS[pole][L].cues,
    extra: (L) => L === "id"
      ? `Font satunya justru condong ke arah sebaliknya: ${lab(opp, L).toLowerCase()} (${B.n}).`
      : `The other font leans the opposite way: ${lab(opp, L).toLowerCase()} (${B.n}).`,
    summary: (L) => L === "id" ? `Lebih ${lab(pole, L).toLowerCase()}: ${A.n}` : `More ${lab(pole, L).toLowerCase()}: ${A.n}`,
  };
}

// 2) Which word describes this font?
function makeTrait(used, usedAxes) {
  const cand = FONT_LIST.filter((f) => Object.keys(f.t).length >= 3 && !used.has(f.n));
  const f = pick(cand);
  const axes = shuffle(Object.keys(f.t)).sort((a, b) => (usedAxes.has(a) ? 1 : 0) - (usedAxes.has(b) ? 1 : 0));
  const axis = axes[0];
  const pole = f.t[axis];
  const wrong = [opposite(pole), ...axes.slice(1, 3).map((a) => opposite(f.t[a]))];
  used.add(f.n); usedAxes.add(axis);
  return {
    sec: "trait", phrase: rint(PHRASES.en.length), layout: "text", specimen: f,
    options: shuffle([{ pole, correct: true }, ...wrong.map((p) => ({ pole: p, correct: false }))]),
    prompt: (L) => L === "id" ? "Kata mana yang paling menggambarkan font ini?" : "Which word describes this font best?",
    optionLabel: (o, L) => lab(o.pole, L),
    answer: (L) => lab(pole, L),
    why: (L) => TRAITS[pole][L].why,
    cues: (L) => TRAITS[pole][L].cues,
    profile: f,
    summary: (L) => `${f.n}: ${lab(pole, L)}`,
  };
}

// 3) Which style does this font express?
function makeStyle(used, usedMain) {
  const free = FONT_LIST.filter((f) => f.main && !used.has(f.n));
  const distinct = free.filter((f) => !usedMain.has(f.main));
  const f = pick(distinct.length ? distinct : free);
  const m = f.main;
  const banned = new Set([...f.s, m, ...ADJ[m]]);
  let far = STYLE_KEYS.filter((s) => !banned.has(s));
  if (far.length < 3) far = STYLE_KEYS.filter((s) => !f.s.includes(s));
  used.add(f.n); usedMain.add(m);
  return {
    sec: "style", phrase: rint(PHRASES.en.length), layout: "text", specimen: f,
    options: shuffle([{ style: m, correct: true }, ...shuffle(far).slice(0, 3).map((s) => ({ style: s, correct: false }))]),
    prompt: (L) => L === "id" ? "Gaya apa yang diekspresikan font ini?" : "Which style does this font express?",
    optionLabel: (o, L) => slab(o.style, L),
    answer: (L) => slab(m, L),
    why: (L) => STYLES[m][L].why,
    cues: (L) => STYLES[m][L].cues,
    profile: f,
    summary: (L) => `${f.n}: ${slab(m, L)}`,
  };
}

// 4) Which one is a text face?
function makeRole(used) {
  const correct = pickFresh(FONT_LIST.filter((f) => f.role === "text"), used);
  const wrong = shuffle(FONT_LIST.filter((f) => f.role === "decorative" || f.role === "display")).slice(0, 3);
  used.add(correct.n);
  const roleMeta = (f) => (L) => ({ title: f.n, text: ROLES[f.role][L] });
  return {
    sec: "role", phrase: rint(PHRASES.en.length), layout: "cards", specimen: null,
    options: shuffle([{ font: correct, correct: true, meta: roleMeta(correct) }, ...wrong.slice(0, 3).map((f) => ({ font: f, correct: false, meta: roleMeta(f) }))]),
    prompt: (L) => ROLE_TEXT[L].prompt,
    answer: () => correct.n,
    why: (L) => ROLE_TEXT[L].why,
    cues: (L) => ROLE_TEXT[L].cues,
    extra: (L) => ROLE_TEXT[L].extra,
    summary: (L) => L === "id" ? `Text face: ${correct.n}` : `Text face: ${correct.n}`,
  };
}

// 5) Weight, width, tracking, orientation: same title, two settings
function makeFx(sec, pair, titlePool, forceKey) {
  const key = forceKey || pick(pair);
  const other = pair.find((k) => k !== key);
  const title = pick(titlePool);
  const mk = (k) => ({ font: FLEX, text: title, css: FX_CSS[k], correct: k === key, meta: (L) => ({ title: FX[k][L].label, text: "" }) });
  return {
    sec, phrase: 0, layout: "cards", specimen: null, variant: true,
    options: shuffle([mk(key), mk(other)]),
    prompt: (L) => FX[key][L].prompt,
    answer: (L) => FX[key][L].label,
    why: (L) => FX[key][L].why,
    cues: (L) => FX[key][L].cues,
    extra: (L) => (L === "id" ? "Sebagai pembanding: " : "For comparison: ") + lowerFirst(FX[other][L].summary) + ".",
    summary: (L) => FX[key][L].summary,
  };
}

// 6) Kerning: even vs. uneven gaps
function makeKerning() {
  const word = pick(KERN_WORDS);
  const diag = new Set(["A", "V", "W", "T", "Y"]);
  const letters = word.split("").map((ch, i) => ({ ch, gap: i > 0 && (diag.has(word[i - 1]) || diag.has(ch)) && !(word[i - 1] === "R" || ch === "R") ? 0.14 : 0 }));
  const good = { font: FLEX, text: word, css: FX_CSS.even, correct: true, meta: (L) => ({ title: FX.even[L].label, text: "" }) };
  const bad = { font: FLEX, text: word, css: FX_CSS.uneven, letters, correct: false, meta: (L) => ({ title: FX.uneven[L].label, text: "" }) };
  return {
    sec: "kerning", phrase: 0, layout: "cards", specimen: null, variant: true,
    options: shuffle([good, bad]),
    prompt: (L) => FX.even[L].prompt,
    answer: (L) => FX.even[L].label,
    why: (L) => FX.even[L].why,
    cues: (L) => FX.even[L].cues,
    extra: (L) => (L === "id" ? "Perhatikan celah di antara huruf diagonal pada versi satunya: " : "Look at the gaps between the diagonal letters in the other version: ") + FX.uneven[L].summary.toLowerCase() + ".",
    summary: (L) => FX.even[L].summary,
  };
}

// 7) Which font fits this comic? (real-life scenario)
function makeFit(style, used) {
  const near = new Set([style, ...ADJ[style]]);
  const good = FONT_LIST.filter((f) => f.main && f.s.includes(style));
  const fresh = good.filter((f) => !used.has(f.n));
  const pref = fresh.filter((f) => f.main === style);
  const correct = pick(pref.length ? pref : fresh.length ? fresh : good);
  const pool = shuffle(FONT_LIST.filter((f) => f.main && f.s.every((s) => !near.has(s))));
  const wrong = []; const seen = new Set();
  pool.forEach((f) => { if (wrong.length < 3 && !seen.has(f.main)) { wrong.push(f); seen.add(f.main); } });
  pool.forEach((f) => { if (wrong.length < 3 && !wrong.includes(f)) wrong.push(f); });
  used.add(correct.n);
  return {
    sec: "scenario", phrase: rint(PHRASES.en.length), layout: "cards", specimen: null,
    options: shuffle([{ font: correct, correct: true, meta: fontMeta(correct) }, ...wrong.map((font) => ({ font, correct: false, meta: fontMeta(font) }))]),
    prompt: (L) => SCENARIOS[style][L],
    answer: () => correct.n,
    why: (L) => STYLES[style][L].why,
    cues: (L) => STYLES[style][L].cues,
    extra: (L) => SCENARIO_EXTRA[L],
    summary: (L) => `${slab(style, L)}: ${correct.n}`,
  };
}

// 8) Which font is an anachronism?
function makeAnach(style, used) {
  const cfg = ANACH[style];
  const withMain = FONT_LIST.filter((f) => f.main);
  const inSet = (f, set) => f.s.some((s) => set.includes(s));
  const outFonts = withMain.filter((f) => inSet(f, cfg.out) && !inSet(f, cfg.fit));
  const fitFonts = withMain.filter((f) => inSet(f, cfg.fit) && !inSet(f, cfg.out));
  const correct = pickFresh(outFonts, used);
  const wrong = [];
  const seen = new Set();
  shuffle(fitFonts).forEach((f) => { if (wrong.length < 3 && !seen.has(f.main)) { wrong.push(f); seen.add(f.main); } });
  shuffle(fitFonts).forEach((f) => { if (wrong.length < 3 && !wrong.includes(f)) wrong.push(f); });
  used.add(correct.n);
  return {
    sec: "anach", phrase: rint(PHRASES.en.length), layout: "cards", specimen: null,
    options: shuffle([{ font: correct, correct: true, meta: fontMeta(correct) }, ...wrong.map((font) => ({ font, correct: false, meta: fontMeta(font) }))]),
    prompt: (L) => cfg[L],
    answer: () => correct.n,
    why: (L) => L === "id"
      ? `${correct.n} terasa ${slab(correct.main, L).toLowerCase()}, yang berasal dari dunia lain dibanding ${cfg.world[L]}. Font mengandung zaman tempat ia dirancang atau ditiru, jadi ketidakcocokan zaman (anachronism) menarik pembaca keluar dari cerita.`
      : `${correct.n} feels ${slab(correct.main, L).toLowerCase()}, which belongs to a different world from ${cfg.world[L]}. A font carries the era it was designed in or imitates, so a mismatch (an anachronism) pulls readers out of the story.`,
    cues: (L) => L === "id" ? "samakan zaman dan dunia font dengan zaman dan dunia ceritamu" : "match the era and world of the font to the era and world of your story",
    summary: (L) => L === "id" ? `Tidak cocok untuk ${cfg.world[L]}: ${correct.n}` : `Out of place in ${cfg.world[L]}: ${correct.n}`,
  };
}

/* ---------- Build a 15-question quiz, in the same order as the lessons ---------- */
function buildQuiz() {
  const used = new Set(), usedMain = new Set(), usedAxes = new Set();
  const qs = [];
  shuffle(Object.keys(AXES)).slice(0, 2).forEach((ax) => qs.push(makeCompare(ax, used)));
  for (let i = 0; i < 2; i++) qs.push(makeTrait(used, usedAxes));
  qs.push(makeStyle(used, usedMain));
  qs.push(makeRole(used));
  qs.push(makeFx("weight", ["heavy", "thin"], TITLES));
  qs.push(makeFx("width", ["condensed", "extended"], SHORT_TITLES));
  qs.push(makeFx("tracking", ["tight", "loose"], TITLES));
  qs.push(makeKerning());
  qs.push(makeFx("orient", ["slant", "upright"], TITLES, "slant"));
  qs.push(makeFx("orient", ["tilt", "upright"], TITLES));
  const an = pick(Object.keys(ANACH));
  shuffle(FIT_STYLES.filter((s) => s !== an)).slice(0, 2).forEach((s) => qs.push(makeFit(s, used)));
  qs.push(makeAnach(an, used));
  qs.forEach((q, i) => { q.tip = i % TIPS.length; });
  return qs.slice(0, TOTAL_QUESTIONS);
}
