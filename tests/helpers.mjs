import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const pages = [
  'index.html',
  'program.html',
  'daftar.html',
  'wireframe.html',
  'style-guide.html',
];

export const read = (path) => readFileSync(resolve(root, path), 'utf8');

export const tags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => match[0]);

export const attr = (tag, name) =>
  tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? null;

export const text = (html) =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
