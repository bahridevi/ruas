# Menyumbang ikon

*English: suggest an icon via an [issue](https://github.com/bahridevi/ruas/issues/new?template=usul-ikon.yml), or draw it yourself following the steps below and open a pull request. The philosophy is in [docs/falsafah_en.html](docs/falsafah_en.html).*

Ada dua jalur:

- **Usulkan saja, tanpa menggambar.** Buka [Usulkan ikon](https://github.com/bahridevi/ruas/issues/new?template=usul-ikon.yml), tulis nama, kegunaan, dan wujudnya (boleh lampirkan foto atau sketsa).
- **Gambar sendiri.** *Fork* repo ini, buat cabang baru, ikuti langkah di bawah, lalu kirim *pull request*. Penjaga falsafah berjalan otomatis pada setiap *pull request*; pemelihara memeriksa daftar periksa manusia sebelum menerima.

Setelah diterima, ikon ikut terbit di galeri dan di paket npm `@ruas-icons/svg` dan `@ruas-icons/react` versi berikutnya.

## Langkah menggambar

1. Baca [docs/falsafah_id.html](docs/falsafah_id.html) (English: [docs/falsafah_en.html](docs/falsafah_en.html)). Setiap butirnya wajib.
2. Buat `icons/<id>.svg`. ID dalam bahasa Inggris, kebab-case, pola `benda-pengubah` (mis. `user-plus`, `house-gadang`).
   Kepala SVG harus persis:
   ```
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
   ```
3. Buat `icons/<id>.json`:
   ```json
   { "nama": "Lonceng", "en": "Bell", "kategori": "komunikasi", "juga": ["status"], "tag": ["notifikasi", "notification", "bell"] }
   ```
   Kategori mengikuti bab 16 falsafah (daftarnya di `KATEGORI`, `scripts/penjaga.mjs`). Tambahkan `"juga": [...]` untuk paling banyak 2 kategori tambahan. Seri rumah adat (`"seri": "rumah-adat"`) wajib `asal` `{ provinsi, wilayah }`, `ciri`, dan `ciri_en`. `en` adalah nama bahasa Inggris yang tampil di galeri versi EN.
4. Jalankan `npm run penjaga` sampai lolos, lalu `npm run rakit` dan periksa ikon di `site/index.html` pada 16, 24, dan 48 px serta keempat mode.

## Daftar periksa manusia (tidak bisa diperiksa mesin)

- [ ] **Lurus**: orang yang belum pernah melihatnya mengenali makna dalam 5 detik.
- [ ] **Sudut Daun**: kiri-atas dan kanan-bawah R4, kanan-atas dan kiri-bawah r1 (bidang kecil R2/r0,5). Lingkaran tetap bulat.
- [ ] **Aksen Makna**: `aksen` hanya pada bagian yang berubah bila maknanya berubah. Benda diam tidak punya aksen.
- [ ] Celah antarbagian ≥ 2 unit dan tetap terbaca di 16 px.
- [ ] Mode Isi: `detail` tetap terlihat di atas `badan` yang terisi.
- [ ] Kata kunci memuat Indonesia dan Inggris. Simbol agama dan budaya diperlakukan setara.
