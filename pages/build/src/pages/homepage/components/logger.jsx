//import React, { Children } from "react";

export const Logger=({logData})=>{
if(logData===undefined) return;
    return ( 
    <div className="loggerDiv">
        <div className="console">
        {
            logData.logchildren.length>0 && logData.logchildren.map(item=>{
                return( 
                <div>
               <label>{item.message}</label>
                </div>
            )})
         }

        </div>
    </div>
    )
}
