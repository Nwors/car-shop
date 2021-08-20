<?php


namespace app\controllers;



use app\uploader\Uploader;
use yii\db\Exception;
use app\services\MyService;
use app\validations\Validator;
use yii;
use yii\rest\ActiveController;

class CarsController extends ActiveController
{
    public $modelClass = 'app\models\Cars';

    public function actionAddCar() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
        header("Content-type: multipart/form-data");
        error_log(json_encode($_POST));
        error_log(json_encode($_FILES));

        $fileName = null;

        try {
            if(!($_FILES['image']['size'] == 0)) {
                $uploader = new Uploader();
                $fileName = $uploader->upload_image($_FILES['image'],$_SERVER['DOCUMENT_ROOT']."/uploads");
                $fileName = explode("/",$fileName);
                $fileName = $fileName[count($fileName)-1];
            }

            $car = (array)json_decode(Yii::$app->request->post("car"));
            $car['photo'] = $fileName;


            $serviceEntity = new MyService($car);

            $result = $serviceEntity->createCar();

        } catch(Exception $e) {
            error_log($e->getMessage());
            return ["error" => ["message" => $e->getMessage(), "code" => "1"]];
        }

        if($result) {
            return ["response" => ["message" => "successfully executed", "code" => "0"]];
        } else {
            return ["error" => ["message" => "error while adding", "code" => "1"]];
        }
    }

    public function actionGetCarPage() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
        //per-page and page are requiered parameters for this query
        $serviceEntity = new MyService;
        $priceMin = null;
        $priceMax = null;
        $price = ["price" => Yii::$app->request->get("price")];
        if(!is_null($price['price'])) {$exploded = explode('-', $price['price']);
            $priceMin = $exploded[0];
            $priceMax = $exploded[1];
        }
        $params = ['priceMin' => $priceMin, 'priceMax' => $priceMax, 'model' => Yii::$app->request->get("model"), 'brand' => Yii::$app->request->get("brand")];
        error_log(json_encode($params));

        return $serviceEntity->getCarPage($params);

    }

    public function actionGetCarOptions() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
        $car = ["id" => Yii::$app->request->get("id")];
        $serviceEntity = new MyService($car);
        return $serviceEntity->getCarOptions();


    }

    public function actionGetCarById() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
        $car = ["id" => Yii::$app->request->get("id")];
        $serviceEntity = new MyService($car);
        return $serviceEntity->getCarById();
    }

    public function actionDeleteCar(): array {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
        $car = ["id" => Yii::$app->request->get("id")];
        error_log(json_encode($car));
        $serviceEntity = new MyService((array) $car);
        try {
            $result = $serviceEntity->deleteCar();
        } catch(Exception $e) {
            return ["error" => ["message" => $e->getMessage(), "code" => "1"]];
        }

        if($result) {
            return ["response" => ["message" => "successfully executed", "code" => "0"]];
        } else {
            return ["error" => ["message" => "error while deliting", "code" => "1"]];
        }
    }

    public function actionUpdateCar() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
        header("Content-type: multipart/form-data");

        $fileName = null;
        if(!($_FILES['image']['size'] == 0)) {
            $uploader = new Uploader();
            $fileName = $uploader->upload_image($_FILES['image'],$_SERVER['DOCUMENT_ROOT']."/uploads");
            $fileName = explode("/",$fileName);
            $fileName = $fileName[count($fileName)-1];
        }

        $car = (array)json_decode(Yii::$app->request->post("car"));
        $car['photo'] = $fileName;

        $serviceEntity = new MyService($car);
        try {
          $serviceEntity->updateCar($car);
        } catch (Exception $e) {
            error_log($e->getMessage());
        }

    }


    public function behaviors()
    {
        return [
            'corsFilter' => [
                'class' => \yii\filters\Cors::class,
                'cors' => [
                    //"Access-Control-Allow-Origin" =>  "*",
                    //"Access-Control-Allow-Headers" => "Origin, X-Requested-With, Content-Type, Accept",
                    // restrict access to
                    'Origin' => ['localhost:3000','192.168.88.25:19000'],
                    // Allow only POST and PUT methods
                    'Access-Control-Request-Method' => ['POST', 'PUT', 'GET', 'FILES'],
                    // Allow only headers 'X-Wsse'
                    'Access-Control-Request-Headers' => ['X-Wsse'],
                    // Allow credentials (cookies, authorization headers, etc.) to be exposed to the browser
                    'Access-Control-Allow-Credentials' => true,
                    // Allow OPTIONS caching
                    'Access-Control-Max-Age' => 3600,
                    // Allow the X-Pagination-Current-Page header to be exposed to the browser.
                    'Access-Control-Expose-Headers' => ['X-Pagination-Current-Page'],
                ],
            ],
        ];
    }

}
