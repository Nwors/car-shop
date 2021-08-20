import React from 'react';
import {Button} from 'react-bootstrap'
import "./CarCards.css"
import {LinkContainer} from "react-router-bootstrap";
function CarsCard({id, name, price, image}) {
    return (
        <div className="card mb-3">
            <div className="row no-gutters">
                <div className="col-md-4 image-placeholder" style={{backgroundImage: `url("http://192.168.88.25:8888/uploads/${image}")`}}>
                    {/*<img draggable={false} src={`http://localhost:8888/uploads/${image}`} className="card-img" alt="..."/>*/}
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{name}</h5>
                        <p className="card-text">Цена: {price}.</p>
                        {/*<p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>*/}
                    </div>
                </div>
                <LinkContainer to={`/cars/${id}`}><Button variant="primary" className={"card-btn"}>Подробнее</Button></LinkContainer>
            </div>
        </div>
    );
}

export default CarsCard;
