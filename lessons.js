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
  input.addEventListener("input", fire);
  const row = h("label", { class: "ctrl" }, h("span", { class: "ctrl-label" }, label), input, out);
  return { row, fire };
}
function titleInput(L, onChange) {
  const input = h("input", { type: "text", class: "demo-input", maxlength: "24", value: demoTitle, "aria-label": bi(L, "Your comic title", "Judul komikmu") });
  input.addEventListener("input", () => { demoTitle = input.value || " "; onChange(demoTitle); });
  return h("label", { class: "ctrl title-ctrl" }, h("span", { class: "ctrl-label" }, bi(L, "Try your own comic title", "Coba judul komikmu sendiri")), input);
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
    h("div", { class: "demo" }, s.row, h("div", { class: "demo-stage" }, h("div", null, a), h("div", null, b)), cap),
  );
}

/* ================= Lesson 4 ================= */
function lessonMatch(L) {
  const traitKeys = Object.keys(TRAITS), styleKeys = Object.keys(STYLES);
  const picked = new Set();
  const results = h("div", { class: "fgrid" });
  const hint = h("p", { class: "hint" });
  const sampleEls = [];
  const render = () => {
    results.innerHTML = ""; sampleEls.length = 0;
    const ranked = FONT_LIST.map((f) => {
      const traits = Object.values(f.t).filter((p) => picked.has("p:" + p));
      const styles = f.s.filter((s) => picked.has("s:" + s));
      return { f, traits, styles, score: traits.length + styles.length * 1.5 };
    }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score || a.f.n.localeCompare(b.f.n)).slice(0, 4);
    hint.textContent = picked.size === 0
      ? bi(L, "Pick two to four words above to see fonts that carry them.", "Pilih dua sampai empat kata di atas untuk melihat font yang membawanya.")
      : ranked.length ? bi(L, "Fonts that match most of your words:", "Font yang cocok dengan sebagian besar katamu:")
        : bi(L, "No font in our small library matches. Try fewer or different words.", "Tidak ada font di perpustakaan kecil kami yang cocok. Coba kata lain atau lebih sedikit.");
    ranked.forEach(({ f, traits, styles }) => {
      const s = h("span", { class: "sample", style: `font-family:${fontStack(f)}` }, demoTitle);
      sampleEls.push(s);
      results.append(h("div", { class: "fcard" }, s, h("p", { class: "cap" }, h("strong", null, f.n),
        [...styles.map((x) => STYLES[x][L].label), ...traits.map((x) => TRAITS[x][L].label)].join(" · "))));
    });
  };
  const chip = (key, text) => {
    const b = h("button", { type: "button", class: "chip-toggle", "aria-pressed": "false" }, text);
    b.addEventListener("click", () => {
      if (picked.has(key)) picked.delete(key); else picked.add(key);
      b.setAttribute("aria-pressed", String(picked.has(key)));
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
  const coverSvg = `<svg viewBox="0 0 240 330" class="cover-svg" xmlns="http://www.w3.org/2000/svg" aria-label="Comic Cover Mockup">
    <defs>
      <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0b1329"/>
        <stop offset="50%" stop-color="#16203a"/>
        <stop offset="100%" stop-color="#24314e"/>
      </linearGradient>
      <filter id="titleShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.8"/>
      </filter>
    </defs>
    <!-- Background -->
    <rect width="240" height="330" rx="8" fill="url(#nightSky)"/>
    
    <!-- Moon & atmosphere -->
    <circle cx="180" cy="75" r="26" fill="#fde68a" opacity="0.9"/>
    <polygon points="30,330 90,50 115,50 45,330" fill="#ffffff" opacity="0.06"/>
    
    <!-- City silhouettes -->
    <rect x="12" y="150" width="36" height="180" fill="#070c18"/>
    <rect x="52" y="180" width="38" height="150" fill="#050810"/>
    <rect x="150" y="130" width="42" height="200" fill="#070c18"/>
    <rect x="195" y="165" width="35" height="165" fill="#050810"/>
    <circle cx="22" cy="170" r="1.5" fill="#fef08a" opacity="0.7"/>
    <circle cx="32" cy="190" r="1.5" fill="#fef08a" opacity="0.7"/>
    <circle cx="162" cy="150" r="1.5" fill="#fef08a" opacity="0.7"/>
    <circle cx="172" cy="170" r="1.5" fill="#fef08a" opacity="0.7"/>

    <!-- [1] TITLE LOGO (Midground) -->
    <text x="120" y="78" fill="#f59e0b" font-family="'Anton', sans-serif" font-size="34" font-weight="900" text-anchor="middle" letter-spacing="1" filter="url(#titleShadow)">NIGHT HAWK</text>

    <!-- [1] HERO ILLUSTRATION (Foreground Layer overlapping title letters for 3D depth) -->
    <path d="M 65,330 L 95,245 L 145,245 L 175,330 Z" fill="#030712"/>
    <path d="M 120,195 C 90,205 65,235 45,280 C 70,265 100,255 115,248 Z" fill="#0c1322"/>
    <path d="M 120,195 C 150,205 180,235 205,280 C 175,265 145,255 125,248 Z" fill="#0c1322"/>
    <path d="M 105,198 C 105,168 112,150 120,144 C 128,150 135,168 135,198 Z" fill="#1e293b"/>
    <polygon points="112,152 116,132 120,145 124,132 128,152" fill="#0c1322"/>
    <ellipse cx="120" cy="148" rx="9" ry="11" fill="#0c1322"/>
    <ellipse cx="117" cy="146" rx="2" ry="1" fill="#38bdf8"/>
    <ellipse cx="123" cy="146" rx="2" ry="1" fill="#38bdf8"/>

    <!-- [2] SECONDARY: TAGLINE in negative space -->
    <text x="120" y="104" fill="#cbd5e1" font-family="'Figtree',sans-serif" font-size="8" font-weight="600" text-anchor="middle" letter-spacing="2">THE CITY NEVER SLEEPS</text>

    <!-- [3] TERTIARY: CORNER ISSUE BOX -->
    <g transform="translate(10, 10)">
      <rect width="32" height="36" rx="3" fill="#090d16" stroke="#f59e0b" stroke-width="1.2"/>
      <text x="16" y="13" fill="#f59e0b" font-family="'Anton',sans-serif" font-size="10" font-weight="700" text-anchor="middle">#1</text>
      <line x1="4" y1="16.5" x2="28" y2="16.5" stroke="#f59e0b" stroke-width="0.8"/>
      <text x="16" y="25" fill="#f8fafc" font-family="'Figtree',sans-serif" font-size="6.5" font-weight="700" text-anchor="middle">OCT</text>
      <text x="16" y="32.5" fill="#94a3b8" font-family="'Figtree',sans-serif" font-size="5.5" text-anchor="middle">$3.99</text>
    </g>

    <!-- [3] TERTIARY: CREATOR BYLINE (Bottom margin) -->
    <rect x="0" y="308" width="240" height="22" fill="#030712" opacity="0.9"/>
    <text x="120" y="322" fill="#94a3b8" font-family="'Figtree',sans-serif" font-size="7" font-weight="600" text-anchor="middle" letter-spacing="1">STORY: R. CHEN · ART: M. SOTO</text>
  </svg>`;

  return h("div", null,
    h("h3", null, bi(L, "Cover Hierarchy with Main Illustration", "Hierarki Sampul dengan Ilustrasi Utama")),
    para(bi(L,
      "In comic cover design, you almost never layout text on an empty canvas: you are orchestrating a relationship with a centerpiece cover illustration. A successful cover establishes a clear 3-tier hierarchy between the art, the title logo, and the supporting metadata:",
      "Dalam desain sampul komik, kamu hampir tidak pernah menata teks di kanvas kosong: kamu mengatur hubungan dengan ilustrasi sampul utama. Sampul yang berhasil membangun hierarki 3 tingkat yang jelas antara gambar, logo judul, dan informasi pendukung:")),
    h("div", { class: "split cover-layout-split" },
      h("div", null,
        h("div", { class: "tier-card" },
          h("span", { class: "tier-badge t1" }, bi(L, "Tier 1: Illustration & Title Logo", "Tingkat 1: Ilustrasi & Logo Judul")),
          para(bi(L,
            "The illustration is the emotional hook (the hero's expression and dynamic pose). The title is the story's brand identity. Place the title in the top third ('masthead zone') so it stays visible on comic racks. Overlapping the character slightly in front of the title creates exciting 3D depth—just make sure at least 80% of the letters remain instantly legible.",
            "Ilustrasi adalah penarik emosi (ekspresi tokoh dan pose dinamis). Judul adalah identitas merek cerita. Tempatkan judul di sepertiga atas ('zona masthead') agar tetap terlihat di rak komik. Menumpuk tokoh sedikit di depan judul menciptakan kedalaman 3D yang seru—pastikan setidaknya 80% huruf tetap terbaca jelas."))),
        h("div", { class: "tier-card" },
          h("span", { class: "tier-badge t2" }, bi(L, "Tier 2: Storyline Tagline", "Tingkat 2: Tagline Cerita")),
          para(bi(L,
            "A teaser phrase ('The city never sleeps'). Scale it to 25–35% of title size and place it in calm negative space between the title and art without crowding either.",
            "Kalimat pemikat ('Kota yang tak pernah tidur'). Buat ukurannya 25–35% dari ukuran judul dan taruh di ruang kosong antara judul dan gambar tanpa membuatnya sesak."))),
        h("div", { class: "tier-card" },
          h("span", { class: "tier-badge t3" }, bi(L, "Tier 3: Issue Number & Creator Byline", "Tingkat 3: Nomor Edisi & Nama Kreator")),
          para(bi(L,
            "Issue #, price and date belong in a compact 'Corner Box' (usually top-left) for collector reference. Creator names (writer & artist) belong in quiet margins at 15–20% of title size. Never place metadata over the hero's face, hands, or focal action!",
            "Nomor edisi, harga, dan tanggal disimpan di 'Kotak Sudut' yang rapi (biasanya kiri atas) untuk rujukan kolektor. Nama kreator (penulis & komikus) ditaruh di tepi yang tenang dengan ukuran 15–20% dari judul. Jangan pernah menaruh teks di atas wajah, tangan, atau aksi utama tokoh!")))),
      raw(coverSvg, "cover-frame")),
    h("h3", null, bi(L, "Good habits for comic covers", "Kebiasaan baik sampul komik")),
    bullets([
      bi(L, "The Squint Test: Step back and squint. The illustration and title should be the only two dominant shapes. If an issue number or creator name screams louder, shrink it.", "Uji Sipit: Mundur dan sipitkan mata. Ilustrasi dan judul harus jadi dua bentuk paling dominan. Jika nomor edisi atau nama kreator lebih mencolok, perkecil ukurannya."),
      bi(L, "Respect the Negative Space: Place titles and metadata where the art has clean breathing room (sky, dark shadows, flat wash) or use an outline/drop shadow against busy textures.", "Hormati Ruang Kosong: Tempatkan judul dan teks di bagian gambar yang punya ruang lapang (langit, bayangan gelap) atau gunakan garis tepi/bayangan halus pada latar yang ramai."),
      bi(L, "Avoid anachronisms: A blackletter title on a futuristic mech story, or a space font on a Western, pulls readers right out of the comic.", "Hindari anakronisme: Judul blackletter untuk cerita robot masa depan, atau font sci-fi untuk Western, merusak imersi pembaca."),
      bi(L, "Avoid trite correlations: Look at what others have done. If every comedy uses the exact same goofy font, look for fresher ways to be playful.", "Hindari korelasi klise: Lihat apa yang sudah dilakukan orang lain. Jika semua komik lucu memakai font konyol yang sama, cari cara yang lebih segar."),
      bi(L, "Limit your palette: 1 expressive display font for the title, and 1 clean font family (with regular and bold weights) for all issue numbers, taglines, and creator credits.", "Batasi palet font: 1 font display ekspresif untuk judul, dan 1 keluarga font bersih (dengan variasi normal dan tebal) untuk semua nomor edisi, tagline, dan nama kreator."),
    ]),
  );
}

/* ================= Lesson 6 ================= */
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
  return h("div", null,
    para(bi(L,
      "The same font can change character when you change its weight (how thick the strokes are) and its width (how wide the letters are). Many font families come with several weights and widths, such as thin, regular, bold, condensed and extended.",
      "Font yang sama bisa berubah karakter ketika ketebalan (seberapa tebal goresan) dan lebarnya (seberapa lebar huruf) diubah. Banyak keluarga font punya beberapa ketebalan dan lebar, seperti tipis, normal, tebal, condensed, dan extended.")),
    titleInput(L, (v) => (sample.textContent = v)),
    h("div", { class: "demo" }, h("div", { class: "demo-stage" }, sample), sw.row, cap1, sd.row, cap2),
    bullets([
      bi(L, "Match weight to your hero's energy: a gentle character rarely wants an extra-heavy title.", "Sesuaikan ketebalan dengan energi tokohmu: tokoh lembut jarang cocok dengan judul sangat tebal."),
      bi(L, "Thin titles can vanish on busy artwork. Heavy ones stay visible from far away.", "Judul tipis bisa hilang di atas gambar yang ramai. Judul tebal tetap terlihat dari jauh."),
      bi(L, "Condensed letters help a long title fit; extended letters suit calm or high-tech stories.", "Huruf sempit membantu judul panjang muat; huruf lebar cocok untuk cerita yang tenang atau berteknologi tinggi."),
    ]),
  );
}

/* ================= Lesson 7 ================= */
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
    h("div", { class: "demo" }, h("div", { class: "demo-stage" }, trSample), tr.row, trCap),
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
    h("div", { class: "demo" }, h("div", { class: "demo-stage" }, leadBox), ld.row, leadCap),
  );
}

/* ================= Lesson 8 ================= */
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
  return h("div", null,
    para(bi(L,
      "Orientation is how the letters stand: upright, slanted or rotated. Slanting and rotating are the quickest ways to add movement to a flat title.",
      "Orientasi adalah cara huruf berdiri: tegak, miring, atau diputar. Memiringkan dan memutar adalah cara tercepat untuk menambah gerak pada judul yang datar.")),
    titleInput(L, (v) => { text = v; draw(); }),
    h("div", { class: "demo" }, h("div", { class: "demo-stage tall" }, wrapper), s1.row, cap1, s2.row, cap2, s3.row, cap3),
    bullets([
      bi(L, "A tilt of about 5–10° looks intentional. A tilt of only 1–2° tends to look like a mistake.", "Kemiringan sekitar 5–10° terlihat disengaja. Kemiringan hanya 1–2° cenderung terlihat seperti kesalahan."),
      bi(L, "Make the slant match the action: a forward lean matches movement to the right.", "Samakan kemiringan dengan aksi: condong ke depan cocok dengan gerak ke kanan."),
      bi(L, "A real italic is redrawn by the type designer. Slanting a normal font just by skewing it distorts the strokes: fine for a bold display title, but check it with your eyes.", "Italic asli digambar ulang oleh perancang font. Memiringkan font biasa hanya dengan skew mengubah bentuk goresan: tidak masalah untuk judul display yang tebal, tetapi periksa dengan matamu."),
      bi(L, "Whatever you do, keep the title readable.", "Apa pun yang kamu lakukan, jaga agar judul tetap terbaca."),
    ]),
  );
}

/* ================= Lesson 9 ================= */
function lessonChecklist(L) {
  const rules = [
    bi(L, "Describe your character or story in three words before you pick a font.", "Gambarkan tokoh atau ceritamu dalam tiga kata sebelum memilih font."),
    bi(L, "Use a display or decorative face for the title. Keep speech balloons in a clear, readable face.", "Pakai display atau decorative face untuk judul. Biarkan balon kata memakai font yang jelas dan mudah dibaca."),
    bi(L, "Check legibility: shrink the cover to thumbnail size.", "Periksa keterbacaan: kecilkan sampul ke ukuran thumbnail."),
    bi(L, "Match the era and world of your story. Avoid anachronisms and clichés.", "Samakan zaman dan dunia ceritamu. Hindari anachronism dan klise."),
    bi(L, "Weight and width: heavy feels strong, thin feels delicate, condensed feels tense, extended feels steady.", "Ketebalan dan lebar: tebal terasa kuat, tipis terasa halus, sempit terasa tegang, lebar terasa mantap."),
    bi(L, "Spacing: tight feels intense, loose feels calm. Kerning the diagonal pairs (T A V W Y) until the gaps look even.", "Jarak: rapat terasa intens, renggang terasa tenang. Rapikan kerning pasangan diagonal (T A V W Y) sampai celahnya tampak rata."),
    bi(L, "Orientation: a forward slant feels fast, a 5–10° tilt feels playful.", "Orientasi: miring ke depan terasa cepat, kemiringan 5–10° terasa ceria."),
    bi(L, "Use one or two fonts, plan the hierarchy, and trust your eyes.", "Pakai satu atau dua font, rencanakan hierarkinya, dan percayai matamu."),
  ];
  return h("div", null,
    para(bi(L, "Here is everything in one list. The quiz that follows tests these ideas with real examples. Take your time: every answer comes with a short note.", "Ini semuanya dalam satu daftar. Kuis berikutnya menguji ide-ide ini dengan contoh nyata. Santai saja: setiap jawaban disertai catatan singkat.")),
    h("ol", { class: "checklist" }, rules.map((r) => h("li", null, r))),
    h("p", { class: "hint" }, bi(L, "Lessons 1–5 are based on the workshop slides \"Choosing Typefaces\". Lessons 6–8 add weight, width, spacing and orientation for comic titles.", "Pelajaran 1–5 berdasarkan slide workshop \"Choosing Typefaces\". Pelajaran 6–8 menambahkan ketebalan, lebar, jarak, dan orientasi untuk judul komik.")),
  );
}

/* ---------- Lesson list ---------- */
const LESSONS = [
  { title: { en: "Type has a voice", id: "Huruf punya suara" }, build: lessonVoice },
  { title: { en: "Every font has character and style", id: "Setiap font punya karakter dan gaya" }, build: lessonCharacter },
  { title: { en: "Text, display and decorative", id: "Text, display, dan decorative" }, build: lessonRoles },
  { title: { en: "Match the font to your character", id: "Cocokkan font dengan tokohmu" }, build: lessonMatch },
  { title: { en: "Good habits for covers", id: "Kebiasaan baik untuk sampul" }, build: lessonHabits },
  { title: { en: "Weight and width", id: "Ketebalan dan lebar" }, build: lessonWeightWidth },
  { title: { en: "Kerning and spacing", id: "Kerning dan jarak" }, build: lessonSpacing },
  { title: { en: "Slant and rotation", id: "Kemiringan dan rotasi" }, build: lessonOrientation },
  { title: { en: "Your checklist", id: "Daftar periksamu" }, build: lessonChecklist },
];
