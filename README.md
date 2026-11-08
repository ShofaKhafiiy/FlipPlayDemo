# FlipPlay

**Watch. Read. Repeat.**

FlipPlay adalah project demo untuk praktikum **Pemrograman Web**. Repo ini
diperbarui setiap minggu mengikuti modul yang sedang dipelajari, mulai dari
HTML, CSS/Tailwind, JavaScript, sampai backend PHP berorientasi objek.

Project ini punya dua bagian:

- **Frontend** — landing page FlipPlay dan halaman katalog **The Vibe Grid**
  yang mengambil data anime & manga dari API AniList.
- **Backend** — aplikasi CLI PHP (OOP) untuk mencari media, melihat detail,
  dan menyimpan koleksi pengguna.

---

## Fitur

### Frontend

- Landing page responsif dengan navigasi mobile (masthead) dan form kontak.
- Katalog **The Vibe Grid** yang mengambil data dari AniList GraphQL API.
- Pencarian judul secara real-time (debounced) dan filter **Aura/Vibes**:
  `High Energy`, `Melancholy`, `Binge Mode`, dan `Chill Vibes`.
- Tampilan state yang lengkap: skeleton saat memuat, pesan kosong, dan pesan
  error (termasuk penanganan rate limit `429`).
- Desain bergaya katalog cetak (riso/letterpress) dengan Tailwind CSS v4.

### Backend

- Pencarian anime/manga dari AniList lewat `cURL`.
- Penyimpanan media yang sudah ditemukan ke `MediaLibrary`.
- Detail media, pencarian judul dari daftar lokal, dan koleksi per user.
- Struktur OOP dengan `abstract class Media`, turunan `Anime`/`Manga`,
  `User`, `MediaLibrary`, dan `AniListService`.

---

## Peta Modul

Repo ini bertumbuh mengikuti modul praktikum per minggu. Tabel berikut
merangkum bagian kode yang mewakili tiap tahap (sesuaikan nomor minggu
dengan silabus kelas bila berbeda).

| Modul | Fokus Materi | Implementasi di Repo |
| ----- | ------------ | -------------------- |
| 1 | HTML dasar & struktur halaman | `src/index.html` |
| 2 | CSS & styling (Tailwind CSS) | `src/input.css`, `src/output.css`, `package.json` |
| 3 | JavaScript & manipulasi DOM | `src/js/app.js`, `src/js/utils/domHelpers.js` |
| 4 | Modularisasi JS & Fetch API | `src/js/main.js`, `src/js/services/`, `src/js/modules/`, `src/vibe-grid.html` |
| 5 | PHP dasar & OOP | `src/backend/src/Models/`, `src/backend/src/Libraries/` |
| 6 | Integrasi API di PHP (cURL) | `src/backend/src/Services/AnilistService.php`, `src/backend/src/Config/` |

> Setiap modul baru ditambahkan tanpa menghapus implementasi modul sebelumnya,
> sehingga repo ini sekaligus menjadi catatan perkembangan belajar.

---

## Struktur Repo

```text
demoModul1/
├── src/
│   ├── index.html              # Landing page FlipPlay
│   ├── vibe-grid.html          # Halaman katalog anime & manga
│   ├── input.css               # Sumber Tailwind + tema kustom
│   ├── output.css              # Hasil build Tailwind
│   ├── js/
│   │   ├── app.js              # Navigasi mobile landing page
│   │   ├── main.js             # Composition root The Vibe Grid
│   │   ├── config/api.js       # Konstanta API (tanpa efek samping)
│   │   ├── services/           # Lapisan I/O (satu-satunya pemanggil fetch)
│   │   ├── modules/            # Filter & renderer (domain + view)
│   │   └── utils/              # Helper murni, DOM helper, aura mapper
│   └── backend/
│       └── src/
│           ├── index.php       # Entry point aplikasi CLI
│           ├── Config/         # Konfigurasi API
│           ├── Models/         # Media, Anime, Manga, User
│           ├── Libraries/      # MediaLibrary
│           └── Services/       # AniListService (cURL)
├── package.json
└── README.md
```

---

## Teknologi

- **HTML5** & **CSS** (Tailwind CSS v4)
- **JavaScript (ES Modules)** — tanpa framework/bundler
- **PHP** (OOP, `curl`, `readline` via STDIN)
- **AniList GraphQL API** sebagai sumber data

---

## Menjalankan Project

### Prasyarat

- [Node.js](https://nodejs.org/) dan npm
- [PHP](https://www.php.net/) 8.0+ dengan ekstensi `curl`
- Koneksi internet (data diambil dari AniList)

### Frontend

```bash
# 1. Install dependency
npm install

# 2. Build CSS sekali jalan
npm run build

# 3. Atau jalankan mode watch saat mengembangkan
npm run dev
```

Setelah `output.css` tersedia, buka halaman lewat web server lokal, misalnya
ekstensi **Live Server** di VS Code (port sudah diatur ke `5501` di
`.vscode/settings.json`) atau:

```bash
npx serve src
```

Lalu buka `index.html` untuk landing page dan `vibe-grid.html` untuk katalog.

> Membuka file HTML langsung lewat `file://` bisa gagal karena browser
> memblokir module dan `fetch`. Gunakan web server lokal.

### Backend

```bash
php src/backend/src/index.php
```

Aplikasi berjalan di terminal dengan menu interaktif (cari media, lihat
detail, tambah ke koleksi, dan lain-lain).

Sebelum menjalankan backend, pastikan `src/backend/src/Config/ApiConfig.php`
sudah mendefinisikan konstanta yang dipakai service:

```php
namespace FlipPlay\Config;

class ApiConfig
{
    public const API_URL = "https://graphql.anilist.co";
    public const PAGE_SIZE = 10;
    public const TIMEOUT = 15;
}
```

---

## Arsitektur Frontend

The Vibe Grid sengaja dipisah per tanggung jawab agar mudah dipelajari:

- `main.js` — **composition root**, satu-satunya file yang mengenal DOM dan
  seluruh modul lain.
- `services/mediaService.js` — **satu-satunya** tempat pemanggilan `fetch`;
  output sudah dinormalisasi.
- `modules/filter.js`, `utils/auraMapper.js` — **domain murni**, tanpa DOM
  dan tanpa jaringan.
- `modules/renderer.js` — **view**, satu-satunya tempat penulisan markup.
- `utils/helpers.js`, `utils/domHelpers.js` — utilitas murni dan pembantu DOM.

Aturan ini menjaga alur data tetap jelas: ambil data → saring → render.

---

## Catatan

- AniList membatasi sekitar **30 permintaan per menit**. Jika muncul error
  `429`, tunggu beberapa saat lalu muat ulang halaman.
- `output.css` adalah hasil build. Edit gaya di `input.css`, bukan di
  `output.css`.
- `node_modules/`, `.env`, dan berkas log tidak ikut di-track (lihat
  `.gitignore`).

---

Dibuat untuk keperluan pembelajaran pada praktikum Pemrograman Web.
