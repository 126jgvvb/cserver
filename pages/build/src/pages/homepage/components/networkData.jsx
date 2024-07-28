import React,{useState,useEffect} from "react";
import { useDispatch } from "react-redux";
import { setObject } from "../../../redux/actions";

let url=`https://codedserver2-578ef8372d7c.herokuapp.com/load-page-data?id=1234`;

export const DataDownloader=()=>{
    const [data,setData]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
    let dispatch=useDispatch();

   useEffect(()=>{
   async function fetchData(){
    const response=await fetch(url)
    const serverData=await response.json();
    if(serverData!=null){
    setData(serverData);
    setData(data);
    setLoading(false);
    let newObjectState=JSON.parse(JSON.stringify(serverData,null,2));  
 //  alert(Object.keys(newObjectState));
   // newObjectState=newObjectState.obj;
    dispatch(setObject(newObjectState));

}
else{
    setLoading(false);
    if(!response.ok){
        throw new Error('Network error');
    }

    setError(error);
    setLoading(false);
}
    }
    
fetchData();

},[error,dispatch])

    if(loading){
        return <div>Loading...</div>
    }

    if(error){
        return <div>Error:{error.message}</div>
    }

    return(
   <div>Complete...</div>
   
    )
}


