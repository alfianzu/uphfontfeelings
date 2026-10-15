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
    id: { label: "Kuat", why: "Goresan tebal dan bentuk padat seperti balok terlihat berat dan kokoh, seperti benda yang sulit didorong roboh. Karena itu kita membacanya sebagai kuat.", cues: "goresan tebal · bentuk lebar dan padat · sedikit ruang kosong" },
  },
  delicate: {
    en: { label: "Delicate", why: "Thin, light strokes look like they could break easily, which gives a feeling of fragility, refinement and care.", cues: "hairline strokes · slim shapes · lots of white space" },
    id: { label: "Halus", why: "Goresan tipis dan ringan terlihat mudah patah, sehingga memberi kesan rapuh, halus, dan penuh kehati-hatian.", cues: "goresan setipis rambut · bentuk ramping · banyak ruang kosong" },
  },
  fast: {
    en: { label: "Fast", why: "Slanted, narrow or streamlined letters seem to lean forward, like something that is already in motion.", cues: "slanted or leaning letters · sharp, streamlined cuts · stretched horizontal lines" },
    id: { label: "Cepat", why: "Huruf miring, sempit, atau ramping tampak condong ke depan, seperti sesuatu yang sudah bergerak.", cues: "huruf miring · potongan tajam dan aerodinamis · garis horizontal memanjang" },
  },
  slow: {
    en: { label: "Slow", why: "Wide, round, open letters with calm, flowing curves invite the eye to take its time.", cues: "wide, open forms · gentle curves · generous spacing · calligraphic rhythm" },
    id: { label: "Lambat", why: "Huruf lebar, bulat, dan terbuka dengan lengkung tenang yang mengalir mengajak mata berjalan pelan.", cues: "bentuk lebar dan terbuka · lengkung lembut · jarak lega · irama kaligrafi" },
  },
  hot: {
    en: { label: "Hot", why: "Energetic, bold and exuberant shapes feel loud and passionate, like fire or a warm summer day.", cues: "bold, lively shapes · uneven or exaggerated details · strong personality" },
    id: { label: "Panas", why: "Bentuk yang enerjik, tebal, dan meledak-ledak terasa riuh dan penuh gairah, seperti api atau hari musim panas.", cues: "bentuk tebal dan hidup · detail tak rata atau berlebihan · kepribadian kuat" },
  },
  cold: {
    en: { label: "Cold", why: "Precise, geometric, evenly spaced shapes feel clinical and technical, with little emotion, like steel or ice.", cues: "geometric precision · even strokes · straight lines and sharp angles" },
    id: { label: "Dingin", why: "Bentuk presisi, geometris, dan berjarak rata terasa klinis dan teknis, minim emosi, seperti baja atau es.", cues: "presisi geometris · goresan rata · garis lurus dan sudut tajam" },
  },
  masculine: {
    en: { label: "Masculine", why: "Heavy, angular, compact letters with sturdy corners are traditionally linked with toughness and force. This is a common association, not a rule.", cues: "thick, square or angular shapes · compact build · strong corners" },
    id: { label: "Maskulin", why: "Huruf berat, bersudut, dan padat dengan sudut kokoh secara tradisional dikaitkan dengan ketangguhan dan tenaga. Ini asosiasi umum, bukan aturan.", cues: "bentuk tebal, kotak, atau bersudut · bangun padat · sudut kokoh" },
  },
  feminine: {
    en: { label: "Feminine", why: "Slender, curved, flowing strokes, often with contrast or flourishes, are traditionally linked with grace and elegance. This is a common association, not a rule.", cues: "slim, curvy forms · high contrast between thick and thin · flourishes" },
    id: { label: "Feminin", why: "Goresan ramping, melengkung, dan mengalir, sering dengan kontras atau hiasan, secara tradisional dikaitkan dengan keanggunan. Ini asosiasi umum, bukan aturan.", cues: "bentuk ramping dan melengkung · kontras tebal–tipis tinggi · hiasan" },
  },
  soft: {
    en: { label: "Soft", why: "Rounded corners and gentle curves feel safe to touch, like a pillow, so the font feels gentle.", cues: "rounded corners · curves instead of angles · uneven, hand-made edges" },
    id: { label: "Lembut", why: "Sudut membulat dan lengkung lembut terasa aman disentuh, seperti bantal, sehingga font terasa lembut.", cues: "sudut membulat · lengkung, bukan sudut · tepi tak rata buatan tangan" },
  },
  hard: {
    en: { label: "Hard", why: "Sharp corners, straight lines and rigid angles feel like they could cut or resist, so the font feels firm.", cues: "sharp corners · straight edges · rigid, geometric structure" },
    id: { label: "Keras", why: "Sudut tajam, garis lurus, dan sudut kaku terasa bisa menggores atau menahan, sehingga font terasa keras.", cues: "sudut tajam · tepi lurus · struktur kaku dan geometris" },
  },
  old: {
    en: { label: "Old", why: "Details inherited from history (pen-drawn strokes, blackletter, classic serifs, typewriter wear) make us think of the past.", cues: "calligraphic, pen-like strokes · ornate or worn details · classic serif shapes" },
    id: { label: "Tua", why: "Detail warisan sejarah (goresan pena, blackletter, serif klasik, bekas mesin ketik) membuat kita teringat masa lalu.", cues: "goresan seperti pena kaligrafi · detail berhias atau usang · bentuk serif klasik" },
  },
  young: {
    en: { label: "Young", why: "Simple, rounded or geometric shapes without historical decoration feel new, light and full of energy.", cues: "simple geometric forms · no traditional decoration · playful or technological shapes" },
    id: { label: "Muda", why: "Bentuk sederhana, bulat, atau geometris tanpa hiasan sejarah terasa baru, ringan, dan penuh energi.", cues: "bentuk geometris sederhana · tanpa hiasan tradisional · bentuk ceria atau teknologis" },
  },
  friendly: {
    en: { label: "Friendly", why: "Round, open, relaxed letters feel like a smile or a wave. They invite you in.", cues: "round, open shapes · relaxed, slightly uneven rhythm · no sharp points" },
    id: { label: "Ramah", why: "Huruf bulat, terbuka, dan santai terasa seperti senyum atau lambaian. Mereka mengundang kita mendekat.", cues: "bentuk bulat dan terbuka · irama santai, sedikit tak rata · tanpa ujung tajam" },
  },
  threatening: {
    en: { label: "Threatening", why: "Spiky points and very heavy, tight, aggressive shapes echo warning signs and weapons, so they feel intimidating.", cues: "sharp spikes · very heavy or military-style blocks · tight, dark shapes" },
    id: { label: "Mengancam", why: "Ujung runcing serta bentuk sangat berat, rapat, dan agresif menyerupai rambu bahaya dan senjata, sehingga terasa mengintimidasi.", cues: "ujung runcing · balok sangat berat atau bergaya militer · bentuk rapat dan gelap" },
  },
};

/* ---------- Style words ---------- */
const STYLES = {
  medieval: {
    en: { label: "Medieval", why: "Medieval fonts copy the hand lettering of monks and scribes from the Middle Ages. They feel like castles, legends and old books.", cues: "pointed, blackletter shapes · pen-made strokes · dense, ornate forms" },
    id: { label: "Abad Pertengahan", why: "Font abad pertengahan meniru tulisan tangan para biarawan dan juru tulis zaman dulu. Terasa seperti kastil, legenda, dan buku kuno.", cues: "bentuk runcing ala blackletter · goresan pena · bentuk padat dan berhias" },
  },
  natural: {
    en: { label: "Natural", why: "Natural fonts look hand-drawn, with slight irregularities, as if made by a person rather than a machine. They suit organic, handmade and eco-friendly things.", cues: "hand-drawn lines · irregular shapes · thin, light, organic strokes" },
    id: { label: "Alami", why: "Font alami tampak digambar tangan, dengan sedikit ketidakrataan, seolah dibuat manusia, bukan mesin. Cocok untuk hal organik, buatan tangan, dan ramah lingkungan.", cues: "garis gambar tangan · bentuk tak beraturan · goresan tipis dan organik" },
  },
  brutalist: {
    en: { label: "Brutalist", why: "Brutalist fonts are raw, blunt and heavy, like exposed concrete. They have almost no decoration and make a bold statement.", cues: "ultra-heavy blocks · rough, blunt shapes · no decoration" },
    id: { label: "Brutalis", why: "Font brutalis terasa mentah, tumpul, dan berat, seperti beton ekspos. Nyaris tanpa hiasan dan membuat pernyataan yang tegas.", cues: "balok sangat tebal · bentuk kasar dan tumpul · tanpa hiasan" },
  },
  humanist: {
    en: { label: "Humanist", why: "Humanist fonts are based on handwriting and pen strokes, so they feel warm and natural to read, like a thoughtful person talking.", cues: "slight pen-like variations · open, readable shapes · calm, warm proportions" },
    id: { label: "Humanis", why: "Font humanis berakar pada tulisan tangan dan goresan pena, sehingga terasa hangat dan alami dibaca, seperti orang bijak yang sedang berbicara.", cues: "variasi halus seperti pena · bentuk terbuka dan mudah dibaca · proporsi tenang dan hangat" },
  },
  artdeco: {
    en: { label: "Art Deco", why: "Art Deco fonts come from the glamorous 1920s and 30s: geometric, symmetrical and elegant, often with strong thick–thin contrast. They feel luxurious and stylish.", cues: "geometric shapes · thick and thin contrast · symmetry and glamour" },
    id: { label: "Art Deco", why: "Font Art Deco berasal dari era glamor 1920–30-an: geometris, simetris, dan elegan, sering dengan kontras tebal–tipis yang kuat. Terasa mewah dan bergaya.", cues: "bentuk geometris · kontras tebal–tipis · simetri dan glamor" },
  },
  neutral: {
    en: { label: "Neutral", why: "Neutral fonts try not to have a personality of their own, so the words can do the talking. They feel clear, plain and trustworthy.", cues: "plain, even shapes · no decoration · consistent, quiet rhythm" },
    id: { label: "Netral", why: "Font netral berusaha tidak punya kepribadian sendiri agar kata-katanya yang berbicara. Terasa jelas, polos, dan tepercaya.", cues: "bentuk polos dan rata · tanpa hiasan · irama konsisten dan tenang" },
  },
  childish: {
    en: { label: "Childish", why: "Childish fonts are round, bouncy and simple, like a child's drawing or a toy. They feel innocent, playful and cheerful.", cues: "round, bubbly shapes · bouncy, uneven rhythm · simple, drawn forms" },
    id: { label: "Kekanak-kanakan", why: "Font kekanak-kanakan bulat, melenting, dan sederhana, seperti gambar anak atau mainan. Terasa polos, ceria, dan suka bermain.", cues: "bentuk bulat dan menggembung · irama melenting dan tak rata · bentuk sederhana seperti gambar" },
  },
  futuristic: {
    en: { label: "Futuristic", why: "Futuristic fonts look engineered: wide, squared-off and technological, as if from a spaceship dashboard. They feel like science fiction and innovation.", cues: "wide, squared curves · tech-like geometry · clean, sharp cuts" },
    id: { label: "Futuristik", why: "Font futuristik tampak direkayasa: lebar, bersudut kotak, dan teknologis, seperti dasbor pesawat luar angkasa. Terasa seperti fiksi ilmiah dan inovasi.", cues: "lengkung kotak dan lebar · geometri ala teknologi · potongan bersih dan tajam" },
  },
  traditional: {
    en: { label: "Traditional", why: "Traditional fonts follow classic book-printing shapes, with serifs and graceful contrast. They feel serious, respectable and timeless.", cues: "serifs · thick–thin stroke contrast · classic, balanced proportions" },
    id: { label: "Tradisional", why: "Font tradisional mengikuti bentuk cetak buku klasik, dengan serif dan kontras yang anggun. Terasa serius, terhormat, dan abadi.", cues: "serif · kontras goresan tebal–tipis · proporsi klasik dan seimbang" },
  },
  rustic: {
    en: { label: "Rustic", why: "Rustic fonts look weathered and rough, like painted signs, wood type or old typewriters. They feel countryside, vintage and down-to-earth.", cues: "worn or uneven edges · chunky, wood-type shapes · vintage details" },
    id: { label: "Rustik", why: "Font rustik tampak usang dan kasar, seperti papan cat, cetakan kayu, atau mesin ketik tua. Terasa pedesaan, vintage, dan membumi.", cues: "tepi usang atau tak rata · bentuk gemuk ala cetakan kayu · detail vintage" },
  },
  scientific: {
    en: { label: "Scientific", why: "Scientific fonts are precise and technical, often monospaced, like data, formulas and lab notes. They feel exact, rational and objective.", cues: "even, mechanical spacing · monospaced shapes · precise, technical details" },
    id: { label: "Ilmiah", why: "Font ilmiah presisi dan teknis, sering monospaced, seperti data, rumus, dan catatan laboratorium. Terasa tepat, rasional, dan objektif.", cues: "jarak mekanis dan rata · bentuk monospaced · detail presisi dan teknis" },
  },
  fresh: {
    en: { label: "Fresh", why: "Fresh fonts are light, round and clean, with an upbeat modern look. They feel youthful, new and energetic, like a new start.", cues: "light, clean shapes · gentle rounded curves · bright, open feel" },
    id: { label: "Segar", why: "Font segar ringan, bulat, dan bersih, dengan tampilan modern yang ceria. Terasa muda, baru, dan berenergi, seperti awal yang baru.", cues: "bentuk ringan dan bersih · lengkung bulat lembut · kesan cerah dan terbuka" },
  },
  contemporary: {
    en: { label: "Contemporary", why: "Contemporary fonts look current: clean, geometric and simple, made for screens and today's brands. They feel modern, confident and up to date.", cues: "clean geometry · simple forms, no decoration · modern proportions" },
    id: { label: "Kontemporer", why: "Font kontemporer tampak masa kini: bersih, geometris, dan sederhana, dibuat untuk layar dan merek zaman sekarang. Terasa modern, percaya diri, dan mutakhir.", cues: "geometri bersih · bentuk sederhana tanpa hiasan · proporsi modern" },
  },
  smart: {
    en: { label: "Smart", why: "Smart fonts feel intelligent and bookish: refined serifs that suggest knowledge, study and careful thinking.", cues: "refined details · classic serif forms · balanced, careful proportions" },
    id: { label: "Cerdas", why: "Font cerdas terasa intelek dan bernuansa buku: serif halus yang menyiratkan pengetahuan, studi, dan pemikiran cermat.", cues: "detail halus · bentuk serif klasik · proporsi seimbang dan cermat" },
  },
  funny: {
    en: { label: "Funny", why: "Funny fonts are exaggerated, bouncy and cartoon-like, so they make us smile before we even read the words. They feel playful and humorous.", cues: "exaggerated, cartoonish shapes · bouncy, uneven rhythm · bold outlines" },
    id: { label: "Lucu", why: "Font lucu berlebihan, melenting, dan seperti kartun, sehingga membuat kita tersenyum sebelum membaca katanya. Terasa jenaka dan penuh canda.", cues: "bentuk berlebihan ala kartun · irama melenting dan tak rata · garis tebal" },
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
  text:       { en: "Text face", id: "Text face (font teks)" },
  display:    { en: "Display face", id: "Display face (font judul)" },
  decorative: { en: "Decorative face", id: "Decorative face (font dekoratif)" },
  flex:       { en: "Versatile", id: "Serbaguna" },
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
  childish:    { en: "Your comic is a gentle picture-book story for toddlers about a baby dinosaur. Which font fits the cover title best?", id: "Komikmu adalah cerita bergambar lembut untuk balita tentang bayi dinosaurus. Font mana yang paling cocok untuk judul sampul?" },
  scientific:  { en: "Your comic is a hard sci-fi story about a lab, data and a rogue AI. Which font fits the cover title best?", id: "Komikmu adalah fiksi ilmiah serius tentang laboratorium, data, dan AI pemberontak. Font mana yang paling cocok untuk judul sampul?" },
  artdeco:     { en: "Your comic is a glamorous 1930s jazz-age detective story. Which font fits the cover title best?", id: "Komikmu adalah cerita detektif glamor era jazz 1930-an. Font mana yang paling cocok untuk judul sampul?" },
  medieval:    { en: "Your comic is a fantasy adventure of knights, castles and dragons. Which font fits the cover title best?", id: "Komikmu adalah petualangan fantasi tentang ksatria, kastil, dan naga. Font mana yang paling cocok untuk judul sampul?" },
  natural:     { en: "Your comic is a quiet, hand-drawn diary about life on a small organic farm. Which font fits the cover title best?", id: "Komikmu adalah buku harian bergambar tangan yang tenang tentang kehidupan di pertanian organik kecil. Font mana yang paling cocok untuk judul sampul?" },
  fresh:       { en: "Your comic is a light, sunny slice-of-life story about teenagers in summer. Which font fits the cover title best?", id: "Komikmu adalah kisah keseharian yang ringan dan cerah tentang remaja di musim panas. Font mana yang paling cocok untuk judul sampul?" },
  futuristic:  { en: "Your comic is a space adventure about a crew exploring distant planets. Which font fits the cover title best?", id: "Komikmu adalah petualangan luar angkasa tentang awak yang menjelajahi planet jauh. Font mana yang paling cocok untuk judul sampul?" },
  funny:       { en: "Your comic is a silly gag comic that wants readers to laugh before they read a word. Which font fits the cover title best?", id: "Komikmu adalah komik gokil yang ingin membuat pembaca tertawa sebelum membaca satu kata pun. Font mana yang paling cocok untuk judul sampul?" },
  rustic:      { en: "Your comic is a dusty Wild West tale of outlaws and sheriffs. Which font fits the cover title best?", id: "Komikmu adalah kisah Wild West berdebu tentang penjahat dan sheriff. Font mana yang paling cocok untuk judul sampul?" },
  brutalist:   { en: "Your comic is a raw, gritty street story with blunt, heavy energy. Which font fits the cover title best?", id: "Komikmu adalah kisah jalanan yang mentah dan keras dengan energi tumpul dan berat. Font mana yang paling cocok untuk judul sampul?" },
  traditional: { en: "Your comic is a classic literary adaptation of a nineteenth-century novel. Which font fits the cover title best?", id: "Komikmu adalah adaptasi sastra klasik dari novel abad ke-19. Font mana yang paling cocok untuk judul sampul?" },
};
const FIT_STYLES = Object.keys(SCENARIOS);

const SCENARIO_EXTRA = {
  en: "Before you decide: a title face grabs attention, but if it hurts legibility, readers will not get the title. Shrink your cover to thumbnail size and check that it still reads.",
  id: "Sebelum memutuskan: font judul menarik perhatian, tetapi jika mengurangi keterbacaan, pembaca tidak akan menangkap judulnya. Kecilkan sampulmu ke ukuran thumbnail dan pastikan tetap terbaca.",
};

/* ---------- Anachronism scenarios ---------- */
const ANACH = {
  medieval: {
    out: ["futuristic", "scientific"], fit: ["medieval", "traditional", "rustic"],
    en: "Your comic is set in the Middle Ages, with knights and castles. Which font would feel out of place on the cover?",
    id: "Komikmu berlatar Abad Pertengahan, dengan ksatria dan kastil. Font mana yang akan terasa tidak pada tempatnya di sampul?",
    world: { en: "a medieval world", id: "dunia abad pertengahan" },
  },
  futuristic: {
    out: ["medieval", "rustic"], fit: ["futuristic", "scientific"],
    en: "Your comic is set in a high-tech space future. Which font would feel out of place on the cover?",
    id: "Komikmu berlatar masa depan luar angkasa yang canggih. Font mana yang akan terasa tidak pada tempatnya di sampul?",
    world: { en: "a high-tech future", id: "masa depan berteknologi tinggi" },
  },
  rustic: {
    out: ["futuristic", "scientific"], fit: ["rustic", "traditional"],
    en: "Your comic is set in the dusty Wild West. Which font would feel out of place on the cover?",
    id: "Komikmu berlatar Wild West yang berdebu. Font mana yang akan terasa tidak pada tempatnya di sampul?",
    world: { en: "the Wild West", id: "Wild West" },
  },
};

/* ---------- Effects of weight, width, spacing and orientation ---------- */
const FX = {
  heavy: {
    en: { label: "Heavy weight", prompt: "Which version of the title feels stronger and louder?", why: "Thick strokes add visual mass, so the title feels powerful, loud and confident. Heavy weights are also easy to see from far away, which is great for covers.", cues: "thick strokes · small inner spaces · dense, dark colour on the page", summary: "Heavy weight feels strong and loud" },
    id: { label: "Berat (tebal)", prompt: "Versi judul mana yang terasa lebih kuat dan lantang?", why: "Goresan tebal menambah massa visual, sehingga judul terasa kuat, lantang, dan percaya diri. Huruf tebal juga mudah terlihat dari jauh, bagus untuk sampul.", cues: "goresan tebal · ruang dalam huruf kecil · warna padat dan gelap di halaman", summary: "Huruf tebal terasa kuat dan lantang" },
  },
  thin: {
    en: { label: "Thin weight", prompt: "Which version of the title feels more delicate and quiet?", why: "Thin strokes take up little visual space, so the title feels quiet, elegant or fragile. On a busy cover or at thumbnail size, thin type can disappear.", cues: "hairline strokes · lots of white space · light colour on the page", summary: "Thin weight feels delicate and quiet" },
    id: { label: "Tipis", prompt: "Versi judul mana yang terasa lebih halus dan tenang?", why: "Goresan tipis memakai sedikit ruang visual, sehingga judul terasa tenang, elegan, atau rapuh. Pada sampul yang ramai atau ukuran thumbnail, huruf tipis bisa hilang.", cues: "goresan setipis rambut · banyak ruang kosong · warna ringan di halaman", summary: "Huruf tipis terasa halus dan tenang" },
  },
  condensed: {
    en: { label: "Condensed (narrow)", prompt: "Which version feels more compressed, tall and urgent?", why: "Narrow letters feel squeezed and tall, like a crowd pressing in. They create tension and urgency, and they fit long titles into small spaces.", cues: "narrow letters · tall proportions · tight rhythm", summary: "Condensed letters feel tense and urgent" },
    id: { label: "Condensed (sempit)", prompt: "Versi mana yang terasa lebih terhimpit, tinggi, dan mendesak?", why: "Huruf sempit terasa terhimpit dan tinggi, seperti kerumunan yang mendesak. Mereka menciptakan ketegangan dan rasa mendesak, serta memuat judul panjang di ruang kecil.", cues: "huruf sempit · proporsi tinggi · irama rapat", summary: "Huruf condensed terasa tegang dan mendesak" },
  },
  extended: {
    en: { label: "Extended (wide)", prompt: "Which version feels more open, steady and grounded?", why: "Wide letters feel stable and grounded, as if they have room to breathe. They read as calm, open or technological, but they take up more space.", cues: "wide letters · low, broad proportions · open rhythm", summary: "Extended letters feel open and steady" },
    id: { label: "Extended (lebar)", prompt: "Versi mana yang terasa lebih terbuka, mantap, dan membumi?", why: "Huruf lebar terasa stabil dan membumi, seolah punya ruang untuk bernapas. Terbaca tenang, terbuka, atau teknologis, tetapi memakan lebih banyak ruang.", cues: "huruf lebar · proporsi rendah dan lebar · irama terbuka", summary: "Huruf extended terasa terbuka dan mantap" },
  },
  tight: {
    en: { label: "Tight letter spacing", prompt: "Which version feels more tense and intense?", why: "Tight tracking (little space between letters) makes letters feel crowded and compact: dense, tense, intense. Too tight and the letters collide, which hurts legibility.", cues: "letters almost touching · dark, dense word shape", summary: "Tight spacing feels dense and intense" },
    id: { label: "Jarak huruf rapat", prompt: "Versi mana yang terasa lebih tegang dan intens?", why: "Tracking rapat (sedikit jarak antar huruf) membuat huruf terasa sesak dan padat: pekat, tegang, intens. Terlalu rapat dan huruf bertabrakan, merusak keterbacaan.", cues: "huruf hampir bersentuhan · bentuk kata gelap dan padat", summary: "Jarak rapat terasa pekat dan intens" },
  },
  loose: {
    en: { label: "Loose letter spacing", prompt: "Which version feels calmer, airier and more cinematic?", why: "Loose tracking (extra space between letters) makes the title feel airy, calm and spacious. It often feels cinematic, premium or quiet. Too loose and the word falls apart into separate letters.", cues: "visible gaps between letters · light, open word shape · slower reading", summary: "Loose spacing feels airy and calm" },
    id: { label: "Jarak huruf renggang", prompt: "Versi mana yang terasa lebih tenang, lapang, dan sinematik?", why: "Tracking renggang (jarak ekstra antar huruf) membuat judul terasa lapang, tenang, dan luas. Sering terasa sinematik, premium, atau hening. Terlalu renggang dan kata pecah menjadi huruf-huruf terpisah.", cues: "celah terlihat antar huruf · bentuk kata ringan dan terbuka · membaca lebih pelan", summary: "Jarak renggang terasa lapang dan tenang" },
  },
  even: {
    en: { label: "Well kerned", prompt: "Which version has more even, well-kerned spacing?", why: "Kerning is the space between one specific pair of letters. Letters like T, A, V and W have diagonal or open shapes that leave bigger gaps. Good kerning tucks these pairs closer so every gap looks equally wide. Uneven gaps look clumsy and make a title feel unfinished.", cues: "gaps that look equal · diagonal letters tucked together · no holes and no collisions", summary: "Even kerning looks polished" },
    id: { label: "Kerning rapi", prompt: "Versi mana yang jaraknya lebih rata dan kerning-nya lebih rapi?", why: "Kerning adalah jarak antara satu pasangan huruf tertentu. Huruf seperti T, A, V, dan W berbentuk diagonal atau terbuka sehingga meninggalkan celah lebih besar. Kerning yang baik merapatkan pasangan ini agar semua celah tampak sama lebar. Celah tak rata terlihat canggung dan membuat judul terasa belum selesai.", cues: "celah tampak sama lebar · huruf diagonal dirapatkan · tanpa lubang dan tanpa tabrakan", summary: "Kerning rata terlihat rapi" },
  },
  uneven: {
    en: { label: "Uneven gaps", summary: "Uneven gaps look clumsy" },
    id: { label: "Celah tak rata", summary: "Celah tak rata terlihat canggung" },
  },
  slant: {
    en: { label: "Forward slant", prompt: "Which version feels faster and more energetic?", why: "A forward slant (leaning right, in the direction we read) makes letters look like they are leaning into motion. It adds speed, energy and momentum, which suits action comics.", cues: "letters leaning right · diagonal energy · feels like movement", summary: "Forward slant feels fast and energetic" },
    id: { label: "Miring ke depan", prompt: "Versi mana yang terasa lebih cepat dan berenergi?", why: "Kemiringan ke depan (condong ke kanan, searah membaca) membuat huruf tampak bersandar ke arah gerak. Menambah kecepatan, energi, dan momentum, cocok untuk komik aksi.", cues: "huruf condong ke kanan · energi diagonal · terasa bergerak", summary: "Miring ke depan terasa cepat dan berenergi" },
  },
  tilt: {
    en: { label: "Tilted title", prompt: "Which version feels more playful and casual?", why: "Tilting the whole title makes it feel casual, lively and a little unstable, as if it was placed by hand. About 5–10° looks intentional; only 1–2° tends to look like a mistake.", cues: "title on a diagonal · baseline rising or falling · casual, lively feel", summary: "A tilted title feels playful and casual" },
    id: { label: "Judul dimiringkan", prompt: "Versi mana yang terasa lebih ceria dan santai?", why: "Memiringkan seluruh judul membuatnya terasa santai, hidup, dan sedikit tidak stabil, seolah ditempatkan dengan tangan. Sekitar 5–10° terlihat disengaja; hanya 1–2° cenderung terlihat seperti kesalahan.", cues: "judul miring diagonal · garis dasar naik atau turun · kesan santai dan hidup", summary: "Judul miring terasa ceria dan santai" },
  },
  upright: {
    en: { label: "Upright and level", prompt: "Which version feels steadier, calmer and more formal?", why: "Letters standing straight on a level baseline feel steady, calm and formal, like a building. That is a safe choice for serious or classic stories.", cues: "vertical letters · level baseline · stable, orderly feel", summary: "Upright, level type feels steady and formal" },
    id: { label: "Tegak dan lurus", prompt: "Versi mana yang terasa lebih mantap, tenang, dan formal?", why: "Huruf yang berdiri tegak pada garis dasar yang lurus terasa mantap, tenang, dan formal, seperti bangunan. Pilihan aman untuk cerita yang serius atau klasik.", cues: "huruf tegak · garis dasar lurus · kesan stabil dan teratur", summary: "Huruf tegak dan lurus terasa mantap dan formal" },
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
    prompt: "Font mana di bawah ini yang merupakan text face, dibuat untuk membaca panjang dengan nyaman?",
    why: "Text face dirancang untuk bacaan panjang, seperti di buku dan majalah. Fokusnya keterbacaan, sehingga kamu bisa membaca cepat dalam waktu lama tanpa lelah. Display face dibuat untuk judul besar, dan decorative face dibuat untuk menarik perhatian, bahkan dengan mengorbankan keterbacaan.",
    cues: "bentuk huruf konvensional · jarak lega · x-height tinggi · bentuk tenang dan rata",
    extra: "Untuk komikmu: pakai font yang ramah baca (atau lettering komik yang jelas) untuk balon kata dan keterangan, dan simpan display atau decorative face untuk judul.",
  },
};

/* ---------- General tips shown in the notes ---------- */
const TIPS = [
  { en: "A font speaks before the words do: we feel its mood before we read a single word.", id: "Font berbicara sebelum kata-katanya: kita merasakan suasananya sebelum membaca satu kata pun." },
  { en: "Personality comes from shapes: stroke thickness, roundness, width, slant and small details.", id: "Kepribadian berasal dari bentuk: ketebalan goresan, kebulatan, lebar, kemiringan, dan detail kecil." },
  { en: "Round shapes tend to feel friendly; sharp angles tend to feel serious or even dangerous.", id: "Bentuk bulat cenderung terasa ramah; sudut tajam cenderung terasa serius atau bahkan berbahaya." },
  { en: "Look for typefaces that embody the qualities of the message you want to convey.", id: "Carilah font yang mewujudkan kualitas pesan yang ingin kamu sampaikan." },
  { en: "One font can carry several moods at once, for example both friendly and young.", id: "Satu font bisa membawa beberapa suasana sekaligus, misalnya ramah sekaligus muda." },
  { en: "Mood is a blend: the look of the font, how readable your design is, and what the words mean.", id: "Suasana adalah perpaduan: tampilan font, keterbacaan desainmu, dan makna kata-katanya." },
  { en: "Culture and context shape these feelings too. They are common associations, not strict rules.", id: "Budaya dan konteks juga membentuk perasaan ini. Ini asosiasi yang umum, bukan aturan mutlak." },
  { en: "Legibility comes first: if readers cannot read the title, its mood does not matter.", id: "Keterbacaan nomor satu: jika pembaca tidak bisa membaca judulnya, suasananya tidak penting." },
  { en: "A limited palette looks confident: one or two fonts are usually enough for a cover.", id: "Palet terbatas terlihat percaya diri: satu atau dua font biasanya cukup untuk sebuah sampul." },
  { en: "Typography is about eyeballing: step back, squint, and trust what you see.", id: "Tipografi itu soal mata: mundur sedikit, sipitkan mata, dan percayai apa yang kamu lihat." },
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
