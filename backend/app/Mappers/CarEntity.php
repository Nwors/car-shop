<?php

namespace app\Mappers;

class CarEntity {
    public $id;
    public $name;
    public $description;
    public $photo;
    public $contacts;
    public $price;
    public $technicalCharacteristics;
    public $options;

    public function __construct($carInfo) {
        $this->id = array_key_exists("id", $carInfo) ? $carInfo["id"] : null;
        $this->name =  array_key_exists('name',$carInfo) ? $carInfo['name'] : null;
        $this->description =  array_key_exists('description',$carInfo) ? $carInfo['description'] : null;
        $this->photo =  array_key_exists('photo',$carInfo) ? $carInfo['photo'] : null;
        $this->contacts =  array_key_exists('contacts',$carInfo) ? $carInfo['contacts'] : null;
        $this->price =  array_key_exists('price',$carInfo) ? $carInfo['price'] : null;

        $this->technicalCharacteristics = (!array_key_exists('technicalCharacteristics', $carInfo) || $carInfo["technicalCharacteristics"] == "") ? null : $carInfo["technicalCharacteristics"];
        $this->options = (!array_key_exists('options', $carInfo) || $carInfo["options"] == "") ? null : $carInfo["options"];
    }
}