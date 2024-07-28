import { NavBar } from "./components/NavBar";
import { MainDiv } from "./components/mainDiv";
import {Helmet} from 'react-helmet';
import React,{useState} from 'react';

import './styles/NavBar.css';
import './styles/mainLayout.css';

function HomePage(){
    return(
        <div className="App">
        <NavBar/>
        <MainDiv/> 
        </div>
    )
}



export default HomePage;