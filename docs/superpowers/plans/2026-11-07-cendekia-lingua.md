# Cendekia Lingua Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, test, export, and deploy a five-page static company profile for Cendekia Lingua, plus a wireframe page, a style guide, and nine Figma-ready PNGs.

**Architecture:** Five standalone HTML pages share one stylesheet and one vanilla-JS file. There is no build step and no runtime dependency. Content lives in HTML; interactions are progressive enhancements driven by `data-*` attributes. A Node built-in test suite checks document structure, content, links, and required hooks; Playwright is used only as a local screenshot tool.

**Tech Stack:** HTML5, CSS custom properties, vanilla JavaScript, Node 24 `node:test`, Playwright CLI via `npx` (dev-only), Netlify CLI.

**Spec:** `docs/superpowers/specs/2026-11-07-cendekia-lingua-design.md`

## Global Constraints

- Static site only: HTML5 + CSS + vanilla JS. No framework, bundler, package.json, or runtime dependency.
- Five pages: `index.html`, `program.html`, `daftar.html`, `wireframe.html`, `style-guide.html`.
- Palette tokens exactly: `--navy-900:#0B2239`, `--navy-700:#123A5C`, `--yellow-400:#F6C445`, `--yellow-100:#FFF1C9`, `--cream:#FAF6EC`, `--white:#FFFFFF`, `--ink:#16202B`, `--muted:#5C6B7A`, `--line:#D8D2C4`, `--success:#1F7A5C`.
- Fonts: Bricolage Grotesque 600–700 for display, Plus Jakarta Sans 400–700 for body/UI. Load from Google Fonts with `display=swap` and preconnect.
- All site copy in Bahasa Indonesia. No lorem ipsum.
- All names, prices, schedules, addresses, and testimonials are fictional. Every page footer includes: “Situs demo. Nama, harga, jadwal, dan testimoni fiktif.”
- WhatsApp number `6281200001234` is demo-only. Every WhatsApp trigger opens the demo `<dialog>`; never link to `wa.me` or `api.whatsapp.com`.
- No stock photos, country flags, gradients, glassmorphism, or emoji as primary icons. Visuals use typography, CSS shapes, and inline SVG.
- Responsive at 390, 768, and 1440 px. `document.documentElement.scrollWidth` must never exceed the viewport width.
- Accessibility: skip link, `lang="id"`, landmarks, one `<h1>` per page, ordered headings, explicit form labels, visible focus, 44 px touch targets, `prefers-reduced-motion`, native `<dialog>` semantics.
- Every internal `href`/`src` must resolve. No `href="#"` and no `javascript:` links.
- Tests: `node --test "tests/*.test.mjs"` must pass before every commit and before the PR.
- Local server: `php -S 127.0.0.1:8000` from the project root.
- Full-page screenshots use `?export=1` so fixed overlays and reveal animations do not pollute the image. Wireframe screenshots use `wireframe.html?artboard=desktop|mobile&export=1`.
- Nine PNG deliverables live in `figma-import/`: `01-home-desktop-1440.png`, `02-home-mobile-390.png`, `02b-home-mobile-sticky-390.png`, `03-program-desktop-1440.png`, `04-program-mobile-390.png`, `05-daftar-mobile-390.png`, `06-wireframe-desktop-1440.png`, `07-wireframe-mobile-390.png`, `08-style-guide-desktop-1440.png`.
- Git: one bootstrap commit on `main` for the approved design/plan, then all work on `feat/cendekia-site`. Conventional Commits. Squash merge only after checks pass.

## Review Focus

These are the failure modes the spec implies but no static content test fully exercises. Each has an explicit QA step in the task that owns the code.

1. **Mobile sticky CTA at 390 px** — must not cover the footer, form controls, or dialog close button; must hide on `daftar.html` and in `?export=1`. Owner: Task 3.
2. **No-JS fallback** — tabs and filters must not hide content; nav links must remain reachable; FAQ must work via `<details>`; form must not pretend to send data. Owner: Tasks 1–5.
3. **Demo dialog** — focus must move into the dialog, Escape must close it, focus must return to the trigger, and background scroll must lock. Owner: Task 1, rechecked in Task 8.
4. **Lead form** — invalid phone/email/consent must show inline errors and focus the first invalid field; valid submit must show a summary without any network request; unknown `?program=` must not throw. Owner: Task 5.
5. **Wireframe gallery vs export** — artboards must keep their literal 1440/390 widths, the gallery must not cause body overflow at 390, and export mode must render one artboard at 1:1 with no chrome. Owner: Task 6.

---

## File Structure

```
cendekia-lingua/
├── index.html
├── program.html
├── daftar.html
├── wireframe.html
├── style-guide.html
├── css/
│   └── style.css                 # tokens, base, components, page sections, responsive
├── js/
│   └── main.js                   # progressive enhancements, one namespace: window.Cendekia
├── assets/
│   ├── logo.svg                  # favicon / mark
│   └── og-image.jpg              # 1200×630 social card
├── tests/
│   ├── helpers.mjs
│   ├── structure.test.mjs
│   ├── home.test.mjs
│   ├── program.test.mjs
│   ├── daftar.test.mjs
│   ├── wireframe.test.mjs
│   ├── style-guide.test.mjs
│   └── links.test.mjs
├── scripts/
│   └── package-site.mjs          # copy deployable files to dist/; not a site build
├── docs/
│   ├── design-notes.md
│   ├── qa/frame.html             # dev-only viewport harness, never deployed
│   ├── screenshots/              # QA screenshots used by README
│   └── superpowers/
│       ├── specs/2026-11-07-cendekia-lingua-design.md
│       └── plans/2026-11-07-cendekia-lingua.md
├── figma-import/                 # nine PNG deliverables
├── README.md
├── robots.txt
└── .gitignore
```

One shared stylesheet and one shared script are intentional for a five-page static site. Keep both organized with section comments instead of adding a build step.

---

### Task 1: Bootstrap, Shared Shell, Design Tokens, Test Harness

**Files:**
- Create: `.gitignore`, `README.md` (stub), `robots.txt`, `assets/logo.svg`
- Create: `css/style.css`, `js/main.js`
- Create: `index.html`, `program.html`, `daftar.html`, `wireframe.html`, `style-guide.html` (shells)
- Test: `tests/helpers.mjs`, `tests/structure.test.mjs`

**Interfaces:**
- Consumes: approved design doc.
- Produces: shared shell classes (`.site-header`, `.site-nav`, `.site-footer`, `.container`, `.skip-link`), CSS tokens, and `window.Cendekia` with `init()` and `initDialogs()`. Later tasks add methods to the same object and register each new `init*` call inside `Cendekia.init()`.
- Produces: shared footer WhatsApp trigger `[data-dialog-open="whatsapp"]` and `<dialog data-dialog="whatsapp">` on every page.

Run every command in this plan from `D:\Projects\cendekia-lingua`.

- [ ] **Step 1: Bootstrap git without putting feature work on main**

```bash
git init -b main
git add docs/superpowers/specs/2026-11-07-cendekia-lingua-design.md docs/superpowers/plans/2026-11-07-cendekia-lingua.md
git commit -m "docs: add Cendekia Lingua design and implementation plan"
git switch -c feat/cendekia-site
```

The first commit is the repository bootstrap exception. From here, no direct commits to `main`.

- [ ] **Step 2: Write the failing structure tests**

`tests/helpers.mjs` exports `root`, `read(path)`, `pages` (the five HTML files), `tags(html, name)`, and `attr(tag, name)`.

`tests/structure.test.mjs` asserts:
- Every page exists, starts with `<!doctype html>`, has `<html lang="id">`, the exact viewport meta, exactly one `<h1>`, a `.skip-link` to `#main`, `<main id="main">`, `<header>`, and `<footer>`.
- `css/style.css` contains all ten palette tokens verbatim, both font-family tokens, and `@media (prefers-reduced-motion: reduce)`.
- `js/main.js` contains `DOMContentLoaded`, `window.Cendekia`, `init()`, and `initDialogs()`.
- Every page contains the demo disclaimer and the WhatsApp dialog markup.
- `assets/logo.svg`, `robots.txt`, and `.gitignore` exist; `robots.txt` allows all.

Use this shape for the main shell test:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { read, pages } from './helpers.mjs';

test('five pages share the document shell', () => {
  for (const page of pages) {
    const html = read(page);
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /<html lang="id">/i);
    assert.match(html, /name="viewport" content="width=device-width, initial-scale=1"/i);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, page);
    assert.match(html, /href="#main"/i, page);
    assert.match(html, /<main[^>]*id="main"/i, page);
    assert.match(html, /<header\b/i, page);
    assert.match(html, /<footer\b/i, page);
  }
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `node --test tests/structure.test.mjs`
Expected: FAIL with `ENOENT` for `index.html` or `style.css`.

- [ ] **Step 4: Create the shared shell and base system**

Each page gets:
- Unique `<title>` and `<meta name="description">`; `index.html` title: “Cendekia Lingua — Kursus Bahasa Inggris, Jepang, Mandarin di Yogyakarta”.
- Google Fonts preconnect + stylesheet link.
- Inline favicon link to `assets/logo.svg`.
- Skip link “Langsung ke konten”.
- Header: `.logo` (CSS mark “CL” + wordmark “Cendekia Lingua”), nav links Program (`program.html`), Pengajar (`index.html#pengajar`), Testimoni (`index.html#testimoni`), Cara Daftar (`daftar.html`), FAQ (`index.html#faq`), plus CTA “Kelas gratis” (`daftar.html`); `[data-nav-toggle]` button and `[data-nav]` nav. Set `aria-current="page"` on the active link.
- Footer: short description, nav, address/hours, demo WhatsApp button, email, social labels, disclaimer.
- Shared `<dialog data-dialog="whatsapp">` with title “WhatsApp demo”, explanation that `6281200001234` is not a real WhatsApp handoff, and a close button.
- `<script src="js/main.js" defer></script>`.

`css/style.css` starts with tokens, reset, body typography, `.container` (max 1180 px), `.skip-link`, `.sr-only`, header/nav desktop styles, footer, button basics, field basics, `:focus-visible`, `[hidden]`, and reduced motion. Mobile-first; breakpoints at 980/760/560 px. Do not add page-specific sections yet.

`js/main.js` starts with:

```js
document.documentElement.classList.add('js');

const Cendekia = {
  init() {
    this.initDialogs();
  },
  initDialogs() { /* native <dialog>, backdrop click, scroll lock, focus return */ },
};

window.Cendekia = Cendekia;
document.addEventListener('DOMContentLoaded', () => Cendekia.init());
```

`assets/logo.svg`: square yellow mark with navy “CL”, simple enough for a favicon.
`robots.txt`: `User-agent: *` + `Allow: /`.
`.gitignore`: `dist/`, `.netlify/`, `node_modules/`, `*.log`.
`README.md`: title, one-line description, and “Status: dalam pengerjaan”.

- [ ] **Step 5: Run the test to verify it passes**

Run: `node --test tests/structure.test.mjs`
Expected: all structure tests PASS.

- [ ] **Step 6: Smoke-test the shell**

Run `php -S 127.0.0.1:8000`, open `http://127.0.0.1:8000/`, and check: skip link appears on first Tab, header/footer render, no console errors, WhatsApp button opens and closes the native dialog with Escape.

- [ ] **Step 7: Commit**

```bash
git add .gitignore README.md robots.txt assets/logo.svg css/style.css js/main.js index.html program.html daftar.html wireframe.html style-guide.html tests/helpers.mjs tests/structure.test.mjs
git commit -m "feat: scaffold static site shell"
```

---

### Task 2: Homepage Hero, Stats, Audience Tabs, Mobile Nav

**Files:**
- Modify: `index.html`, `css/style.css`, `js/main.js`
- Test: `tests/home.test.mjs`

**Interfaces:**
- Consumes: shell and tokens from Task 1.
- Produces: `[data-hero]`, `[data-nav-toggle]`, `[data-nav]`, `[data-tab]`, `[data-panel]`, `[data-program-card]`, `[data-audience]`.
- Produces: `Cendekia.initMobileNav()`, `Cendekia.initTabs()`.
- Produces: six homepage program cards with slugs `english-teens`, `japanese-n5`, `english-campus`, `japanese-n4`, `english-work`, `mandarin-hsk1-2`; each card appears in exactly one panel.

- [ ] **Step 1: Write the failing homepage-top tests**

`tests/home.test.mjs` asserts:
- `#hero` contains the eyebrow “Kursus bahasa di Yogyakarta”, H1 “Berani bicara, siap melangkah.”, both CTAs (`daftar.html`, `program.html`), proof “4,9/5” and “1.200+ alumni”, and the characters “A”, “あ”, “你”.
- Stats strip contains 1.200+, 4,9/5, 12 pengajar, 3 bahasa.
- There are exactly 3 `data-tab` buttons and 3 `data-panel` sections; SMA is selected by default; each panel has a visible heading (“Untuk SMA”, “Untuk Mahasiswa”, “Untuk Pekerja”) so the no-JS fallback is understandable.
- There are exactly 6 `data-program-card` tags; slugs are unique; each `data-audience` has exactly 2 cards.
- Audience mapping is exact: SMA = `english-teens` + `japanese-n5`; Mahasiswa = `english-campus` + `japanese-n4`; Pekerja = `english-work` + `mandarin-hsk1-2`.
- CSS has `.tablist { display: none; }` and `.js .tablist { display: flex; }` so the no-JS fallback shows all panels.
- JS contains `initMobileNav` and `initTabs`; the tabs use `aria-selected`, `aria-controls`, `role="tab"`, `role="tabpanel"`, `aria-labelledby`, and Arrow/Home/End keys.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/home.test.mjs`
Expected: FAIL because the hero and program cards do not exist yet.

- [ ] **Step 3: Implement the homepage top**

Replace the `index.html` shell main content with:
- Hero: eyebrow, highlighted H1, subcopy mentioning Inggris/Jepang/Mandarin and the three audiences, primary CTA “Coba kelas gratis”, secondary CTA “Lihat program”, proof, and a decorative three-card language stack (`aria-hidden="true"`).
- Stats strip with four values.
- `#program` section with tablist and three panels.
- Six cards using the matrix values from spec §8. Each card has a language badge, title, target/level, duration, concrete schedule, “Mulai Rp …”, and CTA to `daftar.html?program=<slug>`.

Add CSS for hero, language cards, stats, tabs, program cards, and responsive stacking. Add JS:
- `initMobileNav()`: toggle `.is-open`, `aria-expanded`, focus first nav link, Escape closes, focus returns to toggle, focus trap while open, close on resize above 980 px.
- `initTabs()`: activate panel, set `hidden` on inactive panels, keep roving `tabindex`, ArrowLeft/ArrowRight/Home/End support. Panels must have no `hidden` attribute in the raw HTML.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/home.test.mjs`
Expected: all homepage-top tests PASS.

- [ ] **Step 5: Browser QA**

At desktop width: click all three tabs, confirm only two cards show; use ArrowRight on the tablist; open/close the mobile drawer only after narrowing the window or using the iframe harness in Task 8. Confirm no console errors. Check with JS disabled (or `.js` class removed in DevTools) that all six cards are visible and the tablist is hidden.

- [ ] **Step 6: Commit**

```bash
git add index.html css/style.css js/main.js tests/home.test.mjs
git commit -m "feat: add homepage hero and audience tabs"
```

---

### Task 3: Homepage Lower Half, Pricing Table, Teachers, Testimonials, FAQ, Sticky CTA

**Files:**
- Modify: `index.html`, `css/style.css`, `js/main.js`
- Test: `tests/home.test.mjs`

**Interfaces:**
- Consumes: six card slugs and the shared dialog from Tasks 1–2.
- Produces: `[data-price-row]` (six rows), `[data-sticky-cta]`, `Cendekia.initStickyCta()`, `Cendekia.initReveal()`, `Cendekia.initExportMode()`.
- Produces: `?export=1` adds `html.is-export`; CSS hides `[data-sticky-cta]` and forces `[data-reveal]` visible in that mode.

- [ ] **Step 1: Extend the failing homepage tests**

Add assertions:
- Pricing table has exactly 6 `data-price-row` rows with unique slugs matching the six cards; every row has four cells with `data-label` values Program/Level/Jadwal/Biaya; prices match spec §8 exactly.
- “Kenapa Cendekia” has 4 cards.
- Teachers: Ayu Prameswari, Kenji Nakamura, Li Wei with their credentials.
- Testimonials: Nadia, Rizky, Sarah, plus the “Testimoni demo” label.
- “Cara daftar” has 3 steps.
- FAQ has 5 `<details>` elements and answers covering free trial, beginner, online/offline, payment, reschedule.
- Contact shows the address, hours, WhatsApp demo button, and email.
- Footer disclaimer exists.
- Sticky CTA exists with a `daftar.html` link and `data-sticky-cta`; JS contains `IntersectionObserver` and checks the hero.
- `?export=1` handling exists in JS and CSS.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/home.test.mjs`
Expected: FAIL on the first missing pricing/teacher/FAQ assertion.

- [ ] **Step 3: Implement the lower homepage**

Add, in order:
- “Jadwal & biaya” six-row table. Desktop = table; ≤760 px = stacked cards using `td[data-label]::before`. Add the note about demo prices, books, and slot confirmation.
- “Kenapa Cendekia” four cards with inline line icons.
- Three teacher cards with initials AP/KN/LW.
- Testimonial block: one large quote + two smaller cards, exact names/results, small “Testimoni demo” label.
- Three registration steps and CTA.
- Five `<details>` FAQ items with these exact demo answers:
  - “Benar-benar gratis?” → “Kelas percobaan 60 menit gratis, tanpa biaya pendaftaran dan tanpa kewajiban lanjut.”
  - “Belum pernah belajar sama sekali?” → “Bisa mulai dari level Pemula. Kami bantu placement test singkat untuk menentukan kelas.”
  - “Online atau offline?” → “Mayoritas kelas tatap muka di Sleman; English for Work dan beberapa sesi bisa online.”
  - “Biaya dan pembayaran?” → “Biaya per modul Rp 850.000–Rp 1.250.000, bisa dicicil 2 kali. Harga demo belum termasuk buku.”
  - “Bisa pindah jadwal?” → “Bisa, maksimal 2 kali per modul dengan pemberitahuan minimal 1 hari sebelumnya, tergantung ketersediaan kelas.”
- Contact section: address, hours, WhatsApp button, email, inline SVG map illustration labeled “Ilustrasi peta demo”.
- Footer disclaimer already comes from the shell; keep it.
- Sticky CTA bar with “Kelas percobaan gratis” + “Daftar” to `daftar.html`; add `hidden` in HTML.

Add JS:
- `initStickyCta()`: IntersectionObserver on `[data-hero]`; show after hero leaves; hide when it re-enters; toggle `body.has-sticky-cta`; fallback to scroll listener.
- `initReveal()`: IntersectionObserver on `[data-reveal]`; add `.is-visible`; if reduced motion, show immediately.
- `initExportMode()`: read `?export=1`, add `html.is-export`.

Add CSS:
- Sticky bar fixed bottom, safe-area padding, only ≤760 px, `body.has-sticky-cta` padding-bottom, hidden on `daftar.html` because the element does not exist there.
- `.is-export [data-sticky-cta] { display: none !important; }`
- `.is-export [data-reveal] { opacity: 1 !important; transform: none !important; }`
- Table-to-cards responsive rules.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/home.test.mjs`
Expected: all homepage tests PASS.

- [ ] **Step 5: Browser QA**

At 390 px using the Task 8 harness or a narrow window: sticky CTA appears after the hero, does not cover the footer, and disappears on `daftar.html`. FAQ opens without JS. WhatsApp triggers open the dialog; Escape closes and focus returns. Check the table stacks with labels at 390.

- [ ] **Step 6: Commit**

```bash
git add index.html css/style.css js/main.js tests/home.test.mjs
git commit -m "feat: add homepage pricing, social proof, FAQ, and sticky CTA"
```

---

### Task 4: Program Page and Language Filters

**Files:**
- Modify: `program.html`, `css/style.css`, `js/main.js`
- Test: `tests/program.test.mjs`

**Interfaces:**
- Consumes: shared card styles from Task 2 and matrix values from spec §8.
- Produces: `[data-filter="all|inggris|jepang|mandarin"]`, `[data-program-card][data-language]`, `Cendekia.initProgramFilters()`.
- Produces: six CTAs with `daftar.html?program=<slug>`.

- [ ] **Step 1: Write the failing program tests**

Assert:
- One `<h1>` “Program kursus”.
- Four filter buttons with `aria-pressed`; “Semua” active by default.
- Six `data-program-card` tags with unique slugs and `data-language` values matching the matrix.
- Each card shows target, level, duration, concrete schedule, price, and the correct CTA slug.
- “Belum yakin levelmu?” placement-test section exists.
- CTA band before the footer links to `daftar.html`.
- No-JS rule: filter buttons are hidden without `.js`; all cards are visible.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/program.test.mjs`
Expected: FAIL because `program.html` is still a shell.

- [ ] **Step 3: Implement the program page and filter**

Add the hero, filter bar, six cards, placement-test section, and CTA band. Reuse the homepage card markup and matrix values; do not invent prices or schedules. Add `initProgramFilters()`: toggle `hidden` on cards by `data-language`, set `aria-pressed`, and keep “Semua” as reset. Hide the filter bar without JS via `.js` so all cards show.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/program.test.mjs`
Expected: all program tests PASS.

- [ ] **Step 5: Browser QA**

Filter each language; confirm counts are 6/3/2/1 (Inggris 3, Jepang 2, Mandarin 1). Confirm CTA URLs carry the right slug. Check noise-free layout at 390/768/1440.

- [ ] **Step 6: Commit**

```bash
git add program.html css/style.css js/main.js tests/program.test.mjs
git commit -m "feat: add program catalogue and language filters"
```

---

### Task 5: Registration Page, Validation, Success State, Program Prefill

**Files:**
- Modify: `daftar.html`, `css/style.css`, `js/main.js`
- Test: `tests/daftar.test.mjs`

**Interfaces:**
- Consumes: shared dialog and footer from Task 1.
- Produces: `LEAD_PROGRAMS` map, `validateLeadForm(form)`, `Cendekia.initLeadForm()`.
- Produces: form field names exactly `name`, `whatsapp`, `email`, `audience`, `language`, `level`, `schedule`, `goal`, `consent`.
- Produces: `[data-form-success]`, `[data-summary="name|whatsapp|audience|language|level|schedule"]`, `[data-program-note]`.

- [ ] **Step 1: Write the failing registration tests**

Assert:
- Form has `data-lead-form` and `novalidate`; no external `action`, no `method="post"`, and no `type="submit"` control. The visible submit control is `type="button"` with `data-submit` so a no-JS click cannot send data.
- All nine fields exist with labels; required fields have `required`; each has a `data-error-for` message element, and each control’s `aria-describedby` points at its error element.
- Audience, language, level, and schedule use the exact options from spec §7.3; schedule values are `weekday-sore`, `weekday-malam`, `sabtu`, `online`.
- Consent checkbox exists and is required.
- Success panel is `hidden` in raw HTML, has `aria-live="polite"`, a demo note, summary slots, a WhatsApp trigger, and a back link.
- `data-program-note` is hidden by default.
- JS contains `LEAD_PROGRAMS` with all six slugs and the exact language/schedule mapping; contains `showModal` for the dialog and no `fetch(`/`XMLHttpRequest`.
- `?program=` handling checks `URLSearchParams` and ignores unknown slugs.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/daftar.test.mjs`
Expected: FAIL because the form does not exist yet.

- [ ] **Step 3: Implement the form**

Add the two-column desktop layout (form 60%, benefits 40% sticky) and single-column mobile layout. Add all fields, inline error paragraphs, and the success panel. Use `<button type="button" data-submit>` — not `type="submit"` — so the form cannot natively submit without JS; bind both click and Enter (except inside the textarea) to the same handler. Add JS:
- `LEAD_PROGRAMS` map: Teens → inggris/weekday-sore; Campus → inggris/weekday-malam; Work → inggris/online; N5 → jepang/sabtu; N4 → jepang/sabtu; Mandarin HSK 1–2 → mandarin/weekday-malam.
- `normalizePhone(value)` strips spaces, dashes, and a leading `+`; accept `08…` or `628…` with 8–11 digits after the prefix.
- `validateLeadForm(form)` returns `{ valid, firstInvalid }`, sets `aria-invalid`, and focuses the first invalid field. Use these exact messages:
  - name: “Nama minimal 2 karakter.”
  - whatsapp: “Masukkan nomor WhatsApp Indonesia yang valid (08… atau 628…).”
  - email: “Format email belum benar.”
  - audience: “Pilih salah satu.”
  - language: “Pilih bahasa yang ingin dipelajari.”
  - level: “Pilih level kamu.”
  - schedule: “Pilih jadwal favorit.”
  - goal: “Maksimal 300 karakter.”
  - consent: “Kamu perlu setuju untuk dihubungi via WhatsApp.”
- `initLeadForm()`: preventDefault, validate, show success panel, fill summary, focus heading, never send network data; handle `?program=`, prefill language and schedule, show program name; unknown slug = no prefill and no error.
- Success panel WhatsApp button opens the shared demo dialog.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/daftar.test.mjs`
Expected: all registration tests PASS.

- [ ] **Step 5: Browser QA**

Submit empty → first error on name. Enter invalid phone → phone error. Enter invalid email → email error. Leave consent unchecked → consent error. Fill valid data → success panel shows the summary, no network request, WhatsApp opens the demo dialog. Open `daftar.html?program=japanese-n5` → Jepang + Sabtu preselected and program note visible. Open `?program=unknown` → no crash.

- [ ] **Step 6: Commit**

```bash
git add daftar.html css/style.css js/main.js tests/daftar.test.mjs
git commit -m "feat: add demo registration form with validation"
```

---

### Task 6: Wireframe Gallery with Literal Artboards and Export Mode

**Files:**
- Modify: `wireframe.html`, `css/style.css`, `js/main.js`
- Test: `tests/wireframe.test.mjs`

**Interfaces:**
- Consumes: homepage section order and content from Tasks 2–3.
- Produces: `[data-wireframe-chrome]`, `[data-artboard="desktop|mobile"]` with `data-width="1440|390"`, `[data-artboard-switch]`, `[data-wireframe-chrome]`, `Cendekia.initWireframe()`.
- Produces: `?artboard=desktop|mobile&export=1` renders one artboard at 1:1 with no gallery chrome.

- [ ] **Step 1: Write the failing wireframe tests**

Assert:
- Page has a wireframe intro and `data-wireframe-chrome`.
- Exactly two artboards with `data-width` 1440 and 390; CSS contains `width: 1440px` and `width: 390px`.
- Artboards contain grayscale stand-ins for all homepage sections: header, hero, stats, tabs, pricing, why, teachers, testimonials, steps, FAQ, contact, footer, sticky CTA.
- `.wf-notes` annotations exist outside the artboards.
- Switch buttons exist and have `aria-selected`.
- JS contains `URLSearchParams`, `artboard`, `export`, and `is-export`; CSS hides chrome/notes/switch and removes the scale in export mode.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/wireframe.test.mjs`
Expected: FAIL because the wireframe page is still a shell.

- [ ] **Step 3: Implement the wireframe page**

Add a documentation-style intro, a Desktop/Mobile switch, and a stage with two grayscale artboards. Use simple boxes, lines, and placeholder text labels; no real colors, photos, or final copy. Add annotations under each artboard. Add `initWireframe()`:
- Switch one artboard at a time below 1360 px; on wide screens, show both with desktop scaled to about 0.6 and mobile at 1:1.
- In `?artboard=desktop&export=1` or `?artboard=mobile&export=1`, add `is-export`, hide chrome/notes/switch, show only the requested artboard, and remove the scale.
- Ensure the page body never scrolls horizontally; desktop artboard uses an `overflow-x:auto` frame on narrow screens.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/wireframe.test.mjs`
Expected: all wireframe tests PASS.

- [ ] **Step 5: Browser QA**

At 390 px: switch artboards, no body horizontal overflow, desktop artboard scrolls inside its frame. At 1440 px: both artboards visible with the scale note. Export URLs render only one artboard at 1440/390 with no header, footer, switch, or notes.

- [ ] **Step 6: Commit**

```bash
git add wireframe.html css/style.css js/main.js tests/wireframe.test.mjs
git commit -m "feat: add responsive wireframe gallery"
```

---

### Task 7: Style Guide Page

**Files:**
- Modify: `style-guide.html`, `css/style.css`
- Test: `tests/style-guide.test.mjs`

**Interfaces:**
- Consumes: all tokens and components from Tasks 1–6.
- Produces: a visual reference that uses the same classes as the live site, not a separate design system.

- [ ] **Step 1: Write the failing style-guide tests**

Assert:
- Page has sections for logo, color, typography, buttons, forms, components, spacing, radius/shadow/icons, do/don't, accessibility.
- All ten hex values appear.
- Type specimens for h1, h2, h3, body, small.
- Button states: primary, secondary, WhatsApp, disabled, focus.
- Form states: default, focus, error, success.
- Components: language badge, program card, teacher card, testimonial, accordion.
- Spacing scale 4/8/12/16/24/32/48/64.
- At least three do/don't pairs and a contrast note.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/style-guide.test.mjs`
Expected: FAIL because the style guide is still a shell.

- [ ] **Step 3: Implement the style guide**

Build the sections using the live classes. Show the logo mark/wordmark on light and dark. Show swatches with hex and contrast ratio labels (compute ratios with a contrast checker; do not invent numbers). Show type specimens and component examples. Keep the page scannable at 1440 and stack cleanly at 390.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/style-guide.test.mjs`
Expected: all style-guide tests PASS.

- [ ] **Step 5: Browser QA**

Compare buttons, cards, badges, and form fields side by side with the homepage; they must match. Check the style guide at 390/1440 and confirm no horizontal overflow.

- [ ] **Step 6: Commit**

```bash
git add style-guide.html css/style.css tests/style-guide.test.mjs
git commit -m "feat: add visual style guide"
```

---

### Task 8: Cross-Page QA, Accessibility, and Responsive Fixes

**Files:**
- Modify: any site files with issues
- Test: `tests/*.test.mjs`, plus `docs/qa/frame.html`

**Interfaces:**
- Consumes: completed pages.
- Produces: a dev-only iframe harness at `docs/qa/frame.html?page=/index.html&w=390&h=844` for viewport checks. The `page` value is an origin-root path, so the iframe does not resolve inside `docs/qa/`. It is never deployed.

- [ ] **Step 1: Write the link and viewport harness checks**

`tests/links.test.mjs` extracts every local `href` and `src` from the five pages. File targets must exist after stripping query/hash; hash-only links must point to an existing `id` on the same page; `index.html#section` links must point to an existing id in `index.html`. It also asserts no `href="#"` or `javascript:`.

Add a structure assertion that `Cendekia.init()` registers every implemented method: `initMobileNav`, `initTabs`, `initProgramFilters`, `initDialogs`, `initLeadForm`, `initStickyCta`, `initWireframe`, `initReveal`, and `initExportMode`.

`docs/qa/frame.html` loads a same-origin page in an iframe sized by `w`/`h` query params, sets `id="frame"`, and treats `page` as an origin-root path.

- [ ] **Step 2: Run the full test suite**

Run: `node --test "tests/*.test.mjs"`
Expected: all tests PASS.

- [ ] **Step 3: Run the responsive and accessibility QA**

Start `php -S 127.0.0.1:8000`. For each page, check 390, 768, and 1440:
- `document.documentElement.scrollWidth <= window.innerWidth` (use the iframe harness for 390/768).
- No console errors or failed local requests.
- Skip link works; focus ring is visible; heading order is sane.
- Header drawer, tabs, filters, FAQ, dialog, sticky CTA, and form all work.
- At 390, the sticky CTA does not cover the footer or form; on `daftar.html` it is absent.
- Dialog: focus enters, Escape closes, focus returns, background does not scroll.
- Form: invalid submit focuses the first error; valid submit shows the success panel; no network request.
- Wireframe: artboards do not reflow; export mode is 1:1 and clean.
- Run Lighthouse on the homepage and `daftar.html`; Accessibility, Best Practices, and SEO must be ≥95. Report Performance honestly.

- [ ] **Step 4: Fix what the QA finds and add regression tests where possible**

For every bug, add or tighten a test if it is statically checkable. Re-run `node --test "tests/*.test.mjs"` after each fix. Do not weaken or delete existing tests.

- [ ] **Step 5: Commit**

```bash
git add index.html program.html daftar.html wireframe.html style-guide.html css/style.css js/main.js tests/ docs/qa/frame.html
git commit -m "fix: resolve responsive and accessibility issues"
```

---

### Task 9: PNG Exports, OG Image, README, Design Notes

**Files:**
- Create: `figma-import/*.png` (9 files), `assets/og-image.jpg`, `docs/design-notes.md`, `docs/screenshots/*`
- Modify: `README.md`, `index.html` (OG meta)

**Interfaces:**
- Consumes: deployed-ready pages and `?export=1`.
- Produces: the nine deliverables and honest documentation.

- [ ] **Step 1: Export the nine PNGs**

Start the local server. Use Playwright CLI with installed Chrome; if `--channel chrome` is unavailable, use `--channel msedge` or install Chromium once.

```bash
npx -y playwright@latest screenshot --channel chrome --viewport-size "1440,900" --full-page --wait-for-timeout 1200 "http://127.0.0.1:8000/index.html?export=1" figma-import/01-home-desktop-1440.png
npx -y playwright@latest screenshot --channel chrome --viewport-size "390,844" --full-page --wait-for-timeout 1200 "http://127.0.0.1:8000/index.html?export=1" figma-import/02-home-mobile-390.png
npx -y playwright@latest screenshot --channel chrome --viewport-size "390,844" --wait-for-timeout 1200 "http://127.0.0.1:8000/index.html#program" figma-import/02b-home-mobile-sticky-390.png
npx -y playwright@latest screenshot --channel chrome --viewport-size "1440,900" --full-page --wait-for-timeout 1200 "http://127.0.0.1:8000/program.html?export=1" figma-import/03-program-desktop-1440.png
npx -y playwright@latest screenshot --channel chrome --viewport-size "390,844" --full-page --wait-for-timeout 1200 "http://127.0.0.1:8000/program.html?export=1" figma-import/04-program-mobile-390.png
npx -y playwright@latest screenshot --channel chrome --viewport-size "390,844" --full-page --wait-for-timeout 1200 "http://127.0.0.1:8000/daftar.html?export=1" figma-import/05-daftar-mobile-390.png
npx -y playwright@latest screenshot --channel chrome --viewport-size "1440,900" --full-page --wait-for-timeout 1200 "http://127.0.0.1:8000/wireframe.html?artboard=desktop&export=1" figma-import/06-wireframe-desktop-1440.png
npx -y playwright@latest screenshot --channel chrome --viewport-size "390,844" --full-page --wait-for-timeout 1200 "http://127.0.0.1:8000/wireframe.html?artboard=mobile&export=1" figma-import/07-wireframe-mobile-390.png
npx -y playwright@latest screenshot --channel chrome --viewport-size "1440,900" --full-page --wait-for-timeout 1200 "http://127.0.0.1:8000/style-guide.html?export=1" figma-import/08-style-guide-desktop-1440.png
```

Verify each PNG width is exactly 1440 or 390 (except `02b`, also 390), full-page heights are taller than the viewport, and no sticky bar or drawer appears in the full-page shots. Use PowerShell `System.Drawing` to read dimensions.

- [ ] **Step 2: Create the OG image and screenshots**

Capture the homepage hero at 1200×630:

```bash
npx -y playwright@latest screenshot --channel chrome --viewport-size "1200,630" --wait-for-timeout 1200 "http://127.0.0.1:8000/index.html?export=1" assets/og-image.png
```

Convert to `assets/og-image.jpg` with PowerShell `System.Drawing` and delete the temporary PNG. Add `og:title`, `og:description`, `og:type`, and `og:image` meta tags to `index.html`; use a relative path locally and update to the live absolute URL in Task 10.

Save 3–4 QA screenshots in `docs/screenshots/` for the README: home desktop, home mobile, program desktop, daftar mobile.

- [ ] **Step 3: Write `README.md` and `docs/design-notes.md`**

README sections: overview/problem, live demo, features, pages, tech stack, screenshots, run locally, tests, Figma exports, design decisions, demo data/disclaimer, deployment, limitations/future improvements, author, honest status (Implemented / Tested / Partially tested / Not tested).

Design notes: brief interpretation, audience, content hierarchy, visual system, the four approved decisions (tab mapping + 6-row table, concrete schedule slots, wireframe gallery behavior, full-page PNGs), accessibility approach, Figma import steps, what would change with more time.

- [ ] **Step 4: Run the full test suite and inspect the exports**

Run: `node --test "tests/*.test.mjs"`
Expected: all tests PASS.

Open each PNG with `browser.preview` and check for clipped text, missing fonts, sticky bars, and blank sections.

- [ ] **Step 5: Commit**

```bash
git add figma-import assets/og-image.jpg docs/design-notes.md docs/screenshots README.md index.html
git commit -m "docs: add Figma exports, README, and design notes"
```

---

### Task 10: GitHub, PR, Netlify Deploy, and Live Verification

**Files:**
- Create: `scripts/package-site.mjs`, `.gitignore` update
- Modify: `README.md` (live URL), `index.html` (absolute OG URL)

**Interfaces:**
- Consumes: all checks green.
- Produces: a public GitHub repo, a merged PR, and a verified Netlify site.

- [ ] **Step 1: Add the deploy packaging script**

`scripts/package-site.mjs` removes `dist/`, recreates it, and copies only `index.html`, `program.html`, `daftar.html`, `wireframe.html`, `style-guide.html`, `css/`, `js/`, `assets/`, and `robots.txt`. It prints `dist ready` and refuses to copy docs/tests/figma-import. Add `dist/` to `.gitignore`. Document `node scripts/package-site.mjs` and `netlify deploy --prod --dir=dist` in the README; this is a deploy convenience, not a site build.

- [ ] **Step 2: Create the GitHub repo and PR**

```bash
gh repo view compavel/cendekia-lingua
# if missing:
gh repo create compavel/cendekia-lingua --public --source=. --remote=origin
git push -u origin main
git push -u origin feat/cendekia-site
gh pr create --base main --head feat/cendekia-site --title "feat: build Cendekia Lingua company profile" --body-file PR_BODY.md
```

`PR_BODY.md` is temporary; do not commit it, and delete it after `gh pr create`. PR body must include: summary, why, pages/features, exact test commands and results, screenshot references, deploy preview URL, and honest status. Do not write “deployed” before Step 4.

- [ ] **Step 3: Run checks and deploy a preview**

Run `node --test "tests/*.test.mjs"`, Lighthouse checks, and the 390/768/1440 QA again. Create or reuse the Netlify site first (`netlify sites:create --name cendekia-lingua`, or `netlify link` if it already exists; if the name is taken, use `cendekia-lingua-demo`). Record the site ID in `.netlify/state.json` (gitignored). Then:

```bash
node scripts/package-site.mjs
netlify deploy --dir=dist --site <site-id>
```

Verify the preview URL: five pages return 200, CSS/JS/fonts load, no console errors, dialog/form work. Put the preview URL in the PR body.

- [ ] **Step 4: Deploy production**

Using the same site ID from Step 3:

```bash
netlify deploy --prod --dir=dist --site <site-id>
```

Verify HTTPS, five 200 responses, assets, live mobile layout, form demo, dialog, and PNGs’ source pages. Update `index.html` OG image to the absolute live URL and `README.md` with the live URL; run tests; commit; push. Run `node scripts/package-site.mjs` again and redeploy the production site so the absolute OG URL is live.

- [ ] **Step 5: Squash merge and verify main**

After all checks are green:

```bash
gh pr merge --squash --delete-branch
git switch main
git pull
node --test "tests/*.test.mjs"
node scripts/package-site.mjs
netlify deploy --prod --dir=dist --site <site-id>
```

Re-check the live site after the merge. If deploy is manual, say so; do not claim auto-deploy.

- [ ] **Step 6: Report status honestly**

Report: repo URL, PR URL, live URL, 5 page status codes, test command/result, Lighthouse scores, PNG count/dimensions, and anything still untested. Do not claim “selesai” without output evidence.

---

## Self-Review

- **Spec coverage:** all five pages, homepage sections 1–12, program cards/filters, form/validation/success, wireframe, style guide, nine PNGs, README/design notes, and Netlify deploy map to Tasks 1–10.
- **Decision coverage:** unique tab mapping + 6-row table → Tasks 2–4; concrete schedule slots → Tasks 2–5; wireframe gallery/export → Task 6; full-page PNG + sticky viewport → Task 9; `?export=1` → Tasks 3 and 9.
- **Interface consistency:** all six slugs, `LEAD_PROGRAMS`, `data-*` hooks, and `window.Cendekia` method names are defined once and reused.
- **Review Focus coverage:** sticky CTA → Task 3; no-JS → Tasks 1–5; dialog → Task 1/Task 8; form → Task 5; wireframe → Task 6.
- **Proportion:** the plan names decisions, values, and verification steps; implementation bodies are left to the executor, with full code only for the initial test shape.
