import React, {useEffect, useState, useRef} from 'react';
import {useLocation, useHistory} from "react-router-dom";
import Pages from "./Pagination/Pages";
import "./CarsPageStyle.css"
import CarCard from "./CarsCard/CarsCard";
import axios from "axios";
import {Button, Card} from "react-bootstrap";
import CarsCard from "./CarsCard/CarsCard";
import {Form} from "react-bootstrap"

function CarsPage(props) {
    const useDidMountEffect = (func, deps) => {
        const didMount = useRef(false);
        useEffect(() => {
            if (didMount.current) func();
            else didMount.current = true;
        }, deps);
    }
    const location = useLocation();
    const history = useHistory();
    const [cars, setCars] = useState([]);
    const [totalCount, setTotalCount] = useState(undefined)
    const [carsCards, setCarsCards] = useState([])
    let [curPage, setCurPage] = useState(1)
    let [loadFlagShowMore, setLoadFlagShowMore] = useState(false)
    let [changePageFlag, setChangePageFlag] = useState({left: false, right: false})
    let [countOfPages, setCountOfPages] = useState(0)
    let perPage = 4;
    const [secretKey, setSecretKey] = useState(0)

    const init = () => {
        //Get page parameter value from url get parameters and set 1 if page is not passed to URL
        let page = location.search.substr !== "" ? location.search.substr(1).split("&").map(it => it.split("=")).filter(it => it[0] === "page")[0] : 1
        let price = location.search.substr !== "" ? location.search.substr(1).split("&").map(it => it.split("=")).filter(it => it[0] === "price")[0] : undefined
        let model = location.search.substr !== "" ? location.search.substr(1).split("&").map(it => it.split("=")).filter(it => it[0] === "model")[0] : undefined
        let brand = location.search.substr !== "" ? location.search.substr(1).split("&").map(it => it.split("=")).filter(it => it[0] === "brand")[0] : undefined
        if(price === undefined) {price = []} else {
            document.getElementById("price-min").setAttribute('value',price[1].split('-')[0])
            document.getElementById("price-max").setAttribute('value',price[1].split('-')[1])

        }
        if(model === undefined) {model = ""} else {
            document.getElementById("filter-model").setAttribute('value',model[1])
        }
        if(brand === undefined) {brand = ""} else {
            document.getElementById("filter-brand").setAttribute('value',brand[1])
        }
        setFiltersUrl(price[1], model[1], brand[1])

        if(page === undefined) {
            page = 1
        } else if(isNaN(page[1])) {
            page = 1
        } else if(page[1] <= 0) {
            page = 1
        } else if(page[1] >= 100) {
            page = 1
        } else {
            page = Number(page[1])
            setCurPage(Number(page))
        }
        //console.log(`http://75f9ffd4c830.ngrok.io/cars/get-car-page${(price.length !== 0) ? `?price=${price[1]}` : ""}`)
        axios.get(`http://192.168.88.25:8888/cars/get-car-page?${(price.length !== 0) ? `&price=${price[1]}` : ""}${(model.length !== 0) ? `&model=${model[1]}` : ""}${(brand.length !== 0) ? `&brand=${brand[1]}` : ""}`, {
            params: {
                'page': page,
                'per-page': perPage
            }
        }).then(it => {
                setCars(it.data.items)
                setTotalCount(it.data.totalCount)
            }
        )
    }

    useDidMountEffect(() => {
        let cards = cars.map((it) => <CarsCard id = {it.id} key={it.id} name={it.name} price={it.price} image={JSON.parse(it.photo)}/>)
        carsCards.push(cards)
    }, [cars])


    useDidMountEffect(() => {
        if(loadFlagShowMore) {
            if(curPage < countOfPages) {
                setCurPage(curPage + 1)
            }
        }}, [loadFlagShowMore])

    useDidMountEffect(() => {
        if(changePageFlag.right && curPage < countOfPages) {setCurPage(curPage + 1)} else if (changePageFlag.left && curPage > 1) setCurPage(curPage - 1)
    }, [changePageFlag])

    useDidMountEffect(() => {
        let filterString = getFilterQuery()
        history.push(`/cars?page=${curPage}${filterString}`)
        if(loadFlagShowMore) {
            axios.get(`http://192.168.88.25:8888/cars/get-car-page?${filterString}`, {
                params: {
                    'page': curPage,
                    'per-page': perPage
                }
            }).then(it => {
                    setCars(it.data.items)
                    setLoadFlagShowMore(false)
                }
            )
        }
        if(changePageFlag.left || changePageFlag.right) {
            if(curPage > countOfPages) {setCarsCards([]);setCurPage(countOfPages);return}
            setCarsCards([])
            axios.get(`http://192.168.88.25:8888/cars/get-car-page?${filterString}`, {
                params: {
                    'page': curPage,
                    'per-page': perPage
                }
            }).then(it => {
                    setCars(it.data.items)
                    setChangePageFlag({left: false, right: false})
                }
            )
        }
    }, [curPage])

    useEffect(() => {
        init()
    }, [])

    useDidMountEffect(() => setCountOfPages(Math.ceil(totalCount / perPage)), [totalCount])
    let changePage = (direction) => {
        if(direction && curPage < countOfPages) {
            setChangePageFlag({right: true, left: false})
        } else if (!direction && curPage > 1) {
            setChangePageFlag({right: false, left: true})
        }
    }
    const [filters, sFilters] = useState({})

    const getFilterQuery = () => {
        let queryString = "&"
        Object.keys(filters).forEach(key => {
            queryString += `${key}=${filters[key]}&`
        })
        console.log(filters)
        queryString = queryString.slice(0,-1)
        return queryString
    }

    useDidMountEffect(() => {
        console.log(`/cars?page=1${getFilterQuery(filters)}`)
        history.push(`/cars?page=1${getFilterQuery(filters)}`)
    },[filters])


    const setFiltersUrl = (price, model, brand) => {
        let obj = {}
        obj['price'] = price
        obj['model'] = model
        obj['brand'] = brand
        if(price === undefined) delete obj['price']
        if(model === undefined) delete obj['model']
        if(brand=== undefined) delete obj['brand']
        sFilters(obj)
    }
    const setFilters = () => {
        let min = document.getElementById("price-min").value
        let max = document.getElementById("price-max").value
        let model = document.getElementById("filter-model").value
        let brand = document.getElementById("filter-brand").value
        let obj = {}
        obj["price"] = `${min}-${max}`
        obj["model"] = `${model}`
        obj["brand"] = `${brand}`
        if(min === "" || isNaN(min)) min = 0
        if(max === "" || isNaN(max)) max = 0
        if(model === "") delete obj['model']
        if(brand === "") delete obj['brand']
        sFilters(
            obj
        )
    }


    return (
    <div className={"grid-container"}>
        <div className={"left-menu"}>
            <div className={"filter-block"}>
                <div className={"filter-name"}>Ценовой фильтр</div>
                <div className={"filter-fields"}>
                    <span><Form.Control id={"price-min"} className={"filter-field"} placeholder="от" /></span>
                    <span><Form.Control id={"price-max"} className={"filter-field"} placeholder="до" /></span>
                </div>
                <div className={"filter-fields"}>
                    <span><Form.Control id={"filter-brand"} className={"filter-field-second"} placeholder="Марка" /></span>
                </div>
                <div className={"filter-fields"}>
                    <span><Form.Control id={"filter-model"} className={"filter-field-second"} placeholder="Модель" /></span>
                </div>
                <Button className={"btn-next"} onClick={() => {setFilters(); setTimeout(()=>document.location.reload(), 100)}}>Применить</Button>
            </div>
        </div>
        <div className={"main-container"}>
            <div className={"cars-content"}>
                <div className="container cars-container">
                    <div className="row">
                        {carsCards}
                    </div>
                </div>
                <div className={"btn-wrapper"}><Button className={"btn-next"} onClick={
                    () => {if(curPage < countOfPages) setLoadFlagShowMore(true)}}>Показать еще</Button></div>
                <Pages curPage={curPage} totalCount={countOfPages} changePage={changePage} />
            </div>
        </div>
    </div>
    );
}

export default CarsPage;
