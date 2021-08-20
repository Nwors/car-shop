
import './App.css';
import $ from 'jquery'
import {Redirect, Route, Switch} from "react-router-dom"
import {Car} from "./Structures/Car.js";
import {TechnicalCharacteristics} from "./Structures/TechnicalCharacteristics";
import Navigation from "./components/Navbar/Navigation.jsx";
import LoginPage from "./components/LoginPage/LoginPage";
import HomePage from "./components/HomePage/HomePage";
import CarsPage from "./components/CarsPage/CarsPage";
import Form from "./components/CreateAdForm/AdForm";
import CarPage from "./components/CarsPage/CarPage/CarPage";
import UpdateForm from "./components/CreateAdForm/UpdateForm/UpdateForm";

function App() {
  let car = new Car("Машина", "нормальное авто", ["1.jpg", "2.jpg"], 10 , "+79323221649",
      new TechnicalCharacteristics("Камаз", "А-10",1920, "DFFD", -1));
    return (
    <>
    <Switch>
        <Route path={"/login"} render={() => <LoginPage/>}/>
        <Route path={"*"} render={()=><Navigation/>}/>
    </Switch>
    <Switch>
        <Route path={"/home"} render={() => <HomePage/>}/>
        <Route path={"/cars/:id"} render={() => <CarPage/>}/>
        <Route path={"/cars"} component={CarsPage}/>
        <Route path={"/createAd"} render={() => <Form/>}/>
        <Route path={"/updateAd/:id"} render={() => <UpdateForm/>}/>
        <Redirect
            to={{
                pathname: "/cars",
            }}
        />
    </Switch>
    </>
  );
}

export default App;


