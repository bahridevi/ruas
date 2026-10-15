// Perakit: menjalankan penjaga, lalu menghasilkan dist/ (svg per ikon, sprite, css, json, js untuk situs).
// Jalankan: npm run rakit
import { mkdirSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { bacaSemua, KEPALA } from './penjaga.mjs';

const semua = bacaSemua(), gagal = semua.filter(i => i.salah.length);
if (gagal.length) {
  for (const i of gagal) console.log(`✗ ${i.id}\n  - ${i.salah.join('\n  - ')}`);
  console.log(`\nPerakitan dibatalkan: ${gagal.length} ikon gagal penjaga falsafah.`);
  process.exit(1);
}

const dist = new URL('../dist/', import.meta.url);
rmSync(dist, { recursive: true, force: true });
mkdirSync(new URL('svg/', dist), { recursive: true });

const ringkas = svg => svg.replace(/>\s+</g, '><').trim();
const isi = svg => ringkas(svg).slice(KEPALA.length, -'</svg>'.length);

const data = semua.map(i => {
  const berkas = ringkas(i.svg);
  writeFileSync(new URL(`svg/${i.id}.svg`, dist), berkas + '\n');
  return { id: i.id, ...i.meta, isi: isi(i.svg), byte: Buffer.byteLength(berkas) };
});

writeFileSync(new URL('sprite.svg', dist), `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${data.map(d => `<symbol id="ruas-${d.id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d.isi}</symbol>`).join('\n')}\n</svg>\n`);
writeFileSync(new URL('ruas.json', dist), JSON.stringify(data, null, 2) + '\n');
writeFileSync(new URL('ruas.js', dist), `window.RUAS = ${JSON.stringify(data)};\n`);
copyFileSync(new URL('../ruas.css', import.meta.url), new URL('ruas.css', dist));

const rerata = Math.round(data.reduce((a, d) => a + d.byte, 0) / data.length);
console.log(`✓ ${data.length} ikon dirakit ke dist/ · rata-rata ${rerata} byte per ikon (target ≤ 400)`);
