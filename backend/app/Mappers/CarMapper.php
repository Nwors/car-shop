<?php

namespace app\Mappers;
use yii;
use yii\data\SqlDataProvider;

class CarMapper {
    protected $db;
    private $sql = 'SELECT * FROM cars LEFT JOIN technicalcharacteristics t on cars.id = t.characteristic_id where 1=1';

    public function __construct() {
        $this->db = Yii::$app->db;
    }
    public function getCarById($car) {
        return $this->db->createCommand("select * from cars LEFT JOIN options o on cars.id = o.carId LEFT JOIN technicalCharacteristics tC on cars.id = tC.characteristic_id where cars.id = :id", [':id'=>$car->id])->queryAll();
    }

    public function getCarPage($params = []) {
        $this->builder($params);
        $dataProvider = new SqlDataProvider([
            'sql' => $this->sql . ' order by created_at desc',
            'pagination' => [
//                'pageSize' => 3,
            ],
        ]);
        return ["totalCount" => $dataProvider->getTotalCount(),"items" => $dataProvider->getModels(), "pagination" => $dataProvider->pagination->limit];
    }

    public function findByPrice(int $priceMin, int $priceMax) {
        $this->sql .= " and price >= $priceMin and price <= $priceMax";
    }


    protected function builder($params)
    {
        if(isset($params['priceMin']) && $params['priceMin'] != null) {
            $priceMin = $params['priceMin'];
            $this->sql .= " and price >= $priceMin";
        }
        if(isset($params['priceMax']) && $params['priceMax'] != null) {
            $priceMax = $params['priceMax'];
            $this->sql .= " and price <= $priceMax";
        }
        if(isset($params['model']) && $params['model'] != null) {
            $model = $params['model'];
            $this->sql .= " and model like '%$model%'";
        }
        if(isset($params['brand']) && $params['brand'] != null) {
            $brand = $params['brand'];
            $this->sql .= " and brand = '$brand'";
        }
    }

    public function getAllCars() {
        return $this->db->createCommand("SELECT * FROM cars;")->execute();
    }

    public function deleteCar($id) {
        $this->db->createCommand("DELETE FROM cars where id = :id;", [':id'=>$id])->execute();
        return true;
    }

    public function updateCar($car) {
        $transaction = $this->db->beginTransaction();
        error_log(json_encode($car));
        try {
            $this->db->createCommand("UPDATE cars set name=:name, description=:description, price=:price, photo=:photo, contacts=:contacts where id=:id",
                [':id' => $car->id,':name'=>$car->name,':description'=>$car->description,":price" => $car->price, ":photo"=>json_encode($car->photo), "contacts" => $car->contacts])->execute();
            $this->db->createCommand("DELETE from technicalcharacteristics where characteristic_id = :id", [':id' => $car->id])->execute();
            if(!is_null($car->technicalCharacteristics)) {
                $this->db->createCommand("INSERT INTO technicalCharacteristics (characteristic_id, brand, model, productionYear, body, mileage ) 
                                          values (:id, :brand, :model, :productionYear, :body, :mileage)",
                    [':id' => $car->id,
                        ":brand"=>$car->technicalCharacteristics->brand,
                        ":model"=>$car->technicalCharacteristics->model,
                        ":productionYear" => $car->technicalCharacteristics->productionYear,
                        ":body" => $car->technicalCharacteristics->body,
                        "mileage" => $car->technicalCharacteristics->mileage
                    ]
                )->execute();
            }
            $this->db->createCommand("DELETE from options where carid = :id", [':id' => $car->id])->execute();
            if(!is_null($car->options) && !empty($car->options)) {
                error_log(json_encode($car->options));
                $queryTemplate = "Insert into options(carid, option_name) values";
                //todo ....
                forEach($car->options as $option) {
                    $queryTemplate .= " (".$car->id.",'$option'),";
                }
                $this->db->createCommand(rtrim($queryTemplate, " ,"))->execute();
            }
            $transaction->commit();
        } catch(\Exception $e) {
            $transaction->rollBack();
            throw $e;
        } catch (\Throwable $e) {
            $transaction->rollBack();
            throw $e;
        }
    }

    public function getCarOptions($car) {
        return $this->db->createCommand('SELECT * from options where carid = :id', [':id' => $car->id])->queryAll();
    }

    public function createCar($car) {
        $transaction = $this->db->beginTransaction();
        try {
            $this->db->createCommand("INSERT INTO cars(name, description, price, photo, contacts) values (:name, :description, :price, :photo, :contacts)",
                [':name'=>$car->name,':description'=>$car->description,":price" => $car->price, ":photo"=>json_encode($car->photo), "contacts" => $car->contacts])->execute();
            if(!is_null($car->technicalCharacteristics)) {
                $this->db->createCommand("INSERT INTO technicalCharacteristics (characteristic_id, brand, model, productionYear, body, mileage ) 
                                          values (:id, :brand, :model, :productionYear, :body, :mileage)",
                    [':id' => Yii::$app->db->getLastInsertID(),
                        ":brand"=>$car->technicalCharacteristics->brand,
                        ":model"=>$car->technicalCharacteristics->model,
                        ":productionYear" => $car->technicalCharacteristics->productionYear,
                        ":body" => $car->technicalCharacteristics->body,
                        "mileage" => $car->technicalCharacteristics->mileage
                    ]
            )->execute();
            }
            if(!is_null($car->options) && !empty($car->options)) {
                error_log(json_encode($car->options));
                $queryTemplate = "Insert into options(carid, option_name) values";
                //todo ....
                forEach($car->options as $option) {
                    $queryTemplate .= " (".Yii::$app->db->getLastInsertID().",'$option'),";
                }
                $this->db->createCommand(rtrim($queryTemplate, " ,"))->execute();
            }
            $transaction->commit();
        } catch(\Exception $e) {
            $transaction->rollBack();
            throw $e;
        } catch (\Throwable $e) {
            $transaction->rollBack();
            throw $e;
        }
    }
}

