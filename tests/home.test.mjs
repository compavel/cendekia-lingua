import test from 'node:test';
import assert from 'node:assert/strict';
import { read, tags, attr, text } from './helpers.mjs';

const html = read('index.html');
const css = read('css/style.css');
const js = read('js/main.js');

const section = (marker) => {
  const match = html.match(new RegExp(`<section[^>]*${marker}[\\s\\S]*?<\\/section>`, 'i'));
  assert.ok(match, `section ${marker} must exist`);
  return match[0];
};

const cardsIn = (markup) =>
  [...markup.matchAll(/<article[^>]*data-program-card[^>]*data-slug="([^"]+)"/gi)].map(
    (match) => match[1],
  );

test('hero states the offer, proof, and both calls to action', () => {
  const hero = section('id="hero"');
  const heroText = text(hero);

  assert.match(heroText, /Kursus bahasa di Yogyakarta/);
  assert.match(hero, /<h1\b/i);
  assert.equal(text(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(hero)[1]), 'Berani bicara, siap melangkah.');
  assert.match(hero, /href="daftar\.html"/i);
  assert.match(hero, /href="program\.html"/i);
  assert.match(heroText, /4,9\/5/);
  assert.match(heroText, /1\.200\+ alumni/);
  assert.match(heroText, /Inggris/);
  assert.match(heroText, /Jepang/);
  assert.match(heroText, /Mandarin/);
  assert.match(heroText, /A/);
  assert.match(heroText, /あ/);
  assert.match(heroText, /你/);
  assert.match(hero, /aria-hidden="true"/);
});

test('stats strip shows four numbers', () => {
  const stats = section('data-stats');
  const statsText = text(stats);

  assert.match(statsText, /1\.200\+/);
  assert.match(statsText, /4,9\/5/);
  assert.match(statsText, /12 pengajar/);
  assert.match(statsText, /3 bahasa/);
});

test('audience tabs follow the approved six-card mapping', () => {
  const tabs = tags(html, 'button').filter((tag) => /\bdata-tab\b/.test(tag));
  const panels = [...html.matchAll(/<section[^>]*data-panel="[^"]+"[^>]*>[\s\S]*?<\/section>/gi)].map(
    (match) => match[0],
  );

  assert.equal(tabs.length, 3);
  assert.equal(panels.length, 3);

  const selected = tabs.filter((tag) => attr(tag, 'aria-selected') === 'true');
  assert.equal(selected.length, 1);
  assert.equal(attr(selected[0], 'data-tab'), 'sma');

  for (const tab of tabs) {
    assert.ok(attr(tab, 'aria-controls'), 'each tab needs aria-controls');
    assert.equal(attr(tab, 'role'), 'tab');
  }

  const headings = { sma: 'Untuk SMA', mahasiswa: 'Untuk Mahasiswa', pekerja: 'Untuk Pekerja' };
  const expected = {
    sma: ['english-teens', 'japanese-n5'],
    mahasiswa: ['english-campus', 'japanese-n4'],
    pekerja: ['english-work', 'mandarin-hsk1-2'],
  };

  for (const markup of panels) {
    const opening = markup.match(/<section[^>]*>/i)[0];
    const audience = attr(opening, 'data-audience');
    assert.match(markup, /role="tabpanel"/);
    assert.match(markup, /aria-labelledby=/);
    assert.ok(!/\shidden(?=[\s>=])/.test(markup), 'panels must not be hidden in raw HTML');
    assert.match(text(markup), new RegExp(headings[audience]));
    assert.deepEqual(cardsIn(markup), expected[audience], audience);
  }

  const allCards = tags(html, 'article').filter((tag) => /\bdata-program-card\b/.test(tag));
  assert.equal(allCards.length, 6);
  assert.deepEqual(
    [...new Set(cardsIn(html))].sort(),
    [
      'english-campus',
      'english-teens',
      'english-work',
      'japanese-n4',
      'japanese-n5',
      'mandarin-hsk1-2',
    ],
  );
});

test('tabs degrade without JavaScript and expose keyboard support', () => {
  assert.ok(css.includes('.tablist { display: none; }'));
  assert.ok(css.includes('.js .tablist { display: flex; }'));

  for (const needle of [
    'initMobileNav',
    'initTabs',
    'ArrowRight',
    'ArrowLeft',
    'Home',
    'End',
  ]) {
    assert.ok(js.includes(needle), `js/main.js must contain ${needle}`);
  }
});

test('header exposes the mobile navigation hooks', () => {
  const toggle = tags(html, 'button').find((tag) => /\bdata-nav-toggle\b/.test(tag));
  assert.ok(toggle, 'nav toggle must exist');
  assert.equal(attr(toggle, 'aria-expanded'), 'false');
  assert.equal(attr(toggle, 'aria-controls'), 'site-nav');

  const nav = tags(html, 'nav').find((tag) => /\bdata-nav\b/.test(tag));
  assert.ok(nav, 'nav must exist');
  assert.equal(attr(nav, 'id'), 'site-nav');
});

const PRICES = {
  'english-teens': 'Rp 850.000',
  'japanese-n5': 'Rp 1.100.000',
  'english-campus': 'Rp 950.000',
  'japanese-n4': 'Rp 1.250.000',
  'english-work': 'Rp 1.200.000',
  'mandarin-hsk1-2': 'Rp 1.100.000',
};

test('pricing table covers all six programs with exact demo prices', () => {
  const pricing = section('id="jadwal-biaya"');
  const rows = [...pricing.matchAll(/<tr[^>]*data-price-row[^>]*>[\s\S]*?<\/tr>/gi)].map(
    (match) => match[0],
  );

  assert.equal(rows.length, 6);
  assert.deepEqual(
    rows.map((row) => attr(row.match(/<tr[^>]*>/i)[0], 'data-slug')).sort(),
    Object.keys(PRICES).sort(),
  );

  for (const row of rows) {
    const slug = attr(row.match(/<tr[^>]*>/i)[0], 'data-slug');
    const cells = [...row.matchAll(/<td[^>]*data-label="([^"]+)"[^>]*>/gi)].map(
      (match) => match[1],
    );
    assert.deepEqual(cells, ['Program', 'Level', 'Jadwal', 'Biaya'], slug);
    assert.ok(text(row).includes(PRICES[slug]), `${slug} must show ${PRICES[slug]}`);
  }

  const note = text(pricing);
  assert.match(note, /Harga demo, belum termasuk biaya buku/);
  assert.match(note, /slot dikonfirmasi admin/i);
});

test('reasons, teachers, and testimonials are substantive', () => {
  const reasons = [...html.matchAll(/<article[^>]*data-reason[^>]*>[\s\S]*?<\/article>/gi)].map(
    (match) => match[0],
  );
  assert.equal(reasons.length, 4);
  const reasonText = text(reasons.join(' '));
  assert.match(reasonText, /8 siswa/);
  assert.match(reasonText, /native speaker/i);
  assert.match(reasonText, /Sabtu/);
  assert.match(reasonText, /gratis/i);

  const teachers = section('id="pengajar"');
  const teacherText = text(teachers);
  for (const name of ['Ayu Prameswari', 'Kenji Nakamura', 'Li Wei']) {
    assert.match(teacherText, new RegExp(name));
  }
  for (const credential of ['S.Pd.', 'JLPT N1', 'HSK 6']) {
    assert.ok(teacherText.includes(credential), `credential ${credential} must appear`);
  }
  for (const initials of ['AP', 'KN', 'LW']) {
    assert.ok(teachers.includes(`>${initials}<`), `initials ${initials} must appear`);
  }

  const testimonials = section('id="testimoni"');
  const testimonialText = text(testimonials);
  for (const name of ['Nadia', 'Rizky', 'Sarah']) {
    assert.match(testimonialText, new RegExp(name));
  }
  assert.match(testimonialText, /moderator presentasi/);
  assert.match(testimonialText, /N5 lulus/);
  assert.match(testimonialText, /presentasi di depan klien/);
  assert.match(testimonialText, /Testimoni demo/);
});

test('registration steps, FAQ, and contact are complete', () => {
  const steps = tags(html, 'li').filter((tag) => /\bdata-step\b/.test(tag));
  assert.equal(steps.length, 3);
  const stepsText = text(section('id="cara-daftar"'));
  assert.match(stepsText, /Isi formulir/);
  assert.match(stepsText, /Dihubungi admin/);
  assert.match(stepsText, /Kelas percobaan/);
  assert.match(stepsText, /Mulai dari sini/);

  const faq = section('id="faq"');
  const details = tags(faq, 'details');
  assert.equal(details.length, 5);
  const faqText = text(faq);
  const answers = [
    'Kelas percobaan 60 menit gratis, tanpa biaya pendaftaran dan tanpa kewajiban lanjut.',
    'Bisa mulai dari level Pemula. Kami bantu placement test singkat untuk menentukan kelas.',
    'Mayoritas kelas tatap muka di Sleman; English for Work dan beberapa sesi bisa online.',
    'Biaya per modul Rp 850.000–Rp 1.250.000, bisa dicicil 2 kali. Harga demo belum termasuk buku.',
    'Bisa, maksimal 2 kali per modul dengan pemberitahuan minimal 1 hari sebelumnya, tergantung ketersediaan kelas.',
  ];
  for (const answer of answers) {
    assert.ok(faqText.includes(answer), `FAQ answer missing: ${answer}`);
  }

  const contact = section('id="kontak"');
  const contactText = text(contact);
  assert.match(contactText, /Jl\. Kaliurang Km\. 5 No\. 18, Sleman, Yogyakarta/);
  assert.match(contactText, /Senin–Jumat 10\.00–20\.00/);
  assert.match(contactText, /Sabtu 09\.00–15\.00/);
  assert.match(contactText, /halo@cendekialingua\.demo/);
  assert.match(contact, /data-dialog-open="whatsapp"/);
  assert.match(contact, /aria-label="Ilustrasi peta demo"/);
});

test('sticky CTA and export mode are wired', () => {
  const sticky = html.match(/<div[^>]*data-sticky-cta[\s\S]*?<\/div>/i)?.[0] ?? '';
  assert.match(html, /<div[^>]*data-sticky-cta[^>]*\shidden(?=[\s>])/i);
  assert.match(sticky, /href="daftar\.html"/i);

  for (const needle of [
    'initStickyCta',
    'initReveal',
    'initExportMode',
    'IntersectionObserver',
    'data-hero',
    'export',
  ]) {
    assert.ok(js.includes(needle), `js/main.js must contain ${needle}`);
  }

  assert.ok(css.includes('.is-export [data-sticky-cta] { display: none !important; }'));
  assert.ok(
    css.includes('.is-export [data-reveal] { opacity: 1 !important; transform: none !important; }'),
  );
  assert.ok(css.includes('body.has-sticky-cta'));
  assert.ok(css.includes('@media (max-width: 760px)'));
});
