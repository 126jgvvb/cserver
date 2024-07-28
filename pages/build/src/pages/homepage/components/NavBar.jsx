import React from "react";
import { Cloud } from "phosphor-react";
import {List} from 'phosphor-react';


export const NavBar=()=>{
    let isOn=false;
const toggleMenu=()=>{
 isOn?document.getElementById('firstColumn').style.display='none'
: document.getElementById('firstColumn').style.display='block';
isOn=isOn?false:true;
}


    return(
        <div className='navbar'>
            <div className="contents">
            <Cloud color="white" className="cloudIcon"/>
            <label className="heading">chargedServer</label>
            <List className="menu-button" size={30} color="white" onClick={toggleMenu}/>
        </div>
        </div>
    )
}