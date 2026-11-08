<?php

namespace FlipPlay\Services;

use FlipPlay\Config\ApiConfig;
use FlipPlay\Models\Anime;
use FlipPlay\Models\Manga;
use FlipPlay\Models\Media;

class AniListService
{
    private function request(
        string $query,
        array $variables = []
    ): array {
        $ch = curl_init(ApiConfig::API_URL);

        $payload = json_encode([
            "query" => $query,
            "variables" => $variables
        ]);

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                "Content-Type: application/json",
                "Accept: application/json"
            ],
            CURLOPT_TIMEOUT => ApiConfig::TIMEOUT
        ]);

        $response = curl_exec($ch);

        if ($response === false) {
            $error = curl_error($ch);
            curl_close($ch);

            throw new \RuntimeException(
                "Gagal menghubungi AniList: " . $error
            );
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        $result = json_decode($response, true);

        if (!is_array($result)) {
            throw new \RuntimeException(
                "Respons AniList tidak dapat dibaca."
            );
        }

        if ($httpCode < 200 || $httpCode >= 300) {
            $message = $result["errors"][0]["message"]
                ?? "HTTP Error " . $httpCode;

            throw new \RuntimeException($message);
        }

        if (!empty($result["errors"])) {
            $message = $result["errors"][0]["message"]
                ?? "GraphQL request error.";

            throw new \RuntimeException($message);
        }

        return $result["data"] ?? [];
    }

    private function createMedia(array $data): Media
    {
        $title = $data["title"]["english"]
            ?? $data["title"]["romaji"]
            ?? $data["title"]["native"]
            ?? "Untitled";

        $year = $data["startDate"]["year"] ?? null;

        $averageScore = $data["averageScore"] ?? null;

        $coverImage = $data["coverImage"]["large"] ?? "";

        $siteUrl = $data["siteUrl"] ?? "";

        $arguments = [
            $data["id"],
            $title,
            $data["format"] ?? "Unknown",
            $year,
            $averageScore,
            $coverImage,
            $siteUrl
        ];

        if ($data["type"] === "MANGA") {
            return new Manga(
                ...$arguments,
                $data["chapters"] ?? null
            );
        }

        return new Anime(
            ...$arguments,
            $data["episodes"] ?? null
        );
    }

    /**
     * @return array<int, Media>
     */
    public function searchMedia(
        string $keyword,
        ?string $type = null,
        int $page = 1,
        int $perPage = ApiConfig::PAGE_SIZE
    ): array {
        $query = '
            query (
                $search: String,
                $type: MediaType,
                $page: Int,
                $perPage: Int
            ) {
                Page(page: $page, perPage: $perPage) {
                    media(search: $search, type: $type) {
                        id
                        type
                        title {
                            english
                            romaji
                            native
                        }
                        format
                        startDate {
                            year
                        }
                        averageScore
                        coverImage {
                            large
                        }
                        siteUrl
                        episodes
                        chapters
                    }
                }
            }
        ';

        $data = $this->request($query, [
            "search" => $keyword,
            "type" => $type,
            "page" => $page,
            "perPage" => $perPage
        ]);

        $mediaList = [];

        foreach ($data["Page"]["media"] ?? [] as $item) {
            $mediaList[] = $this->createMedia($item);
        }

        return $mediaList;
    }

    public function getMediaDetail(int $id): ?Media
    {
        $query = '
            query ($id: Int) {
                Media(id: $id) {
                    id
                    type
                    title {
                        english
                        romaji
                        native
                    }
                    format
                    startDate {
                        year
                    }
                    averageScore
                    coverImage {
                        large
                    }
                    siteUrl
                    episodes
                    chapters
                }
            }
        ';

        $data = $this->request($query, [
            "id" => $id
        ]);

        if (empty($data["Media"])) {
            return null;
        }

        return $this->createMedia($data["Media"]);
    }
}