# FlipPlay — The Midnight Library

**Watch it. Read it. Live it.**

FlipPlay adalah project demo untuk praktikum **Pemrograman Web**. Isi dan
konsepnya tetap sama dengan FlipPlay: satu ruang hiburan untuk anime, drama,
manga, dan light novel. Yang berubah adalah **gaya UI/UX**: landing dan katalog
kini memakai bahasa visual _The Midnight Library_ — gelap, hangat, dengan aksen
kuningan, video nav, parallax, dan kartu media yang diperlakukan seperti buku.

Backend PHP lama tetap dipertahankan sebagai materi praktikum OOP dan tidak
dipakai oleh halaman frontend.

---

## Fitur

### Landing (`src/index.html`)

- Hero **“Watch it. Read it. Live it.”** dengan scene Three.js prosedural,
  parallax, dan statistik 4 format / 1 ruang / ∞ cerita.
- Empat kategori FlipPlay: **Anime, Drama, Manga, Light Novel**.
- Bagian **The FlipPlay idea** dengan dua poin: _Simple discovery_ dan
  _One entertainment space_.
- Form kontak (Nama, Email, Kategori, Pesan) dengan umpan balik demo di klien.
- Nav dengan video latar yang dimuat malas, menu mobile, dan skip link.

### Katalog (`src/vibe-grid.html`)

- **The Vibe Grid**: katalog anime dan manga dari **Kitsu REST API**.
- Pencarian judul dengan debounce 350 ms.
- Filter **Aura**: Semua Vibes, High Energy, Melancholy, Binge Mode, Chill Vibes.
- Filter jenis (Semua/Anime/Manga), filter kategori dinamis, dan urutan
  (paling ramai, rating tertinggi, terbaru).
- Pagination 20 item per jenis dengan tombol **Muat lebih banyak**.
- Modal detail: poster, metadata, kategori, sinopsis, dan tautan ke Kitsu.
- State lengkap: skeleton, pesan kosong, error + tombol coba lagi.
- Tidak ada konsep pinjam buku, rak pinjaman, atau `localStorage`.

### Umum

- Menghormati `prefers-reduced-motion`.
- `aria-expanded`, `aria-pressed`, `aria-live`, `focus-visible`, dan skip link.
- Semua data dinormalisasi sebelum masuk ke view.

---

## Sumber Data: Kitsu REST

- Base URL: `https://kitsu.io/api/edge`
- Tanpa API key, CORS `*`.
- Maksimal **20 item per halaman** (`page[limit]`); pagination lewat
  `page[offset]`.
- Pencarian: `filter[text]=`.
- Urutan: `sort=-userCount`, `-averageRating`, `-startDate`.
- Jenis: endpoint `/anime` atau `/manga`.
- `filter[nsfw]` tidak didukung, jadi item NSFW disaring di klien dari
  `attributes.nsfw`.
- Kategori diambil lewat `include=categories`, lalu
  `relationships.categories.data` dicocokkan dengan entri `included` bertipe
  `categories`.
- `averageRating` berupa string 0–100, dinormalisasi menjadi skala 0–10.
- URL publik: `https://kitsu.io/anime/{slug}` atau
  `https://kitsu.io/manga/{slug}`.

Respons mentah dinormalisasi di `src/frontend/js/api/normalize.js` supaya modul
lain tidak perlu tahu bentuk JSON:API Kitsu.

---

## Struktur Repo

```text
demoModul1/
├── src/
│   ├── index.html                 # Landing FlipPlay
│   ├── vibe-grid.html             # Katalog The Vibe Grid
│   ├── input.css                  # Sumber Tailwind + tema kustom
│   ├── output.css                 # Hasil build Tailwind (jangan diedit)
│   ├── assets/
│   │   ├── nav-poster.jpg         # Poster fallback nav
│   │   ├── nav-loop.webm          # Video nav (VP9)
│   │   └── nav-loop.mp4           # Video nav (H.264)
│   ├── frontend/
│   │   └── js/
│   │       ├── config/kitsu.js    # Konstanta API
│   │       ├── utils.js           # Helper, escapeHtml, registry item
│   │       ├── api/kitsuClient.js # Satu-satunya pemanggil fetch
│   │       ├── api/normalize.js   # Mapper Kitsu -> model internal
│   │       ├── services/mediaService.js # Pencarian + pagination + cache
│   │       ├── modules/auraMapper.js # Definisi Aura dan pencocokan
│   │       ├── modules/filter.js  # Domain murni: query, aura, kategori
│   │       ├── modules/renderer.js # View: kartu, skeleton, notice
│   │       ├── ui/nav.js          # Menu mobile + video lazy
│   │       ├── ui/parallax.js     # Reveal + parallax rAF
│   │       ├── ui/bookModal.js    # Dialog detail
│   │       ├── ui/contactForm.js  # Umpan balik form kontak
│   │       ├── three/heroScene.js # Scene Three.js hero
│   │       ├── home.js            # Composition root landing
│   │       └── vibe-grid.js       # Composition root katalog
│   └── backend/
│       └── src/
│           ├── index.php          # Entry point aplikasi CLI
│           ├── Config/            # Konfigurasi API AniList
│           ├── Models/            # Media, Anime, Manga, User
│           ├── Libraries/         # MediaLibrary
│           └── Services/          # AniListService (cURL)
├── docs/
│   └── rework-midnight-library.md # Bundle kode lengkap
├── package.json
└── README.md
```

---

## Arsitektur Frontend

Alur data dibuat satu arah: **ambil → normalisasi → saring → render**.

- `home.js` / `vibe-grid.js` — **composition root**, satu-satunya entry point
  yang mengenal DOM dan merangkai seluruh modul.
- `api/kitsuClient.js` — **satu-satunya** tempat `fetch` dipanggil, lengkap
  dengan timeout dan `AbortController`.
- `services/mediaService.js` — cache in-memory ber-TTL, pagination, dan
  penggabungan anime + manga.
- `api/normalize.js` — mengubah JSON:API Kitsu menjadi model internal yang
  stabil (`title`, `poster`, `rating`, `categories`, dan seterusnya).
- `modules/auraMapper.js` — definisi Aura dan `matchAura()` berbasis
  `categories`, `subtype`, `episodes`, dan `chapters`.
- `modules/filter.js` — domain murni tanpa DOM/jaringan.
- `modules/renderer.js` — view, satu-satunya tempat penulisan markup kartu.
- `ui/*` — perilaku antarmuka: nav, parallax, modal, form kontak.
- `three/heroScene.js` — scene 3D yang di-`import()` dinamis hanya di landing.

Untuk mode **Semua**, `fetchCatalog()` memanggil endpoint anime dan manga
secara paralel, lalu menggabungkan hasilnya. Setiap item diberi id
`anime-{id}` atau `manga-{id}` agar tidak bertabrakan.

---

## Menjalankan Project

### Prasyarat

- [Node.js](https://nodejs.org/) dan npm
- Koneksi internet (data dari Kitsu, Three.js dari CDN)
- Web server lokal (ES Modules tidak bisa dibuka lewat `file://`)

### Frontend

```bash
npm install
npm run build
npm run dev        # mode watch saat mengembangkan
```

Preview statis:

```bash
npx serve src
```

atau tanpa dependency tambahan:

```bash
python3 -m http.server 4173 --directory src
```

Lalu buka `http://localhost:4173/` untuk landing dan
`http://localhost:4173/vibe-grid.html` untuk katalog.

### Backend (opsional, materi lama)

```bash
php src/backend/src/index.php
```

Aplikasi berjalan di terminal dengan menu interaktif. Backend masih memakai
AniList dan tidak terhubung ke frontend.

---

## Aset Video Nav

Aset di `src/assets/` saat ini adalah **placeholder** gelap yang dibuat lokal
agar halaman langsung berjalan. Ganti dengan klip bertema perpustakaan/buku
dari sumber bebas seperti Coverr, Pexels, atau Mixkit, lalu kompres:

```bash
ffmpeg -i nav-source.mp4 -vf "scale=1280:-2,fps=24" -an \
  -c:v libvpx-vp9 -crf 34 -b:v 0 src/assets/nav-loop.webm

ffmpeg -i nav-source.mp4 -vf "scale=1280:-2,fps=24" -an \
  -c:v libx264 -crf 28 -preset slow -movflags +faststart src/assets/nav-loop.mp4

ffmpeg -i nav-source.mp4 -vf "scale=1280:-2" -frames:v 1 -q:v 4 \
  src/assets/nav-poster.jpg
```

Target: loop 5–8 detik, tanpa audio, total ≤ 1.5 MB.

---

## Catatan

- `output.css` adalah hasil build. Edit gaya di `input.css`.
- Three.js dimuat dari CDN lewat import map (`three@0.169.0`); tidak ada
  bundler.
- Item NSFW disaring di klien karena Kitsu tidak menyediakan filter tersebut.
- Cache pencarian berlaku 10 menit di memori tab (`CACHE_TTL_MS`).
- Gambar kategori di landing memakai Unsplash; poster media berasal dari Kitsu.
- Seluruh kode frontend aktif berada di `src/frontend/js/`.
- Bundle kode lengkap tersedia di
  [`docs/rework-midnight-library.md`](docs/rework-midnight-library.md).

---

Dibuat untuk keperluan pembelajaran pada praktikum Pemrograman Web.

```

---

## 6. Verifikasi yang Sudah Dilakukan

Semua kode di atas diuji pada salinan kerja `/tmp/opencode/flip-final`:

| Uji | Hasil |
|---|---|
| `npm run build` | Sukses, Tailwind v4.3.3 |
| `node --check` semua modul JS | Sukses |
| Kitsu `searchMedia({ kind: "anime", query: "attack on titan", limit: 5 })` | 5 item, `nextOffset` 5 |
| Kitsu `fetchCatalog({ kind: "all", query: "berserk", limit: 5 })` | 10 item (5 anime + 5 manga), `nextOffset` 5 |
| Landing headless | 4 format card, stats 4/1/∞, hero “Watch it. Read it. Live it.”, canvas Three.js aktif, form kontak ada |
| Katalog headless | 40 kartu awal, High Energy 36, Anime 20, pencarian “Berserk” 16, load more menjadi 80 |
| Modal | Terbuka, judul “Attack on Titan”, meta lengkap, tautan Kitsu benar, tidak ada tombol pinjam |
| Form kontak | Status demo muncul, form ter-reset |
| Console error | Tidak ada error JS; favicon 404 dihilangkan dengan `<link rel="icon" href="data:," />` |

Angka hasil uji bergantung pada data Kitsu saat pengujian, bukan nilai tetap.

---

## 7. Checksum SHA-256 File Final

Checksum di bawah dihitung dari file final di salinan kerja yang diuji. Setelah
menulis ulang file, Anda bisa membandingkan hasilnya dengan nilai ini.

| File | SHA-256 |
|---|---|
| `src/index.html` | `9f3e6a9ee7b51c658941d9ccf2c47cdea52baae9fe1da8710a7089755968ca20` |
| `src/vibe-grid.html` | `b426257c1d1103b4336f5d8921081750f8b982459f879cdcb3ccd56aa0ba67f0` |
| `src/input.css` | `3aea4d0b9c35db827b2b9a5dc903a8fd03858820e20837bda82a21e75508db9a` |
| `src/frontend/js/utils.js` | `e6bba9c6d6712dc151e5ee130ecabe4aea151b1549cb63c48b8bf4dc383e3bb6` |
| `src/frontend/js/api/normalize.js` | `4733979b1f878acc4f021dc8661344b0c955c87cc95d8e88b74497fbcecfdf16` |
| `src/frontend/js/services/mediaService.js` | `b5c7a6c0e66f25c02463d9dad93076b9e9050156a1b8f27c280f4d0cb3134793` |
| `src/frontend/js/modules/auraMapper.js` | `4fdfbfc3d4eb3948313ddd18ab29b484ac3d31edf0fb392b03d747dd2de6af42` |
| `src/frontend/js/modules/filter.js` | `8c383a05a43e392507441dfe0b9264d9fd13a95907716c054b1c64b685ff79ae` |
| `src/frontend/js/modules/renderer.js` | `004b43c7cf003cd039c8810e66f7668f9f63b55596a3982ba641415f7cc540ed` |
| `src/frontend/js/ui/nav.js` | `4f067cb4aca5c59241cb387c680e5811c89005e7f59dd17caff01f7976c2a939` |
| `src/frontend/js/ui/bookModal.js` | `231807d6c3e16090ac9da86161b4a1ab8a4977d30510efc5ac459281cb9bcfd5` |
| `src/frontend/js/ui/contactForm.js` | `a5a195233ebe0bb0bec0397a7534074b5a8f1e1cd3671a8bc76f9dedabd31177` |
| `src/frontend/js/home.js` | `7ab22c2e0e52c41d180799303322abd1dbbe02f374566aa5a3be582ab3c73da8` |
| `src/frontend/js/vibe-grid.js` | `e93ad1b636cc30bd903b7292d5b1f67862a4c0a657f2df6a8e8371fb4e724480` |
| `README.md` | `a477e029ff8f48e3a1c615be0b0195cbcff36aa3b317feb9942e4ea6cd895772` |

---

## 8. Catatan Penerapan

- **Jangan menulis `src/output.css` manual.** Setelah `src/input.css` diubah,
  jalankan `npm run build`.
- `src/frontend/js/config/kitsu.js`, `api/kitsuClient.js`, `ui/parallax.js`, dan
  `three/heroScene.js` tidak berubah; biarkan apa adanya.
- `src/backend/**` tidak berubah.
- Aset video/poster nav tidak berubah.
- Gambar kategori landing memakai Unsplash; poster media berasal dari Kitsu.
  Jika salah satu gambar gagal dimuat, layout tetap berjalan.
- Aura adalah filter sisi klien. Artinya, filter bekerja pada item yang sudah
  dimuat; pagination tetap mengambil halaman berikutnya dari Kitsu.
- Untuk mode “Semua”, anime dan manga diambil paralel. ID sudah diberi prefix
  jenis agar tidak bertabrakan.
- Konsep pinjam buku, rak pinjaman, badge, event `library:borrowed-change`, dan
  `localStorage` sudah tidak ada di kode final.
```
