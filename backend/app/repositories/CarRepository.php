<?php

namespace app\repositories;
use app\Mappers\CarMapper;

class CarRepository implements RepositoryInterface
{
    protected $carMapper;
    public function __construct($car) {
        $this->carEntity = $car;
        $this->carMapper = new CarMapper();
    }

    public function getAll()
    {
        return $this->carMapper->getAllCars();
    }

    public function getCarById($car) {
        return $this->carMapper->getCarById($car);
    }

    public function getCarPage($params) {
        return $this->carMapper->getCarPage($params);
    }

    public function getCarOptions($car) {
        return $this->carMapper->getCarOptions($car);
    }

    public function create($car)
    {
        $this->carMapper->createCar($car);
    }

    public function update($car)
    {
       $this->carMapper->updateCar($car);
    }

    public function delete($car){
        return $this->carMapper->deleteCar($car->id);
    }

}
