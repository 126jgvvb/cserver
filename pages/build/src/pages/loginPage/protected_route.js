import { Children, useContext } from "react";
import {Navigate, Route,redirect} from 'react-router-dom';
import { auth_context } from "./Auth_service";


const Protected_route=({component:Component,...rest})=>{
    const {token}=useContext(auth_context);

    if(!token){
        return <Navigate to={"/"}/>
    }

    return Children;
}


export default Protected_route;