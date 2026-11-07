import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

const files = [
  'index.html',
  'program.html',
  'daftar.html',
  'wireframe.html',
  'style-guide.html',
  'robots.txt',
];

const directories = ['css', 'js', 'assets'];

const allowedRootEntries = new Set([...files, ...directories]);

const source = (name) => resolve(root, name);

// Validate before touching dist so a missing input cannot leave a half-written deploy.
for (const file of [...files, ...directories]) {
  if (!existsSync(source(file))) {
    throw new Error(`Missing required source: ${file}`);
  }
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const file of files) {
  cpSync(source(file), resolve(dist, file));
}

for (const directory of directories) {
  cpSync(source(directory), resolve(dist, directory), { recursive: true });
}

for (const entry of readdirSync(dist)) {
  if (!allowedRootEntries.has(entry)) {
    throw new Error(`Refusing unexpected entry in dist/: ${entry}`);
  }
}

console.log(`dist ready: ${dist}`);
