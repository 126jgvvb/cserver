import React from "react";
import { Credentials } from "./loginCredentials";

export const Layout=()=>{
    return(
        <div className="loginLayout">
            <div className="loginCard">
                    <label>Enter your device-id</label>
                    <Credentials/>
            </div>
        </div>
    )
}