import test from 'node:test';
import assert from 'node:assert/strict';
import { read, tags, attr, text } from './helpers.mjs';

const html = read('wireframe.html');
const css = read('css/style.css');
const js = read('js/main.js');

const SECTIONS = [
  'header',
  'hero',
  'stats',
  'tabs',
  'pricing',
  'why',
  'teachers',
  'testimonials',
  'steps',
  'faq',
  'contact',
  'sticky',
  'footer',
];

test('wireframe page has an intro, chrome, and two literal artboards', () => {
  const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  assert.ok(h1, 'h1 must exist');
  assert.equal(text(h1[1]), 'Wireframe homepage');

  assert.ok(html.includes('data-wireframe-chrome'), 'gallery chrome must be marked');
  assert.match(text(html), /tidak reflow/i);

  const boards = tags(html, 'div').filter((tag) => /\bdata-artboard=/.test(tag));
  assert.equal(boards.length, 2);
  assert.deepEqual(
    boards.map((tag) => [attr(tag, 'data-artboard'), attr(tag, 'data-width')]),
    [
      ['desktop', '1440'],
      ['mobile', '390'],
    ],
  );

  assert.ok(css.includes('width: 1440px'));
  assert.ok(css.includes('width: 390px'));
});

test('both artboards cover every homepage section in order', () => {
  const sections = [...html.matchAll(/data-wf-section="([^"]+)"/g)].map((match) => match[1]);

  for (const section of SECTIONS) {
    assert.equal(
      sections.filter((value) => value === section).length,
      2,
      `${section} must appear once per artboard`,
    );
  }

  const positions = SECTIONS.map((section) => sections.indexOf(section));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test('annotations sit outside the artboards and explain the sections', () => {
  assert.match(html, /class="[^"]*\bwf-notes\b/);
  assert.ok(html.indexOf('wf-notes') > html.indexOf('data-wireframe-stage'));
  assert.ok(html.indexOf('wf-notes') > html.indexOf('data-artboard="mobile"'));
  assert.match(text(html), /Anotasi/);

  const notes = html.slice(html.indexOf('wf-notes'));
  for (const keyword of ['Header', 'Hero', 'Stats', 'Tab', 'Jadwal', 'Pengajar', 'FAQ', 'Sticky']) {
    assert.ok(notes.includes(keyword), `annotation for ${keyword} must exist`);
  }
});

test('artboard switch exposes two pressed states', () => {
  const wrap = tags(html, 'div').find((tag) => /\bdata-artboard-switch\b/.test(tag));
  assert.ok(wrap, 'switch container must exist');
  assert.ok(!/\brole="tablist"/.test(wrap), 'simple toggles must not claim tab semantics');

  const tabs = tags(html, 'button').filter((tag) => /\bdata-artboard-tab\b/.test(tag));
  assert.equal(tabs.length, 2);
  assert.deepEqual(
    tabs.map((tab) => attr(tab, 'data-artboard-tab')),
    ['desktop', 'mobile'],
  );
  assert.ok(tabs.every((tab) => attr(tab, 'type') === 'button'));
  assert.ok(tabs.every((tab) => ['true', 'false'].includes(attr(tab, 'aria-pressed'))));
  assert.equal(tabs.filter((tab) => attr(tab, 'aria-pressed') === 'true').length, 1);
  assert.ok(tabs.every((tab) => !attr(tab, 'aria-selected')));
});

test('gallery scales, switches, and exports through CSS and JS', () => {
  for (const needle of ['initWireframe', 'URLSearchParams', 'artboard', 'export', 'is-export', 'is-wireframe-export', 'has-artboard-request']) {
    assert.ok(js.includes(needle), `js/main.js must contain ${needle}`);
  }

  assert.ok(css.includes('.js .wf-frame { display: none; }'));
  assert.ok(css.includes('.js .wf-frame.is-active { display: block; }'));
  assert.ok(css.includes('zoom: 0.6'));
  assert.ok(css.includes('.wf-switch button[aria-pressed="true"]'));
  assert.ok(css.includes('.is-export .wf-artboard--desktop { zoom: 1; }'));
  assert.ok(css.includes('.is-wireframe-export .site-header'));
  assert.ok(css.includes('.is-wireframe-export .site-footer'));
  assert.ok(css.includes('.is-wireframe-export [data-wireframe-chrome]'));
  assert.ok(css.includes('.is-wireframe-export .wf-notes'));
  assert.ok(css.includes('.has-artboard-request .wf-frame.is-active'));
  assert.ok(!css.includes('.is-export .site-header'), 'generic export mode must keep the site header');
});
