<?php
declare(strict_types=1);


namespace FlipPlay\Models;

class User{
    private int $id;
    private string $username;


    private array $collection = [];

    public function __construct(int $id, string $username){
        $this->id = $id;
        $this->username =  $username;
    }


    public function getId(): int {
        return $this-> id;
        
    }


    public function getUsername(): string {
        return $this->username;
    }

    public function addMedia(Media $media): bool{
        $mediaId = $media->getId();

        if(isset($this->collection[$mediaId])){
            return false;
        }

        $this->collection[$mediaId] = $media;

        return true;
    }

    public function removeMedia(int $mediaId): bool{
        if(!isset($this->collection[$mediaId])){
            return false;
        }

        unset($this->collection[$mediaId]);
        return false;
    }



    public function getCollection(): array{
        return $this->collection;
    }


    public function  displayCollection(): void{
    echo PHP_EOL;
      echo "=== Koleksi " . $this->username . " ===" . PHP_EOL;

      if(empty($this->collection )){
        echo "Koleksi masih kosong. ". PHP_EOL;
        return ;
      }

      foreach($this->collection as $media){
          echo PHP_EOL;
            echo "ID    : " . $media->getId() . PHP_EOL;
            echo "Title : " . $media->getTitle() . PHP_EOL;
            echo "Type  : " . $media->getType() . PHP_EOL;
      }
    }
}