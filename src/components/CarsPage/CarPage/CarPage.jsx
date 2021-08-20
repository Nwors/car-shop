import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {useHistory, useLocation} from "react-router-dom";
import "./CarPage.css"
import {Button} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

function CarPage() {
    const useDidMountEffect = (func, deps) => {
        const didMount = useRef(false);
        useEffect(() => {
            if (didMount.current) func();
            else didMount.current = true;
        }, deps);
    }

    const location = useLocation();
    const history = useHistory()
    const names = ["Брэнд", "Модель", "Год производства", "Тип кузова", "Общий пробег"]
    const [img, setImg] = useState([])
    const [carData, setCarData] = useState({})
    const [technicalCharacteristicsFlag, setTechnicalCharactersiticsFlag] = useState(false)
    const [options, setOptions] = useState([])
    const [car, setCar] = useState({})
    useEffect(() => {
        let id = location.pathname.split('/').pop()
        if(isNaN(id)) history.push('/cars')

        axios("http://192.168.88.25:8888/cars/get-car-by-id", {
            params: {
                id: location.pathname.split('/').pop()
            }
        }).then(it => {setCarData(it.data)})
    }, [])

    useDidMountEffect(() => {
        //setImg(JSON.parse(carData.photo))
        if(carData.length === 0) {
            history.push('/cars')
        } else {
            let options = carData.map(it => it.option_name)
            setImg(JSON.parse(carData[0].photo))
            setCar(carData[0])
            setOptions(options)
        }
    }, [carData])

    useEffect(() => {
        if(car.hasOwnProperty("body") && car.body != null) {
            setTechnicalCharactersiticsFlag(true)
        }
    }, [car])

    return (
        <div className={"car-page-container"}>
            {car.name && (
        <>
        <span className={"name"}>{car.name}</span>
        <span className={"price"}>{`${car.price} ₽`}</span>
        </>)}
        <div className={"image-container"} style={{backgroundImage: `url("http://192.168.88.25:8888/uploads/${img}")`}}>
        </div>
            {technicalCharacteristicsFlag ? <div className={"field-name top-name"}>Технические характеристики: </div> : undefined}
            {technicalCharacteristicsFlag ? <div><span className={"mini-field-name"}>Марка машины: </span><span className={"field-description"}>{`${car.brand}`}</span></div> : undefined}
            {technicalCharacteristicsFlag ? <div><span className={"mini-field-name"}>Модель машины: </span><span className={"field-description"}>{`${car.model}`}</span></div> : undefined}
            {technicalCharacteristicsFlag ? <div><span className={"mini-field-name"}>Год производства: </span><span className={"field-description"}>{`${car.productionyear}`}</span></div> : undefined}
            {technicalCharacteristicsFlag ? <div><span className={"mini-field-name"}>Тип кузова: </span><span className={"field-description"}>{`${car.body}`}</span></div> : undefined}
            {technicalCharacteristicsFlag ? <div><span className={"mini-field-name"}>Общий пробег(км): </span><span className={"field-description"}>{`${car.mileage}`}</span></div> : undefined}
            <div className={"field-name top-name"}>Описание: </div>
            <div className={"description"}>{car.description}</div>
            {options[0] !== null ?  <div className={"field-name top-name"}>Дополнительные опции: </div> : undefined}
            {options[0] !== null ?  options.map(it =>
                <div><span className={"mini-field-name"}>Опция: </span><span className={"field-description"}>{`${it}`}</span></div>
            ) : undefined}
            <div className={"field-name top-name"}>Телефон для связи: </div>
            <div className={'field-description'}>{car.contacts}</div>
            <LinkContainer to={`/updateAd/${car.id}`}><Button className={"btn-edit"}>Редактировать объявление</Button></LinkContainer>
            <Button className={"btn-edit"} onClick={() => {
                if(window.confirm('Вы действительно хотите удалить объявление')) {
                    history.push("/cars")
                    axios(`http://192.168.88.25:8888/cars/delete-car?id=${car.id}`).then(it => {
                    })
                }
            }}>Удалить объявление</Button>
        </div>
    );
}


export default CarPage;
