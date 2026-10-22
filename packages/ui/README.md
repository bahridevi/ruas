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

## Tema

Token warna ada di `:root` (`--ruas-bg`, `--ruas-surface`, `--ruas-ink`, `--ruas-muted`, `--ruas-line`, `--ruas-bambu`, `--ruas-on-bambu`, `--ruas-kunyit`, `--ruas-bahaya`, `--ruas-info`). Tema gelap aktif dengan `data-theme="dark"` atau kelas `.dark`; tanpa `data-theme`, mengikuti sistem. Untuk mengikuti tema aplikasi:

```css
:root { --ruas-bambu: var(--primary); --ruas-surface: var(--card); --ruas-line: var(--border); }
```

Huruf mengikuti aplikasi. Komponen memakai `"use client"`, jadi bisa diimpor langsung dari Server Component Next.js.
