<?php


declare (strict_types= 1);

namespace FlipPlay\Models;

use Override;

class Manga extends Media{
private ?int $chapters;


    public function __construct(
         int $id,
        string $title,
        string $format,
        ?int $year,
        ?int $averageScore,
        string $coverImage,
        string $siteUrl,
        ?int $chapters
    ){

parent::__construct(
    $id,
    $title,
    $format,
        $year,
    $averageScore,
    $coverImage,
    $siteUrl,
   
);

$this->chapters = $chapters;

    }







    #[Override]
    public function getType(): string
    {
        return "Manga";
    }
}