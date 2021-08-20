
import 'bootstrap/dist/css/bootstrap.min.css';
import "./NavigationStyle.css"
import {LinkContainer} from "react-router-bootstrap"

import React from 'react';
import {Nav, Navbar, Container, NavDropdown} from 'react-bootstrap'

function Navigation() {
    return (
        <Navbar fixed="top" bg="light" expand="lg">
            <Container className={"container-width-none container-position-fixed"}>
                <div className={"logo-image"}/>
                <LinkContainer to={"/"}><Navbar.Brand href="/">Car-shop</Navbar.Brand></LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to={"/createAd"}><Nav.Link>Создать объявление</Nav.Link></LinkContainer>
                        <LinkContainer to={"/cars"}><Nav.Link>Каталог автомобилей</Nav.Link></LinkContainer>
                        {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">*/}
                        {/*    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Divider />*/}
                        {/*    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
                        {/*</NavDropdown>*/}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;