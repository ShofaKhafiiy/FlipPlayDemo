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

