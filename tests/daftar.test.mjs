import test from 'node:test';
import assert from 'node:assert/strict';
import { read, tags, attr, text } from './helpers.mjs';

const html = read('daftar.html');
const js = read('js/main.js');

const FIELD_NAMES = [
  'name',
  'whatsapp',
  'email',
  'audience',
  'language',
  'level',
  'schedule',
  'goal',
  'consent',
];
const REQUIRED = ['name', 'whatsapp', 'audience', 'language', 'level', 'schedule', 'consent'];

const form = html.match(/<form[^>]*data-lead-form[\s\S]*?<\/form>/i)?.[0] ?? '';
const controls = form ? [...tags(form, 'input'), ...tags(form, 'select'), ...tags(form, 'textarea')] : [];
const controlFor = (name) => controls.filter((tag) => attr(tag, 'name') === name);

test('form cannot submit natively', () => {
  assert.ok(form, 'lead form must exist');
  assert.match(form, /\bnovalidate\b/);
  assert.ok(!/\baction=/.test(form), 'form must not declare an action');
  assert.ok(!/\bmethod="post"/i.test(form), 'form must not post');
  assert.ok(!/type="submit"/i.test(form), 'form must not contain a submit control');

  const submit = tags(form, 'button').find((tag) => /\bdata-submit\b/.test(tag));
  assert.ok(submit, 'demo submit button must exist');
  assert.equal(attr(submit, 'type'), 'button');
});

test('all nine fields are labelled, described, and validated inline', () => {
  assert.ok(form, 'lead form must exist');

  for (const name of FIELD_NAMES) {
    const group = controlFor(name);
    assert.ok(group.length > 0, `${name} control must exist`);

    for (const control of group) {
      const id = attr(control, 'id');
      assert.ok(id, `${name} control needs an id`);
      assert.match(form, new RegExp(`<label[^>]*for="${id}"`), `${name} control needs a label`);
      if (REQUIRED.includes(name)) {
        assert.match(control, /\brequired\b/, `${name} must be required`);
      }
      const described = (attr(control, 'aria-describedby') ?? '').split(/\s+/);
      assert.ok(described.includes(`error-${name}`), `${name} must reference error-${name}`);
    }

    const error = form.match(new RegExp(`<p[^>]*data-error-for="${name}"[^>]*>`, 'i'))?.[0];
    assert.ok(error, `inline error for ${name} must exist`);
    assert.equal(attr(error, 'id'), `error-${name}`);
    assert.match(error, /\bhidden\b/);
  }

  const formText = text(form);
  for (const label of [
    'Nama lengkap',
    'Nomor WhatsApp',
    'Email',
    'Kamu siapa',
    'Bahasa',
    'Level',
    'Jadwal favorit',
    'Tujuan belajar',
    'Saya setuju dihubungi via WhatsApp',
  ]) {
    assert.ok(formText.includes(label), `label "${label}" must appear`);
  }
});

test('choice options match the approved registration spec', () => {
  const values = (name) =>
    controls.filter((tag) => attr(tag, 'type') === 'radio' && attr(tag, 'name') === name).map(
      (tag) => attr(tag, 'value'),
    );

  assert.deepEqual(values('audience'), ['sma', 'mahasiswa', 'pekerja']);
  assert.deepEqual(values('language'), ['inggris', 'jepang', 'mandarin']);

  const selectBlock = (name) =>
    form.match(new RegExp(`<select[^>]*name="${name}"[^>]*>[\\s\\S]*?<\\/select>`, 'i'))?.[0] ?? '';
  const optionValues = (block) =>
    [...block.matchAll(/<option[^>]*value="([^"]*)"/gi)].map((match) => match[1]).filter(Boolean);

  assert.deepEqual(optionValues(selectBlock('level')), ['pemula', 'pernah-belajar', 'menengah']);
  assert.deepEqual(optionValues(selectBlock('schedule')), [
    'weekday-sore',
    'weekday-malam',
    'sabtu',
    'online',
  ]);

  const consent = controlFor('consent')[0];
  assert.ok(consent, 'consent checkbox must exist');
  assert.equal(attr(consent, 'type'), 'checkbox');
  assert.match(consent, /\brequired\b/);
});

test('success panel and program note start hidden and complete', () => {
  const panel = html.match(/<section[^>]*data-form-success[\s\S]*?<\/section>/i)?.[0] ?? '';
  assert.ok(panel, 'success panel must exist');
  assert.match(panel, /\bhidden\b/);
  assert.match(panel, /aria-live="polite"/i);
  assert.match(text(panel), /Mode demo, data tidak dikirim/);

  for (const slot of ['name', 'whatsapp', 'audience', 'language', 'level', 'schedule']) {
    assert.ok(panel.includes(`data-summary="${slot}"`), `summary slot ${slot} must exist`);
  }

  assert.match(panel, /data-dialog-open="whatsapp"/);
  assert.match(panel, /href="index\.html"/);

  const note = html.match(/<p[^>]*data-program-note[^>]*>/i)?.[0] ?? '';
  assert.ok(note, 'program note must exist');
  assert.match(note, /\bhidden\b/);
});

test('script validates locally, maps programs, and never sends data', () => {
  assert.ok(js.includes('LEAD_PROGRAMS'));
  assert.ok(js.includes('validateLeadForm'));
  assert.ok(js.includes('initLeadForm'));
  assert.ok(js.includes('normalizePhone'));
  assert.ok(js.includes('URLSearchParams'));
  assert.ok(js.includes("get('program')"));
  assert.ok(js.includes('if (!program) return;'));
  assert.ok(js.includes('showModal'));
  assert.ok(js.includes('this.initLeadForm();'));
  assert.ok(!js.includes('fetch('), 'form must not fetch');
  assert.ok(!js.includes('XMLHttpRequest'), 'form must not use XHR');

  const mapping = {
    'english-teens': ['inggris', 'weekday-sore'],
    'english-campus': ['inggris', 'weekday-malam'],
    'english-work': ['inggris', 'online'],
    'japanese-n5': ['jepang', 'sabtu'],
    'japanese-n4': ['jepang', 'sabtu'],
    'mandarin-hsk1-2': ['mandarin', 'weekday-malam'],
  };

  for (const [slug, [language, schedule]] of Object.entries(mapping)) {
    const pattern = new RegExp(
      `'${slug}'\\s*:\\s*\\{[^}]*language:\\s*'${language}'[^}]*schedule:\\s*'${schedule}'`,
    );
    assert.match(js, pattern, `${slug} must map to ${language}/${schedule}`);
  }

  for (const message of [
    'Nama minimal 2 karakter.',
    'Masukkan nomor WhatsApp Indonesia yang valid (08… atau 628…).',
    'Format email belum benar.',
    'Pilih salah satu.',
    'Pilih bahasa yang ingin dipelajari.',
    'Pilih level kamu.',
    'Pilih jadwal favorit.',
    'Maksimal 300 karakter.',
    'Kamu perlu setuju untuk dihubungi via WhatsApp.',
  ]) {
    assert.ok(js.includes(message), `message missing: ${message}`);
  }
});
