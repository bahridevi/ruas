// Uji paket @ruas-icons/ui: logika tabel dan markup aksesibel. Jalankan `npm run rakit && npm run uji`.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup as r } from 'react-dom/server';
import * as UI from '../packages/ui/index.js';

// Logika tabel: saring kolom, cari semua kolom, urut (angka, teks alami, kosong di akhir).
const kolom = [{ key: 'nama' }, { key: 'unit', options: ['A', 'B'] }, { key: 'gaji' }];
const data = [
  { nama: 'Budi Santoso', unit: 'A', gaji: 9000 },
  { nama: 'Ani', unit: 'B', gaji: 12000 },
  { nama: 'Citra', unit: 'A', gaji: null },
  { nama: 'budi 2', unit: 'B', gaji: 800 },
  { nama: 'Budi 10', unit: 'A', gaji: 800 },
];
const nama = rs => rs.map(x => x.nama);
const olah = UI.applyTableState;
assert.deepEqual(nama(olah(data, kolom, { q: 'budi' })), ['Budi Santoso', 'budi 2', 'Budi 10'], 'cari tanpa peduli huruf besar');
assert.deepEqual(nama(olah(data, kolom, { q: 'budi a' })), ['Budi Santoso', 'Budi 10'], 'semua kata harus ada, lintas kolom');
assert.deepEqual(nama(olah(data, kolom, { filters: { unit: 'B' } })), ['Ani', 'budi 2'], 'saringan pilihan = sama persis');
assert.deepEqual(nama(olah(data, kolom, { filters: { nama: 'ud', unit: '' } })), ['Budi Santoso', 'budi 2', 'Budi 10'], 'saringan teks memuat; kosong diabaikan');
assert.deepEqual(olah(data, kolom, { sort: { key: 'gaji', dir: 'asc' } }).map(x => x.gaji), [800, 800, 9000, 12000, null], 'angka naik, kosong di akhir');
assert.deepEqual(olah(data, kolom, { sort: { key: 'gaji', dir: 'desc' } }).map(x => x.gaji), [12000, 9000, 800, 800, null], 'angka turun, kosong tetap di akhir');
assert.deepEqual(nama(olah(data, kolom, { q: 'budi', sort: { key: 'nama', dir: 'asc' } })), ['budi 2', 'Budi 10', 'Budi Santoso'], 'urut teks alami (2 < 10)');
assert.equal(olah(data, kolom, {}).length, data.length);
assert.notEqual(olah(data, kolom, { sort: { key: 'gaji', dir: 'asc' } }), data, 'data asli tidak diubah');

// Isian: label terhubung, galat diumumkan, aria-invalid.
const isian = r(h(UI.Input, { label: 'Email', id: 'e', required: true, hint: 'Kantor', error: 'Email wajib diisi.' }));
assert.match(isian, /<label for="e"/);
assert.match(isian, /aria-describedby="e-hint e-error"/);
assert.match(isian, /aria-invalid="true"/);
assert.match(isian, /role="alert"[^>]*>.*Email wajib diisi\./);

// OTP: satu kotak per digit, isi otomatis SMS di kotak pertama, label per kotak.
const otp = r(h(UI.Otp, { length: 4, defaultValue: '12', name: 'kode' }));
assert.equal((otp.match(/aria-label="Digit \d dari 4"/g) || []).length, 4);
assert.equal((otp.match(/autoComplete="one-time-code"|autocomplete="one-time-code"/gi) || []).length, 1);
assert.match(otp, /type="hidden" name="kode" value="12"/);
assert.equal((otp.match(/data-terisi=""/g) || []).length, 2);

// Tab: satu tab terpilih dan bisa difokus, sisanya tabindex -1.
const tab = r(h(UI.Tabs, { label: 'Data', items: [{ id: 'a', label: 'A', content: 'isi A' }, { id: 'b', label: 'B', content: 'isi B' }] }));
assert.match(tab, /role="tablist" aria-label="Data"/);
assert.equal((tab.match(/aria-selected="true"/g) || []).length, 1);
assert.match(tab, /tabindex="-1"/);
assert.match(tab, /isi A/);
assert.doesNotMatch(tab, /isi B/);

// Pilihan: fieldset + legend; pilih semua muncul.
const centang = r(h(UI.CheckboxGroup, { label: 'Hak akses', selectAll: true, defaultValue: ['x'], options: [{ value: 'x', label: 'X' }, { value: 'y', label: 'Y' }] }));
assert.match(centang, /<fieldset[^>]*><legend class="ruas-label">Hak akses/);
assert.match(centang, /Pilih semua/);
assert.equal((centang.match(/checked=""/g) || []).length, 1);
const radio = r(h(UI.RadioGroup, { label: 'Mode', variant: 'segmented', defaultValue: 'b', options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] }));
assert.match(radio, /class="ruas-seg"/);
assert.equal((radio.match(/checked=""/g) || []).length, 1);

// Bagian: tombol kepala dengan aria-expanded; tertutup = isi hidden.
const bab = r(h(UI.Section, { title: 'Ringkasan', defaultOpen: false, printable: true }, 'isi'));
assert.match(bab, /aria-expanded="false"/);
assert.match(bab, /hidden=""/);
assert.match(bab, /Cetak/);

// Tabel: nomor urut, x dari y, paginasi, judul urut, baris saring.
const baris = Array.from({ length: 23 }, (_, i) => ({ id: i, nama: `Orang ${i + 1}`, unit: i % 2 ? 'A' : 'B' }));
const tabel = r(h(UI.DataTable, { title: 'Karyawan', rowKey: 'id', rows: baris, columns: [{ key: 'nama', label: 'Nama', sortable: true, filter: true }, { key: 'unit', label: 'Unit', filter: true, options: ['A', 'B'] }] }));
assert.match(tabel, /23 dari 23/);
assert.match(tabel, /1–10 dari 23/);
assert.match(tabel, /Halaman 1 dari 3/);
assert.match(tabel, /aria-sort="none"/);
assert.match(tabel, /aria-label="Saring Nama"/);
assert.match(tabel, /Orang 10<\/td>/);
assert.doesNotMatch(tabel, /Orang 11<\/td>/);
assert.match(tabel, /Buka semua/);
const server = r(h(UI.DataTable, { title: 'X', rows: baris.slice(0, 10), total: 500, grandTotal: 900, columns: [{ key: 'nama', label: 'Nama' }] }));
assert.match(server, /500 dari 900/);
assert.match(server, /Halaman 1 dari 50/);
assert.doesNotMatch(server, /Cetak hasil saringan/, 'mode server tanpa fetchAllRows: tombol disembunyikan');
assert.match(r(h(UI.DataTable, { title: 'X', rows: [], columns: [{ key: 'nama', label: 'Nama' }] })), /Belum ada data\./);


// Tabel: baris rincian (detail), baris total (footer, dari semua hasil saringan), saringan tambahan.
const rinci = r(h(UI.DataTable, { title: 'Kas', rowKey: 'id', rows: baris, columns: [{ key: 'nama', label: 'Nama' }, { key: 'unit', label: 'Unit' }],
  detail: x => `rincian ${x.nama}`, footer: rs => ({ nama: 'Total', unit: rs.length }), filters: h('span', null, 'Periode'), filtersActive: 1 }));
assert.match(rinci, /aria-expanded="false" aria-label="Buka rincian"/);
assert.doesNotMatch(rinci, /rincian Orang 1</, 'rincian tertutup saat awal');
assert.match(rinci, /Buka semua rincian/);
assert.match(rinci, /<tfoot><tr><td class="ruas-buka"><\/td><td class="ruas-no"><\/td><td[^>]*>Total<\/td><td[^>]*>23<\/td>/, 'total dari semua 23 baris, bukan hanya halaman');
assert.match(rinci, /ruas-saringan-lain[^>]*><span>Periode/);
assert.match(rinci, /1 saringan aktif/);

// Kaki beberapa baris, kop/tanda tangan hanya tercetak, ringkasan & saringan tidak tercetak.
const kaki2 = r(h(UI.DataTable, { title: 'Kas', rows: baris, columns: [{ key: 'nama', label: 'Nama' }], summary: 'ringkas',
  footer: () => [{ nama: 'Total' }, { nama: 'Arus bersih' }], printHeader: 'KOP', printFooter: 'TTD' }));
assert.equal((kaki2.match(/<tfoot>.*<\/tfoot>/)[0].match(/<tr>/g) || []).length, 2, 'footer larik = dua baris');
assert.match(kaki2, /class="ruas-cetak-saja">KOP</);
assert.match(kaki2, /class="ruas-cetak-saja">TTD</);
assert.equal((kaki2.match(/ruas-noprint/g) || []).length >= 2, true);
assert.match(r(h(UI.DataTable, { title: 'X', rows: baris, columns: [{ key: 'nama', label: 'Nama' }], rowClassName: x => x.id === 0 ? 'merah' : '' })), /<tr class="merah">/, 'rowClassName');
assert.equal(olah([{ a: h('b', null, 'x') }, { a: 'object' }], [{ key: 'a' }], { q: 'object' }).length, 1, 'elemen React tidak dicari sebagai [object Object]');
assert.match(r(h(UI.Badge, { size: 'sm', tone: 'success' }, 'x')), /class="ruas-badge ruas-badge-success ruas-badge-sm"/, 'badge kecil');
assert.doesNotMatch(r(h(UI.DataTable, { title: 'X', rows: baris, columns: [{ key: 'nama', label: 'Nama' }], searchable: false })), /type="search" [^>]*placeholder="Ketik untuk mencari/, 'kotak cari bisa disembunyikan');
// Lightning CSS (Tailwind 4) menggabung `font: ... sans-serif; font-family: inherit` jadi `font: ... inherit` yang tidak sah: pakai longhand.
assert.doesNotMatch(readFileSync(new URL('../packages/ui/ruas-ui.css', import.meta.url), 'utf8'), /font:[^;]*;s*font-family:s*inherit/, 'shorthand font + inherit dilarang');
// Pohon: tingkat lewat --tingkat, tombol beraria; daun tanpa tombol. Dialog: tertutup = kosong; terbuka = judul terhubung, tombol Tutup, form bila onSubmit.
assert.match(r(h(UI.TreeCell, { depth: 2, expanded: true, onToggle: () => {}, label: '11' }, '11')), /style="--tingkat:2".*aria-expanded="true" aria-label="Gulung 11"/);
assert.doesNotMatch(r(h(UI.TreeCell, { depth: 1 }, '1111')), /<button/);
assert.doesNotMatch(r(h(UI.Dialog, { open: false, title: 'X' }, 'isi rahasia')), /isi rahasia/, 'dialog tertutup tidak merender isi');
const dlg = r(h(UI.Dialog, { open: true, title: 'Tambah', description: 'Catat kas', onSubmit: () => {}, footer: h(UI.Button, { type: 'submit' }, 'Simpan') }, 'isi'));
assert.match(dlg, /<dialog [^>]*class="ruas-dialog ruas-dialog-md"/);
assert.match(dlg, /aria-labelledby="([^"]+)".*<h2 id="\1"/);
assert.match(dlg, /<form class="ruas-dialog-kotak">/);
assert.match(dlg, /aria-label="Tutup"/);
assert.doesNotMatch(r(h(UI.Dialog, { open: true, title: 'X', dismissible: false }, 'i')), /aria-label="Tutup"/);
assert.match(r(h(UI.Button, { icon: h('svg'), 'aria-label': 'Ubah' })), /ruas-btn-ikon/, 'tombol ikon saja');
assert.doesNotMatch(r(h(UI.Button, { icon: h('svg') }, 'Simpan')), /ruas-btn-ikon/);
assert.match(r(h(UI.Dialog, { open: true, title: 'X', alert: 'Gagal menyimpan.' }, 'i')), /role="alert".*Gagal menyimpan./, 'galat di dalam dialog');
assert.match(readFileSync(new URL('../packages/ui/ruas-ui.css', import.meta.url), 'utf8'), /.ruas-dialog {[^}]*margin: auto !important/, 'modal tetap di tengah walau induk memakai space-y-*');
// Alert: danger/warning dibacakan segera, info sebagai status. Stat: label, nilai, aksi di kaki.
assert.match(r(h(UI.Alert, { tone: 'danger', title: 'Gagal' }, 'x')), /role="alert" class="ruas-alert ruas-alert-danger"/);
assert.match(r(h(UI.Alert, { title: 'Info' }, 'x')), /role="status"/);
assert.match(r(h(UI.Stat, { label: 'Saldo', value: 'Rp 1', tone: 'info', action: h('a', { href: '/x' }, 'Kelola') })), /ruas-stat ruas-stat-info.*Saldo.*Rp 1.*ruas-stat-aksi.*href="\/x"/);
console.log('✓ @ruas-icons/ui: logika tabel dan markup aksesibel lolos uji');
