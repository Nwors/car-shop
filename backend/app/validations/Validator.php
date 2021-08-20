<?php

namespace app\validations;

use Faker\Core\Number;
use phpDocumentor\Reflection\Types\Boolean;
use phpDocumentor\Reflection\Types\Integer;
use yii\db\Exception;
use yii\validators\NumberValidator;
use yii\validators\StringValidator;

class Validator
{
   private $car;
   public function __construct($car) {
       $this->car = $car;
   }

   public function validateId($id): bool {
       $numberValidator = new NumberValidator();
       $numberValidator->min = 1;
       if($numberValidator->validate($id)) {} else throw new Exception("Id validation failed");
       return true;
   }

   public function validateFields(): bool {
     $stringValidator = new StringValidator();
     $dateValidator = new NumberValidator();
     $numberValidator = new NumberValidator();
     $stringValidator->min = 1;
     $numberValidator->max = 20000000;
     $numberValidator->min = 0;

     $dateValidator->max = date("Y");
     $dateValidator->min = 1850;

     if(!$numberValidator->validate($this->car->price)) throw new Exception("Price validation failed");
     if(!$stringValidator->validate($this->car->name)) throw new Exception("Name validation failed");
     if(!$stringValidator->validate($this->car->contacts)) new Exception("Contacts validation failed");
     if(!$stringValidator->validate($this->car->description)) throw new Exception("description validation failed");
     if(!is_null($this->car->technicalCharacteristics)) {
         if(!$stringValidator->validate($this->car->technicalCharacteristics->brand)) throw new Exception("Brand validation failed");
         if(!$stringValidator->validate($this->car->technicalCharacteristics->model)) throw new Exception("Model validation failed");
         if(!$stringValidator->validate($this->car->technicalCharacteristics->body)) throw new Exception("Body validation failed");
         if(!$dateValidator->validate($this->car->technicalCharacteristics->productionYear)) throw new Exception("Production year validation failed");
         if(!$numberValidator->validate($this->car->technicalCharacteristics->mileage)) throw new Exception("Mileage year validation failed");
     }
     if(!is_null($this->car->options)) {
         foreach($this->car->options as $option) {
             if(!$stringValidator->validate($option)) throw new Exception("options validation failed");
         }
     }
     return true;
   }
}