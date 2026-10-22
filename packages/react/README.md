# @ruas-icons/react

Ikon [Ruas](https://ruas.metabahri.com) untuk React dan Next.js. Set ikon gratis berfalsafah bambu, lisensi MIT.

```bash
npm i @ruas-icons/react
```

```jsx
import { MosqueDome, Bell } from "@ruas-icons/react";

<MosqueDome />                              // 24 px, warna mengikuti teks
<Bell size={20} className="text-emerald-700" />
<MosqueDome title="Masjid terdekat" />      // berdiri sendiri: dibacakan pembaca layar
```

Nama komponen = id ikon dalam PascalCase (`mosque-dome` → `MosqueDome`). Cari id di galeri: https://ruas.metabahri.com

Props: `size` (bawaan 24), `strokeWidth` (bawaan 1,5), `title`, dan semua atribut `<svg>`. Tanpa `title`/`aria-label` ikon dianggap hiasan (`aria-hidden`).

Mode warna Lapis, Aksen, Isi: pasang `@ruas-icons/svg/ruas.css`, lalu beri kelas pada ikon atau pembungkusnya, mis. `className="ruas-aksen"`.

Bisa dipakai di Server Component Next.js (tanpa `"use client"`). Hanya ikon yang diimpor yang ikut ke bundel.
