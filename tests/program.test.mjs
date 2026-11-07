import test from 'node:test';
import assert from 'node:assert/strict';
import { read, attr, text } from './helpers.mjs';

const html = read('program.html');
const css = read('css/style.css');
const js = read('js/main.js');

const PROGRAMS = {
  'english-teens': {
    name: 'English for Teens',
    language: 'inggris',
    target: 'SMA',
    level: 'Beginner–Intermediate',
    duration: '12 sesi × 90 mnt',
    schedule: 'Selasa & Kamis 16.00–17.30',
    price: 'Rp 850.000',
  },
  'english-campus': {
    name: 'English for Campus',
    language: 'inggris',
    target: 'Mahasiswa',
    level: 'Conversation',
    duration: '12 sesi × 90 mnt',
    schedule: 'Senin & Rabu 18.30–20.00',
    price: 'Rp 950.000',
  },
  'english-work': {
    name: 'English for Work',
    language: 'inggris',
    target: 'Pekerja',
    level: 'Business speaking',
    duration: '10 sesi × 90 mnt',
    schedule: 'Selasa & Kamis 19.00–20.30 (online)',
    price: 'Rp 1.200.000',
  },
  'japanese-n5': {
    name: 'Japanese N5',
    language: 'jepang',
    target: 'SMA–umum',
    level: 'Pemula (N5)',
    duration: '16 sesi × 150 mnt',
    schedule: 'Sabtu 09.00–11.30',
    price: 'Rp 1.100.000',
  },
  'japanese-n4': {
    name: 'Japanese N4',
    language: 'jepang',
    target: 'Mahasiswa–umum',
    level: 'Lanjutan N4 (prasyarat N5)',
    duration: '16 sesi × 150 mnt',
    schedule: 'Sabtu 13.00–15.30',
    price: 'Rp 1.250.000',
  },
  'mandarin-hsk1-2': {
    name: 'Mandarin HSK 1–2',
    language: 'mandarin',
    target: 'Pekerja–umum',
    level: 'Pemula (HSK 1–2)',
    duration: '16 sesi × 90 mnt',
    schedule: 'Jumat 18.30–20.00',
    price: 'Rp 1.100.000',
  },
};

const cards = [...html.matchAll(/<article[^>]*data-program-card[^>]*>[\s\S]*?<\/article>/gi)].map(
  (match) => match[0],
);
const opening = (card) => card.match(/<article[^>]*>/i)[0];
const bySlug = new Map(cards.map((card) => [attr(opening(card), 'data-slug'), card]));

const sectionWith = (marker) => {
  const match = html.match(new RegExp(`<section[^>]*${marker}[\\s\\S]*?<\\/section>`, 'i'));
  assert.ok(match, `section ${marker} must exist`);
  return match[0];
};

test('program page keeps one clear hero heading', () => {
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  assert.ok(h1, 'h1 must exist');
  assert.equal(text(h1[1]), 'Program kursus');
  assert.match(text(html), /Inggris, Jepang, dan Mandarin/);
});

test('four filter chips expose pressed state with Semua active', () => {
  const buttons = [...html.matchAll(/<button[^>]*data-filter[^>]*>[\s\S]*?<\/button>/gi)].map(
    (match) => match[0],
  );
  assert.equal(buttons.length, 4);
  assert.deepEqual(
    buttons.map((button) => attr(button, 'data-filter')),
    ['all', 'inggris', 'jepang', 'mandarin'],
  );

  const pressed = buttons.filter((button) => attr(button, 'aria-pressed') === 'true');
  assert.equal(pressed.length, 1);
  assert.equal(attr(pressed[0], 'data-filter'), 'all');
  assert.equal(text(buttons[0]), 'Semua');
  assert.deepEqual(buttons.slice(1).map((button) => text(button)), [
    'Inggris',
    'Jepang',
    'Mandarin',
  ]);

  assert.ok(css.includes('.filter-bar { display: none; }'));
  assert.ok(css.includes('.js .filter-bar { display: flex; }'));
  for (const needle of ['initProgramFilters', 'aria-pressed', 'dataset.language']) {
    assert.ok(js.includes(needle), `js/main.js must contain ${needle}`);
  }
});

test('six cards match the program matrix exactly', () => {
  assert.equal(cards.length, 6);
  assert.deepEqual([...bySlug.keys()].sort(), Object.keys(PROGRAMS).sort());

  const counts = { inggris: 0, jepang: 0, mandarin: 0 };

  for (const [slug, expected] of Object.entries(PROGRAMS)) {
    const card = bySlug.get(slug);
    assert.ok(card, `card ${slug} must exist`);
    assert.equal(attr(opening(card), 'data-language'), expected.language, slug);
    counts[expected.language] += 1;

    const cardText = text(card);
    for (const value of [
      expected.name,
      expected.target,
      expected.level,
      expected.duration,
      expected.schedule,
      expected.price,
    ]) {
      assert.ok(cardText.includes(value), `${slug} must show "${value}"`);
    }

    const languageLabel = expected.language.charAt(0).toUpperCase() + expected.language.slice(1);
    assert.ok(cardText.includes(languageLabel), `${slug} must name ${languageLabel}`);
    assert.match(card, new RegExp(`href="daftar\\.html\\?program=${slug}"`));
    assert.ok(!/\shidden(?=[\s>=])/.test(opening(card)), `${slug} must not start hidden`);
  }

  assert.deepEqual(counts, { inggris: 3, jepang: 2, mandarin: 1 });
  assert.equal(new Set(cards.map((card) => attr(opening(card), 'data-slug'))).size, 6);
});

test('placement test and closing CTA band are in place', () => {
  const placement = sectionWith('id="placement"');
  const placementText = text(placement);
  assert.match(placementText, /Belum yakin levelmu\?/);
  assert.match(placementText, /placement test/i);
  assert.match(placement, /href="daftar\.html"/);

  const band = html.match(/<section[^>]*data-cta-band[^>]*>[\s\S]*?<\/section>/i)?.[0];
  assert.ok(band, 'CTA band must exist');
  assert.match(band, /href="daftar\.html"/);
  assert.ok(html.indexOf('data-cta-band') < html.indexOf('<footer'), 'CTA band must precede the footer');
});
