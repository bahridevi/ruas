// Rekap pengunjung & unduhan dari log nginx Ruas (deploy/nginx-ruas.conf, format "ruas").
// Dijalankan cron di VPS: node scripts/statistik.mjs [berkas-log...]  (bawaan /var/log/nginx/ruas.log*)
// Hasil di /var/lib/ruas-stat: umum.json (publik: dilihat, diunduh) dan privat/ (rincian, berkata sandi).
// Log nginx hanya disimpan 14 hari, jadi rekap per hari disimpan di harian.json dan digabung setiap kali jalan.
// Tidak menyimpan IP: pengunjung unik dihitung dari sidik (IP + browser) per hari, lalu hanya jumlahnya yang disimpan.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync, existsSync, renameSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const KELUAR = process.env.RUAS_STAT || '/var/lib/ruas-stat';
const LOG = '/var/log/nginx';
const berkas = process.argv.length > 2 ? process.argv.slice(2) : readdirSync(LOG).filter(f => /^ruas\.log(\.\d+)?(\.gz)?$/.test(f)).map(f => `${LOG}/${f}`);

const BOT = /bot|crawl|spider|slurp|curl|wget|python|go-http|headless|scan|httpclient|java\/|okhttp|axios|libwww|facebookexternalhit|preview|monitor|uptime|zgrab|masscan/i;
const HALAMAN = /^\/(site\/(index\.html)?|docs\/[\w-]+\.html)$/;
const API = /^\/dist\/(ruas\.json|ruas\.js|ruas\.css|sprite\.svg)$/;
const SENDIRI = 'ruas.metabahri.com';

const baru = {};
const unik = {};
const hari = t => (baru[t] ??= { lihat: 0, unik: 0, unduh: 0, salin: 0, bagikan: 0, api: 0, bot: 0, negara: {}, perujuk: {}, halaman: {}, ikon: {} });
const tambah = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };

for (const f of berkas) {
  let isi;
  try { isi = readFileSync(f); } catch (e) { console.error(`Gagal membaca ${f}: ${e.message}`); continue; }
  if (f.endsWith('.gz')) isi = gunzipSync(isi);
  for (const baris of isi.toString('utf8').split('\n')) {
    const [waktu, ip, negara, metode, uri, status, perujuk, ua] = baris.split('\t');
    if (!ua && !uri) continue;
    const t = waktu.slice(0, 10);
    const [jalur, kueri = ''] = uri.split('?');
    const d = hari(t);
    const ok = status === '200' || status === '304';
    // Pemakaian langsung (mis. skrip sinkron aplikasi) dihitung sebelum saring bot
    if (metode === 'GET' && ok && API.test(jalur) && !perujuk.includes(SENDIRI)) { tambah(d.halaman, jalur); d.api++; continue; }
    if (!ua || ua === '-' || BOT.test(ua) || status === '404') { d.bot++; continue; }
    const id = (jalur.match(/^\/dist\/svg\/([a-z0-9-]+)\.svg$/) || [])[1];
    if (metode === 'POST' && jalur === '/stat/hit') {
      const q = new URLSearchParams(kueri);
      const e = q.get('e'), ikon = (q.get('id') || '').replace(/[^a-z0-9-]/g, '').slice(0, 60);
      if (e === 'salin-tautan') d.bagikan++;
      else if (/^salin-(svg|jsx|sprite)$/.test(e)) { d.salin++; if (ikon) tambah(d.ikon[ikon] ??= {}, 'salin'); }
      continue;
    }
    if (metode !== 'GET' || !ok) continue;
    if (id) { d.unduh++; tambah(d.ikon[id] ??= {}, 'unduh'); continue; }
    if (!HALAMAN.test(jalur)) continue;
    d.lihat++;
    tambah(d.halaman, jalur);
    if (negara && negara !== '-') tambah(d.negara, negara);
    try { const h = new URL(perujuk).hostname; if (h !== SENDIRI) tambah(d.perujuk, h); } catch { tambah(d.perujuk, '(langsung)'); }
    (unik[t] ??= new Set()).add(createHash('sha256').update(ip + ua).digest('hex').slice(0, 16));
  }
}
for (const [t, s] of Object.entries(unik)) baru[t].unik = s.size;

mkdirSync(`${KELUAR}/privat`, { recursive: true });
const jalurHarian = `${KELUAR}/harian.json`;
const lama = existsSync(jalurHarian) ? JSON.parse(readFileSync(jalurHarian, 'utf8')) : {};
const harian = Object.fromEntries(Object.entries({ ...lama, ...baru }).sort(([a], [b]) => a.localeCompare(b)));
const tulis = (p, o) => { writeFileSync(p + '.tmp', JSON.stringify(o)); renameSync(p + '.tmp', p); };
const jumlah = k => Object.values(harian).reduce((s, d) => s + d[k], 0);
const diperbarui = new Date().toISOString();

tulis(jalurHarian, harian);
tulis(`${KELUAR}/umum.json`, { dilihat: jumlah('lihat'), diunduh: jumlah('unduh') + jumlah('salin'), diperbarui });
tulis(`${KELUAR}/privat/data.json`, { diperbarui, harian });
copyFileSync(new URL('../deploy/statistik.html', import.meta.url), `${KELUAR}/privat/index.html`);
console.log(`${diperbarui} · ${Object.keys(baru).length} hari dari ${berkas.length} log · dilihat ${jumlah('lihat')} · diunduh ${jumlah('unduh') + jumlah('salin')}`);
