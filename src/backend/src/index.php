<?php

require_once __DIR__ . "/src/Config/ApiConfig.php";

require_once __DIR__ . "/src/Models/Media.php";
require_once __DIR__ . "/src/Models/Anime.php";
require_once __DIR__ . "/src/Models/Manga.php";
require_once __DIR__ . "/src/Models/User.php";

require_once __DIR__ . "/src/Services/AniListService.php";
require_once __DIR__ . "/src/Libraries/MediaLibrary.php";

use FlipPlay\Models\User;
use FlipPlay\Services\AniListService;
use FlipPlay\Libraries\MediaLibrary;

// Membuat objek service dan library.
$aniListService = new AniListService();

$mediaLibrary = new MediaLibrary($aniListService);

// Membuat user demo.
$user = new User(1, "Shofa");

function showMenu(): void
{
    echo PHP_EOL;
    echo "==================================" . PHP_EOL;
    echo "          FLIPPLAY BACKEND        " . PHP_EOL;
    echo "==================================" . PHP_EOL;
    echo "1. Cari anime atau manga" . PHP_EOL;
    echo "2. Tampilkan media tersedia" . PHP_EOL;
    echo "3. Cari judul dari media tersedia" . PHP_EOL;
    echo "4. Tampilkan detail media" . PHP_EOL;
    echo "5. Tambahkan media ke koleksi" . PHP_EOL;
    echo "6. Tampilkan koleksi user" . PHP_EOL;
    echo "0. Keluar" . PHP_EOL;
    echo "==================================" . PHP_EOL;
}

function readInput(string $message): string
{
    echo $message;

    return trim(fgets(STDIN) ?: "");
}

while (true) {
    showMenu();

    $choice = readInput("Pilih menu: ");

    try {
        switch ($choice) {

            case "1":
                $keyword = readInput("Masukkan judul: ");

                if ($keyword === "") {
                    echo "Judul tidak boleh kosong." . PHP_EOL;
                    break;
                }

                echo PHP_EOL;
                echo "Pilih tipe media:" . PHP_EOL;
                echo "1. Anime" . PHP_EOL;
                echo "2. Manga" . PHP_EOL;
                echo "3. Semua tipe" . PHP_EOL;

                $typeChoice = readInput("Pilihan: ");

                $type = match ($typeChoice) {
                    "1" => "ANIME",
                    "2" => "MANGA",
                    "3" => null,
                    default => null
                };

                if (!in_array($typeChoice, ["1", "2", "3"], true)) {
                    echo "Pilihan tipe tidak valid." . PHP_EOL;
                    break;
                }

                $results = $mediaLibrary->searchMedia(
                    $keyword,
                    $type
                );

                echo PHP_EOL;
                echo "=== HASIL PENCARIAN ===" . PHP_EOL;

                if (empty($results)) {
                    echo "Media tidak ditemukan." . PHP_EOL;
                    break;
                }

                foreach ($results as $media) {
                    echo PHP_EOL;
                    $media->displayInfo();
                    echo "----------------------------------" . PHP_EOL;
                }

                break;

            case "2":
                $mediaLibrary->displayAvailableMedia();
                break;

            case "3":
                $keyword = readInput("Masukkan judul yang dicari: ");

                $results = $mediaLibrary->findMediaByTitle(
                    $keyword
                );

                echo PHP_EOL;
                echo "=== HASIL PENCARIAN LOKAL ===" . PHP_EOL;

                if (empty($results)) {
                    echo "Judul tidak ditemukan dalam daftar media." . PHP_EOL;
                    break;
                }

                foreach ($results as $media) {
                    echo PHP_EOL;
                    $media->displayInfo();
                }

                break;

            case "4":
                $id = filter_var(
                    readInput("Masukkan ID media: "),
                    FILTER_VALIDATE_INT
                );

                if ($id === false || $id <= 0) {
                    echo "ID tidak valid." . PHP_EOL;
                    break;
                }

                $media = $mediaLibrary->getMediaDetail($id);

                if ($media === null) {
                    echo "Media tidak ditemukan." . PHP_EOL;
                    break;
                }

                echo PHP_EOL;
                echo "=== DETAIL MEDIA ===" . PHP_EOL;
                $media->displayInfo();

                break;

            case "5":
                $id = filter_var(
                    readInput("Masukkan ID media: "),
                    FILTER_VALIDATE_INT
                );

                if ($id === false || $id <= 0) {
                    echo "ID tidak valid." . PHP_EOL;
                    break;
                }

                $success = $mediaLibrary->addToCollection(
                    $user,
                    $id
                );

                if ($success) {
                    echo "Media berhasil ditambahkan ke koleksi." . PHP_EOL;
                } else {
                    echo "Media tidak ditemukan atau sudah ada di koleksi." . PHP_EOL;
                }

                break;

            case "6":
                $user->displayCollection();
                break;

            case "0":
                echo "Terima kasih telah menggunakan FlipPlay!" . PHP_EOL;
                exit(0);

            default:
                echo "Pilihan menu tidak valid." . PHP_EOL;
                break;
        }

    } catch (\Throwable $error) {
        echo PHP_EOL;
        echo "Terjadi kesalahan: " . $error->getMessage() . PHP_EOL;
    }
}