import test from 'node:test';
import assert from 'node:assert/strict';
import { read, tags, attr, text } from './helpers.mjs';

const html = read('style-guide.html');
const css = read('css/style.css');

const TOKENS = {
  '#0B2239': 'navy-900',
  '#123A5C': 'navy-700',
  '#F6C445': 'yellow-400',
  '#FFF1C9': 'yellow-100',
  '#FAF6EC': 'cream',
  '#FFFFFF': 'white',
  '#16202B': 'ink',
  '#5C6B7A': 'muted',
  '#D8D2C4': 'line',
  '#1F7A5C': 'success',
};

const SECTIONS = [
  'logo',
  'warna',
  'tipografi',
  'tombol',
  'form',
  'komponen',
  'spacing',
  'radius',
  'do-dont',
  'aksesibilitas',
];

test('style guide covers every required section', () => {
  const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  assert.ok(h1, 'h1 must exist');
  assert.equal(text(h1[1]), 'Style guide');

  for (const id of SECTIONS) {
    assert.match(html, new RegExp(`id="${id}"`), `section #${id} must exist`);
    assert.equal(
      (html.match(new RegExp(`data-sg-section="${id}"`, 'g')) ?? []).length,
      1,
      `data-sg-section="${id}" must appear once`,
    );
  }

  assert.ok(css.includes('.sg-swatch'), 'swatch styles must exist');
  assert.ok(css.includes('.sg-do-dont'), 'do/dont styles must exist');
});

const luminance = (hex) => {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const [r, g, b] = channels.map((value) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (foreground, background) => {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

test('all ten design tokens appear as labelled swatches with real contrast ratios', () => {
  const swatches = [...html.matchAll(/<li[^>]*data-swatch="[^"]*"[^>]*>[\s\S]*?<\/li>/gi)].map(
    (match) => match[0],
  );
  assert.equal(swatches.length, 10, 'one swatch per token');

  const found = new Set();
  for (const swatch of swatches) {
    const hex = /#[0-9A-F]{6}/i.exec(swatch)?.[0]?.toUpperCase() ?? null;
    assert.ok(hex, 'every swatch must show a hex value');
    assert.ok(TOKENS[hex], `${hex} must be a documented token`);
    found.add(hex);
    assert.ok(css.includes(`var(--${TOKENS[hex]})`), `${hex} must be used via its custom property`);

    const pair = /--on-swatch:\s*(#[0-9A-F]{6})/i.exec(swatch)?.[1]?.toUpperCase() ?? null;
    assert.ok(pair, `${hex} must document the colour it is paired with`);

    const shown = /(\d+\.\d+):1/.exec(text(swatch))?.[1] ?? null;
    assert.ok(shown, `${hex} must show a computed contrast ratio`);

    const computed = Math.round(contrast(hex, pair) * 100) / 100;
    assert.equal(Number(shown), computed, `${hex} on ${pair} must match the computed WCAG ratio`);
  }

  assert.deepEqual([...found].sort(), Object.keys(TOKENS).sort());
});

test('typography specimens match the live scale', () => {
  for (const name of ['h1', 'h2', 'h3', 'body', 'small']) {
    assert.equal(
      (html.match(new RegExp(`data-type-sample="${name}"`, 'g')) ?? []).length,
      1,
      `type specimen ${name} must exist`,
    );
  }

  assert.match(html, /Bricolage Grotesque/);
  assert.match(html, /Plus Jakarta Sans/);
  assert.ok(css.includes('--font-display'));
  assert.ok(css.includes('--font-body'));
});

test('buttons and form states are demonstrated with live classes', () => {
  const buttonSection = html.match(/<section[^>]*id="tombol"[\s\S]*?<\/section>/i)?.[0] ?? '';
  assert.ok(buttonSection, 'button section must exist');

  for (const className of ['btn-primary', 'btn-secondary', 'btn-whatsapp']) {
    assert.ok(buttonSection.includes(`btn ${className}`), `${className} must be shown`);
  }
  assert.match(buttonSection, /<button[^>]*\bdisabled\b/);
  assert.match(buttonSection, /data-focus-demo/);

  const formSection = html.match(/<section[^>]*id="form"[\s\S]*?<\/section>/i)?.[0] ?? '';
  assert.ok(formSection, 'form section must exist');

  for (const state of ['default', 'focus', 'error', 'success']) {
    assert.ok(
      formSection.includes(`data-form-state="${state}"`),
      `form state ${state} must be shown`,
    );
  }

  assert.match(formSection, /aria-invalid="true"/);
  assert.match(formSection, /data-error-for="demo"/);
  assert.match(formSection, /data-form-success/);
});

test('component examples reuse the production classes', () => {
  const components = html.match(/<section[^>]*id="komponen"[\s\S]*?<\/section>/i)?.[0] ?? '';
  assert.ok(components, 'component section must exist');

  const expected = {
    'lang-badge': 'lang-badge',
    'program-card': 'program-card',
    'teacher-card': 'teacher-card',
    testimonial: 'testimonial',
    accordion: 'faq-item',
  };

  for (const [marker, className] of Object.entries(expected)) {
    const block = components.match(
      new RegExp(`<div[^>]*data-component="${marker}"[\\s\\S]*?<\\/div>`, 'i'),
    )?.[0];
    assert.ok(block, `component ${marker} must be marked`);
    assert.ok(block.includes(className), `${marker} must use .${className}`);
  }
});

test('spacing, radius, shadow, icons, do/dont, and accessibility notes are complete', () => {
  const spacing = html.match(/<section[^>]*id="spacing"[\s\S]*?<\/section>/i)?.[0] ?? '';
  for (const value of ['4', '8', '12', '16', '24', '32', '48', '64']) {
    assert.ok(spacing.includes(`data-space="${value}"`), `spacing step ${value} must exist`);
  }

  const radius = html.match(/<section[^>]*id="radius"[\s\S]*?<\/section>/i)?.[0] ?? '';
  for (const needle of ['--radius-card', '--radius-pill', '--radius-input', '--shadow-soft']) {
    assert.ok(radius.includes(needle), `radius/shadow token ${needle} must be shown`);
  }
  assert.match(radius, /<svg\b/, 'icon set must include an inline SVG');

  const doDont = html.match(/<section[^>]*id="do-dont"[\s\S]*?<\/section>/i)?.[0] ?? '';
  assert.ok((doDont.match(/data-do-dont\b/g) ?? []).length >= 3, 'at least three pairs');
  assert.ok((doDont.match(/\bsg-do\b/g) ?? []).length >= 3, 'each pair needs a do example');
  assert.ok((doDont.match(/\bsg-dont\b/g) ?? []).length >= 3, 'each pair needs a dont example');

  const accessibility = html.match(/<section[^>]*id="aksesibilitas"[\s\S]*?<\/section>/i)?.[0] ?? '';
  assert.match(accessibility, /WCAG\s*2\.2\s*AA/i);
  assert.match(accessibility, /4\.5:1/);
  assert.match(accessibility, /fokus/i);
  assert.match(accessibility, /prefers-reduced-motion/);
  assert.match(accessibility, /44\s*px/i);

  const buttons = tags(html, 'a').concat(tags(html, 'button'));
  assert.ok(buttons.length > 0, 'interactive examples exist');
  assert.ok(attr(buttons[0], 'class') !== null, 'button examples carry classes');
});
