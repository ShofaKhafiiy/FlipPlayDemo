<?php

namespace FlipPlay\Models;

class Anime extends Media
{
    private ?int $episodes;

    public function __construct(
        int $id,
        string $title,
        string $format,
        ?int $year,
        ?int $averageScore,
        string $coverImage,
        string $siteUrl,
        ?int $episodes
    ) {
        parent::__construct(
            $id,
            $title,
            $format,
            $year,
            $averageScore,
            $coverImage,
            $siteUrl
        );

        $this->episodes = $episodes;
    }

    public function getEpisodes(): ?int
    {
        return $this->episodes;
    }

    public function getType(): string
    {
        return "Anime";
    }

    public function displayInfo(): void
    {
        parent::displayInfo();

        echo "Episodes : " . ($this->episodes ?? "Unknown") . PHP_EOL;
    }
}