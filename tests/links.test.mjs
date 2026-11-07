import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pages, root, read, tags, attr } from './helpers.mjs';

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const LOCAL_PAGE = /\.html$/i;

const pagePath = (page) => resolve(root, page);
const idsOf = (html) => new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));

const attributes = (html) => [
  ...tags(html, 'a').map((tag) => ['href', attr(tag, 'href')]),
  ...tags(html, 'link').map((tag) => ['href', attr(tag, 'href')]),
  ...tags(html, 'script').map((tag) => ['src', attr(tag, 'src')]),
  ...tags(html, 'img').map((tag) => ['src', attr(tag, 'src')]),
  ...tags(html, 'source').map((tag) => ['src', attr(tag, 'src')]),
];

const parseTarget = (href, page) => {
  const [pathAndQuery, hash = ''] = href.split('#');
  const [path] = pathAndQuery.split('?');
  const target = path === '' ? page : path;
  return { path: target, hash };
};

test('every local link and asset resolves to a real target', () => {
  const failures = [];

  for (const page of pages) {
    const html = read(page);

    for (const [name, value] of attributes(html)) {
      if (!value) continue;
      assert.ok(!/^javascript:/i.test(value), `${page}: javascript: URL found`);
      if (value === '#') failures.push(`${page}: empty href="#"`);

      if (value.startsWith('#')) {
        if (value.length > 1 && !idsOf(html).has(value.slice(1))) {
          failures.push(`${page}: missing anchor ${value}`);
        }
        continue;
      }

      if (EXTERNAL.test(value) || value.startsWith('mailto:') || value.startsWith('tel:')) {
        continue;
      }

      const { path, hash } = parseTarget(value, page);
      const target = resolve(root, path);

      if (!existsSync(target)) {
        failures.push(`${page}: ${name}="${value}" -> missing file ${path}`);
        continue;
      }

      if (hash && LOCAL_PAGE.test(path)) {
        const targetHtml = readFileSync(target, 'utf8');
        if (!idsOf(targetHtml).has(hash)) {
          failures.push(`${page}: ${value} -> missing anchor #${hash} in ${path}`);
        }
      }
    }
  }

  assert.deepEqual(failures, []);
});

test('init registers every implemented behavior', () => {
  const js = read('js/main.js');
  const init = /init\(\) \{([\s\S]*?)\n  \},/.exec(js)?.[1] ?? '';
  assert.ok(init, 'Cendekia.init must exist');

  for (const method of [
    'initMobileNav',
    'initTabs',
    'initProgramFilters',
    'initDialogs',
    'initLeadForm',
    'initStickyCta',
    'initWireframe',
    'initReveal',
    'initExportMode',
  ]) {
    assert.ok(init.includes(`this.${method}()`), `init() must call ${method}()`);
  }
});

test('dialog close restores focus without relying on the native close event', () => {
  const js = read('js/main.js');
  const block = /initDialogs\(\) \{([\s\S]*?)\n  \},/.exec(js)?.[1] ?? '';
  assert.ok(block, 'initDialogs() must exist');

  const closeFn = /const close = \(\) => \{([\s\S]*?)\n      \};/.exec(block)?.[1] ?? '';
  assert.ok(closeFn, 'close() must exist');
  assert.match(closeFn, /restoreFocus\(\)/, 'close() must restore focus directly');

  assert.match(block, /addEventListener\('cancel'/, 'Escape must be handled explicitly');
  assert.match(block, /event\.preventDefault\(\)/, 'cancel must not race the native close');
  assert.match(block, /addEventListener\('close', restoreFocus\)/, 'native close stays as a fallback');
});

test('viewport harness loads an origin-root page at the requested size', () => {
  const harnessPath = resolve(root, 'docs/qa/frame.html');
  assert.ok(existsSync(harnessPath), 'docs/qa/frame.html must exist');

  const harness = readFileSync(harnessPath, 'utf8');
  const frame = tags(harness, 'iframe').find((tag) => attr(tag, 'id') === 'frame');
  assert.ok(frame, 'harness must expose iframe#frame');
  assert.ok(!/\bsrc="(?!about:blank)/.test(frame), 'harness must not hardcode a page');

  assert.ok(harness.includes('URLSearchParams'), 'harness reads query params');
  assert.match(harness, /get\('page'\)|get\("page"\)/);
  assert.match(harness, /get\('w'\)|get\("w"\)/);
  assert.match(harness, /get\('h'\)|get\("h"\)/);
  assert.match(harness, /window\.location\.origin/);
  assert.match(harness, /startsWith\('\/'\)|startsWith\("\/"\)/);
  assert.match(harness, /frame\.src\s*=/);
  assert.match(harness, /noindex/i);
});

test('the five pages keep unique titles and one main landmark', () => {
  const titles = new Set();

  for (const page of pages) {
    const html = read(page);
    const title = /<title>([^<]+)<\/title>/i.exec(html)?.[1]?.trim();
    assert.ok(title, `${page}: title required`);
    assert.ok(!titles.has(title), `${page}: duplicate title "${title}"`);
    titles.add(title);

    assert.equal((html.match(/<main\b/gi) ?? []).length, 1, `${page}: exactly one main landmark`);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, `${page}: exactly one h1`);
    assert.equal((html.match(/<html lang="id"/gi) ?? []).length, 1, `${page}: lang="id"`);
  }
});

test('source files stay scoped to the five pages', () => {
  const siteFiles = [
    'index.html',
    'program.html',
    'daftar.html',
    'wireframe.html',
    'style-guide.html',
    'css/style.css',
    'js/main.js',
  ];

  for (const file of siteFiles) {
    const full = resolve(root, file);
    assert.ok(existsSync(full), `${file} must exist`);
    const text = readFileSync(full, 'utf8');
    assert.ok(!/TODO|FIXME/.test(text), `${file} must not ship TODO/FIXME markers`);
    assert.ok(!/localhost:\d+/.test(text), `${file} must not hardcode localhost`);
  }

  assert.ok(dirname(resolve(root, 'docs/qa/frame.html')).endsWith('docs\\qa') || dirname(resolve(root, 'docs/qa/frame.html')).endsWith('docs/qa'));
});
