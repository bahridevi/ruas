# Menyumbang ikon

1. Baca [docs/falsafah_id.html](docs/falsafah_id.html) (English: [docs/falsafah_en.html](docs/falsafah_en.html)). Setiap butirnya wajib.
2. Buat `icons/<id>.svg`. ID dalam bahasa Inggris, kebab-case, pola `benda-pengubah` (mis. `user-plus`, `house-gadang`).
   Kepala SVG harus persis:
   ```
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
   ```
3. Buat `icons/<id>.json`:
   ```json
   { "nama": "Lonceng", "kategori": "komunikasi", "juga": ["status"], "tag": ["notifikasi", "notification", "bell"] }
   ```
   Kategori mengikuti bab 16 falsafah (daftarnya di `KATEGORI`, `scripts/penjaga.mjs`). Tambahkan `"juga": [...]` untuk paling banyak 2 kategori tambahan. Seri rumah adat (`"seri": "rumah-adat"`) wajib `asal` `{ provinsi, wilayah }` dan `ciri`.
4. Jalankan `npm run penjaga` sampai lolos, lalu `npm run rakit` dan periksa ikon di `site/index.html` pada 16, 24, dan 48 px serta keempat mode.

## Daftar periksa manusia (tidak bisa diperiksa mesin)

- [ ] **Lurus**: orang yang belum pernah melihatnya mengenali makna dalam 5 detik.
- [ ] **Sudut Daun**: kiri-atas dan kanan-bawah R4, kanan-atas dan kiri-bawah r1 (bidang kecil R2/r0,5). Lingkaran tetap bulat.
- [ ] **Aksen Makna**: `aksen` hanya pada bagian yang berubah bila maknanya berubah. Benda diam tidak punya aksen.
- [ ] Celah antarbagian ≥ 2 unit dan tetap terbaca di 16 px.
- [ ] Mode Isi: `detail` tetap terlihat di atas `badan` yang terisi.
- [ ] Kata kunci memuat Indonesia dan Inggris. Simbol agama dan budaya diperlakukan setara.
