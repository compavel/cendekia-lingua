import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
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

const forbidden = ['docs', 'tests', 'figma-import', 'scripts', '.git', '.superpowers', 'node_modules'];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const file of files) {
  const source = resolve(root, file);
  if (!existsSync(source)) {
    throw new Error(`Missing required file: ${file}`);
  }
  cpSync(source, resolve(dist, file));
}

for (const directory of directories) {
  const source = resolve(root, directory);
  if (!existsSync(source)) {
    throw new Error(`Missing required directory: ${directory}`);
  }
  cpSync(source, resolve(dist, directory), { recursive: true });
}

for (const name of forbidden) {
  if (existsSync(resolve(dist, name))) {
    throw new Error(`Refusing to publish ${name} in dist/`);
  }
}

console.log(`dist ready: ${dist}`);
