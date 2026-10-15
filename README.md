# Ruas

Set ikon publik gratis berfalsafah bambu: ringan, beruas, lentur, lurus, berumpun, untuk semua. Lisensi MIT.

Rujukan utama setiap ikon: [docs/falsafah_id.html](docs/falsafah_id.html) (English: [docs/falsafah_en.html](docs/falsafah_en.html)).

## Mulai

```bash
npm install
npm run penjaga   # periksa semua ikon terhadap falsafah
npm run rakit     # penjaga + hasilkan dist/
```

Lalu buka `site/index.html` di browser untuk melihat galeri.

## Struktur

| Folder/berkas | Isi |
|---|---|
| `icons/<id>.svg` | Sumber tunggal tiap ikon (grid 24, garis 1,5, kelas peran `badan` `detail` `aksen` `padat`) |
| `icons/<id>.json` | Nama Indonesia, kategori (Inti/Bidang, lihat bab 16 falsafah), `juga`, `seri`, kata kunci, dan `asal`/`ciri` untuk rumah adat |
| `scripts/penjaga.mjs` | Pemeriksa falsafah: grid, kelipatan 0,25, area 2–22, ≤4 elemen, ≤1 KB, metadata |
| `scripts/rakit.mjs` | Menghasilkan `dist/` |
| `ruas.css` | Mode warna Garis, Lapis, Aksen, Isi |
| `site/` | Galeri publik. Sunting `site/galeri.html`; `site/index.html` dibuat oleh `npm run rakit` |
| `docs/` | Falsafah dan catatan seri |

Hasil rakit (`dist/`, tidak masuk git): `svg/<id>.svg`, `sprite.svg` (simbol `ruas-<id>`), `ruas.json`, `ruas.js`, `ruas.css`.

## Pakai

```html
<link rel="stylesheet" href="ruas.css">
<span class="ruas-aksen" style="color:#17211A"><!-- tempel isi dist/svg/bell.svg --></span>
```

Kelas mode: `ruas-lapis`, `ruas-aksen`, `ruas-isi` (boleh digabung). Variabel: `--ruas-aksen` (bawaan kunyit `#C27600`), `--ruas-latar` (warna latar untuk mode Isi).

Ikon tanpa makna teks diberi `aria-hidden="true"`; ikon yang berdiri sendiri diberi `role="img"` dan `aria-label`.

## Belum ada

- Paket `@ruas/react` dan paket npm terbit.
- Gerak (`gerak`) dan pencerminan RTL (`cermin`) baru dicatat di metadata, belum dirakit menjadi CSS.
