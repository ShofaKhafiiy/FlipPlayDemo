<?php

declare(strict_types= 1);

namespace FlipPlay\Models;

abstract class Media
{
    private int $id;
    private string $title;
    private string $format;
    private ?int $year;
    private ?int $averageScore;
    private string $coverImage;
    private string $siteUrl;

    public function __construct(
        int $id,
        string $title,
        string $format,
        ?int $year,
        ?int $averageScore,
        string $coverImage,
        string $siteUrl
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->format = $format;
        $this->year = $year;
        $this->averageScore = $averageScore;
        $this->coverImage = $coverImage;
        $this->siteUrl = $siteUrl;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getFormat(): string
    {
        return $this->format;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function getAverageScore(): ?int
    {
        return $this->averageScore;
    }

    public function getCoverImage(): string
    {
        return $this->coverImage;
    }

    public function getSiteUrl(): string
    {
        return $this->siteUrl;
    }

    abstract public function getType(): string;

    public function displayInfo(): void
    {
        echo "ID       : " . $this->id . PHP_EOL;
        echo "Title    : " . $this->title . PHP_EOL;
        echo "Type     : " . $this->getType() . PHP_EOL;
        echo "Format   : " . $this->format . PHP_EOL;
        echo "Year     : " . ($this->year ?? "Unknown") . PHP_EOL;
        echo "Score    : " . ($this->averageScore ?? "Not rated") . PHP_EOL;
        echo "Cover    : " . $this->coverImage . PHP_EOL;
        echo "URL      : " . $this->siteUrl . PHP_EOL;
    }
}