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
