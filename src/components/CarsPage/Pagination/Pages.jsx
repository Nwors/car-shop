import React from 'react';
import {Pagination} from "react-bootstrap";
import "./PaginationStyle.css"
import {Redirect, useHistory} from "react-router-dom";


function Pages({curPage, totalCount, changePage}) {
    const history = useHistory()
    return (
        <div className={"pagination-container d-flex"}>
        <Pagination className={"pagination-cars"}>
            <Pagination.First/>
            <Pagination.Prev onClick={() => changePage(false)}/>

            <Pagination.Item onClick={() => changePage(false)}>{curPage - 1 === 0 ? "-" : curPage - 1}</Pagination.Item>
            <Pagination.Item >{curPage}</Pagination.Item>
            <Pagination.Item onClick={() => changePage(true)}>{curPage + 1 > totalCount ? "-" : curPage + 1}</Pagination.Item>

            <Pagination.Next onClick={() => changePage(true)} />
            <Pagination.Last/>
        </Pagination>
        </div>
    );
}

export default Pages;