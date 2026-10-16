// Penjaga falsafah: memeriksa setiap ikon di icons/ terhadap aturan Falsafah Ruas (docs/falsafah_id.html).
// Jalankan: npm run penjaga. Keluar dengan kode 1 bila ada ikon yang gagal.
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svgPathBbox } from 'svg-path-bbox';

export const KEPALA = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">';
const PERAN = new Set(['badan', 'detail', 'aksen', 'padat']);
// Klasifikasi (bab 16 falsafah). Urutan di sini = urutan tampil di galeri. Kategori baru hanya lewat RFC.
export const KATEGORI = {
  navigasi: { nama: 'Navigasi & Panah', en: 'Navigation', kelompok: 'inti' },
  aksi: { nama: 'Aksi & Sunting', en: 'Actions', kelompok: 'inti' },
  berkas: { nama: 'Berkas & Dokumen', en: 'Files', kelompok: 'inti' },
  komunikasi: { nama: 'Komunikasi', en: 'Communication', kelompok: 'inti' },
  pengguna: { nama: 'Pengguna & Akun', en: 'People', kelompok: 'inti' },
  status: { nama: 'Status & Peringatan', en: 'Status', kelompok: 'inti' },
  keamanan: { nama: 'Keamanan', en: 'Security', kelompok: 'inti' },
  perangkat: { nama: 'Perangkat & Sistem', en: 'Devices', kelompok: 'inti' },
  media: { nama: 'Media', en: 'Media', kelompok: 'inti' },
  waktu: { nama: 'Waktu & Kalender', en: 'Time', kelompok: 'inti' },
  data: { nama: 'Data & Grafik', en: 'Data & Charts', kelompok: 'inti' },
  keuangan: { nama: 'Keuangan & Akuntansi', en: 'Finance & Accounting', kelompok: 'bidang' },
  niaga: { nama: 'Niaga & Gudang', en: 'Commerce & Inventory', kelompok: 'bidang' },
  kesehatan: { nama: 'Kesehatan & Psikologi', en: 'Health & Psychology', kelompok: 'bidang' },
  sains: { nama: 'Sains & Teknologi', en: 'Science & Technology', kelompok: 'bidang' },
  pendidikan: { nama: 'Pendidikan & Humaniora', en: 'Education & Humanities', kelompok: 'bidang' },
  keagamaan: { nama: 'Keagamaan', en: 'Religion', kelompok: 'bidang' },
  pemerintahan: { nama: 'Pemerintahan & Hukum', en: 'Government & Law', kelompok: 'bidang' },
  bangunan: { nama: 'Tempat & Bangunan', en: 'Places & Buildings', kelompok: 'bidang' },
  transportasi: { nama: 'Transportasi & Peta', en: 'Transport & Maps', kelompok: 'bidang' },
  alam: { nama: 'Alam, Cuaca & Pertanian', en: 'Nature, Weather & Farming', kelompok: 'bidang' },
};
// Seri: penanda lintas kategori (mis. Nusantara). Seri rumah-adat wajib asal dan ciri.
export const SERI = {
  'rumah-adat': { nama: 'Rumah Adat Nusantara', en: 'Indonesian Traditional Houses' },
  psikometri: { nama: 'Model Psikometri', en: 'Psychometric Models' },
  medsos: { nama: 'Web & Media Sosial', en: 'Web & Social Media' },
  pajak: { nama: 'Perpajakan', en: 'Taxation' },
};
const GERAK = new Set(['denyut', 'tambah', 'turun', 'buka', 'ketik', 'cari']);
const ATRIBUT = { path: ['class', 'd'], circle: ['class', 'cx', 'cy', 'r'], g: ['transform'] };
const DIR = new URL('../icons/', import.meta.url);

const kelipatan = n => Number.isInteger(+(n * 4).toFixed(6));
const putar = ([x0, y0, x1, y1], deg, cx, cy) => {
  const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
  const t = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]);
  return [Math.min(...t.map(p => p[0])), Math.min(...t.map(p => p[1])), Math.max(...t.map(p => p[0])), Math.max(...t.map(p => p[1]))];
};

export function periksa(id, svg, meta) {
  const salah = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) salah.push('nama berkas harus huruf kecil berpola benda-pengubah, mis. user-plus');
  if (!svg.startsWith(KEPALA)) salah.push('tag <svg> pembuka harus persis sama dengan kepala baku (viewBox 0 0 24 24, garis 1,5 bulat, currentColor)');
  if (Buffer.byteLength(svg) > 1024) salah.push(`Berongga: berkas ${Buffer.byteLength(svg)} byte, maksimal 1024`);

  const tag = [...svg.matchAll(/<\/?([a-z]+)\b([^>]*?)\/?>/g)];
  let putaran = null, elemen = 0;
  const kotak = [];
  for (const [utuh, nama, atr] of tag) {
    if (nama === 'svg') continue;
    if (!ATRIBUT[nama]) { salah.push(`elemen <${nama}> tidak diizinkan (hanya path, circle, g)`); continue; }
    if (utuh.startsWith('</')) { if (nama === 'g') putaran = null; continue; }
    const a = Object.fromEntries([...atr.matchAll(/([a-z-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
    for (const k of Object.keys(a)) if (!ATRIBUT[nama].includes(k)) salah.push(`atribut ${k} pada <${nama}> tidak diizinkan (warna dan gaya diatur dari luar)`);
    if (nama === 'g') {
      const m = /^rotate\((-?[\d.]+) 12 12\)$/.exec(a.transform || '');
      if (!m) salah.push('<g> hanya boleh transform="rotate(sudut 12 12)"');
      else putaran = +m[1];
      continue;
    }
    elemen++;
    for (const p of (a.class || '').split(' ').filter(Boolean)) if (!PERAN.has(p)) salah.push(`peran "${p}" tidak dikenal (badan, detail, aksen, padat)`);
    const angka = nama === 'path' ? (a.d.match(/-?\d*\.?\d+/g) || []).map(Number) : [a.cx, a.cy, a.r].map(Number);
    if (!angka.every(kelipatan)) salah.push(`Beruas: ada koordinat bukan kelipatan 0,25 pada <${nama}>`);
    let b = nama === 'path' ? svgPathBbox(a.d) : [a.cx - a.r, a.cy - a.r, +a.cx + +a.r, +a.cy + +a.r];
    if (putaran !== null) b = putar(b, putaran, 12, 12);
    kotak.push(b);
  }
  if (elemen > 4) salah.push(`Berongga: ${elemen} elemen, maksimal 4`);
  if (kotak.length) {
    const [x0, y0, x1, y1] = [Math.min(...kotak.map(b => b[0])), Math.min(...kotak.map(b => b[1])), Math.max(...kotak.map(b => b[2])), Math.max(...kotak.map(b => b[3]))];
    if (x0 < 1.99 || y0 < 1.99 || x1 > 22.01 || y1 > 22.01) salah.push(`Beruas: bentuk keluar dari area aktif 2–22 (${[x0, y0, x1, y1].map(n => +n.toFixed(2)).join(', ')})`);
  }

  if (!meta) return [...salah, `berkas keterangan icons/${id}.json tidak ada`];
  if (typeof meta.nama !== 'string' || !meta.nama) salah.push('keterangan: "nama" (bahasa Indonesia) wajib diisi');
  if (!KATEGORI[meta.kategori]) salah.push(`keterangan: kategori "${meta.kategori}" tidak dikenal (${Object.keys(KATEGORI).join(', ')})`);
  if (meta.juga !== undefined) {
    const j = meta.juga;
    if (!Array.isArray(j) || !j.length || j.length > 2) salah.push('keterangan: "juga" berisi 1–2 kategori tambahan');
    else for (const k of j) if (!KATEGORI[k] || k === meta.kategori || j.indexOf(k) !== j.lastIndexOf(k)) salah.push(`keterangan: kategori tambahan "${k}" tidak dikenal, ganda, atau sama dengan kategori utama`);
  }
  if (meta.seri !== undefined && !SERI[meta.seri]) salah.push(`keterangan: seri "${meta.seri}" tidak dikenal (${Object.keys(SERI).join(', ')})`);
  if (!Array.isArray(meta.tag) || !meta.tag.length) salah.push('keterangan: "tag" wajib berisi kata kunci ID dan EN');
  if (meta.gerak && !GERAK.has(meta.gerak)) salah.push(`keterangan: gerak "${meta.gerak}" tidak dikenal`);
  if (meta.gerak && !svg.includes('aksen')) salah.push('Aksen Makna: gerak hanya untuk ikon yang punya bagian aksen');
  if (meta.seri === 'rumah-adat' && !(meta.asal?.provinsi && meta.asal?.wilayah && meta.ciri)) salah.push('keterangan: seri rumah adat wajib punya asal.provinsi, asal.wilayah, dan ciri');
  return salah;
}

export function bacaSemua() {
  const berkas = readdirSync(DIR);
  const id = [...new Set(berkas.map(f => f.replace(/\.(svg|json)$/, '')))].sort();
  return id.map(i => {
    const svg = berkas.includes(i + '.svg') ? readFileSync(new URL(i + '.svg', DIR), 'utf8') : '';
    let meta = null;
    try { meta = berkas.includes(i + '.json') ? JSON.parse(readFileSync(new URL(i + '.json', DIR), 'utf8')) : null; }
    catch (e) { meta = { rusak: e.message }; }
    const salah = svg ? periksa(i, svg, meta) : [`berkas icons/${i}.svg tidak ada`];
    if (meta?.rusak) salah.push(`keterangan JSON rusak: ${meta.rusak}`);
    return { id: i, svg, meta, salah };
  });
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const semua = bacaSemua(), gagal = semua.filter(i => i.salah.length);
  for (const i of gagal) console.log(`✗ ${i.id}\n  - ${i.salah.join('\n  - ')}`);
  console.log(gagal.length ? `\n${gagal.length} dari ${semua.length} ikon gagal.` : `✓ ${semua.length} ikon lolos penjaga falsafah.`);
  process.exit(gagal.length ? 1 : 0);
}
