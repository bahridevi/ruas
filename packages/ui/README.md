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
| `Checkbox`, `Radio`, `CheckboxGroup`, `RadioGroup` | Grup memakai `fieldset`/`legend`. `CheckboxGroup selectAll` menambah "Pilih semua" (setengah tercentang bila sebagian). `RadioGroup variant="segmented"` untuk pilihan ringkas. |
| `Tabs` | `items` `{ id, label, content, icon?, badge?, disabled? }`; panah kiri/kanan, Home, End. |
| `Section`, `SectionGroup` | Bagian yang tergulung menjadi satu baris. `SectionGroup` memberi tombol Buka semua / Gulung semua (berlaku juga untuk yang bersarang). `printable` mencetak bagian itu saja. |
| `Dialog` | Jendela modal dari `<dialog>` bawaan: fokus terkurung, Esc dan klik latar menutup, gulir latar terkunci, fokus awal ke isian pertama. `title`, `description`, `icon`, `tone` default · danger · warning, `size` sm · md · lg · xl, `footer`, `alert` (galat di dalam modal), `onSubmit` (kotak menjadi `<form>`). Di HP tampil sebagai lembar bawah. |
| `TreeCell` | Sel kolom pertama tabel bertingkat: garis panduan per tingkat, tombol buka/gulung kecil, titik untuk daun. `depth`, `expanded`, `onToggle`, `label`. |
| `Alert` | Kotak pesan berwarna: `tone` info · success · warning · danger, `icon`, `title`, `aside` (isi kanan, turun ke bawah di HP). danger/warning memakai `role="alert"`, lainnya `role="status"`. |
| `Stat` | Kartu angka ringkas (KPI): `label`, `value`, `hint`, `icon`, `tone`, `action` (tautan di kaki kartu, mis. `<Link>`). |
| `DataTable` | Kontainer Ringkasan / Saringan / Daftar, urut per kolom (klik judul), baris saring di bawah judul, cari semua kolom, nomor urut, "x dari y", paginasi, cetak halaman dan cetak hasil saringan. |

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

Tabel padat (baris ±33 px) dengan zebra lembut; tombol ikon (`Button` tanpa teks), lencana, dan isian di dalam sel otomatis mengecil.

## Modal

```tsx
<Dialog open={buka} onClose={() => setBuka(false)} title="Tambah transaksi" description="Jurnal dibuat otomatis."
  icon={<Plus size={20} />} size="lg" onSubmit={simpan} alert={galat}
  footer={<><Button onClick={() => setBuka(false)}>Batal</Button><Button type="submit" variant="primary">Simpan</Button></>}>
  <Input label="Keterangan" required />
</Dialog>
```

Toast halaman yang memakai `position: fixed` tertutup lapisan modal; tampilkan galat simpan lewat `alert`.

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
