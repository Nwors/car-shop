import React, {useEffect, useRef, useState} from 'react';
import {Button, Form, FormControl} from "react-bootstrap";
import './AdForm.css'
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import axios from "axios";
import {Car} from "../../Structures/Car";
import {TechnicalCharacteristics} from "../../Structures/TechnicalCharacteristics";



function AdForm(props) {

    const useDidMountEffect = (func, deps) => {
        const didMount = useRef(false);
        useEffect(() => {
            if (didMount.current) func();
            else didMount.current = true;
        }, deps);
    }

    let [characteristicsFlag, setCharacteristicsFlag] = useState(false)
    const [allOptions, setAllOptions] = useState([])
    const handleDelete = (id) => () => {
        const items = allOptions.filter(item => item !== id);
        unregister(`option${id}`)
        setAllOptions(items)
    }

    const displayCharacteristics = () => {setCharacteristicsFlag(!characteristicsFlag)}

    const {register, handleSubmit, formState: { errors }, watch, unregister} = useForm()
    const onSubmit = (data) => {
        let characteristics
        console.log("Данные",data)

        if(characteristicsFlag) characteristics = new TechnicalCharacteristics(data.label, data.model, data.year, data.body, data.raceDistance)

        let car = new Car(data.name, data.description, undefined, data.price, data.telephone, characteristics, Object.keys(data)
            .filter(it => it.includes("option")).map(it => data[it])
        )
        let bodyFormData = new FormData();
        bodyFormData.append("car",JSON.stringify(car))
        bodyFormData.append("image", data.images[0])

        console.log("Машина", car)
        axios({
            url: "http://192.168.88.25:8888/cars/add-car",
            method: "POST",
            data: bodyFormData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(it => console.log(it))

    }
    const onError = (errors) => {console.log(errors)}
    //console.log(watch())
    //console.log(formState.errors)
    return (
        <Form className={"ad-form"} onSubmit={handleSubmit(onSubmit, onError)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <div className={"form-title"}>Заполните предложенные поля</div>
                <Form.Label>Название авто</Form.Label>
                <div className={"error-message"}><ErrorMessage errors={errors} name="name" /></div>
                <FormControl type={"text"} {...register('name', {required: "Пожалуйста введите название"})}
                 placeholder="Введите название авто" />
                <Form.Text className="text-muted">
                    *не более 40 символов (например: Chevrolet lacetti).
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Описание</Form.Label>
                <div className={"error-message"}><ErrorMessage errors={errors} name="description" /></div>
                <Form.Control as="textarea" {...register('description', {required: "Пожалуйста введите описание"})} type="text" placeholder="Введите описание" />
                <Form.Text className="text-muted">
                    *не более 256 символов.
                </Form.Text>
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3 drop-form">

                <Form.Label>Загрузите фотографии или изображения</Form.Label>
                <div>
                    <div className={"error-message"}><ErrorMessage errors={errors} name="images" /></div>
                </div>
                <Form.Control {...register('images', {
                    required: "Прикрепите хотябы одно изображение",
                    validate: {
                        lessThan10MB: files => files[0]?.size < 10000000 || 'Максимальный размер 10 Мб',
                        acceptedFormats: files =>
                            ['image/jpeg', 'image/png','image/jpg'].includes(
                                files[0]?.type
                            ) || 'Поддерживаются следующие форматы: PNG, JPEG, JPG',
                    },
                })}  type="file" multiple/>
                {/*<FileUploader*/}
                {/*    types={["JPG", "PNG"]}*/}
                {/*    name="file"*/}
                {/*/>*/}
                <div>
                    <Form.Text className="text-muted">
                    *допустимые форматы .jpg .png .jpeg.
                     </Form.Text>
                </div>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label >Номер телефона</Form.Label>
                <div className={"error-message"}><ErrorMessage errors={errors} name="telephone" /></div>
                <Form.Control  placeholder="Введите телефон"{...register('telephone', {required: "Пожалуйста введите телефонный номер",
                    validate: {
                    isNumber: it => !isNaN(it.slice(1)) || "Введите корректный номер",
                    checkFirst: it => !(isNaN(it) && it !== '+') || "Введите корректный номер"
                    },
                    minLength: {
                    value: 11,
                    message: "Минимальная длина 11 символов (с кодом страны 12)"
                    },
                    maxLength: {
                    value: 12,
                    message: "Максимальная длина 12"
                    }})}/>
                <Form.Text className="text-muted">
                    *в международном или обычном формате.
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label >Цена продажи в рублях</Form.Label>
                <div className={"error-message"}><ErrorMessage errors={errors} name="price" /></div>
                <Form.Control {...register('price', {required: "Пожалуйста введите цену", validate: {
                    isNumber: it => !isNaN(it) || "Введите корректную цену",
                    aboveZero: it => !(it < 0)  || "Введите корректную цену",
                    toHigh: it => !(it >= 2000000000000) || "Введите корректуню цену"
                    }})}  placeholder="Введите цену" />
                <Form.Text className="text-muted">
                    *целое количество
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check onChange={() => displayCharacteristics()} type="checkbox" label="Указать технические характеристики машины" />
            </Form.Group>
            <Form.Group className={`mb-3 ${characteristicsFlag ? "slider" : "slider slider-closed"}`}>
                <Form.Label>Марка машины</Form.Label>
                <div className="error-message"><ErrorMessage errors={errors} name="label" /></div>
                <Form.Control {...(() => {
                    if (characteristicsFlag) return {...register('label',
                            {required: "Пожалуйста введите марку"}
                        )}
                    return {}
                })()} placeholder="Введите марку" />
            </Form.Group>
            <Form.Group className={`mb-3 ${characteristicsFlag ? "slider" : "slider slider-closed"}`}>
                <Form.Label>Модель машины</Form.Label>
                <div className={"error-message"}><ErrorMessage errors={errors} name="model" /></div>
                <Form.Control {...(() => {
                    if (characteristicsFlag) return {...register('model',
                            {required: "Пожалуйста введите модель"}
                        )}
                    return {}
                })()} placeholder="Введите модель" />
            </Form.Group>
            <Form.Group className={`mb-3 ${characteristicsFlag ? "slider" : "slider slider-closed"}`}>
                <Form.Label>Год производства</Form.Label>
                <div className="error-message"><ErrorMessage errors={errors} name="year" /></div>
                <Form.Control {...(() => {
                    if (characteristicsFlag) return {...register('year', {required: "Пожалуйста введите год производства" , validate: {
                        isNumber: it => !isNaN(it) || "Введите корректный год производства",
                        aboveZero: it => !(it < 1800)  || "Введите корректный год производства",
                        toHigh: it => !(it > new Date().getFullYear()) || "Введите корректный год производства"
                        }})}
                    return {}
                })()}  placeholder="Введите год производства" />
            </Form.Group>
            <Form.Group className={`mb-3 ${characteristicsFlag ? "slider" : "slider slider-closed"}`}>
                <Form.Label>Тип кузова</Form.Label>
                <div className="error-message"><ErrorMessage errors={errors} name="body" /></div>
                <Form.Control {...(() => {
                    if (characteristicsFlag) return {...register('body',
                            {required: "Пожалуйста введите тип кузова"}
                        )}
                    return {}
                })()} placeholder="Введите тип кузова" />
            </Form.Group>
            <Form.Group className={`mb-3 ${characteristicsFlag ? "slider" : "slider slider-closed"}`}>
                <Form.Label>Пробег</Form.Label>
                <div className="error-message"><ErrorMessage errors={errors} name="raceDistance" /></div>
                <Form.Control {...(() => {
                    if(characteristicsFlag) return {...register('raceDistance',
                            {required: "Пожалуйста введите пробег", validate: {
                                    isNumber: it => !isNaN(it) || "Введите корректный пробег",
                                    aboveZero: it => !(it < 0)  || "Введите корректный пробег",
                                    toHigh: it => !(it > 2000000000) || "Введите корректный пробег"
                                }}
                        )}
                    else return {}
                })()} placeholder="Введите пробег" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <span><Button onClick={() => {
                    const id = Math.floor(Math.random() * 999999)
                    setAllOptions([
                        ...allOptions,
                        id
                    ])
                }} className={"add-option"}>+</Button></span>
                <span>Добавить дополнительную опцию</span>
            </Form.Group>
            {allOptions.map(itId =>
                <Form.Group className={`mb-3`} key = {itId}>
                    <span><Button className={"add-option"} onClick={handleDelete(itId)}>-</Button></span>
                    <Form.Label>Дополнительная опция</Form.Label>
                    <div className="error-message"><ErrorMessage errors={errors} name={`option${itId}`}/></div>
                    <span><Form.Control className={"additional-option"} {...register(`option${itId}`,
                    {required: "Пожалуйста введите опцию"})}  placeholder="Введите дополнительную опцию" /></span>
                </Form.Group>
            )}
            <Button  variant="primary" type="submit">
                Опубликовать
            </Button>
        </Form>
    );
}

export default AdForm;
