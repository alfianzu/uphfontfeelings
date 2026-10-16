"use strict";

/* ============================================================
   Font Feelings – UI, scoring, leaderboard, email
   (content.js provides buildQuiz, PHRASES, TIPS, tagsOf, …)
   ============================================================ */

const BASE_POINTS = 100;
const STREAK_STEP = 10;
const MAX_STREAK_BONUS = 50;

/* Optional: fill these in (free account at emailjs.com) to send real emails
   straight from the browser. Left empty, the app opens the player's own mail
   app with the results pre-filled instead. */
const EMAILJS = { serviceId: "", templateId: "", publicKey: "" };

const KEYS = { lang: "ff-lang", name: "ff-name", email: "ff-email", board: "ff-leaderboard", learned: "ff-learned" };

/* ---------- UI text ---------- */
const T = {
  en: {
    appName: "Font Feelings",
    goToLesson: "Jump to lesson…",
    lessonJumpOpt: (n, title) => `${n}. ${title}`,
    startTitle: "Every font has a personality.",
    startLead: "Choosing a title font for your comic starts with understanding that every typeface has a distinct character. Explore 10 interactive lessons on typographic voice, hierarchy, spacing, orientation, and cover color—then test your eye in a 15-question quiz. No prior design experience needed.",
    nameLabel: "Your name",
    namePlaceholder: "e.g. Alex",
    nameError: "Please enter your name to start.",
    start: "Start the lessons",
    skipLessons: "Skip the lessons, go to the quiz",
    lessonOf: (n, total) => `Lesson ${n} of ${total}`,
    lessonBack: "Back", lessonNext: "Next lesson", lessonStartQuiz: "Start the quiz", skipToQuiz: "Skip to the quiz",
    reviewLessons: "Review the lessons",
    noTimer: "No timer, no rush. Each answer comes with a short note that explains why.",
    leaderboard: "Leaderboard",
    best: (n) => `Your best: ${n} pts`,
    qOf: (n, total) => `Question ${n} of ${total}`,
    pts: "pts",
    sec_compare: "Feel the difference", sec_trait: "Find the word", sec_style: "Name the style", sec_role: "Know the role",
    sec_weight: "Weight", sec_width: "Width", sec_tracking: "Letter spacing", sec_kerning: "Kerning", sec_orient: "Slant and rotation",
    sec_scenario: "Choose for your comic", sec_anach: "Spot the mismatch",
    right: "That's right",
    wrong: "Not quite",
    answerIs: (a) => `Answer: ${a}`,
    lookFor: "Look for", goodToKnow: "Good to know",
    about: (n) => `About ${n}`,
    next: "Next", finish: "See my results",
    streakLabel: (n) => `🔥 ${n} in a row`,
    resHello: (n) => `Well done, ${n}`,
    points: "points", correct: "Correct", accuracy: "Accuracy", bestStreak: "Best streak",
    review: "Review your answers",
    youAre: (n, total) => `You are #${n} of ${total} on this device's leaderboard.`,
    newBest: "A new personal best!",
    emailLabel: "Send my results to my email",
    emailPlaceholder: "you@example.com",
    emailBtn: "Send",
    copyBtn: "Copy results instead",
    emailBad: "Please enter a valid email address.",
    emailOpened: "Your email app should open with the results ready to send. If it didn't, use \"Copy results instead\".",
    emailSending: "Sending…",
    emailSent: "Sent! Check your inbox.",
    emailFail: "Couldn't send it. Try \"Copy results instead\".",
    copied: "Copied. Paste it anywhere you like.",
    playAgain: "Play again", celebrate: "Celebrate again",
    boardTitle: "Leaderboard",
    boardNote: "Scores are saved in this browser on this device.",
    boardEmpty: "No scores yet. Be the first!",
    back: "Back", clear: "Clear leaderboard",
    clearConfirm: "Delete all scores from this device's leaderboard?",
    boardLine: (c, t, d) => `${c}/${t} correct · ${d}`,
    ranks: [
      { min: 14, title: "Type Whisperer", msg: "You can hear what a font is saying before it says a word." },
      { min: 11, title: "Sharp Eye", msg: "You read the mood of most fonts with ease. Lovely work." },
      { min: 8, title: "Getting the Feel", msg: "You already sense a lot. Keep looking at shapes, strokes and curves." },
      { min: 5, title: "Warming Up", msg: "A good start. Next time, notice how round or sharp the letters are." },
      { min: 0, title: "Just Beginning", msg: "Everyone starts here. Play again and watch how shapes change the feeling." },
    ],
    mailSubject: (s) => `My Font Feelings result: ${s} points`,
    mailIntro: (n) => `Hi ${n}, here are your Font Feelings results.`,
    mailScore: "Score", mailCorrect: "Correct", mailRank: "Rank", mailAnswers: "Your answers", mailRemember: "What to remember",
    mailTakeaways: [
      "A font speaks before the words do: we feel its mood before we read.",
      "Personality comes from shapes: thick or thin strokes, round or sharp corners, wide or narrow letters.",
      "Match the font's mood to your message.",
    ],
  },
  id: {
    appName: "Font Feelings",
    goToLesson: "Pilih materi pelajaran…",
    lessonJumpOpt: (n, title) => `${n}. ${title}`,
    startTitle: "Setiap huruf punya karakter.",
    startLead: "Memilih rupa huruf (typeface) untuk judul komik dimulai dari memahami bahwa setiap font memiliki kepribadian visual. Pelajari 10 materi singkat yang interaktif tentang karakter huruf, hierarki sampul, pengaturan spasi, kemiringan, hingga komposisi warna—lalu uji kepekaan matamu lewat 15 soal kuis. Tidak perlu latar belakang desain.",
    nameLabel: "Nama kamu",
    namePlaceholder: "mis. Alex",
    nameError: "Silakan isi namamu terlebih dahulu untuk memulai.",
    start: "Mulai materi",
    skipLessons: "Lewati materi, langsung ke kuis",
    lessonOf: (n, total) => `Pelajaran ${n} dari ${total}`,
    lessonBack: "Sebelumnya", lessonNext: "Pelajaran berikutnya", lessonStartQuiz: "Mulai kuis", skipToQuiz: "Langsung ke kuis",
    reviewLessons: "Pelajari ulang materi",
    noTimer: "Tanpa batas waktu, tak perlu terburu-buru. Setiap jawaban dilengkapi penjelasan singkat yang mudah dipahami.",
    leaderboard: "Papan peringkat",
    best: (n) => `Skor terbaikmu: ${n} poin`,
    qOf: (n, total) => `Soal ${n} dari ${total}`,
    pts: "poin",
    sec_compare: "Rasakan perbedaannya", sec_trait: "Kenali karakternya", sec_style: "Tebak gaya visualnya", sec_role: "Pahami fungsi huruf",
    sec_weight: "Ketebalan (Weight)", sec_width: "Proporsi lebar (Width)", sec_tracking: "Jarak antarhuruf (Tracking)", sec_kerning: "Kerapatan pasangan huruf (Kerning)", sec_orient: "Kemiringan & rotasi",
    sec_scenario: "Pilih untuk sampul komikmu", sec_anach: "Temukan ketidakcocokan zaman",
    right: "Tepat sekali!",
    wrong: "Kurang tepat",
    answerIs: (a) => `Jawaban: ${a}`,
    lookFor: "Ciri visual", goodToKnow: "Tips desain",
    about: (n) => `Profil ${n}`,
    next: "Lanjut", finish: "Lihat hasil akhir",
    streakLabel: (n) => `🔥 ${n} benar beruntun`,
    resHello: (n) => `Kerja bagus, ${n}!`,
    points: "poin", correct: "Benar", accuracy: "Akurasi", bestStreak: "Beruntun terbaik",
    review: "Tinjau pembahasan jawabanmu",
    youAre: (n, total) => `Kamu berada di peringkat #${n} dari ${total} pada perangkat ini.`,
    newBest: "Rekor pribadi baru!",
    emailLabel: "Kirim hasil ke email",
    emailPlaceholder: "kamu@contoh.com",
    emailBtn: "Kirim",
    copyBtn: "Salin teks hasil",
    emailBad: "Masukkan alamat email yang valid.",
    emailOpened: "Aplikasi emailmu akan terbuka dengan hasil yang siap dikirim. Jika tidak terbuka, gunakan tombol \"Salin teks hasil\".",
    emailSending: "Mengirim…",
    emailSent: "Terkirim! Silakan periksa kotak masukmu.",
    emailFail: "Gagal mengirim otomatis. Gunakan tombol \"Salin teks hasil\".",
    copied: "Tersalin! Kamu bisa menempelkannya di mana saja.",
    playAgain: "Main lagi", celebrate: "Rayakan lagi",
    boardTitle: "Papan Peringkat",
    boardNote: "Skor tersimpan secara lokal pada peramban di perangkat ini.",
    boardEmpty: "Belum ada skor tercatat. Jadilah yang pertama!",
    back: "Kembali", clear: "Kosongkan papan peringkat",
    clearConfirm: "Hapus semua data skor dari papan peringkat di perangkat ini?",
    boardLine: (c, t, d) => `${c}/${t} benar · ${d}`,
    ranks: [
      { min: 14, title: "Pakar Rasa Huruf", msg: "Kamu langsung menangkap pesan dan suasana sebuah font bahkan sebelum membaca kata-katanya." },
      { min: 11, title: "Mata Desain Tajam", msg: "Kamu mampu membaca karakter dan suasana berbagai jenis huruf dengan sangat baik." },
      { min: 8, title: "Mulai Peka Visual", msg: "Kepekaan tipografimu sudah tumbuh. Terus amati ketebalan garis, sudut, dan lengkungan huruf." },
      { min: 5, title: "Tahap Pemanasan", msg: "Awal yang baik! Selanjutnya, coba perhatikan kontras antara bentuk huruf yang membulat dan yang bersudut tajam." },
      { min: 0, title: "Langkah Pertama", msg: "Semua desainer memulai dari sini. Coba lagi dan amati bagaimana anatomi huruf mengubah suasana cerita." },
    ],
    mailSubject: (s) => `Hasil Font Feelings: ${s} poin`,
    mailIntro: (n) => `Halo ${n}, berikut adalah ringkasan hasil Font Feelings kamu.`,
    mailScore: "Skor", mailCorrect: "Jawaban benar", mailRank: "Predikat", mailAnswers: "Rincian jawaban", mailRemember: "Prinsip utama yang perlu diingat",
    mailTakeaways: [
      "Huruf berbicara sebelum kata-katanya dibaca: pembaca merasakan suasananya terlebih dahulu.",
      "Karakter visual lahir dari anatomi huruf: tebal-tipis goresan (stroke), sudut tajam atau membulat, serta proporsi lebar-sempitnya.",
      "Selaraskan suasana rupa huruf (typeface), hierarki tata letak, dan palet warna dengan jiwa ceritamu.",
    ],
  },
};

/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

let lang = store.get(KEYS.lang) || ((navigator.language || "en").toLowerCase().startsWith("id") ? "id" : "en");
const t = (k, ...a) => { const v = T[lang][k]; return typeof v === "function" ? v(...a) : v; };

let quiz = [];
let state = null;
let result = null; // { rank, entryId, newBest }
let boardBack = "screen-start";

/* ---------- Screens ---------- */
function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  syncLessonNavigation();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
const activeScreen = () => document.querySelector(".screen.active").id;

function populateGlobalLessonSelect() {
  const sel = $("global-lesson-select");
  if (!sel || typeof LESSONS === "undefined") return;
  const currentScreen = activeScreen();
  sel.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = t("goToLesson");
  sel.append(placeholder);

  LESSONS.forEach((ls, idx) => {
    const opt = document.createElement("option");
    opt.value = String(idx);
    opt.textContent = t("lessonJumpOpt", idx + 1, ls.title[lang]);
    sel.append(opt);
  });

  sel.value = currentScreen === "screen-learn" ? String(lessonIdx) : "";
}

function syncLessonNavigation() {
  populateGlobalLessonSelect();
}

function applyStaticText() {
  document.documentElement.lang = lang;
  document.title = t("appName");
  document.querySelectorAll("[data-i18n]").forEach((n) => {
    const v = T[lang][n.dataset.i18n];
    if (typeof v === "string") n.textContent = v;
  });
  $("name-input").placeholder = t("namePlaceholder");
  $("email-input").placeholder = t("emailPlaceholder");
  document.querySelectorAll(".lang-btn").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  const best = Number(store.get("ff-best") || 0);
  $("best-start").textContent = best ? t("best", best) : "";
  $("btn-skip-start").hidden = !store.get(KEYS.learned);
  populateGlobalLessonSelect();
}

function setLang(l) {
  lang = l;
  store.set(KEYS.lang, l);
  applyStaticText();
  const s = activeScreen();
  if (s === "screen-learn") renderLesson();
  if (s === "screen-quiz") renderQuestion();
  if (s === "screen-result") renderResult(false);
  if (s === "screen-board") renderBoard();
  if (!$("name-error").hidden) $("name-error").textContent = t("nameError");
}

/* ---------- Lessons ---------- */
let playerName = "";
let lessonIdx = 0;

function ensurePlayerName() {
  if (playerName) return playerName;
  const typed = $("name-input") && $("name-input").value ? $("name-input").value.trim().replace(/\s+/g, " ") : "";
  const saved = store.get(KEYS.name) || "";
  playerName = typed || saved || (lang === "id" ? "Kreator" : "Creator");
  return playerName;
}

function startFlow(name) {
  playerName = name;
  goLesson(0);
}
function goLesson(i) {
  stopConfetti();
  ensurePlayerName();
  lessonIdx = Math.max(0, Math.min(LESSONS.length - 1, Number(i) || 0));
  show("screen-learn");
  renderLesson();
}
function renderLesson() {
  const n = LESSONS.length;
  $("l-count").textContent = t("lessonOf", lessonIdx + 1, n);
  $("l-progress").style.width = ((lessonIdx + 1) / n) * 100 + "%";
  $("l-title").textContent = LESSONS[lessonIdx].title[lang];
  const body = $("l-body");
  body.innerHTML = "";
  body.append(LESSONS[lessonIdx].build(lang));
  $("btn-l-back").textContent = t("lessonBack");
  $("btn-l-next").textContent = lessonIdx === n - 1 ? t("lessonStartQuiz") : t("lessonNext");
  $("btn-skip").textContent = t("skipToQuiz");
  $("btn-skip").hidden = lessonIdx === n - 1;
  syncLessonNavigation();
}
function lessonNext() {
  if (lessonIdx >= LESSONS.length - 1) { store.set(KEYS.learned, "1"); return startGame(ensurePlayerName()); }
  goLesson(lessonIdx + 1);
}
function lessonBack() {
  if (lessonIdx === 0) { show("screen-start"); applyStaticText(); return; }
  goLesson(lessonIdx - 1);
}

/* ---------- Game flow ---------- */
async function startGame(name) {
  quiz = buildQuiz();
  state = { index: 0, score: 0, streak: 0, bestStreak: 0, correct: 0, answered: false, chosen: null, lastGain: 0, name, answers: [] };
  stopConfetti();
  $("btn-start").disabled = true;
  $("btn-l-next").disabled = true;
  await preloadFonts();
  $("btn-start").disabled = false;
  $("btn-l-next").disabled = false;
  show("screen-quiz");
  renderQuestion();
}

function preloadFonts() {
  if (!document.fonts || !document.fonts.load) return Promise.resolve();
  const names = new Set();
  quiz.forEach((q) => {
    if (q.specimen) names.add(q.specimen.n);
    q.options.forEach((o) => o.font && names.add(o.font.n));
  });
  const loads = [...names].map((n) => document.fonts.load(`32px "${n}"`).catch(() => {}));
  return Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, 5000))]);
}

function answer(idx) {
  if (state.answered) return;
  const q = quiz[state.index];
  state.answered = true;
  state.chosen = idx;
  const ok = q.options[idx].correct;
  if (ok) {
    state.streak++;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.correct++;
    state.lastGain = BASE_POINTS + Math.min(MAX_STREAK_BONUS, (state.streak - 1) * STREAK_STEP);
    state.score += state.lastGain;
  } else {
    state.streak = 0;
    state.lastGain = 0;
  }
  state.answers.push({ q, ok });
  renderQuestion();
  $("btn-next").focus({ preventScroll: true });
  $("notes").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function nextQuestion() {
  if (state.index + 1 >= quiz.length) return finishGame();
  state.index++;
  state.answered = false;
  state.chosen = null;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function finishGame() {
  const prevBest = Number(store.get("ff-best") || 0);
  const newBest = state.score > prevBest;
  if (newBest) store.set("ff-best", String(state.score));
  const entryId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  saveEntry({ id: entryId, name: state.name, score: state.score, correct: state.correct, total: quiz.length, date: Date.now() });
  result = { entryId, newBest };
  $("email-status").textContent = "";
  show("screen-result");
  renderResult(true);
}

/* ---------- Rendering: question ---------- */
function renderQuestion() {
  const q = quiz[state.index];
  const answered = state.answered;

  $("q-count").textContent = t("qOf", state.index + 1, quiz.length);
  $("hud-score").textContent = state.score;
  $("hud-streak").textContent = state.streak > 1 ? t("streakLabel", state.streak) : "";
  $("bar-progress").style.width = ((state.index + (answered ? 1 : 0)) / quiz.length) * 100 + "%";
  $("q-kicker").textContent = t("sec_" + q.sec);
  $("q-prompt").textContent = q.prompt(lang);

  const phrase = PHRASES[lang][q.phrase];
  const spec = $("q-specimen");
  spec.hidden = !q.specimen;
  if (q.specimen) {
    spec.style.fontFamily = fontStack(q.specimen);
    spec.textContent = phrase;
  }

  const wrap = $("q-options");
  wrap.className = "options" + (q.layout === "cards" ? " cards" : "");
  wrap.innerHTML = "";
  q.options.forEach((o, i) => {
    const b = el("button", "opt" + (q.layout === "cards" ? " card" : "") + (q.variant ? " variant" : ""));
    b.type = "button";
    if (q.layout === "cards") {
      const sample = el("span", "sample");
      sample.style.fontFamily = fontStack(o.font);
      if (o.letters) {
        o.letters.forEach((l) => { const s = el("span", null, l.ch); s.style.marginLeft = l.gap + "em"; sample.append(s); });
      } else {
        sample.textContent = o.text || phrase;
      }
      if (o.css) sample.style.cssText += ";" + o.css;
      b.append(sample);
      if (answered) {
        const m = o.meta(lang);
        const meta = el("span", "meta");
        meta.append(el("strong", null, m.title), document.createTextNode(m.text || ""));
        b.append(meta);
      }
    } else {
      b.append(el("span", "key", String(i + 1)), el("span", "label", q.optionLabel(o, lang)));
    }
    if (answered) {
      b.disabled = true;
      if (o.correct) b.classList.add("correct");
      else if (i === state.chosen) b.classList.add("wrong");
      else b.classList.add("dim");
    } else {
      b.addEventListener("click", () => answer(i));
    }
    wrap.append(b);
  });

  renderNotes(q);
}

function renderNotes(q) {
  const box = $("notes");
  box.hidden = !state.answered;
  if (!state.answered) return;
  const ok = q.options[state.chosen].correct;
  box.className = "notes " + (ok ? "good" : "bad");
  $("n-verdict").textContent = ok ? `${t("right")}  +${state.lastGain}` : t("wrong");
  $("n-answer").textContent = t("answerIs", q.answer(lang));
  $("n-why").textContent = q.why(lang) + (q.extra ? " " + q.extra(lang) : "");
  $("n-cues").textContent = q.cues(lang);

  const prof = $("n-profile");
  prof.hidden = !q.profile;
  if (q.profile) {
    $("n-profile-title").textContent = t("about", q.profile.n);
    const chips = $("n-chips");
    chips.innerHTML = "";
    const tg = tagsOf(q.profile, lang);
    tg.styles.forEach((s) => chips.append(el("span", "chip style", s)));
    tg.traits.forEach((s) => chips.append(el("span", "chip", s)));
  }

  $("n-tip").textContent = TIPS[q.tip][lang];
  $("btn-next").textContent = state.index + 1 >= quiz.length ? t("finish") : t("next");
}

/* ---------- Rendering: result ---------- */
const rankFor = () => T[lang].ranks.find((r) => state.correct >= r.min);

function renderResult(celebrate) {
  const r = rankFor();
  $("res-hello").textContent = t("resHello", state.name);
  $("res-rank").textContent = r.title;
  $("res-score").textContent = state.score;
  $("res-correct").textContent = `${state.correct}/${quiz.length}`;
  $("res-acc").textContent = Math.round((state.correct / quiz.length) * 100) + "%";
  $("res-streak").textContent = state.bestStreak;
  $("res-msg").textContent = r.msg;

  const board = loadBoard();
  const pos = board.findIndex((e) => e.id === result.entryId) + 1;
  $("res-place").textContent = (result.newBest ? t("newBest") + " " : "") + (pos ? t("youAre", pos, board.length) : "");

  const list = $("review-list");
  list.innerHTML = "";
  state.answers.forEach(({ q, ok }) => {
    const li = el("li");
    const body = el("span");
    body.append(el("span", "sec", t("sec_" + q.sec)), document.createTextNode(q.summary(lang)));
    li.append(el("span", "mark " + (ok ? "ok" : "no"), ok ? "✓" : "✗"), body);
    list.append(li);
  });

  $("email-input").value = $("email-input").value || store.get(KEYS.email) || "";
  if (celebrate) celebrateNow();
}

/* ---------- Leaderboard (stored in this browser) ---------- */
function loadBoard() {
  try {
    const b = JSON.parse(store.get(KEYS.board)) || [];
    return Array.isArray(b) ? b : [];
  } catch { return []; }
}
const sortBoard = (b) => b.sort((x, y) => y.score - x.score || y.correct - x.correct || x.date - y.date);
function saveEntry(entry) {
  const b = sortBoard([...loadBoard(), entry]).slice(0, 100);
  store.set(KEYS.board, JSON.stringify(b));
}

function openBoard() {
  boardBack = activeScreen();
  show("screen-board");
  renderBoard();
}

function renderBoard() {
  const b = sortBoard(loadBoard());
  const list = $("board-list");
  list.innerHTML = "";
  $("board-empty").hidden = b.length > 0;
  list.hidden = b.length === 0;
  const fmt = (ts) => new Date(ts).toLocaleDateString(lang === "id" ? "id-ID" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
  const row = (e, i) => {
    const li = el("li", result && e.id === result.entryId ? "me" : "");
    const who = el("span", "who");
    who.append(el("strong", null, e.name), el("small", null, t("boardLine", e.correct, e.total, fmt(e.date))));
    li.append(el("span", "pos", String(i + 1)), who, el("span", "pts", String(e.score)));
    return li;
  };
  b.slice(0, 10).forEach((e, i) => list.append(row(e, i)));
  const mine = result ? b.findIndex((e) => e.id === result.entryId) : -1;
  if (mine >= 10) {
    list.append(el("li", "gap", "···"));
    list.append(row(b[mine], mine));
  }
}

/* ---------- Email / copy ---------- */
function resultsText() {
  const r = rankFor();
  const lines = [
    t("mailIntro", state.name), "",
    `${t("mailScore")}: ${state.score}`,
    `${t("mailCorrect")}: ${state.correct}/${quiz.length}`,
    `${t("mailRank")}: ${r.title}`, "",
    `${t("mailAnswers")}:`,
    ...state.answers.map(({ q, ok }, i) => `${i + 1}. ${ok ? "✓" : "✗"} ${q.summary(lang)}`), "",
    `${t("mailRemember")}:`,
    ...T[lang].mailTakeaways.map((x) => `- ${x}`),
  ];
  return lines.join("\n");
}

const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

async function sendEmail() {
  const email = $("email-input").value.trim();
  const status = $("email-status");
  if (!validEmail(email)) { status.textContent = t("emailBad"); $("email-input").focus(); return; }
  store.set(KEYS.email, email);
  const subject = t("mailSubject", state.score);
  const body = resultsText();

  if (EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey) {
    status.textContent = t("emailSending");
    $("btn-email").disabled = true;
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS.serviceId, template_id: EMAILJS.templateId, user_id: EMAILJS.publicKey,
          template_params: { to_email: email, to_name: state.name, subject, message: body },
        }),
      });
      status.textContent = res.ok ? t("emailSent") : t("emailFail");
    } catch { status.textContent = t("emailFail"); }
    $("btn-email").disabled = false;
    return;
  }

  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = t("emailOpened");
}

async function copyResults() {
  const text = resultsText();
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = el("textarea");
    ta.value = text;
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.append(ta);
    ta.select();
    try { document.execCommand("copy"); } catch { /* ignore */ }
    ta.remove();
  }
  $("email-status").textContent = t("copied");
}

/* ---------- Confetti ---------- */
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let particles = [];
let confettiRaf = null;
const COLORS = ["#b8553a", "#e3a93c", "#46745c", "#6b8fb5", "#b57ca5", "#2a2825", "#f0c9b8"];
const pick1 = (a) => a[Math.floor(Math.random() * a.length)];

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener("resize", resizeCanvas);
resizeCanvas();

function spawn(x, y, angle, spread, speed, count) {
  for (let i = 0; i < count; i++) {
    const a = angle + (Math.random() - 0.5) * spread;
    const v = speed * (0.5 + Math.random() * 0.7);
    particles.push({
      x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
      w: 6 + Math.random() * 8, h: 4 + Math.random() * 6,
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4,
      color: pick1(COLORS), life: 0, circle: Math.random() < 0.25,
    });
  }
}

function celebrateNow() {
  stopConfetti();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const n = reduced ? 40 : 110;
  spawn(0, innerHeight * 0.85, -Math.PI / 3, 0.7, 20, n);
  spawn(innerWidth, innerHeight * 0.85, (-2 * Math.PI) / 3, 0.7, 20, n);
  spawn(innerWidth / 2, innerHeight * 0.4, -Math.PI / 2, Math.PI * 2, 14, n);
  const end = performance.now() + (reduced ? 1500 : 6000);
  let lastRain = 0;

  const frame = (now) => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (now < end && now - lastRain > 90 && !reduced) {
      lastRain = now;
      spawn(Math.random() * innerWidth, -10, Math.PI / 2, 0.8, 3, 6);
    }
    particles.forEach((p) => {
      p.life++;
      p.vy += 0.35; p.vx *= 0.985; p.vy *= 0.985;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.circle) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, 6.28); ctx.fill(); }
      else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.life * 0.1)) + 1);
      ctx.restore();
    });
    particles = particles.filter((p) => p.y < innerHeight + 30);
    if (particles.length) confettiRaf = requestAnimationFrame(frame);
    else { confettiRaf = null; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  };
  confettiRaf = requestAnimationFrame(frame);
}

function stopConfetti() {
  if (confettiRaf) cancelAnimationFrame(confettiRaf);
  confettiRaf = null;
  particles = [];
  ctx.clearRect(0, 0, innerWidth, innerHeight);
}

/* ---------- Events ---------- */
function readName() {
  const name = $("name-input").value.trim().replace(/\s+/g, " ");
  const err = $("name-error");
  if (!name) {
    err.textContent = t("nameError");
    err.hidden = false;
    $("name-input").focus();
    return "";
  }
  err.hidden = true;
  store.set(KEYS.name, name);
  return name;
}
$("start-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = readName();
  if (name) startFlow(name);
});
$("btn-skip-start").addEventListener("click", () => {
  const name = readName();
  if (name) { playerName = name; startGame(name); }
});
$("btn-l-next").addEventListener("click", lessonNext);
$("btn-l-back").addEventListener("click", lessonBack);
$("btn-skip").addEventListener("click", () => startGame(playerName));
$("btn-review-lessons").addEventListener("click", () => { stopConfetti(); playerName = state ? state.name : playerName; goLesson(0); });
$("name-input").addEventListener("input", () => { $("name-error").hidden = true; });
$("btn-next").addEventListener("click", nextQuestion);
$("btn-again").addEventListener("click", () => { stopConfetti(); show("screen-start"); applyStaticText(); });
$("btn-celebrate").addEventListener("click", celebrateNow);
$("btn-board-start").addEventListener("click", openBoard);
$("btn-board-result").addEventListener("click", openBoard);
$("btn-board-back").addEventListener("click", () => show(boardBack));
$("btn-board-clear").addEventListener("click", () => {
  if (confirm(t("clearConfirm"))) { store.set(KEYS.board, "[]"); renderBoard(); }
});
$("btn-email").addEventListener("click", sendEmail);
$("email-input").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); sendEmail(); } });
$("btn-copy").addEventListener("click", copyResults);
if ($("global-lesson-select")) {
  $("global-lesson-select").addEventListener("change", (e) => {
    const val = e.target.value;
    if (val !== "") {
      goLesson(Number(val));
    }
  });
}
if ($("brand-home")) {
  $("brand-home").addEventListener("click", () => {
    stopConfetti();
    show("screen-start");
    applyStaticText();
  });
}
document.querySelectorAll(".lang-btn").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
document.addEventListener("keydown", (e) => {
  if (!state || activeScreen() !== "screen-quiz" || state.answered) return;
  if (e.target.tagName === "INPUT") return;
  const n = Number(e.key);
  const q = quiz[state.index];
  if (n >= 1 && n <= q.options.length) answer(n - 1);
});

$("name-input").value = store.get(KEYS.name) || "";
applyStaticText();
