# Seri Tengara Nusantara

Bangunan atau monumen yang menjadi ciri khas suatu daerah. Penanda seri: `"seri": "tengara"`, kategori utama `bangunan`. Setiap ikon wajib punya `asal` `{ provinsi, wilayah }` dan `ciri`. Tengara termasuk benda diam, jadi ikonnya tanpa aksen. Nama kode mengikuti pola `jenis-nama`, misalnya `temple-borobudur` dan `bridge-ampera`.

## Syarat masuk

Ikon tengara harus dikenali **namanya**, bukan sekadar jenis bangunannya. Uji yang dipakai:

1. `npm run penjaga` lolos.
2. Celah antarbagian minimal 2 unit setelah tebal garis. Bagian yang menempel tidak dihitung, begitu juga celah yang tertutup bagian ketiga.
3. Lembar kontak 16/24/48 px, tebal 1/1,5/2,5, keempat mode, latar terang dan gelap, serta diletakkan di antara 8 ikon tetangga (house-gadang, mosque, church, pura, stupa, building, house-joglo, klenteng).
4. Uji kenal buta: gambar diberi nama acak, lalu penebak menyebut bangunan apa itu. Ikon masuk bila namanya disebut dengan benar secara konsisten. Uji manusia 10 orang (bab 04 falsafah) tetap berlaku sebelum rilis.

## Sudah masuk (4)

| Ikon | Provinsi | Uji kenal (dua putaran) |
|---|---|---|
| Candi Borobudur | Jawa Tengah | 8/10 |
| Tugu Khatulistiwa | Kalimantan Barat | 6/10 |
| Jembatan Ampera | Sumatera Selatan | 6/10 |
| Monas | DKI Jakarta | 5/10 |

Penebak model kecil hampir tidak pernah menyebut nama bangunan apa pun. Penebak lainnya menyebut keempat ikon ini dengan benar 5–6 kali dari 6.

## Draf yang belum lolos (`draf/tengara/`)

| Ikon | Skor | Dibaca sebagai | Arah perbaikan |
|---|---|---|---|
| Siger Lampung | 4/10 | mahkota (selalu) | Butuh ciri Siger yang membedakannya dari mahkota umum |
| Masjid Raya Baiturrahman | 4/10 | masjid (selalu), Masjid Al-Mashun | Kubah bawang saja tidak cukup; coba menara depan |
| Jam Gadang | 2/10 | tugu bulan sabit, gapura, torii | Atap gonjong dari depan terbaca sabit; coba atap berlapis seperti Rumah Gadang |
| Gedung Sate | 2/10 | pagoda, pura, tugu | Bangunan memanjang tidak terbaca pada 24 px; tusuk sate terlalu kecil |
| Candi Prambanan | 1/10 | gereja, masjid, menara | Tiga puncak runcing tanpa gerigi terbaca sebagai menara ibadah lain |

Dibuang: Tugu Jogja (terbaca sebagai Tugu Pahlawan atau Monas) dan Menara Siger berbadan rumah (terbaca sebagai rumah adat atau rumah terbakar).

## Pelajaran

- Siluet harus sudah berbeda sebelum detail ditambahkan. Bentuk umum (tugu, kubah, tiga menara) langsung ditebak sebagai bangunan lain yang lebih terkenal.
- Lingkaran jam yang besar di bawah atap bertanduk terbaca sebagai wajah atau bulan sabit.
- Air di bawah jembatan membantu, tetapi menara pendek membuatnya terbaca sebagai dermaga.
- Pintu lengkung membuat candi terbaca sebagai gereja atau masjid. Candi tidak diberi pintu.

## Calon berikutnya

Menara Kudus (Jawa Tengah), Istana Maimun (Sumatera Utara), Lawang Sewu (Jawa Tengah), Jembatan Suramadu (Jawa Timur), Gong Perdamaian (Maluku), Jembatan Holtekamp (Papua). Jembatan kabel dan lengkung cenderung umum, jadi perlu ciri khas sebelum digambar.
