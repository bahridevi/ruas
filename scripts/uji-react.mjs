// Uji paket @ruas-icons/react hasil rakit: jalankan `npm run rakit && npm run uji`.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as Ruas from '../packages/react/dist/index.js';

const data = JSON.parse(readFileSync(new URL('../dist/ruas.json', import.meta.url)));
assert.equal(Object.keys(Ruas).length, data.length, 'satu komponen per ikon');

const hias = renderToStaticMarkup(h(Ruas.MosqueDome));
assert.match(hias, /^<svg [^>]*width="24"[^>]*aria-hidden="true"/);
assert.ok(hias.includes(data.find(d => d.id === 'mosque-dome').isi), 'isi ikon utuh');

const berlabel = renderToStaticMarkup(h(Ruas.MosqueDome, { size: 32, title: 'Masjid <A&B>', className: 'ruas-aksen' }));
assert.match(berlabel, /role="img"/);
assert.doesNotMatch(berlabel, /aria-hidden/);
assert.match(berlabel, /class="ruas-aksen"/);
assert.match(berlabel, /width="32"/);
assert.match(berlabel, /<title>Masjid &#60;A&#38;B&#62;<\/title>/, 'judul di-escape');

const dts = readFileSync(new URL('../packages/react/dist/index.d.ts', import.meta.url), 'utf8');
for (const k of Object.keys(Ruas)) assert.ok(dts.includes(`export declare const ${k}: RuasIcon;`), `tipe ${k}`);

console.log(`✓ @ruas-icons/react: ${data.length} komponen lolos uji`);
