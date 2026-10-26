// Uji paket @ruas-icons/ui: logika tabel dan markup aksesibel. Jalankan `npm run rakit && npm run uji`.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
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

// Tabel lanjut: pilih baris, sembunyikan kolom, CSV aman untuk Excel, kerangka memuat.
const lanjut = r(h(UI.DataTable, { title: 'K', rowKey: 'id', rows: baris, selectable: true, columnToggle: true, exportable: true,
  columns: [{ key: 'nama', label: 'Nama' }, { key: 'unit', label: 'Unit', hidden: true }] }));
assert.match(lanjut, /aria-label="Pilih semua baris di halaman ini"/);
assert.equal((lanjut.match(/aria-label="Pilih baris \d+"/g) || []).length, 10, 'centang per baris di halaman ini');
assert.doesNotMatch(lanjut, /<th[^>]*>Unit<\/th>/, 'kolom hidden tidak tampil');
assert.match(lanjut, /popover="auto"[^>]*aria-label="Tampilkan kolom"/);
assert.match(lanjut, /Unduh CSV/);
assert.equal(UI.toCsv([{ a: '=1+1', b: 'x;y', c: 'kata "kutip"', d: 5, e: -3 }], ['a', 'b', 'c', 'd', 'e'].map(k => ({ key: k, label: k.toUpperCase() }))),
  'A;B;C;D;E\r\n\'=1+1;"x;y";"kata ""kutip""";5;-3', 'CSV: rumus dinetralkan, pemisah & kutip di-escape, angka negatif tetap angka');
assert.equal(UI.toCsv([{ t: new Date(2026, 0, 2) }], [{ key: 't', label: 'T' }]).split('\r\n')[1], '2/1/2026', 'tanggal format Indonesia');
const muat = r(h(UI.DataTable, { title: 'K', rows: [], loading: true, columns: [{ key: 'nama', label: 'Nama' }] }));
assert.match(muat, /class="ruas-kerangka"/);
assert.match(muat, /role="status">Memuat…/);

// Kerangka dasbor, jejak, menu.
const shell = r(h(UI.AppShell, { brand: h('b', null, 'Kas'), header: 'Judul', nav: [{ title: 'Utama', items: [{ href: '/', label: 'Beranda', active: true }, { href: '/kas', label: 'Kas', badge: 3 }] }] }, 'isi'));
assert.match(shell, /href="#ruas-isi"[^>]*>Lewati ke isi/);
assert.match(shell, /<nav aria-label="Navigasi utama"/);
assert.match(shell, /href="\/" class="ruas-nav-butir" aria-current="page"/);
assert.match(shell, /<main id="ruas-isi" tabindex="-1"/);
assert.match(shell, /aria-label="Buka menu"[^>]*aria-expanded="false"/);
const jejak = r(h(UI.Breadcrumb, { items: [{ label: 'Beranda', href: '/' }, { label: 'Kas' }] }));
assert.match(jejak, /<a href="\/">Beranda<\/a>.*<span aria-current="page">Kas<\/span>/);
const menu = r(h(UI.Menu, { items: [{ label: 'Ubah' }, '-', { label: 'Hapus', tone: 'danger' }] }));
assert.match(menu, /aria-label="Aksi"[^>]*aria-haspopup="menu"/);
assert.equal((menu.match(/role="menuitem"/g) || []).length, 2);
assert.match(menu, /role="separator"/);

// Isian lanjut.
assert.match(r(h(UI.Switch, { label: 'Aktif' })), /type="checkbox"[^>]*role="switch"/);
const combo = r(h(UI.Combobox, { label: 'Unit', options: ['Gudang', 'Toko'], defaultValue: 'Toko', name: 'unit' }));
assert.match(combo, /role="combobox" aria-expanded="false"/);
assert.match(combo, /value="Toko"/);
assert.match(combo, /type="hidden" name="unit" value="Toko"/);
assert.deepEqual(UI.dateRangePreset('bulanLalu', new Date(2026, 2, 15)), { from: '2026-02-01', to: '2026-02-28' }, 'bulan lalu, tanggal lokal');
assert.deepEqual(UI.dateRangePreset('tujuhHari', new Date(2026, 0, 3)), { from: '2025-12-28', to: '2026-01-03' });
assert.match(r(h(UI.DateRange, { label: 'Periode', defaultValue: { from: '2026-05-02', to: '2026-05-01' } })), /role="alert".*Tanggal awal harus sebelum/, 'rentang terbalik ditolak');
// Minggu ini mulai Senin (Minggu → mundur 6 hari, lintas tahun), Tahun lalu 1 Jan–31 Des.
assert.deepEqual(UI.dateRangePreset('mingguIni', new Date(2026, 9, 25)), { from: '2026-10-19', to: '2026-10-25' }, 'Minggu 25 Okt');
assert.deepEqual(UI.dateRangePreset('mingguIni', new Date(2026, 9, 26)), { from: '2026-10-26', to: '2026-11-01' }, 'Senin 26 Okt');
assert.deepEqual(UI.dateRangePreset('mingguIni', new Date(2026, 0, 1)), { from: '2025-12-29', to: '2026-01-04' }, 'Kamis 1 Jan');
assert.deepEqual(UI.dateRangePreset('tahunLalu', new Date(2026, 9, 25)), { from: '2025-01-01', to: '2025-12-31' });
assert.equal(UI.dateRangeLabel({ from: '2026-10-01', to: '2026-10-15' }), '01/10/2026 – 15/10/2026');
assert.equal(UI.dateRangeLabel({ from: '', to: '' }), 'Semua tanggal');
// Varian select: isian tanggal hanya untuk Rentang tanggal…; tombol preset lama tetap di varian bawaan.
const menuTgl = p => r(h(UI.DateRange, { variant: 'select', ...p }));
assert.doesNotMatch(menuTgl({ defaultValue: UI.dateRangePreset('bulanIni') }), /type="date"/, 'preset tanpa isian');
assert.match(menuTgl({ defaultValue: UI.dateRangePreset('bulanIni') }), /<option value="bulanIni" selected="">Bulan ini/);
assert.match(menuTgl({ defaultValue: { from: '', to: '' } }), /<option value="semua" selected="">Semua tanggal/);
assert.match(menuTgl({ period: { from: '2026-01-01', to: '2026-06-30' }, defaultValue: { from: '2026-01-01', to: '2026-06-30' } }), /<option value="periode" selected="">Periode \(01\/01\/2026 – 30\/06\/2026\)/);
assert.equal((menuTgl({ defaultValue: { from: '2026-03-02', to: '2026-03-09' } }).match(/type="date"/g) || []).length, 2, 'rentang bebas → Dari–Sampai');
assert.match(menuTgl({ defaultValue: { from: '2026-03-09', to: '2026-03-02' } }), /role="alert".*Tanggal awal harus sebelum/, 'rentang terbalik ditolak (select)');
assert.match(r(h(UI.DateRange, {})), /7 hari terakhir.*Bulan lalu/, 'tombol preset 0.6.0 tetap');
assert.match(r(h(UI.NumberInput, { label: 'Gaji', prefix: 'Rp', defaultValue: 1250000 })), /inputMode="numeric"[^>]*value="1\.250\.000"|value="1\.250\.000"[^>]*/i);
const unggah = r(h(UI.FileDrop, { label: 'Foto', accept: 'image/*', maxSize: 5 * 1048576 }));
assert.match(unggah, /type="file" class="ruas-sr" accept="image\/\*"/);
assert.match(unggah, /Maksimal 5 MB per berkas\./);
const langkah = r(h(UI.Stepper, { steps: [{ label: 'Data' }, { label: 'Periksa' }, { label: 'Kirim' }], current: 1 }));
assert.match(langkah, /aria-current="step"/);
assert.match(langkah, /Langkah 1 dari 3, selesai/);

// Angka & grafik.
const stat = r(h(UI.Stat, { label: 'Biaya', value: 'Rp 5', delta: -4.5, invert: true, deltaLabel: 'dari bulan lalu', trend: [3, 2, 1] }));
assert.match(stat, /ruas-stat-delta ruas-delta-baik/, 'turun = baik untuk biaya');
assert.match(stat, /turun <\/span><b>−4,5%<\/b>/);
assert.match(stat, /ruas-garis-mini/);
assert.match(r(h(UI.Progress, { value: 30, max: 60, label: 'Unggah' })), /role="progressbar"[^>]*aria-valuenow="30".*width:50%/);
const taktentu = r(h(UI.Progress, { value: null, label: 'Memuat' }));
assert.ok(taktentu.includes('ruas-progres-taktentu') && !taktentu.includes('aria-valuenow') && !taktentu.includes('%<'), 'Progress tak tentu: tanpa aria-valuenow dan tanpa angka persen');
assert.match(r(h(UI.Progress, { value: 40, active: true })), /ruas-progres-jalan/);
assert.doesNotMatch(r(h(UI.Progress, { value: 100, active: true })), /ruas-progres-jalan/, 'Progress selesai tidak bergerak lagi');
const eq = r(h(UI.Equalizer, { values: [0, .5, 1.4, 'x'], segments: 4 }));
assert.match(eq, /role="img" aria-label="Level: 0%, 50%, 100%, 0%"/);
assert.ok(eq.includes('--isi:0.5') && eq.includes('--isi:1') && !eq.includes('ruas-eq-main'), 'Equalizer: level dibulatkan per daun, tanpa animasi');
assert.match(r(h(UI.Equalizer, {})), /aria-label="Sedang diputar".*ruas-eq-main.*steps\(7, jump-none\)/);
const bar = r(h(UI.BarChart, { label: 'Kas', data: [{ label: 'Jan', value: 10 }, { label: 'Feb', value: 30 }] }));
assert.match(bar, /role="img" aria-label="Kas: 2 data, terendah 10, tertinggi 30"/);
assert.equal((bar.match(/class="ruas-grafik-batang"/g) || []).length, 2);
assert.match(bar, /Lihat tabel/);
assert.match(r(h(UI.LineChart, { data: [{ label: 'a', value: 1 }, { label: 'b', value: 2 }] })), /class="ruas-grafik-garis"/);
assert.match(r(h(UI.EmptyState, { title: 'Belum ada kas' })), /ruas-hampa-judul">Belum ada kas/);
assert.match(r(h(UI.Skeleton, { lines: 3 })), /aria-hidden="true"/);
assert.match(r(h(UI.ToastProvider, null, 'x')), /popover="manual" role="region" aria-label="Pemberitahuan"/);
assert.doesNotMatch(r(h(UI.CommandPalette, { items: [{ label: 'Beranda' }] })), /Beranda/, 'palet tertutup tidak merender isi');
console.log('✓ @ruas-icons/ui: logika tabel dan markup aksesibel lolos uji');

// Falsafah (Berumpun): setiap Sudut Daun di CSS berbanding R:r = 4:1, kiri-atas & kanan-bawah melengkung.
const css = readFileSync(new URL('../packages/ui/ruas-ui.css', import.meta.url), 'utf8');
const daun = [...css.matchAll(/border-radius:\s*([\d.]+)px ([\d.]+)px ([\d.]+)px ([\d.]+)px/g)];
assert.ok(daun.length > 30, 'Sudut Daun ditemukan di CSS');
for (const [s, R, r, R2, r2] of daun) assert.ok(R === R2 && r === r2 && +R === 4 * r, `Sudut Daun harus R:r = 4:1, lengkung di kiri-atas: ${s}`);
console.log(`✓ ${daun.length} Sudut Daun di ruas-ui.css berbanding 4:1`);

// Ikon tersemat: hiasan disembunyikan, berlabel jadi gambar bermakna; kelas ukuran/gaya/nada.
const ubin = r(h(UI.IconTile, { icon: h('svg'), tone: 'danger', size: 'lg', variant: 'solid' }));
assert.match(ubin, /class="ruas-ikon ruas-ikon-lg ruas-ikon-solid ruas-ikon-danger" aria-hidden="true"/);
assert.match(r(h(UI.IconTile, { icon: h('svg'), label: 'Saldo kas' })), /class="ruas-ikon ruas-ikon-md ruas-ikon-soft" role="img" aria-label="Saldo kas"/);

// Font pilihan: berkas Ruas Angka yang dirujuk ruas-font.css ada dan ikut terbit di paket.
const cssFont = readFileSync(new URL('../packages/ui/ruas-font.css', import.meta.url), 'utf8');
for (const [, berkas] of cssFont.matchAll(/url\("\.\/([^"]+)"\)/g)) assert.ok(existsSync(new URL('../packages/ui/' + berkas, import.meta.url)), 'berkas font hilang: ' + berkas);
const pkgUi = JSON.parse(readFileSync(new URL('../packages/ui/package.json', import.meta.url), 'utf8'));
assert.ok(pkgUi.files.includes('ruas-font.css') && pkgUi.files.includes('fonts'), 'ruas-font.css dan fonts/ harus ikut terbit');

// Bahasa lain: kunci sama persis dengan LABEL, jenis sama, dan fungsi menghasilkan teks utuh.
const B = await import('../packages/ui/bahasa.js');
for (const [nama, L] of Object.entries(B)) {
  assert.deepEqual(Object.keys(L).sort(), Object.keys(UI.LABEL).sort(), `${nama}: kunci sama dengan LABEL`);
  for (const [k, v] of Object.entries(L)) {
    assert.equal(typeof v, typeof UI.LABEL[k], `${nama}.${k}: jenis sama`);
    const teks = typeof v === 'function' ? v(3, 12, 40) : v;
    assert.ok(typeof teks === 'string' && teks.trim() && !/undefined|NaN/.test(teks), `${nama}.${k}: teks utuh`);
  }
}
console.log(`✓ ${Object.keys(B).length} bahasa lengkap: ${Object.keys(B).join(', ')}`);
