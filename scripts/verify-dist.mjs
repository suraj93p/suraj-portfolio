import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { loadConfig } from './load-config.mjs';
const config = await loadConfig();
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const html = await readFile(`${root}/index.html`, 'utf8');
assert(html.includes(config.profile.name), 'Name missing from HTML metadata/fallback');
assert(html.includes('<noscript>'), 'No-JavaScript fallback missing');
assert(!html.includes('<!-- portfolio:noscript -->'), 'Fallback not generated');
const required = ['favicon.svg', config.pwa.appleTouchIcon, config.site.socialImage.path, 'robots.txt', ...config.pwa.icons.map((icon) => icon.src)];
if (config.features.pwa) required.push('sw.js', 'manifest.webmanifest');
for (const file of required) assert((await stat(`${root}/${file}`)).size > 0, `Missing asset: ${file}`);
if (config.features.pwa) {
  const manifest = JSON.parse(await readFile(`${root}/manifest.webmanifest`, 'utf8'));
  assert.equal(manifest.name, config.pwa.name);
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.scope, './');
  assert.equal(manifest.start_url, './');
  assert(manifest.icons.some((icon) => icon.purpose === 'maskable'));
  assert(manifest.icons.some((icon) => icon.sizes === '192x192'));
  assert(manifest.icons.some((icon) => icon.sizes === '512x512'));
  const baseUrl = `https://validation.invalid${config.site.basePath}`;
  for (const icon of manifest.icons) assert(new URL(icon.src, baseUrl).pathname.startsWith(config.site.basePath));
}
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const url = match[1];
  if (/^(?:https:|mailto:|#)/.test(url)) continue;
  assert(url.startsWith(config.site.basePath), `Asset not under base: ${url}`);
  const path = url.slice(config.site.basePath.length).split(/[?#]/)[0];
  if (path) assert((await stat(`${root}/${path}`)).isFile(), `HTML references missing file: ${path}`);
}
const files = await readdir(root, { recursive: true });
for (const file of files) assert(!/\.(pdf|map|tsx?|md)$|portfolio\.config|content-and-evidence|node_modules|package(?:-lock)?\.json/i.test(file), `Private/source file in dist: ${file}`);
assert(!/href=["']tel:/i.test(html), 'Unexpected public telephone link');
console.log(`Verified production metadata, base paths and ${required.length} required assets. Offline behaviour requires browser tests.`);
