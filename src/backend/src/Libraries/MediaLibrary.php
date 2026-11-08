<?php

namespace FlipPlay\Libraries;

use FlipPlay\Models\Media;
use FlipPlay\Models\User;
use FlipPlay\Services\AniListService;

class MediaLibrary
{
    private AniListService $aniListService;

    /**
     * Media yang sudah ditemukan dari AniList.
     *
     * @var array<int, Media>
     */
    private array $availableMedia = [];

    public function __construct(AniListService $aniListService)
    {
        $this->aniListService = $aniListService;
    }

    /**
     * @return array<int, Media>
     */
    public function searchMedia(
        string $keyword,
        ?string $type = null
    ): array {
        $results = $this->aniListService->searchMedia(
            $keyword,
            $type
        );

        foreach ($results as $media) {
            $this->availableMedia[$media->getId()] = $media;
        }

        return $results;
    }

    /**
     * @return array<int, Media>
     */
    public function getAvailableMedia(): array
    {
        return $this->availableMedia;
    }

    public function findMediaByTitle(string $keyword): array
    {
        $results = [];

        foreach ($this->availableMedia as $media) {
            if (
                stripos($media->getTitle(), $keyword) !== false
            ) {
                $results[] = $media;
            }
        }

        return $results;
    }

    public function getMediaDetail(int $id): ?Media
    {
        if (isset($this->availableMedia[$id])) {
            return $this->availableMedia[$id];
        }

        $media = $this->aniListService->getMediaDetail($id);

        if ($media !== null) {
            $this->availableMedia[$id] = $media;
        }

        return $media;
    }

    public function addToCollection(
        User $user,
        int $mediaId
    ): bool {
        $media = $this->getMediaDetail($mediaId);

        if ($media === null) {
            return false;
        }

        return $user->addMedia($media);
    }

    public function displayAvailableMedia(): void
    {
        echo PHP_EOL;
        echo "=== DAFTAR MEDIA TERSEDIA ===" . PHP_EOL;

        if (empty($this->availableMedia)) {
            echo "Belum ada media yang ditemukan." . PHP_EOL;
            return;
        }

        foreach ($this->availableMedia as $media) {
            echo PHP_EOL;
            echo "ID    : " . $media->getId() . PHP_EOL;
            echo "Title : " . $media->getTitle() . PHP_EOL;
            echo "Type  : " . $media->getType() . PHP_EOL;
        }
    }
}