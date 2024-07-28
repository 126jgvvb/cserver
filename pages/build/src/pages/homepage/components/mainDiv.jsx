import React from "react";
import { User} from "phosphor-react";
import {Gear} from "phosphor-react";
import {Upload} from "phosphor-react";

import { useDispatch, useSelector } from "react-redux";
import { setProperty } from "C:/Users/SAVANA/chargedserver/src/redux/actions";

import { TabDiv } from "./tabsDiv";
import { DynamicDiv } from "./dynamicDiv";
import { Logger } from "./logger";
import { DataDownloader } from "./networkData";

var activeTabState1='tab-active';
var activeTabState2='tab-inactive';
var activeTabState3='tab-inactive';

function ToggleTabs(str){
    if(str==='session'){
    (activeTabState1='tab-active');
    (activeTabState2='tab-inactive');
    (activeTabState3='tab-inactive');
    }
    else if(str==='admin'){
        (activeTabState1='tab-inactive');
        (activeTabState2='tab-active');
        (activeTabState3='tab-inactive');
    }
    else{
        (activeTabState1='tab-inactive');
        (activeTabState2='tab-inactive');
        (activeTabState3='tab-active');
    }
    
}


export const MainDiv=()=>{
    const dispatch=useDispatch();
    const layoutObj=useSelector((initialState)=> initialState.layoutObj);
    const updateProperty=(property,value)=>{
        dispatch(setProperty(property,value));

    }

    return(
        <div className="mainlayout">
            <div className="firstColumn" id="firstColumn">
                <div className={activeTabState1}><Upload size={20} className={activeTabState1}/><label onClick={(Event)=>{ ToggleTabs('session');  updateProperty('title','uploads')}}>view sessions</label></div>
                <div className={activeTabState2}><User size={20} className={activeTabState2} /><label onClick={(Event)=>{ ToggleTabs('admin');  updateProperty('title','Admin')}} >Admin</label></div>
                <div className={activeTabState3}><Gear size={20} className={activeTabState3}/><label  onClick={(Event)=>{  ToggleTabs('behavior'); updateProperty('title','Behavior')}}>Behavior</label></div>
               <p><label className="dwnIcon">Data retrieval:</label> <DataDownloader/></p> 
           </div>

            <div className="secondColumn">
               <TabDiv data={layoutObj.tabConfig}/>
                <DynamicDiv DataToRender={layoutObj}/>
               <Logger logData={layoutObj}/> 
                </div> 
        </div>
    )
}