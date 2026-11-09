# FlipPlay — The Midnight Library: Perubahan Kode Final

> Dokumen ini berisi **seluruh kode final** untuk mengubah edisi *Midnight
> Library* (konsep pinjam buku) menjadi **FlipPlay dengan konsep/isi asli,
> tetapi memakai gaya UI/UX Midnight Library**.
>
> Semua blok kode di bawah diambil langsung dari salinan kerja yang sudah
> di-build dan diuji dengan Kitsu API serta headless Chrome. Tidak ada kode
> yang ditulis dari ingatan.
>
> Dokumen ini menggantikan bundle `docs/rework-midnight-library.md` sebelumnya.

---

## 1. Keputusan yang Diterapkan

| Aspek | Keputusan |
|---|---|
| Konsep/isi | Kembali ke FlipPlay: landing 4 format + about + contact, katalog anime/manga |
| Gaya UI/UX | Tetap **The Midnight Library**: gelap, parchment, kuningan, video nav, parallax, kartu seperti buku |
| Sumber data | **Kitsu REST API** |
| Katalog | Ditingkatkan: search, 4 Aura, filter jenis, filter kategori, sort, pagination, modal detail |
| Pinjam buku | **Dihapus total**: tidak ada rak pinjaman, badge, tombol pinjam, atau `localStorage` |
| Backend | Tidak disentuh |

---

## 2. Peta Perubahan File

| File | Status | Keterangan |
|---|---|---|
| `src/index.html` | Tulis ulang | Landing FlipPlay dengan gaya Midnight Library |
| `src/library.html` | Ganti nama | Menjadi `src/vibe-grid.html` |
| `src/vibe-grid.html` | Baru | Katalog The Vibe Grid |
| `src/input.css` | Ubah | Tambah komponen landing/katalog, hapus komponen pinjaman |
| `src/frontend/js/utils.js` | Ubah | Hapus helper tak terpakai dan localStorage |
| `src/frontend/js/api/normalize.js` | Ubah | ID unik per jenis + label subtype |
| `src/frontend/js/services/mediaService.js` | Tulis ulang | Kitsu `searchMedia` + `fetchCatalog` |
| `src/frontend/js/modules/auraMapper.js` | Baru | Definisi Aura berbasis kategori Kitsu |
| `src/frontend/js/modules/filter.js` | Ubah | Query + aura + kategori + jenis |
| `src/frontend/js/modules/renderer.js` | Ubah | Kartu media + badge jenis |
| `src/frontend/js/ui/nav.js` | Ubah | Hapus badge pinjaman |
| `src/frontend/js/ui/bookModal.js` | Ubah | Hapus aksi pinjam |
| `src/frontend/js/ui/contactForm.js` | Baru | Umpan balik form kontak |
| `src/frontend/js/home.js` | Ubah | Composition root landing |
| `src/frontend/js/library.js` | Ganti nama | Menjadi `src/frontend/js/vibe-grid.js` |
| `src/frontend/js/vibe-grid.js` | Baru | Composition root katalog |
| `src/frontend/js/ui/borrowedShelf.js` | Hapus | Tidak dipakai lagi |
| `README.md` | Ubah | Dokumentasi final |

### File yang tidak berubah

| File | Keterangan |
|---|---|
| `src/frontend/js/config/kitsu.js` | Konstanta Kitsu, `PAGE_LIMIT`, `CACHE_TTL_MS`, `SORT` |
| `src/frontend/js/api/kitsuClient.js` | Satu-satunya pemanggil `fetch` |
| `src/frontend/js/ui/parallax.js` | Reveal + parallax |
| `src/frontend/js/three/heroScene.js` | Scene Three.js hero |
| `package.json` | Script build/dev tetap |
| `src/assets/*` | Video/poster nav tetap |
| `src/backend/**` | Backend PHP tidak diubah |
| `src/output.css` | Hasil build, jangan ditulis manual |

File lama `src/js/*` dan `src/vibe-grid.html` versi AniList sudah terhapus pada
rework sebelumnya dan tetap dibiarkan terhapus.

---

## 3. Urutan Penerapan Manual

1. Ganti nama `src/library.html` menjadi `src/vibe-grid.html`.
2. Ganti nama `src/frontend/js/library.js` menjadi
   `src/frontend/js/vibe-grid.js`.
3. Hapus `src/frontend/js/ui/borrowedShelf.js`.
4. Tulis ulang file HTML, CSS, dan JavaScript sesuai urutan di bawah.
5. Perbarui `README.md`.
6. Jalankan `npm run build` untuk membuat `src/output.css`.
7. Jalankan server statis dan uji landing + katalog.

---

## 4. Logika Singkat

- **`index.html`** — landing statis: hero + stats, 4 kartu format, about,
  contact. Three.js dan parallax tetap dipakai. Tidak ada fetch data di landing.
- **`vibe-grid.html`** — katalog: toolbar search/jenis/sort, wadah Aura dan
  kategori yang diisi JS, grid, tombol load more, modal detail tanpa pinjam.
- **`input.css`** — token Midnight Library dipertahankan; komponen pinjaman
  dihapus; komponen baru ditambahkan untuk stats, format card, about points,
  contact, badge jenis, dan footer.
- **`utils.js`** — registry item untuk modal, escape HTML, format rating,
  `bookStyle` deterministik, dan `debounce`.
- **`normalize.js`** — Kitsu JSON:API menjadi model internal. ID diberi prefix
  `anime-`/`manga-` agar tidak bertabrakan saat anime dan manga digabung.
- **`mediaService.js`** — satu-satunya lapisan I/O katalog. `searchMedia`
  mengambil satu jenis; `fetchCatalog` menggabungkan anime+manga secara paralel
  untuk mode “Semua”. Cache berlaku 10 menit.
- **`auraMapper.js`** — Aura dicocokkan lewat `categories`, `subtype`,
  `episodes`, dan `chapters` Kitsu, bukan `tags` AniList.
- **`filter.js`** — menyaring item berdasarkan jenis, kategori, aura, dan
  kata kunci. Semua fungsi murni, tanpa DOM/fetch.
- **`renderer.js`** — merender kartu buku, badge jenis, rating, skeleton, dan
  notice. Item disimpan ke registry agar modal bisa mengambilnya.
- **`nav.js`** — menu mobile, Escape, klik luar, scroll state, dan video lazy.
- **`bookModal.js`** — membuka detail dari registry, mengisi poster, metadata,
  kategori, sinopsis, dan tautan Kitsu. Tidak ada aksi pinjam.
- **`contactForm.js`** — mencegah submit reload, validasi HTML, tampilkan status
  demo, lalu reset form.
- **`home.js`** — composition root landing.
- **`vibe-grid.js`** — composition root katalog: state, chip Aura/kategori,
  filter, load/pagination, dan event.
- **`README.md`** — dokumentasi final.

---

## 5. Kode Final

### 5.1 `src/index.html`

**Status:** Tulis ulang total

Landing FlipPlay dengan gaya Midnight Library.

- Head: title/description FlipPlay, font, `output.css`, import map Three.js,
  dan `home.js`.
- Nav: video lazy, brand FlipPlay + “Watch · Read · Live”, link
  Home/Explore/About/Contact/Vibe Grid.
- Hero: copy “Watch it. Read it. Live it.”, stats 4/1/∞, CTA ke katalog dan
  about. Canvas Three.js dan `data-depth` tetap.
- Explore: 4 kartu statis Anime, Drama, Manga, Light Novel.
- About: “The FlipPlay idea” + dua poin.
- Contact: form Nama, Email, Kategori, Pesan, status demo.
- Footer: brand, tagline, link, credit Kitsu.
- Tidak ada modal, rak, atau tombol pinjam.

````html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FlipPlay — Watch. Read. Live.</title>
    <meta
      name="description"
      content="FlipPlay menyatukan anime, drama, manga, dan light novel dalam satu ruang hiburan digital yang sederhana dan nyaman."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <link rel="icon" href="data:," />
    <link rel="stylesheet" href="./output.css" />
    <script type="importmap">
      {
        "imports": {
          "three": "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js"
        }
      }
    </script>
    <script type="module" src="./frontend/js/home.js"></script>
  </head>
  <body>
    <a class="skip-link" href="#konten">Lewati ke konten</a>

    <header class="nav" data-nav>
      <video
        class="nav__video"
        data-nav-video
        data-src-webm="./assets/nav-loop.webm"
        data-src-mp4="./assets/nav-loop.mp4"
        poster="./assets/nav-poster.jpg"
        muted
        loop
        playsinline
        preload="none"
        disablepictureinpicture
        aria-hidden="true"
      ></video>
      <div class="nav__scrim" aria-hidden="true"></div>

      <div class="nav__inner">
        <a class="nav__brand" href="./index.html">
          <span class="nav__brand-mark">FL</span>
          <span>
            FlipPlay
            <em>Watch · Read · Live</em>
          </span>
        </a>

        <nav class="nav__links" id="nav-links" data-nav-links aria-label="Navigasi utama">
          <a class="nav__link" href="#home" aria-current="page">Home</a>
          <a class="nav__link" href="#explore">Explore</a>
          <a class="nav__link" href="#about">About</a>
          <a class="nav__link" href="#contact">Contact</a>
          <a class="nav__link" href="./vibe-grid.html">Vibe Grid</a>
        </nav>

        <button
          class="nav__toggle"
          type="button"
          data-nav-toggle
          aria-expanded="false"
          aria-controls="nav-links"
          aria-label="Buka menu"
        >
          <span class="nav__toggle-bar"></span>
          <span class="nav__toggle-bar"></span>
        </button>
      </div>
    </header>

    <main id="konten">
      <section class="hero" id="home" data-hero>
        <div class="hero__poster" aria-hidden="true"></div>
        <canvas class="hero__canvas" data-hero-canvas aria-hidden="true"></canvas>
        <div class="hero__vignette" aria-hidden="true"></div>

        <div class="hero__content" data-depth="0.15">
          <p class="eyebrow">Your entertainment shelf</p>
          <h1 class="hero__title">
            Watch it.<br />
            Read it.<br />
            <span>Live it.</span>
          </h1>
          <p class="hero__lede">
            FlipPlay menyatukan anime, drama, manga, dan light novel dalam satu
            ruang hiburan digital yang sederhana dan nyaman.
          </p>
          <div class="hero__actions">
            <a class="btn btn--brass" href="./vibe-grid.html">Jelajahi koleksi</a>
            <a class="btn btn--ghost" href="#about">Kenapa FlipPlay?</a>
          </div>

          <div class="hero__stats" aria-label="Ringkasan FlipPlay">
            <div class="stat">
              <p class="stat__value">4</p>
              <p class="stat__label">Format hiburan</p>
            </div>
            <div class="stat">
              <p class="stat__value">1</p>
              <p class="stat__label">Ruang terpadu</p>
            </div>
            <div class="stat">
              <p class="stat__value">∞</p>
              <p class="stat__label">Cerita</p>
            </div>
          </div>
        </div>

        <a class="hero__scroll" href="#explore">Gulir</a>
      </section>

      <section class="section" id="explore">
        <div class="section__head" data-reveal>
          <p class="eyebrow">Explore the shelf</p>
          <h2 class="section__title">Pick your mood.</h2>
          <p class="section__lede">
            Empat kategori utama FlipPlay dirancang untuk membuat pengguna
            menemukan hiburan tanpa berpindah-pindah platform.
          </p>
        </div>

        <div class="format-grid" data-reveal>
          <article class="format-card">
            <img
              class="format-card__media"
              src="https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?auto=format&amp;fit=crop&amp;w=1000&amp;q=85"
              alt="Ilustrasi layar untuk kategori anime"
              loading="lazy"
            />
            <div class="format-card__body">
              <div class="format-card__top">
                <span class="format-card__index">01 / Watch</span>
                <span class="format-card__kind">Anime</span>
              </div>
              <h3 class="format-card__title">Anime After Hours</h3>
              <p class="format-card__copy">
                Temukan cerita animasi dari petualangan ringan hingga dunia
                fantasi yang penuh karakter unik.
              </p>
            </div>
          </article>

          <article class="format-card">
            <img
              class="format-card__media"
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&amp;fit=crop&amp;w=1000&amp;q=85"
              alt="Ilustrasi suasana menonton drama"
              loading="lazy"
            />
            <div class="format-card__body">
              <div class="format-card__top">
                <span class="format-card__index">02 / Watch</span>
                <span class="format-card__kind">Drama</span>
              </div>
              <h3 class="format-card__title">Drama for Every Night</h3>
              <p class="format-card__copy">
                Pilih kisah yang dekat dengan kehidupan, penuh emosi, konflik,
                dan momen yang membuat penasaran.
              </p>
            </div>
          </article>

          <article class="format-card">
            <img
              class="format-card__media"
              src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&amp;fit=crop&amp;w=1000&amp;q=85"
              alt="Buku yang mewakili kategori manga"
              loading="lazy"
            />
            <div class="format-card__body">
              <div class="format-card__top">
                <span class="format-card__index">03 / Read</span>
                <span class="format-card__kind">Manga</span>
              </div>
              <h3 class="format-card__title">Turn the Page</h3>
              <p class="format-card__copy">
                Baca manga favorit dalam pengalaman digital yang ringkas, mudah
                dijelajahi, dan nyaman untuk sesi membaca panjang.
              </p>
            </div>
          </article>

          <article class="format-card">
            <img
              class="format-card__media"
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&amp;fit=crop&amp;w=1000&amp;q=85"
              alt="Koleksi buku yang mewakili light novel"
              loading="lazy"
            />
            <div class="format-card__body">
              <div class="format-card__top">
                <span class="format-card__index">04 / Read</span>
                <span class="format-card__kind">Light Novel</span>
              </div>
              <h3 class="format-card__title">Words Become Worlds</h3>
              <p class="format-card__copy">
                Masuk lebih dalam ke cerita melalui narasi dan dunia yang
                berkembang halaman demi halaman.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section class="section about" id="about">
        <div class="about__art" data-depth="0.35" aria-hidden="true">
          <span class="about__ring"></span>
          <span class="about__ring about__ring--2"></span>
        </div>

        <div class="about__copy" data-reveal>
          <p class="eyebrow">The FlipPlay idea</p>
          <h2 class="section__title">
            Tidak perlu memilih antara menonton atau membaca.
          </h2>
          <p>
            FlipPlay dirancang sebagai satu pengalaman terpadu untuk menikmati
            berbagai bentuk cerita digital.
          </p>
          <p>
            Dari episode yang sedang ditonton sampai halaman terakhir yang
            dibaca, semuanya berada dalam satu ekosistem hiburan yang mudah
            dipahami.
          </p>

          <div class="about__points">
            <div class="about__point">
              <p class="about__point-num">01</p>
              <p class="about__point-label">Simple discovery</p>
            </div>
            <div class="about__point about__point--dark">
              <p class="about__point-num">02</p>
              <p class="about__point-label">One entertainment space</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="contact">
        <div class="contact" data-reveal>
          <div class="contact__head">
            <p class="eyebrow">Stay in the loop</p>
            <h2 class="section__title">Punya cerita untuk FlipPlay?</h2>
            <p class="section__lede">
              Kirimkan pesan atau ide Anda. Form ini menjadi titik awal
              interaksi pengguna pada landing page FlipPlay.
            </p>
          </div>

          <form class="contact__form" data-contact-form action="#" method="post">
            <label class="contact__field">
              <span class="contact__label">Nama</span>
              <input
                class="contact__input"
                id="name"
                name="name"
                type="text"
                placeholder="Nama Anda"
                required
              />
            </label>

            <label class="contact__field">
              <span class="contact__label">Email</span>
              <input
                class="contact__input"
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                required
              />
            </label>

            <label class="contact__field contact__field--full">
              <span class="contact__label">Apa yang ingin Anda sampaikan?</span>
              <select class="contact__input" id="category" name="category">
                <option value="feedback">Feedback</option>
                <option value="content">Saran konten</option>
                <option value="collaboration">Kolaborasi</option>
              </select>
            </label>

            <label class="contact__field contact__field--full">
              <span class="contact__label">Pesan</span>
              <textarea
                class="contact__input contact__textarea"
                id="message"
                name="message"
                rows="5"
                placeholder="Tulis pesan Anda..."
                required
              ></textarea>
            </label>

            <div class="contact__field contact__field--full">
              <button class="btn btn--brass contact__submit" type="submit">
                Kirim pesan →
              </button>
              <p
                class="contact__status"
                data-contact-status
                role="status"
                aria-live="polite"
                hidden
              ></p>
            </div>
          </form>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p class="site-footer__brand">Flip<span>Play</span></p>
      <p class="site-footer__tagline">Watch. Read. Repeat.</p>
      <nav class="site-footer__links" aria-label="Navigasi footer">
        <a href="#home">Home</a>
        <a href="#explore">Explore</a>
        <a href="./vibe-grid.html">Vibe Grid</a>
        <a href="#contact">Contact</a>
      </nav>
      <p class="site-footer__licence">© 2026 FlipPlay · Data dari Kitsu</p>
    </footer>
  </body>
</html>
````

---

### 5.2 `src/vibe-grid.html`

**Status:** Ganti nama dari `library.html`, lalu tulis ulang

Katalog The Vibe Grid.

- Head memuat `vibe-grid.js`; import map Three.js tidak diperlukan.
- Nav menandai Vibe Grid sebagai halaman aktif.
- Toolbar: search, jenis (Semua/Anime/Manga), sort.
- `data-aura-chips` dan `data-category-chips` diisi oleh JavaScript.
- Grid `book-grid`, tombol load more, modal detail.
- Modal hanya punya tautan “Buka di Kitsu”; tidak ada tombol pinjam.

````html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>The Vibe Grid — FlipPlay</title>
    <meta
      name="description"
      content="Katalog anime dan manga FlipPlay. Cari judul, pilih jenis, saring kategori, dan temukan vibe yang cocok."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <link rel="icon" href="data:," />
    <link rel="stylesheet" href="./output.css" />
    <script type="module" src="./frontend/js/vibe-grid.js"></script>
  </head>
  <body>
    <a class="skip-link" href="#konten">Lewati ke konten</a>

    <header class="nav" data-nav>
      <video
        class="nav__video"
        data-nav-video
        data-src-webm="./assets/nav-loop.webm"
        data-src-mp4="./assets/nav-loop.mp4"
        poster="./assets/nav-poster.jpg"
        muted
        loop
        playsinline
        preload="none"
        disablepictureinpicture
        aria-hidden="true"
      ></video>
      <div class="nav__scrim" aria-hidden="true"></div>

      <div class="nav__inner">
        <a class="nav__brand" href="./index.html">
          <span class="nav__brand-mark">FL</span>
          <span>
            FlipPlay
            <em>Watch · Read · Live</em>
          </span>
        </a>

        <nav class="nav__links" id="nav-links" data-nav-links aria-label="Navigasi utama">
          <a class="nav__link" href="./index.html">Home</a>
          <a class="nav__link" href="./index.html#explore">Explore</a>
          <a class="nav__link" href="./index.html#about">About</a>
          <a class="nav__link" href="./index.html#contact">Contact</a>
          <a class="nav__link" href="./vibe-grid.html" aria-current="page">Vibe Grid</a>
        </nav>

        <button
          class="nav__toggle"
          type="button"
          data-nav-toggle
          aria-expanded="false"
          aria-controls="nav-links"
          aria-label="Buka menu"
        >
          <span class="nav__toggle-bar"></span>
          <span class="nav__toggle-bar"></span>
        </button>
      </div>
    </header>

    <main id="konten">
      <section class="page-head" data-reveal>
        <p class="eyebrow">The Vibe Grid</p>
        <h1>Katalog Anime &amp; Manga</h1>
        <p>
          Cari judul, pilih jenis, saring kategori, lalu tentukan urutan rak.
          Tekan sebuah kartu untuk melihat detail.
        </p>
      </section>

      <section class="section library" id="katalog">
        <div class="library-toolbar" data-reveal>
          <label class="field">
            <span class="field__label">Cari judul</span>
            <input
              class="field__input"
              type="search"
              data-library-search
              placeholder="Cari judul atau genre…"
              autocomplete="off"
            />
          </label>

          <div class="field">
            <span class="field__label">Jenis</span>
            <div class="chips" data-kind-chips role="group" aria-label="Jenis judul">
              <button class="chip is-active" type="button" data-kind="all" aria-pressed="true">
                Semua
              </button>
              <button class="chip" type="button" data-kind="anime" aria-pressed="false">
                Anime
              </button>
              <button class="chip" type="button" data-kind="manga" aria-pressed="false">
                Manga
              </button>
            </div>
          </div>

          <label class="field">
            <span class="field__label">Urutkan</span>
            <select class="select" data-sort>
              <option value="popular">Paling ramai</option>
              <option value="rating">Rating tertinggi</option>
              <option value="newest">Terbaru</option>
            </select>
          </label>
        </div>

        <div class="library-vibes">
          <span class="field__label">Vibe</span>
          <div class="chips chips--aura" data-aura-chips role="group" aria-label="Filter aura"></div>
        </div>

        <div class="library-meta">
          <p class="result-count" data-result-count></p>
          <p class="status" data-library-status role="status" aria-live="polite"></p>
        </div>

        <div
          class="chips chips--categories"
          data-category-chips
          role="group"
          aria-label="Kategori"
        ></div>

        <div class="book-grid" data-library-grid aria-live="polite"></div>

        <div class="library-more">
          <button class="btn btn--ghost" type="button" data-load-more hidden>
            Muat lebih banyak
          </button>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p class="site-footer__brand">Flip<span>Play</span></p>
      <p class="site-footer__tagline">Watch. Read. Repeat.</p>
      <nav class="site-footer__links" aria-label="Navigasi footer">
        <a href="./index.html">Home</a>
        <a href="./index.html#explore">Explore</a>
        <a href="./vibe-grid.html">Vibe Grid</a>
        <a href="./index.html#contact">Contact</a>
      </nav>
      <p class="site-footer__licence">© 2026 FlipPlay · Data dari Kitsu</p>
    </footer>

    <dialog class="modal" data-book-modal aria-labelledby="modal-title">
      <div class="modal__panel">
        <button class="modal__close" type="button" data-modal-close aria-label="Tutup detail">
          ×
        </button>
        <div class="modal__poster" data-modal-poster aria-hidden="true"></div>
        <div class="modal__body">
          <h2 class="modal__title" id="modal-title" data-modal-title></h2>
          <p class="modal__meta" data-modal-meta></p>
          <div class="modal__categories" data-modal-categories></div>
          <p class="modal__synopsis" data-modal-synopsis></p>
          <div class="modal__actions">
            <a
              class="btn btn--brass"
              data-modal-link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buka di Kitsu
            </a>
          </div>
        </div>
      </div>
    </dialog>
  </body>
</html>
````

---

### 5.3 `src/input.css`

**Status:** Ubah

Penyesuaian tema Midnight Library untuk konten FlipPlay.

- Token warna/font tetap.
- Hapus `.badge`, `.shelf`, `.shelf__head`, `.shelf__grid`, dan
  `.borrowed-empty`.
- Tambah `.hero__stats`, `.format-grid`, `.format-card*`, `.about__points`,
  `.contact*`, `.book__kind`, `.library-vibes`, dan kelas footer.
- `.book-grid` menggantikan `.shelf__grid`.
- Media query dan `prefers-reduced-motion` diperbarui.

````css
@import "tailwindcss";

@theme {
  --color-ink: #0b0907;
  --color-ink-2: #14100c;
  --color-ink-3: #1d1712;
  --color-parchment: #f2e6cf;
  --color-parchment-dim: #c9b99a;
  --color-brass: #c79a4b;
  --color-brass-soft: #e2c07a;
  --color-wood: #5a2f22;
  --color-wood-dark: #3a1d15;
  --font-display: "Cormorant Garamond", "Georgia", serif;
  --font-body: "Inter", "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--color-ink);
  color: var(--color-parchment);
  font-family: var(--font-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

body.nav-open {
  overflow: hidden;
}

img,
video,
canvas {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font: inherit;
  color: inherit;
}

:focus-visible {
  outline: 2px solid var(--color-brass-soft);
  outline-offset: 3px;
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: -4rem;
  z-index: 100;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  background: var(--color-brass);
  color: #1a1208;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 1rem;
}

/* Navigasi */

.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  isolation: isolate;
  border-bottom: 1px solid transparent;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.nav.is-scrolled {
  background: color-mix(in srgb, var(--color-ink) 88%, transparent);
  backdrop-filter: blur(14px);
  border-bottom-color: color-mix(in srgb, var(--color-brass) 25%, transparent);
}

.nav__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.22;
  z-index: -2;
}

.nav__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(11, 9, 7, 0.55), rgba(11, 9, 7, 0.92));
  z-index: -1;
}

.nav__inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0.9rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.nav__brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  letter-spacing: 0.02em;
}

.nav__brand em {
  display: block;
  font-family: var(--font-body);
  font-size: 0.62rem;
  font-style: normal;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--color-parchment-dim);
}

.nav__brand-mark {
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  border: 1px solid var(--color-brass);
  border-radius: 50%;
  font-size: 0.8rem;
  color: var(--color-brass-soft);
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.nav__link {
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  font-size: 0.9rem;
  color: var(--color-parchment-dim);
  transition: color 0.2s ease, background 0.2s ease;
}

.nav__link:hover {
  color: var(--color-parchment);
  background: rgba(199, 154, 75, 0.12);
}

.nav__toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 0.3rem;
  width: 2.6rem;
  height: 2.6rem;
  padding: 0 0.6rem;
  border: 1px solid rgba(199, 154, 75, 0.35);
  border-radius: 0.6rem;
  background: rgba(11, 9, 7, 0.5);
  cursor: pointer;
}

.nav__toggle-bar {
  display: block;
  height: 2px;
  background: var(--color-parchment);
  transition: transform 0.25s ease;
}

.nav.is-open .nav__toggle-bar:first-child {
  transform: translateY(3px) rotate(45deg);
}

.nav.is-open .nav__toggle-bar:last-child {
  transform: translateY(-3px) rotate(-45deg);
}

@media (max-width: 899px) {
  .nav__toggle {
    display: inline-flex;
  }

  .nav__links {
    position: fixed;
    inset: 4.6rem 1rem auto;
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    background: rgba(20, 16, 12, 0.98);
    border: 1px solid rgba(199, 154, 75, 0.25);
    border-radius: 1rem;
    opacity: 0;
    pointer-events: none;
    transform: translateY(-0.5rem);
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  .nav.is-open .nav__links {
    opacity: 1;
    pointer-events: auto;
    transform: none;
  }
}

/* Hero */

.hero {
  position: relative;
  min-height: 100svh;
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: 7rem 1.25rem 4rem;
}

.hero__canvas,
.hero__poster,
.hero__vignette {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero__poster {
  z-index: 0;
  background: radial-gradient(circle at 70% 40%, #3a2418, #0b0907 60%);
}

.hero__canvas {
  z-index: 1;
}

.hero__vignette {
  z-index: 2;
  background: radial-gradient(
    circle at 50% 45%,
    transparent 30%,
    rgba(11, 9, 7, 0.55) 75%,
    var(--color-ink) 100%
  );
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 3;
  max-width: 640px;
  text-align: center;
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 7vw, 5.4rem);
  line-height: 0.98;
  margin: 0.6rem 0 1rem;
  font-weight: 500;
}

.hero__title span {
  color: var(--color-brass-soft);
  font-style: italic;
}

.hero__lede {
  color: var(--color-parchment-dim);
  max-width: 46ch;
  margin: 0 auto 1.8rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
}

.hero__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  max-width: 30rem;
  margin: 2.5rem auto 0;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(199, 154, 75, 0.2);
  text-align: left;
}

.stat__value {
  margin: 0;
  font-family: var(--font-display);
  font-size: 2rem;
  line-height: 1;
  color: var(--color-brass-soft);
}

.stat__label {
  margin: 0.25rem 0 0;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-parchment-dim);
}

.hero__scroll {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-parchment-dim);
}

.hero--no-webgl .hero__canvas {
  display: none;
}

/* Tombol */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.88rem;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn--brass {
  background: var(--color-brass);
  color: #1a1208;
  font-weight: 600;
}

.btn--brass:hover {
  background: var(--color-brass-soft);
}

.btn--ghost {
  border-color: rgba(199, 154, 75, 0.4);
  color: var(--color-parchment);
  background: rgba(199, 154, 75, 0.06);
}

/* Bagian umum */

.section {
  max-width: 1180px;
  margin: 0 auto;
  padding: 5rem 1.25rem;
}

.section__head {
  max-width: 60ch;
  margin-bottom: 2.5rem;
}

.section__title {
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 4vw, 3rem);
  line-height: 1.05;
  margin: 0.4rem 0 0.8rem;
  font-weight: 500;
}

.section__lede {
  color: var(--color-parchment-dim);
}

.eyebrow {
  margin: 0;
  font-size: 0.68rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--color-brass);
}

/* Grid dan kartu media */

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem 1.1rem;
  align-items: end;
}

.book {
  min-width: 0;
}

.book__open {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
}

.book__cover {
  position: relative;
  display: block;
  height: var(--book-height, 220px);
  border-radius: 4px 10px 10px 4px;
  background: var(--book-tone, #5a2f22);
  box-shadow: 0 18px 30px -18px rgba(0, 0, 0, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  overflow: hidden;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.book__open:hover .book__cover,
.book__open:focus-visible .book__cover {
  transform: translateY(-10px) rotate(-1deg);
  box-shadow: 0 30px 40px -20px rgba(0, 0, 0, 0.95);
}

.book__cover-inner {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.92;
}

.book__cover-inner::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(11, 9, 7, 0.05), rgba(11, 9, 7, 0.55));
}

.book__spine {
  position: absolute;
  inset: 0 auto 0 0;
  width: 12px;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.55), rgba(255, 255, 255, 0.08) 60%, transparent);
}

.book__rating {
  position: absolute;
  right: 0.45rem;
  bottom: 0.45rem;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: rgba(11, 9, 7, 0.82);
  color: var(--color-brass-soft);
  font-size: 0.68rem;
}

.book__kind {
  position: absolute;
  top: 0.45rem;
  left: 0.55rem;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: rgba(11, 9, 7, 0.82);
  color: var(--color-parchment);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.book__title {
  font-size: 0.92rem;
  line-height: 1.3;
  color: var(--color-parchment);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book__meta {
  font-size: 0.72rem;
  color: var(--color-parchment-dim);
}

/* Chip dan form */

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.chip {
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  border: 1px solid rgba(199, 154, 75, 0.28);
  background: rgba(199, 154, 75, 0.05);
  color: var(--color-parchment-dim);
  font-size: 0.78rem;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.chip:hover {
  color: var(--color-parchment);
  border-color: rgba(199, 154, 75, 0.5);
}

.chip.is-active {
  background: var(--color-brass);
  border-color: var(--color-brass);
  color: #1a1208;
  font-weight: 600;
}

.chip--static {
  cursor: default;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.field__label {
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-parchment-dim);
}

.field__input,
.select {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border-radius: 0.7rem;
  border: 1px solid rgba(199, 154, 75, 0.25);
  background: rgba(20, 16, 12, 0.75);
  color: var(--color-parchment);
  font: inherit;
}

.field__input:focus,
.select:focus {
  border-color: var(--color-brass);
  outline: none;
}

/* Halaman katalog */

.page-head {
  max-width: 1180px;
  margin: 0 auto;
  padding: 9rem 1.25rem 1rem;
}

.page-head h1 {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 6vw, 4rem);
  line-height: 1;
  margin: 0.5rem 0 1rem;
  font-weight: 500;
}

.page-head p {
  max-width: 55ch;
  color: var(--color-parchment-dim);
}

.library-toolbar {
  display: grid;
  grid-template-columns: 1.6fr 0.9fr 0.9fr;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1.5rem;
}

.library-vibes {
  display: grid;
  gap: 0.35rem;
  margin-bottom: 1.5rem;
}

.library-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: baseline;
  margin-bottom: 1rem;
}

.result-count {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-brass-soft);
}

.status {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-parchment-dim);
}

.chips--categories {
  margin-bottom: 1.8rem;
}

.library-more {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

@media (max-width: 760px) {
  .library-toolbar {
    grid-template-columns: 1fr;
  }

  .library-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
}

/* Notifikasi dan skeleton */

.notice {
  grid-column: 1 / -1;
  padding: 2rem;
  border: 1px dashed rgba(199, 154, 75, 0.3);
  border-radius: 1rem;
  text-align: center;
  color: var(--color-parchment-dim);
}

.notice__retry {
  margin-top: 1rem;
}

.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.skeleton {
  border-radius: 0.5rem;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.12),
    rgba(255, 255, 255, 0.05)
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton--cover {
  height: 220px;
}

.skeleton--line {
  height: 0.8rem;
}

.skeleton--short {
  width: 60%;
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}

/* Tentang */

.about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.about__art {
  position: relative;
  aspect-ratio: 1;
}

.about__ring {
  position: absolute;
  inset: 12%;
  border: 1px solid rgba(199, 154, 75, 0.35);
  border-radius: 50%;
}

.about__ring--2 {
  inset: 28%;
  border-color: rgba(199, 154, 75, 0.2);
}

.about__copy p {
  color: var(--color-parchment-dim);
}

.about__points {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.about__point {
  padding: 1rem;
  border: 1px solid rgba(199, 154, 75, 0.25);
  border-radius: 1rem;
  background: rgba(199, 154, 75, 0.05);
}

.about__point--dark {
  background: var(--color-parchment);
  color: var(--color-ink);
}

.about__point-num {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.8rem;
  line-height: 1;
  color: var(--color-brass-soft);
}

.about__point--dark .about__point-num {
  color: var(--color-wood);
}

.about__point-label {
  margin: 0.35rem 0 0;
  font-size: 0.8rem;
  font-weight: 600;
}

@media (max-width: 800px) {
  .about {
    grid-template-columns: 1fr;
  }
}

/* Format hiburan */

.format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.format-card {
  overflow: hidden;
  border: 1px solid rgba(199, 154, 75, 0.2);
  border-radius: 1.2rem;
  background: var(--color-ink-2);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.format-card:hover {
  transform: translateY(-4px);
  border-color: rgba(199, 154, 75, 0.45);
}

.format-card__media {
  width: 100%;
  height: 220px;
  object-fit: cover;
  filter: grayscale(0.7) sepia(0.15);
  opacity: 0.85;
  transition: filter 0.4s ease, opacity 0.4s ease;
}

.format-card:hover .format-card__media {
  filter: none;
  opacity: 1;
}

.format-card__body {
  padding: 1.4rem;
}

.format-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.format-card__index {
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-brass);
}

.format-card__kind {
  font-size: 0.75rem;
  color: var(--color-parchment-dim);
}

.format-card__title {
  margin: 0.75rem 0 0;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 1.1;
}

.format-card__copy {
  margin: 0.6rem 0 0;
  font-size: 0.9rem;
  color: var(--color-parchment-dim);
}

/* Kontak */

.contact {
  padding: clamp(1.5rem, 4vw, 3rem);
  border: 1px solid rgba(199, 154, 75, 0.22);
  border-radius: 1.5rem;
  background: var(--color-ink-2);
}

.contact__head {
  max-width: 60ch;
  margin-bottom: 2rem;
}

.contact__form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.contact__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
}

.contact__field--full {
  grid-column: 1 / -1;
}

.contact__label {
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-parchment-dim);
}

.contact__input {
  width: 100%;
  padding: 0.8rem 0.95rem;
  border: 1px solid rgba(199, 154, 75, 0.25);
  border-radius: 0.7rem;
  background: rgba(20, 16, 12, 0.75);
  color: var(--color-parchment);
  font: inherit;
}

.contact__input:focus {
  border-color: var(--color-brass);
  outline: none;
}

.contact__textarea {
  min-height: 140px;
  resize: vertical;
}

.contact__submit {
  width: 100%;
}

.contact__status {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: var(--color-brass-soft);
}

@media (max-width: 640px) {
  .contact__form {
    grid-template-columns: 1fr;
  }

  .hero__stats {
    grid-template-columns: 1fr;
    max-width: 18rem;
  }
}

/* Footer */

.site-footer {
  border-top: 1px solid rgba(199, 154, 75, 0.15);
  padding: 2.5rem 1.25rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--color-parchment-dim);
}

.site-footer p {
  margin: 0.2rem 0;
}

.site-footer__brand {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--color-parchment);
}

.site-footer__brand span {
  color: var(--color-brass-soft);
}

.site-footer__tagline {
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-size: 0.66rem;
}

.site-footer__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem 1rem;
  margin: 1rem 0;
}

.site-footer__links a {
  color: var(--color-parchment-dim);
}

.site-footer__links a:hover {
  color: var(--color-brass-soft);
}

.site-footer__licence {
  font-size: 0.72rem;
}

/* Modal */

.modal {
  width: min(920px, calc(100% - 2rem));
  max-height: 90svh;
  padding: 0;
  border: 1px solid rgba(199, 154, 75, 0.3);
  border-radius: 1.2rem;
  background: var(--color-ink-2);
  color: var(--color-parchment);
  overflow: auto;
}

.modal::backdrop {
  background: rgba(5, 4, 3, 0.75);
  backdrop-filter: blur(4px);
}

.modal__panel {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 260px) 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
}

.modal__poster {
  min-height: 340px;
  border-radius: 0.8rem;
  background: var(--color-ink-3) center / cover no-repeat;
}

.modal__title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  line-height: 1.05;
  margin: 0.3rem 0 0.5rem;
  font-weight: 500;
}

.modal__meta {
  font-size: 0.8rem;
  color: var(--color-brass-soft);
  margin: 0 0 1rem;
}

.modal__synopsis {
  color: var(--color-parchment-dim);
  font-size: 0.92rem;
}

.modal__categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.modal__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.5rem;
}

.modal__close {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  z-index: 2;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  border: 1px solid rgba(199, 154, 75, 0.3);
  background: rgba(11, 9, 7, 0.7);
  cursor: pointer;
}

@media (max-width: 640px) {
  .modal__panel {
    grid-template-columns: 1fr;
  }

  .modal__poster {
    min-height: 240px;
  }
}

/* Parallax dan reveal */

[data-depth] {
  transform: translate3d(0, var(--parallax-y, 0px), 0);
  will-change: transform;
}

.will-reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.will-reveal.is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  .will-reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }

  [data-depth] {
    transform: none;
  }

  .book__open:hover .book__cover,
  .book__open:focus-visible .book__cover {
    transform: none;
  }

  .format-card:hover {
    transform: none;
  }

  .format-card:hover .format-card__media {
    filter: grayscale(0.7) sepia(0.15);
    opacity: 0.85;
  }
}
````

---

### 5.4 `src/frontend/js/utils.js`

**Status:** Ubah

Helper kecil yang masih dipakai.

- `escapeHtml` untuk semua teks dinamis.
- `rememberItem`/`getItem` sebagai registry untuk modal.
- `formatRating` untuk rating 0–10.
- `bookStyle` memberi tone/tinggi kartu secara deterministik.
- `debounce` untuk input pencarian.
- Helper DOM dan localStorage yang tidak dipakai dihapus.

````js
const registry = new Map();

export function escapeHtml(value) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return String(value ?? "").replace(/[&<>"']/g, (ch) => map[ch]);
}

export function rememberItem(item) {
  if (item?.id != null) registry.set(String(item.id), item);
  return item;
}

export function getItem(id) {
  return registry.get(String(id)) || null;
}

export function formatRating(rating) {
  return Number.isFinite(rating) ? rating.toFixed(1) : "—";
}

const BOOK_TONES = ["#5a2f22", "#3f4a3a", "#3a3f5a", "#5a4a2a", "#4a2f3f", "#2f4a4a"];

function hash(text) {
  let value = 0;
  for (let i = 0; i < text.length; i += 1) {
    value = (value * 31 + text.charCodeAt(i)) >>> 0;
  }
  return value;
}

export function bookStyle(item) {
  const index = hash(String(item?.id ?? item?.title ?? "buku"));
  const tone = BOOK_TONES[index % BOOK_TONES.length];
  const height = 210 + (index % 5) * 14;
  return `--book-tone:${tone};--book-height:${height}px`;
}

export function debounce(fn, wait = 300) {
  let timer = 0;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
````

---

### 5.5 `src/frontend/js/api/normalize.js`

**Status:** Ubah

Mapper Kitsu JSON:API ke model internal.

- `id` menjadi `anime-{id}` atau `manga-{id}` supaya anime dan manga dengan
  angka ID sama tidak saling menimpa.
- `subtypeLabel` menerjemahkan subtype Kitsu (TV, movie, ONA, manga, novel,
  dan seterusnya).
- `categories` diambil dari `relationships.categories` + `included`.
- Rating `averageRating` 0–100 dibagi 10.
- `url` mengarah ke halaman Kitsu yang benar.

````js
const KIND_LABEL = {
  anime: "Anime",
  manga: "Manga",
};

const SUBTYPE_LABELS = {
  tv: "TV",
  movie: "Movie",
  ona: "ONA",
  ova: "OVA",
  special: "Special",
  music: "Music",
  manga: "Manga",
  novel: "Novel",
  "one-shot": "One-shot",
  doujin: "Doujin",
  manhua: "Manhua",
  manhwa: "Manhwa",
};

export function normalizeMedia(raw, { kind = "anime", included = [] } = {}) {
  const attrs = raw?.attributes || {};
  const titles = attrs.titles || {};

  const title =
    attrs.canonicalTitle ||
    titles.en ||
    titles.en_jp ||
    titles.ja_jp ||
    "Tanpa judul";

  const poster =
    attrs.posterImage?.medium ||
    attrs.posterImage?.small ||
    attrs.posterImage?.original ||
    "";

  const cover =
    attrs.coverImage?.large ||
    attrs.coverImage?.original ||
    poster;

  const ratingRaw = Number(attrs.averageRating);
  const rating = Number.isFinite(ratingRaw) ? ratingRaw / 10 : null;
  const startDate = attrs.startDate || "";
  const subtype = attrs.subtype || "";

  return {
    id: `${kind}-${raw.id}`,
    slug: attrs.slug || String(raw.id),
    kind,
    kindLabel: KIND_LABEL[kind] || "Judul",
    subtype,
    subtypeLabel: SUBTYPE_LABELS[String(subtype).toLowerCase()] || subtype,
    title,
    titleJa: titles.ja_jp || "",
    synopsis: attrs.synopsis || attrs.description || "Belum ada sinopsis.",
    poster,
    cover,
    rating,
    year: startDate.slice(0, 4),
    startDate,
    status: attrs.status || "",
    episodes: attrs.episodeCount || null,
    chapters: attrs.chapterCount || null,
    categories: categoryNames(raw, included),
    nsfw: Boolean(attrs.nsfw),
    ageRating: attrs.ageRating || "",
    url: `https://kitsu.io/${kind}/${attrs.slug || raw.id}`,
  };
}

function categoryNames(raw, included) {
  const refs = raw?.relationships?.categories?.data || [];
  const byId = new Map(
    included
      .filter((entry) => entry.type === "categories")
      .map((entry) => [entry.id, entry.attributes?.title])
  );

  return refs.map((ref) => byId.get(ref.id)).filter(Boolean);
}
````

---

### 5.6 `src/frontend/js/services/mediaService.js`

**Status:** Tulis ulang

Lapisan I/O katalog berbasis Kitsu.

- `searchMedia()` membangun parameter `page[limit]`, `page[offset]`, `sort`,
  `include=categories`, dan `filter[text]` bila ada query.
- Hasil dinormalisasi, NSFW disaring, item disimpan ke registry.
- `nextOffset` dihitung dari jumlah baris yang kembali.
- Cache in-memory ber-TTL 10 menit; key mencakup jenis, query, sort, limit,
  dan offset.
- `fetchCatalog()` untuk satu jenis memanggil `searchMedia()`; untuk “Semua”
  memanggil anime dan manga paralel lalu menggabungkan hasilnya.
- Mode “Semua” tetap bisa pagination selama salah satu endpoint masih punya
  halaman berikutnya.

````js
import { CACHE_TTL_MS, PAGE_LIMIT, SORT } from "../config/kitsu.js";
import { kitsuFetch } from "../api/kitsuClient.js";
import { normalizeMedia } from "../api/normalize.js";
import { rememberItem } from "../utils.js";

const cache = new Map();

function cacheKey(prefix, params) {
  return `${prefix}:${JSON.stringify(params)}`;
}

function readCache(key) {
  const hit = cache.get(key);
  if (!hit) return null;

  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return hit.value;
}

function writeCache(key, value) {
  cache.set(key, { at: Date.now(), value });
  return value;
}

export async function searchMedia({
  kind = "anime",
  query = "",
  sort = SORT.popular,
  limit = PAGE_LIMIT,
  offset = 0,
  signal,
} = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || PAGE_LIMIT, 1), PAGE_LIMIT);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const params = {
    "page[limit]": safeLimit,
    "page[offset]": safeOffset,
    sort,
    include: "categories",
  };

  if (query) params["filter[text]"] = query;

  const key = cacheKey("search", {
    kind,
    query,
    sort,
    limit: safeLimit,
    offset: safeOffset,
  });

  const hit = readCache(key);
  if (hit) return hit;

  const payload = await kitsuFetch(`/${kind}`, { params, signal });
  const rows = Array.isArray(payload.data)
    ? payload.data
    : payload.data
      ? [payload.data]
      : [];

  const items = rows
    .map((raw) => normalizeMedia(raw, { kind, included: payload.included || [] }))
    .filter((item) => !item.nsfw);

  items.forEach(rememberItem);

  const result = {
    items,
    nextOffset: rows.length === safeLimit ? safeOffset + safeLimit : null,
  };

  return writeCache(key, result);
}

export async function fetchCatalog({
  kind = "all",
  query = "",
  sort = SORT.popular,
  limit = PAGE_LIMIT,
  offset = 0,
  signal,
} = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || PAGE_LIMIT, 1), PAGE_LIMIT);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  if (kind === "anime" || kind === "manga") {
    return searchMedia({ kind, query, sort, limit: safeLimit, offset: safeOffset, signal });
  }

  const [anime, manga] = await Promise.all([
    searchMedia({ kind: "anime", query, sort, limit: safeLimit, offset: safeOffset, signal }),
    searchMedia({ kind: "manga", query, sort, limit: safeLimit, offset: safeOffset, signal }),
  ]);

  const hasMore = anime.nextOffset !== null || manga.nextOffset !== null;

  return {
    items: [...anime.items, ...manga.items],
    nextOffset: hasMore ? safeOffset + safeLimit : null,
  };
}
````

---

### 5.7 `src/frontend/js/modules/auraMapper.js`

**Status:** Baru

Definisi Aura versi Kitsu.

- `matchesAnyCategory()` mencocokkan `item.categories` tanpa peduli huruf besar.
- High Energy: kategori energik atau anime ≥ 24 episode.
- Melancholy: kategori drama/psikologis/romansa.
- Binge Mode: manga ≤ 30 chapter, atau anime movie/ONA/special/OVA/≤ 13 eps.
- Chill Vibes: komedi, slice of life, gourmet, school, kids, dan sejenisnya.
- `matchAura()` selalu meloloskan `all`; `getAuraLabel()` untuk teks UI.

````js
/**
 * Domain murni: definisi Aura dan cara mencocokkan satu item ke satu aura.
 * Tidak boleh menyentuh DOM dan tidak boleh melakukan fetch.
 *
 * Sumber data katalog adalah Kitsu, jadi pencocokan memakai `item.categories`
 * (judul kategori Kitsu) dan `item.subtype`, bukan `tags` milik AniList.
 */

export const ALL_AURA_ID = "all";

function matchesAnyCategory(item, categories) {
  const wanted = categories.map((category) => category.toLowerCase());
  const owned = (item.categories || []).map((category) =>
    String(category).toLowerCase()
  );

  return owned.some((category) => wanted.includes(category));
}

export const AURAS = [
  {
    id: "high-energy",
    label: "High Energy",
    hint: "Aksi, petualang, olahraga, dan cerita yang panjang.",
    match(item) {
      const energetic = [
        "Action",
        "Adventure",
        "Sports",
        "Combat Sports",
        "Mecha",
        "Super Power",
        "Shounen",
        "Sci-Fi",
        "Science Fiction",
        "Military",
        "Martial Arts",
      ];

      const hasCategory = matchesAnyCategory(item, energetic);
      const longRun = item.kind === "anime" && Number(item.episodes) >= 24;

      return hasCategory || longRun;
    },
  },
  {
    id: "melancholy",
    label: "Melancholy",
    hint: "Drama, psikologis, dan cerita yang menghangatkan.",
    match(item) {
      const moody = [
        "Drama",
        "Psychological",
        "Thriller",
        "Romance",
        "Slice of Life",
        "Seinen",
        "Historical",
        "Tragedy",
        "Suspense",
      ];

      return matchesAnyCategory(item, moody);
    },
  },
  {
    id: "binge",
    label: "Binge Mode",
    hint: "Pendek, atau bisa dituntaskan dalam satu malam.",
    match(item) {
      if (item.kind === "manga") {
        return Number(item.chapters) > 0 && Number(item.chapters) <= 30;
      }

      const shortType = ["movie", "ona", "special", "ova"].includes(
        String(item.subtype).toLowerCase()
      );
      const shortRun = Number(item.episodes) > 0 && Number(item.episodes) <= 13;

      return shortType || shortRun;
    },
  },
  {
    id: "chill",
    label: "Chill Vibes",
    hint: "Ringan, santai, dan aman menonton kapan saja.",
    match(item) {
      const relaxed = [
        "Comedy",
        "Slice of Life",
        "Gourmet",
        "Iyashikei",
        "Parody",
        "School",
        "School Life",
        "Harem",
        "Kids",
      ];

      return matchesAnyCategory(item, relaxed);
    },
  },
];

/**
 * Mencocokkan satu item dengan aura yang dipilih.
 * Aura "all" selalu cocok.
 */
export function matchAura(item, auraId) {
  if (!auraId || auraId === ALL_AURA_ID) return true;

  const aura = AURAS.find((entry) => entry.id === auraId);
  if (!aura) return true;

  return aura.match(item);
}

/**
 * Mengambil label aura untuk ditampilkan.
 */
export function getAuraLabel(auraId) {
  if (auraId === ALL_AURA_ID) return "Semua Vibes";

  return AURAS.find((entry) => entry.id === auraId)?.label ?? "Semua Vibes";
}
````

---

### 5.8 `src/frontend/js/modules/filter.js`

**Status:** Ubah

Domain murni penyaringan.

- `collectCategories()` menghitung frekuensi kategori lalu mengurutkannya.
- `filterMedia()` memfilter berurutan: jenis → kategori → aura → kata kunci.
- Kata kunci dipecah per spasi dan semuanya harus muncul di haystack.
- Haystack berisi judul, judul Jepang, label jenis/subtype, status, tahun, dan
  kategori.

````js
/**
 * Domain murni: menyaring array item media.
 * Tidak boleh menyentuh DOM dan tidak boleh melakukan fetch.
 */

import { ALL_AURA_ID, matchAura } from "./auraMapper.js";

/**
 * Membangun satu string besar berisi semua teks yang bisa dicari
 * dari sebuah item: judul, kategori, jenis, tahun, dan seterusnya.
 */
function buildHaystack(item) {
  return [
    item.title,
    item.titleJa,
    item.kindLabel,
    item.subtypeLabel,
    item.status,
    item.year,
    ...(item.categories || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/**
 * Mengumpulkan kategori dari item yang sudah dimuat, diurutkan dari yang
 * paling sering muncul. Dipakai untuk chip kategori dinamis.
 */
export function collectCategories(items) {
  const counts = new Map();

  items.forEach((item) => {
    (item.categories || []).forEach((name) => {
      counts.set(name, (counts.get(name) || 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name);
}

/**
 * Menyaring item berdasarkan kata kunci, aura, kategori, dan jenis.
 *
 * Aura "all" selalu lolos, jadi memilih "Semua Vibes" tidak mengubah
 * hasil pencarian sama sekali.
 */
export function filterMedia(
  items,
  { query = "", auraId = ALL_AURA_ID, category = "all", kind = "all" } = {}
) {
  const terms = String(query).toLowerCase().split(/\s+/).filter(Boolean);

  return items.filter((item) => {
    if (kind !== "all" && item.kind !== kind) return false;

    if (category !== "all" && !(item.categories || []).includes(category)) {
      return false;
    }

    if (!matchAura(item, auraId)) return false;
    if (terms.length === 0) return true;

    const haystack = buildHaystack(item);

    return terms.every((term) => haystack.includes(term));
  });
}
````

---

### 5.9 `src/frontend/js/modules/renderer.js`

**Status:** Ubah

View kartu media.

- `renderBooks()` menyimpan item ke registry lalu menulis markup.
- Kartu menampilkan poster, badge jenis, rating, judul, dan meta jenis/tahun.
- `renderSkeletons()` untuk loading dan `renderNotice()` untuk kosong/error.
- Tombol kartu memakai `data-book-open` agar modal bisa membuka detail.

````js
import { escapeHtml, bookStyle, rememberItem } from "../utils.js";

export function renderBooks(container, items) {
  if (!container) return;

  container.setAttribute("aria-busy", "false");
  items.forEach(rememberItem);
  container.innerHTML = items.map(bookMarkup).join("");
}

function bookMarkup(item) {
  const poster = item.poster
    ? `style="background-image:url('${escapeHtml(item.poster)}')"`
    : "";

  const rating = item.rating
    ? `<span class="book__rating">${item.rating.toFixed(1)}</span>`
    : "";

  const meta = [item.kindLabel, item.year].filter(Boolean).join(" · ");

  return `
    <article class="book" style="${bookStyle(item)}">
      <button class="book__open" type="button" data-book-open="${escapeHtml(item.id)}" aria-label="Lihat detail ${escapeHtml(item.title)}">
        <span class="book__cover">
          <span class="book__cover-inner" ${poster}></span>
          <span class="book__spine"></span>
          <span class="book__kind">${escapeHtml(item.kindLabel)}</span>
          ${rating}
        </span>
        <span class="book__title">${escapeHtml(item.title)}</span>
        <span class="book__meta">${escapeHtml(meta)}</span>
      </button>
    </article>
  `;
}

export function renderSkeletons(container, count = 6) {
  if (!container) return;

  container.setAttribute("aria-busy", "true");
  container.innerHTML = Array.from({ length: count }, () => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton skeleton--cover"></div>
      <div class="skeleton skeleton--line"></div>
      <div class="skeleton skeleton--line skeleton--short"></div>
    </div>
  `).join("");
}

export function renderNotice(container, message, { retry } = {}) {
  if (!container) return;

  container.setAttribute("aria-busy", "false");
  container.innerHTML = `
    <div class="notice">
      <p>${escapeHtml(message)}</p>
      ${retry ? '<button class="btn btn--ghost notice__retry" type="button">Coba lagi</button>' : ""}
    </div>
  `;

  if (retry) {
    container.querySelector(".notice__retry")?.addEventListener("click", retry, { once: true });
  }
}
````

---

### 5.10 `src/frontend/js/ui/nav.js`

**Status:** Ubah

Perilaku navigasi tanpa fitur pinjaman.

- Toggle menu mobile + `aria-expanded`.
- Tutup dengan Escape, klik link, klik luar, atau resize ≥ 900px.
- Kelas `is-scrolled` saat halaman digulir.
- Video nav dimuat malas (`requestIdleCallback`) dan dijeda saat tab hidden.
- Badge dan listener localStorage dihapus.

````js
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initNav(root = document) {
  const nav = root.querySelector("[data-nav]") || root.querySelector(".nav");
  if (!nav) return () => {};

  const toggle = nav.querySelector("[data-nav-toggle]");
  const panel = nav.querySelector("[data-nav-links]") || nav.querySelector(".nav__links");
  const video = nav.querySelector("[data-nav-video]");
  const cleanups = [];

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);

    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    }

    if (open) panel?.querySelector("a, button")?.focus?.();
  };

  const onToggle = () => setOpen(!nav.classList.contains("is-open"));
  toggle?.addEventListener("click", onToggle);
  if (toggle) cleanups.push(() => toggle.removeEventListener("click", onToggle));

  const onNavClick = (event) => {
    if (event.target.closest("a")) setOpen(false);
  };
  nav.addEventListener("click", onNavClick);
  cleanups.push(() => nav.removeEventListener("click", onNavClick));

  const onKeydown = (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle?.focus();
    }
  };
  document.addEventListener("keydown", onKeydown);
  cleanups.push(() => document.removeEventListener("keydown", onKeydown));

  const onResize = () => {
    if (window.innerWidth >= 900) setOpen(false);
  };
  window.addEventListener("resize", onResize, { passive: true });
  cleanups.push(() => window.removeEventListener("resize", onResize));

  const onOutside = (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (!nav.contains(event.target)) setOpen(false);
  };
  document.addEventListener("pointerdown", onOutside);
  cleanups.push(() => document.removeEventListener("pointerdown", onOutside));

  let scrolled = false;
  const onScroll = () => {
    const next = window.scrollY > 16;
    if (next === scrolled) return;
    scrolled = next;
    nav.classList.toggle("is-scrolled", scrolled);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  cleanups.push(() => window.removeEventListener("scroll", onScroll));
  onScroll();

  const loadVideo = () => {
    if (!video || video.dataset.loaded === "true") return;
    video.dataset.loaded = "true";

    const { srcWebm, srcMp4 } = video.dataset;

    if (srcWebm) {
      const source = document.createElement("source");
      source.src = srcWebm;
      source.type = "video/webm";
      video.append(source);
    }

    if (srcMp4) {
      const source = document.createElement("source");
      source.src = srcMp4;
      source.type = "video/mp4";
      video.append(source);
    }

    video.load();
    if (!REDUCED_MOTION) video.play().catch(() => {});
  };

  if (video) {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(loadVideo, { timeout: 1500 });
      cleanups.push(() => window.cancelIdleCallback?.(id));
    } else {
      const id = window.setTimeout(loadVideo, 600);
      cleanups.push(() => window.clearTimeout(id));
    }

    const onVisibility = () => {
      if (video.dataset.loaded !== "true") return;
      if (document.hidden) video.pause();
      else if (!REDUCED_MOTION) video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    cleanups.push(() => document.removeEventListener("visibilitychange", onVisibility));
  }

  setOpen(nav.classList.contains("is-open"));

  return () => cleanups.forEach((fn) => fn());
}
````

---

### 5.11 `src/frontend/js/ui/bookModal.js`

**Status:** Ubah

Dialog detail media.

- Menerima klik `[data-book-open]`, mengambil item dari registry.
- Mengisi poster, judul, meta (jenis, subtype, tahun, status, rating,
  episode/chapter), kategori, sinopsis, dan tautan Kitsu.
- Tutup lewat tombol X, klik backdrop, atau `dialog.close()`.
- Tidak ada tombol pinjam/kembalikan.

````js
import { getItem, escapeHtml, formatRating } from "../utils.js";

export function initBookModal() {
  const dialog = document.querySelector("[data-book-modal]");
  if (!dialog) return;

  const poster = dialog.querySelector("[data-modal-poster]");
  const title = dialog.querySelector("[data-modal-title]");
  const meta = dialog.querySelector("[data-modal-meta]");
  const synopsis = dialog.querySelector("[data-modal-synopsis]");
  const categories = dialog.querySelector("[data-modal-categories]");
  const link = dialog.querySelector("[data-modal-link]");
  const close = dialog.querySelector("[data-modal-close]");

  const open = (item) => {
    if (!item) return;

    if (poster) {
      poster.style.backgroundImage = item.poster ? `url('${item.poster}')` : "";
    }
    if (title) title.textContent = item.title;
    if (meta) {
      meta.textContent = [
        item.kindLabel,
        item.subtypeLabel,
        item.year,
        item.status,
        item.rating ? `★ ${formatRating(item.rating)}` : "",
        item.episodes ? `${item.episodes} eps` : "",
        item.chapters ? `${item.chapters} ch` : "",
      ]
        .filter(Boolean)
        .join(" · ");
    }
    if (synopsis) synopsis.textContent = item.synopsis || "Belum ada sinopsis.";
    if (categories) {
      categories.innerHTML = (item.categories || [])
        .slice(0, 8)
        .map((name) => `<span class="chip chip--static">${escapeHtml(name)}</span>`)
        .join("");
    }
    if (link) {
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  };

  const closeModal = () => {
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-book-open]");
    if (!trigger) return;

    const item = getItem(trigger.dataset.bookOpen);
    if (item) open(item);
  });

  close?.addEventListener("click", closeModal);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeModal();
  });

}
````

---

### 5.12 `src/frontend/js/ui/contactForm.js`

**Status:** Baru

Umpan balik form kontak tanpa backend.

- `preventDefault()` agar halaman tidak reload.
- `reportValidity()` memanfaatkan validasi HTML.
- Menampilkan pesan status demo dan mereset form.

````js
export function initContactForm(root = document) {
  const form = root.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-contact-status]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (status) {
      status.textContent =
        "Terima kasih! Form ini masih berupa demo dan belum terhubung ke backend.";
      status.hidden = false;
    }

    form.reset();
  });
}
````

---

### 5.13 `src/frontend/js/home.js`

**Status:** Ubah

Composition root landing.

- Inisialisasi nav, parallax, hero Three.js, dan form kontak.
- Tidak lagi memuat shelf, media service, renderer, atau modal.

````js
import * as nav from "./ui/nav.js";
import * as parallax from "./ui/parallax.js";
import * as hero from "./three/heroScene.js";
import { initContactForm } from "./ui/contactForm.js";

const initNav = nav.initNav || (() => {});
const initParallax = parallax.initParallax || (() => {});
const initHeroScene = hero.initHeroScene || (() => {});

function boot() {
  initNav();
  initParallax();
  initHeroScene();
  initContactForm();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
````

---

### 5.14 `src/frontend/js/vibe-grid.js`

**Status:** Ganti nama dari `library.js`, lalu tulis ulang

Composition root katalog.

- State: item, query, aura, kategori, jenis, sort, offset, nextOffset,
  loading, requestId.
- `renderAuraChips()` membuat chip dari `AURAS`.
- `renderCategoryChips()` membuat chip kategori dinamis dari item yang dimuat.
- `renderResults()` memfilter dengan `filterMedia()` lalu merender kartu.
- `load()` memanggil `fetchCatalog()`, mendukung append, dan menangani error.
- Pencarian memakai debounce 350 ms; jenis/kategori/aura/sort punya handler
  masing-masing.
- Load more memakai `nextOffset`; request lama diabaikan lewat `requestId`.

````js
import * as nav from "./ui/nav.js";
import * as parallax from "./ui/parallax.js";
import * as bookModal from "./ui/bookModal.js";
import * as media from "./services/mediaService.js";
import * as renderer from "./modules/renderer.js";
import * as filters from "./modules/filter.js";
import { ALL_AURA_ID, AURAS, getAuraLabel } from "./modules/auraMapper.js";
import { SORT } from "./config/kitsu.js";
import { debounce } from "./utils.js";

const initNav = nav.initNav || (() => {});
const initParallax = parallax.initParallax || (() => {});
const initBookModal = bookModal.initBookModal || (() => {});
const fetchCatalog = media.fetchCatalog;
const renderBooks = renderer.renderBooks;
const renderSkeletons = renderer.renderSkeletons;
const renderNotice = renderer.renderNotice;
const collectCategories = filters.collectCategories;
const filterMedia = filters.filterMedia;

const state = {
  items: [],
  query: "",
  auraId: ALL_AURA_ID,
  category: "all",
  kind: "all",
  sort: "popular",
  offset: 0,
  nextOffset: null,
  loading: false,
  requestId: 0,
};

const els = {
  search: document.querySelector("[data-library-search]"),
  kindWrap: document.querySelector("[data-kind-chips]"),
  auraWrap: document.querySelector("[data-aura-chips]"),
  categoryWrap: document.querySelector("[data-category-chips]"),
  sort: document.querySelector("[data-sort]"),
  grid: document.querySelector("[data-library-grid]"),
  status: document.querySelector("[data-library-status]"),
  count: document.querySelector("[data-result-count]"),
  loadMore: document.querySelector("[data-load-more]"),
};

let lastCategories = "";

function setStatus(message) {
  if (els.status) els.status.textContent = message || "";
}

function dedupe(items) {
  const seen = new Set();

  return items.filter((item) => {
    const id = item?.id ?? item?.slug ?? item?.title;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function activeAuraButtons() {
  if (!els.auraWrap) return;

  els.auraWrap.querySelectorAll("[data-aura]").forEach((button) => {
    const active = button.dataset.aura === state.auraId;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderAuraChips() {
  if (!els.auraWrap) return;

  els.auraWrap.replaceChildren();

  const options = [{ id: ALL_AURA_ID, label: "Semua Vibes", hint: "" }, ...AURAS];

  options.forEach(({ id, label, hint }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.dataset.aura = id;
    button.textContent = label;
    if (hint) button.title = hint;
    els.auraWrap.append(button);
  });

  activeAuraButtons();
}

function activeCategoryButtons() {
  if (!els.categoryWrap) return;

  els.categoryWrap.querySelectorAll("[data-category]").forEach((button) => {
    const active = button.dataset.category === state.category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderCategoryChips(categories) {
  if (!els.categoryWrap) return;

  const visible = categories.slice(0, 12);
  const signature = visible.join("|");

  if (signature === lastCategories && els.categoryWrap.children.length) {
    activeCategoryButtons();
    return;
  }

  lastCategories = signature;
  const current = state.category;
  els.categoryWrap.replaceChildren();

  const all = document.createElement("button");
  all.type = "button";
  all.className = "chip";
  all.dataset.category = "all";
  all.textContent = "Semua";
  els.categoryWrap.append(all);

  visible.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.dataset.category = category;
    button.textContent = category;
    els.categoryWrap.append(button);
  });

  const stillThere = [...els.categoryWrap.querySelectorAll("[data-category]")].some(
    (button) => button.dataset.category === current
  );

  if (!stillThere) state.category = "all";
  activeCategoryButtons();
}

function emptyMessage() {
  if (state.query) return `Tidak ada hasil untuk “${state.query}”.`;
  if (state.auraId !== ALL_AURA_ID) return `Tidak ada judul untuk vibe ${getAuraLabel(state.auraId)}.`;
  if (state.category !== "all") return "Tidak ada judul di kategori ini.";
  return "Belum ada judul di katalog ini.";
}

function renderResults() {
  if (!els.grid) return;

  const categories = collectCategories(state.items) || [];
  renderCategoryChips(categories);

  const filtered =
    filterMedia(state.items, {
      query: state.query,
      auraId: state.auraId,
      category: state.category,
      kind: state.kind,
    }) || [];

  if (els.count) els.count.textContent = `${filtered.length} judul`;

  if (!filtered.length) {
    renderNotice?.(els.grid, emptyMessage());
    setStatus("");
    return;
  }

  renderBooks(els.grid, filtered);
  setStatus("");
}

async function load({ append = false } = {}) {
  if (!els.grid || !fetchCatalog) return;

  const requestId = ++state.requestId;
  state.loading = true;

  if (!append) {
    state.offset = 0;
    state.nextOffset = null;
    renderSkeletons?.(els.grid, 8);
  }

  setStatus(append ? "Menambah judul…" : "Membuka katalog…");
  if (els.loadMore) els.loadMore.disabled = true;

  try {
    const result = await fetchCatalog({
      kind: state.kind,
      query: state.query,
      sort: SORT[state.sort] || SORT.popular,
      limit: 20,
      offset: state.offset,
    });

    if (requestId !== state.requestId) return;

    const items = Array.isArray(result) ? result : result?.items || [];
    const nextOffset = Array.isArray(result) ? null : result?.nextOffset ?? null;

    state.items = dedupe(append ? [...state.items, ...items] : items);
    state.nextOffset = nextOffset;
    renderResults();
  } catch (error) {
    if (requestId !== state.requestId) return;

    state.nextOffset = null;

    if (append) {
      setStatus("Gagal menambah judul. Coba lagi.");
    } else {
      renderNotice?.(els.grid, "Gagal memuat katalog dari Kitsu.", {
        retry: () => load(),
      });
      setStatus("Koneksi bermasalah. Coba lagi.");
    }

    console.warn("Katalog gagal dimuat:", error);
  } finally {
    if (requestId === state.requestId) {
      state.loading = false;

      if (els.loadMore) {
        els.loadMore.disabled = false;
        els.loadMore.hidden = state.nextOffset === null;
      }
    }
  }
}

function bindEvents() {
  const runSearch = debounce(() => {
    state.query = els.search.value.trim();
    load();
  }, 350);

  els.search?.addEventListener("input", runSearch);

  els.kindWrap?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-kind]");
    if (!button) return;

    state.kind = button.dataset.kind;
    state.category = "all";
    lastCategories = "";

    els.kindWrap.querySelectorAll("[data-kind]").forEach((el) => {
      const active = el === button;
      el.classList.toggle("is-active", active);
      el.setAttribute("aria-pressed", String(active));
    });

    load();
  });

  els.auraWrap?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-aura]");
    if (!button) return;

    state.auraId = button.dataset.aura;
    activeAuraButtons();
    renderResults();
  });

  els.categoryWrap?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    state.category = button.dataset.category;
    activeCategoryButtons();
    renderResults();
  });

  els.sort?.addEventListener("change", () => {
    state.sort = els.sort.value;
    load();
  });

  els.loadMore?.addEventListener("click", () => {
    if (state.loading || state.nextOffset === null) return;
    state.offset = state.nextOffset;
    load({ append: true });
  });
}

function boot() {
  initNav();
  initParallax();
  initBookModal();

  const activeKind = els.kindWrap?.querySelector("[data-kind].is-active")?.dataset.kind;
  if (activeKind) state.kind = activeKind;
  if (els.sort?.value) state.sort = els.sort.value;
  if (els.search?.value) state.query = els.search.value.trim();

  renderAuraChips();
  bindEvents();
  load();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
````

---

### 5.15 `README.md`

**Status:** Ubah

Dokumentasi final: konsep FlipPlay, gaya Midnight Library, Kitsu, fitur
landing/katalog, struktur repo, arsitektur, cara menjalankan, dan catatan
aset.

````markdown
# FlipPlay — The Midnight Library

**Watch it. Read it. Live it.**

FlipPlay adalah project demo untuk praktikum **Pemrograman Web**. Isi dan
konsepnya tetap sama dengan FlipPlay: satu ruang hiburan untuk anime, drama,
manga, dan light novel. Yang berubah adalah **gaya UI/UX**: landing dan katalog
kini memakai bahasa visual *The Midnight Library* — gelap, hangat, dengan aksen
kuningan, video nav, parallax, dan kartu media yang diperlakukan seperti buku.

Backend PHP lama tetap dipertahankan sebagai materi praktikum OOP dan tidak
dipakai oleh halaman frontend.

---

## Fitur

### Landing (`src/index.html`)

- Hero **“Watch it. Read it. Live it.”** dengan scene Three.js prosedural,
  parallax, dan statistik 4 format / 1 ruang / ∞ cerita.
- Empat kategori FlipPlay: **Anime, Drama, Manga, Light Novel**.
- Bagian **The FlipPlay idea** dengan dua poin: *Simple discovery* dan
  *One entertainment space*.
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
````

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
