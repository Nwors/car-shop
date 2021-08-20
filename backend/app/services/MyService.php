<?php

namespace app\services;

use app\Mappers\CarEntity;
use app\repositories\CarRepository;
use app\validations\Validator;
use yii\db\Exception;

class MyService
{
    protected $car;
    protected $carRepository;

    public function __construct(array $car = []) {
        $this->car = new CarEntity($car);
        $this->carRepository = new CarRepository($car);
    }

    public function getCarPage($params) {
        return $this->carRepository->getCarPage($params);
    }

    public function getCarById() {
        $validator = new Validator($this->car);
        $validator->validateId($this->car->id);
        return $this->carRepository->getCarById($this->car);
    }

    public function createCar(): bool
    {
        $validator = new Validator($this->car);
        $validator->validateFields();

        $this->carRepository->create($this->car);
        return true;
    }

    public function updateCar() {
        $validator = new Validator($this->car);
        $validator->validateFields();
        $this->carRepository->update($this->car);
        return true;


    }

    public function getCarOptions() {
       $validator = new Validator($this->car);
       $validator->validateId($this->car->id);
       return $this->carRepository->getCarOptions($this->car);
    }

    public function deleteCar() {
        $validator = new Validator($this->car);
        $validator->validateId($this->car->id);

        return $this->carRepository->delete($this->car);
    }

}
