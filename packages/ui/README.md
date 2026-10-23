# @ruas-icons/ui

Komponen dasbor bergaya [Ruas](https://ruas.metabahri.com) untuk React dan Next.js: Sudut Daun, hijau bambu, tema gelap. Teks bawaan berbahasa Indonesia, bisa dipakai dengan papan ketik dan pembaca layar. Lisensi MIT.

Contoh langsung: https://ruas.metabahri.com/site/ui.html

```bash
npm i @ruas-icons/ui @ruas-icons/react
```

```tsx
// app/layout.tsx: sekali saja
import "@ruas-icons/ui/ruas-ui.css";
```

```tsx
import { Button, DataTable, Otp, Section, SectionGroup, Tabs } from "@ruas-icons/ui";
import { Plus } from "@ruas-icons/react";

<Button variant="primary" icon={<Plus size={16} />}>Tambah data</Button>
<Otp onComplete={kode => kirim(kode)} />
```

## Komponen

| Komponen | Isi |
|---|---|
| `Button` | `variant` primary · secondary · danger · ghost; `size` sm · md · lg; `loading`; `icon`. Tombol ikon saja wajib `aria-label`. |
| `Badge` | `tone` neutral · success · warning · danger · info; `icon` |
| `Input`, `Textarea`, `Select`, `Field` | `label`, `hint`, `error` (diumumkan pembaca layar), `required`. `Select` menerima `options` dan `placeholder`. `Field` untuk kontrol buatan sendiri. |
| `Otp` | Satu kotak per digit; ketik, hapus, panah, tempel sekaligus, isi otomatis SMS (`one-time-code`). `length`, `onComplete`, `name` (input tersembunyi untuk form), `alphanumeric`. |
| `Checkbox`, `Radio`, `CheckboxGroup`, `RadioGroup` | Radio berbentuk daun bertitik. Grup memakai `fieldset`/`legend`. `CheckboxGroup selectAll` menambah "Pilih semua" (setengah tercentang bila sebagian). `RadioGroup variant="segmented"` untuk pilihan ringkas. |
| `Tabs` | `items` `{ id, label, content, icon?, badge?, disabled? }`; panah kiri/kanan, Home, End. |
| `Section`, `SectionGroup` | Bagian yang tergulung menjadi satu baris. `SectionGroup` memberi tombol Buka semua / Gulung semua (berlaku juga untuk yang bersarang). `printable` mencetak bagian itu saja. |
| `Dialog` | Jendela modal dari `<dialog>` bawaan: fokus terkurung, Esc dan klik latar menutup, gulir latar terkunci, fokus awal ke isian pertama. `title`, `description`, `icon`, `tone` default · danger · warning, `size` sm · md · lg · xl, `footer`, `alert` (galat di dalam modal), `onSubmit` (kotak menjadi `<form>`). Di HP tampil sebagai lembar bawah. |
| `TreeCell` | Sel kolom pertama tabel bertingkat: garis panduan per tingkat, tombol buka/gulung kecil, titik untuk daun. `depth`, `expanded`, `onToggle`, `label`. |
| `Alert` | Kotak pesan berwarna: `tone` info · success · warning · danger, `icon`, `title`, `aside` (isi kanan, turun ke bawah di HP). danger/warning memakai `role="alert"`, lainnya `role="status"`. |
| `Stat` | Kartu angka ringkas (KPI): `label`, `value`, `hint`, `icon`, `tone`, `action` (tautan di kaki kartu, mis. `<Link>`). `delta` (persen, mis. `12.5`) menampilkan panah naik/turun + teks untuk pembaca layar; `invert` bila turun itu baik (biaya, keluhan); `trend` (deret angka) menggambar garis tren mini. |
| `DataTable` | Kontainer Ringkasan / Saringan / Daftar, urut per kolom (klik judul), baris saring di bawah judul, cari semua kolom, nomor urut, "x dari y", paginasi, cetak halaman dan cetak hasil saringan. Opsional: pilih baris + aksi massal, tombol Kolom, Unduh CSV, judul kolom tetap saat digulir. |
| `Switch` | Sakelar nyala/mati (`role="switch"`) untuk pengaturan yang langsung berlaku: jalur dan kenop persegi Sudut Daun, rongga di kiri kenop terisi warna. Bisa diklik, ditekan Spasi, atau digeser (kanan = nyala, kiri = mati). Prop sama dengan `Checkbox`. |
| `Menu` | Menu aksi (bawaan tombol "⋯"): `items` `{ label, icon, onSelect, tone: "danger", disabled }`, `'-'` = garis pemisah. Panah, Home/End, Esc; memakai popover bawaan browser. |
| `Combobox` | Pilihan yang bisa dicari (kota, pelanggan, akun). Cocok per kata tanpa peduli huruf besar/kecil; `limit` (bawaan 50) menjaga daftar tetap ringan; data besar: `onSearch` lalu isi `options` dari server. `name` untuk form. |
| `DateRange` | Dua `<input type="date">` bawaan + pilihan cepat (Hari ini, 7 hari terakhir, Bulan ini, Bulan lalu, Tahun ini). Nilai `{ from, to }` YYYY-MM-DD menurut tanggal lokal (bukan UTC). `dateRangePreset("bulanLalu")` untuk nilai awal. |
| `NumberInput` | Angka berpemisah ribuan saat diketik (`1.250.000`); Rupiah: `prefix="Rp"`. Nilai bilangan bulat atau `null`, kursor tidak meloncat. Negatif hanya bila `min < 0`. |
| `FileDrop` | Seret-lepas atau pilih berkas, pratinjau gambar, hapus per berkas. `accept`, `multiple`, `maxSize` (byte) dengan pesan galat Bahasa Indonesia. Server tetap wajib memeriksa ulang. |
| `Stepper` | Langkah formulir panjang: `steps` `{ label, hint }`, `current`, `onStepClick` (langkah yang sudah lewat bisa diklik). Tegak di HP. |
| `AppShell` | Kerangka dasbor: menu samping berkelompok (`nav`), bisa diciutkan jadi ikon saja (diingat browser), laci di HP (Esc/klik luar menutup, isi belakang `inert`), bilah atas (`header`, `actions`), tautan "Lewati ke isi". `linkAs={Link}` untuk Next.js. |
| `Breadcrumb` | Jejak halaman; di HP satu baris (induk + halaman ini). |
| `ToastProvider`, `useToast` | Pemberitahuan singkat: `toast({ title, description, tone, action, duration })`. Hilang setelah 5 detik (jeda saat disorot), `danger` tetap sampai ditutup; tampil di atas modal; dibacakan pembaca layar. |
| `CommandPalette` | Palet perintah Ctrl+K / ⌘K: `items` `{ label, group, icon, keywords, hint, onSelect }`. |
| `BarChart`, `LineChart`, `Sparkline` | Grafik satu seri tanpa pustaka tambahan: sumbu angka ringkas (`25 jt`), tooltip sorot/sentuh, tombol "Lihat tabel" (papan ketik, pembaca layar, cetak). `data` `[{ label, value }]`, `format`. |
| `Progress`, `Skeleton`, `EmptyState` | Bilah kemajuan (`role="progressbar"`) berupa batang berisi daun kecil: `value={null}` = tak tentu (daun bergerak kiri-kanan), `active` = daun mengalir selama proses berjalan. Kerangka saat memuat, dan keadaan kosong dengan ajakan bertindak. |
| `Equalizer` | Daun berdiri berisi daun kecil mendatar yang menyala dari bawah: `values` (0–1 per batang) untuk level nyata, tanpa `values` = hiasan "sedang diputar" (`playing`). `segments`, `height`, `tone`. Gerak berhenti bila pengguna memilih kurangi gerak. |

Semua kontrol bisa terkendali (`value` + `onChange`) atau mandiri (`defaultValue`). Teks bawaan diganti lewat prop `labels`, mis. `labels={{ sebelumnya: "Previous" }}` (daftar lengkap: `LABEL`).

## Tabel

```tsx
<DataTable
  title="Daftar karyawan"
  rows={karyawan}
  rowKey="id"
  summary={<Ringkasan />}
  columns={[
    { key: "nama", label: "Nama", sortable: true, filter: true },
    { key: "unit", label: "Unit", sortable: true, filter: true, options: ["Keuangan", "Gudang"] },
    { key: "gaji", label: "Gaji", sortable: true, align: "right", render: r => rupiah(r.gaji) },
  ]}
/>
```

Data besar: kerjakan saring, urut, dan halaman di server. Beri `total` (jumlah hasil saringan) dan `onStateChange`; `rows` cukup baris halaman yang tampil. `onStateChange` dipanggil saat mulai dan setiap perubahan (ditunda 250 ms saat mengetik). Untuk "Cetak hasil saringan" beri `fetchAllRows(state)`.

```tsx
<DataTable title="Transaksi" columns={kolom} rows={halaman.rows} total={halaman.total} grandTotal={semua}
  loading={memuat} onStateChange={s => muat(s)} fetchAllRows={s => ambilSemua(s)} />
```

Rincian per baris, baris total, dan saringan milik aplikasi:

```tsx
<DataTable title="Kas masuk" rows={trx} rowKey="id" columns={kolom}
  detail={t => <RincianJurnal trx={t} />}
  footer={rs => ({ akun: "Total", nominal: rupiah(rs.reduce((a, t) => a + t.nominal, 0)) })}
  filters={<Input type="date" label="Dari" value={dari} onChange={e => setDari(e.target.value)} />}
  filtersActive={dari ? 1 : 0} onClearFilters={() => setDari("")} />
```

`footer` menerima semua baris hasil saringan (bukan hanya halaman ini), jadi totalnya ikut saringan.

Pilih baris, aksi massal, tombol Kolom, Unduh CSV, dan menu aksi per baris:

```tsx
<DataTable title="Karyawan" rows={karyawan} rowKey="id" maxHeight="70vh"
  selectable bulkActions={(ids, bersihkan) => <Button size="sm" onClick={() => { nonaktifkan(ids); bersihkan(); }}>Nonaktifkan</Button>}
  columnToggle exportable exportName="karyawan"
  columns={[
    { key: "nama", label: "Nama", hideable: false },
    { key: "id", label: "ID", hidden: true },
    { key: "aksi", label: "Aksi", exportable: false, render: r => <Menu label={`Aksi untuk ${r.nama}`} items={[{ label: "Ubah", onSelect: () => ubah(r) }, "-", { label: "Hapus", tone: "danger", onSelect: () => hapus(r) }]} /> },
  ]} />
```

CSV memakai pemisah `;` dan BOM UTF-8 agar langsung rapi di Excel berbahasa Indonesia; isi sel yang diawali `= + - @` diberi `'` supaya tidak dijalankan sebagai rumus. Mode server: Unduh CSV memakai `fetchAllRows`.

Tabel padat (baris ±33 px) dengan zebra lembut; tombol ikon (`Button` tanpa teks), lencana, dan isian di dalam sel otomatis mengecil.

## Modal

```tsx
<Dialog open={buka} onClose={() => setBuka(false)} title="Tambah transaksi" description="Jurnal dibuat otomatis."
  icon={<Plus size={20} />} size="lg" onSubmit={simpan} alert={galat}
  footer={<><Button onClick={() => setBuka(false)}>Batal</Button><Button type="submit" variant="primary">Simpan</Button></>}>
  <Input label="Keterangan" required />
</Dialog>
```

Toast buatan sendiri yang memakai `position: fixed` tertutup lapisan modal; pakai `useToast` (tampil di atas modal) atau tampilkan galat simpan lewat `alert`.

## Kerangka dasbor

```tsx
// app/(dasbor)/layout.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppShell, Breadcrumb, CommandPalette, ToastProvider } from "@ruas-icons/ui";
import { ChartBar, House, Users } from "@ruas-icons/react";

export default function Layout({ children }) {
  const p = usePathname();
  const nav = [{ title: "Utama", items: [
    { href: "/", label: "Beranda", icon: <House size={20} />, active: p === "/" },
    { href: "/laporan", label: "Laporan", icon: <ChartBar size={20} />, active: p.startsWith("/laporan") },
    { href: "/karyawan", label: "Karyawan", icon: <Users size={20} />, badge: 3, active: p.startsWith("/karyawan") },
  ] }];
  return (
    <ToastProvider>
      <AppShell linkAs={Link} brand="Kas Koperasi" nav={nav} header={<Breadcrumb linkAs={Link} items={[{ label: "Beranda", href: "/" }, { label: "Laporan" }]} />}>
        {children}
      </AppShell>
      <CommandPalette items={nav[0].items.map(x => ({ label: x.label, group: "Halaman", onSelect: () => location.assign(x.href) }))} />
    </ToastProvider>
  );
}
```

## Angka & grafik

```tsx
<Stat label="Penjualan" value="Rp70,4 jt" delta={12.4} deltaLabel="dari bulan lalu" trend={[52, 58, 61, 70]} />
<Stat label="Biaya" value="Rp18,2 jt" delta={-3.1} invert />
<BarChart label="Penjualan per bulan" data={[{ label: "Jan", value: 42_000_000 }, { label: "Feb", value: 56_500_000 }]} format={v => rupiah(v)} />
```

Grafik sengaja satu seri (hijau bambu, tanpa legenda); untuk membandingkan beberapa seri buat beberapa grafik berdampingan.

## Tema

Token warna ada di `:root` (`--ruas-bg`, `--ruas-surface`, `--ruas-ink`, `--ruas-muted`, `--ruas-line`, `--ruas-bambu`, `--ruas-on-bambu`, `--ruas-kunyit`, `--ruas-bahaya`, `--ruas-info`). Tema gelap aktif dengan `data-theme="dark"` atau kelas `.dark`; tanpa `data-theme`, mengikuti sistem. Untuk mengikuti tema aplikasi:

```css
:root { --ruas-bambu: var(--primary); --ruas-surface: var(--card); --ruas-line: var(--border); }
```

Penanda terpilih (tab, radio bersegmen, kotak centang, kolom terurut, baris terbuka, tombol `aria-pressed`/`aria-current`) memakai `--ruas-aktif` (isi), `--ruas-on-aktif` (teks di atas isi), dan `--ruas-aktif-teks` (teks di latar biasa). Bawaannya bambu. Contoh penanda kunyit yang tegas:

```css
:root { --ruas-aktif: #e09b0f; --ruas-on-aktif: #1d1300; --ruas-aktif-teks: var(--ruas-kunyit); }
```

Huruf mengikuti aplikasi. Komponen memakai `"use client"`, jadi bisa diimpor langsung dari Server Component Next.js.
