// Perakit: menjalankan penjaga, lalu menghasilkan dist/ (svg per ikon, sprite, css, json, js untuk situs).
// Jalankan: npm run rakit
import { mkdirSync, rmSync, writeFileSync, copyFileSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { bacaSemua, KEPALA, KATEGORI, SERI } from './penjaga.mjs';

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
writeFileSync(new URL('ruas.js', dist), `window.RUAS = ${JSON.stringify(data)};\nwindow.RUAS_KATEGORI = ${JSON.stringify(KATEGORI)};\nwindow.RUAS_SERI = ${JSON.stringify(SERI)};\n`);
copyFileSync(new URL('../ruas.css', import.meta.url), new URL('ruas.css', dist));
// Teks lisensi MIT ikut disajikan agar pemakai bisa menyertakannya walau repo tidak publik.
copyFileSync(new URL('../LICENSE', import.meta.url), new URL('LICENSE.txt', dist));
// Peta situs untuk mesin pencari: galeri, falsafah, dan satu alamat per ikon (?ikon=<id>).
const SITUS = 'https://ruas.metabahri.com';
const alamat = ['/site/', '/site/?lang=en', '/site/ui.html', ...['en', 'zh', 'ja', 'ru', 'ar', 'ur'].map(b => '/site/ui.html?lang=' + b), '/docs/falsafah_id.html', '/docs/falsafah_en.html', ...data.map(d => `/site/?ikon=${d.id}`)];
// Galeri: alamat ruas.js/css/svg diberi ?v=<sidik isi> agar browser dan Cloudflare langsung memakai versi baru.
const versi = createHash('sha1').update(readFileSync(new URL('ruas.js', dist))).update(readFileSync(new URL('ruas.css', dist))).digest('hex').slice(0, 10);
writeFileSync(new URL('../site/index.html', import.meta.url), readFileSync(new URL('../site/galeri.html', import.meta.url), 'utf8').replaceAll('__VERSI__', versi));
writeFileSync(new URL('sitemap.xml', dist), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${alamat.map(a => `  <url><loc>${SITUS}${a}</loc></url>`).join('\n')}\n</urlset>\n`);

// Paket @ruas-icons/react: satu komponen per ikon (id kebab → PascalCase), tanpa langkah build.
const reactDist = new URL('../packages/react/dist/', import.meta.url);
rmSync(reactDist, { recursive: true, force: true });
mkdirSync(reactDist, { recursive: true });
const komponen = id => id.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
writeFileSync(new URL('index.js', reactDist), `import { createElement as h, forwardRef } from 'react';
const esc = s => String(s).replace(/[&<>"]/g, c => '&#' + c.charCodeAt(0) + ';');
// Tanpa title/aria-label ikon dianggap hiasan (aria-hidden); dengan itu ia menjadi role="img".
const buat = (nama, isi) => {
  const K = forwardRef(({ size = 24, title, strokeWidth = 1.5, ...p }, ref) => h('svg', {
    ref, xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
    strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', ...(title || p['aria-label'] ? { role: 'img' } : { 'aria-hidden': true }), ...p,
    dangerouslySetInnerHTML: { __html: (title ? '<title>' + esc(title) + '</title>' : '') + isi },
  }));
  K.displayName = nama;
  return K;
};
${data.map(d => `export const ${komponen(d.id)} = /* @__PURE__ */ buat('${komponen(d.id)}', ${JSON.stringify(d.isi)});`).join('\n')}
`);
writeFileSync(new URL('index.d.ts', reactDist), `import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
export interface RuasProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'children'> { size?: number | string; title?: string }
export type RuasIcon = ForwardRefExoticComponent<RuasProps & RefAttributes<SVGSVGElement>>;
${data.map(d => `/** ${d.nama} · ${d.en} */\nexport declare const ${komponen(d.id)}: RuasIcon;`).join('\n')}
`);
copyFileSync(new URL('../LICENSE', import.meta.url), new URL('../packages/react/LICENSE', import.meta.url));

// Paket @ruas-icons/ui ditulis tangan; dist/ui dan dist/react disajikan untuk halaman contoh site/ui.html (dirakit dari site/ui-contoh.html).
copyFileSync(new URL('../LICENSE', import.meta.url), new URL('../packages/ui/LICENSE', import.meta.url));
for (const [asal, ke] of [['../packages/ui/index.js', 'ui/index.js'], ['../packages/ui/ruas-ui.css', 'ui/ruas-ui.css'], ['../packages/ui/bahasa.js', 'ui/bahasa.js'], ['../packages/ui/ruas-font.css', 'ui/ruas-font.css'], ['../packages/ui/fonts/ruas-angka.woff', 'ui/fonts/ruas-angka.woff'], ['../packages/react/dist/index.js', 'react/index.js']]) {
  mkdirSync(new URL('.', new URL(ke, dist)), { recursive: true });
  copyFileSync(new URL(asal, import.meta.url), new URL(ke, dist));
}
// Halaman contoh: seperti galeri, alamat CSS/JS diberi ?v=<sidik isi> agar cache lama (4 jam) tidak memuat paket versi sebelumnya.
const kamusUi = readdirSync(new URL('../site/ui-bahasa/', import.meta.url)).sort().map(b => readFileSync(new URL('../site/ui-bahasa/' + b, import.meta.url)));
const versiUi = kamusUi.reduce((x, b) => x.update(b), createHash('sha1')).update(readFileSync(new URL('ui/index.js', dist))).update(readFileSync(new URL('ui/ruas-ui.css', dist))).update(readFileSync(new URL('react/index.js', dist))).update(readFileSync(new URL('ui/bahasa.js', dist))).update(readFileSync(new URL('ui/ruas-font.css', dist))).digest('hex').slice(0, 10);
writeFileSync(new URL('../site/ui.html', import.meta.url), readFileSync(new URL('../site/ui-contoh.html', import.meta.url), 'utf8').replaceAll('__VERSI__', versiUi));

const rerata = Math.round(data.reduce((a, d) => a + d.byte, 0) / data.length);
console.log(`✓ ${data.length} ikon dirakit ke dist/ · rata-rata ${rerata} byte per ikon (target ≤ 400)`);
