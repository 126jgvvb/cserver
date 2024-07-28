import React from "react"
import { useDispatch} from "react-redux";
import { setProperty } from "C:/Users/SAVANA/chargedserver/src/redux/actions";

var activeTabState1='tab-active';
var activeTabState2='tab-inactive';

function ToggleTabs(){
    if(activeTabState1==='tab-inactive'){
    (activeTabState1='tab-active');
    (activeTabState2='tab-inactive');
    }
    else{
        (activeTabState1='tab-inactive');
        (activeTabState2='tab-active');
    }
    
}

export const TabDiv=({data})=>{
    const dispatch=useDispatch();
    const updateProperty=(property,value)=>{
        dispatch(setProperty(property,value));
    }

    if(data.title==='uploads'||data.title==='IO' ){
    return(
       <div className="tabDiv">
        <div className={activeTabState1} onClick={(Event)=>{ToggleTabs(); updateProperty('title','uploads')}} ><label>Backup Analysis</label></div>
        <div className={activeTabState2} onClick={(Event)=>{ ToggleTabs(); updateProperty('title','IO')}}><label>upload section</label> </div>
        </div>
    )}
    else if(data.title==='Admin'){
        return(
            <div className="adminDetailsH"><label>admin details</label></div>
        )
    }
    else if(data.title==='Behavior'){
        return(
            <div className="behaviorHeaderH"><label>Behavior</label></div>
        )
    }
}