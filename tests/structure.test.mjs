import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { read, pages, root } from './helpers.mjs';

const tokens = {
  '--navy-900': '#0B2239',
  '--navy-700': '#123A5C',
  '--yellow-400': '#F6C445',
  '--yellow-100': '#FFF1C9',
  '--cream': '#FAF6EC',
  '--white': '#FFFFFF',
  '--ink': '#16202B',
  '--muted': '#5C6B7A',
  '--line': '#D8D2C4',
  '--success': '#1F7A5C',
};

test('five pages share the document shell', () => {
  for (const page of pages) {
    const html = read(page);
    assert.match(html, /<!doctype html>/i, page);
    assert.match(html, /<html lang="id">/i, page);
    assert.match(
      html,
      /name="viewport" content="width=device-width, initial-scale=1"/i,
      page,
    );
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, page);
    assert.match(html, /<main[^>]*id="main"/i, page);
    assert.match(html, /<header\b/i, page);
    assert.match(html, /<footer\b/i, page);
    assert.match(html, /<link rel="stylesheet" href="css\/style\.css">/i, page);
    assert.match(html, /<script src="js\/main\.js" defer><\/script>/i, page);

    const skip = html.match(/<a\b[^>]*class="skip-link"[^>]*>/i)?.[0] ?? '';
    assert.match(skip, /href="#main"/i, `${page}: skip link must target #main`);
  }
});

test('design tokens, font tokens, and reduced motion exist', () => {
  const css = read('css/style.css');
  for (const [token, hex] of Object.entries(tokens)) {
    assert.match(css, new RegExp(`${token}\\s*:\\s*${hex}`, 'i'), token);
  }
  assert.match(css, /--font-display\s*:/i);
  assert.match(css, /--font-body\s*:/i);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
});

test('the shared script exposes the Cendekia namespace', () => {
  const js = read('js/main.js');
  for (const needle of ['DOMContentLoaded', 'window.Cendekia', 'init()', 'initDialogs()']) {
    assert.ok(js.includes(needle), `js/main.js must contain ${needle}`);
  }
});

test('every page has the demo disclaimer and WhatsApp dialog', () => {
  for (const page of pages) {
    const html = read(page);
    assert.match(
      html,
      /Situs demo\. Nama, harga, jadwal, dan testimoni fiktif\./i,
      page,
    );
    assert.match(html, /data-dialog-open="whatsapp"/i, page);
    assert.match(html, /<dialog[^>]*data-dialog="whatsapp"/i, page);
  }
});

test('support files exist and robots.txt allows crawling', () => {
  for (const file of ['assets/logo.svg', 'robots.txt', '.gitignore', 'README.md']) {
    assert.ok(existsSync(resolve(root, file)), `${file} must exist`);
  }
  assert.match(read('robots.txt'), /User-agent:\s*\*/i);
  assert.match(read('robots.txt'), /Allow:\s*\//i);
  assert.match(read('.gitignore'), /dist\//i);
  assert.match(read('.gitignore'), /\.netlify\//i);
});
