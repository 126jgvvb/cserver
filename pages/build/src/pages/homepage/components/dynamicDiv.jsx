import React from "react";
import { FileUpload } from "./fileUpload";
import { FileDownload } from "./downloadFile";
import { DeleteFile } from "./deleteFile";

export const DynamicDiv=({DataToRender})=>{
    if(!DataToRender) return;
//   alert(DataToRender.dynamicDiv.files.length);
 
if(DataToRender.dynamicDiv.title==='uploads'){
    if(DataToRender.dynamicDiv.files.length<=0) return(
        <div className="dynamicDiv">
        <div><label>No files available...</label></div>
        </div>
    )

    return( 
        <div className="dynamicDiv">   
            { 
             DataToRender.dynamicDiv.files.length>0 && DataToRender.dynamicDiv.files.map(
                row=>{
                     //   alert(row.path);
                return(    <div className='rowItem'>
                        <label>{row.name}</label>
                        <label>{row.date}</label>
                        <FileDownload filename={row.name} filePath={row.path}/>
                        <DeleteFile ID={DataToRender.ID} adminFile={false} filename={row.name} path={row.path}/>
                        </div>
            )}
            ) } 
        </div>
    );
}

    if(DataToRender.dynamicDiv.title==='IO'){
        return(
            <div className="dynamicDiv">
                <div className="fileDiv">
                <label>Upload the text file here</label>
                <FileUpload/>
                <strong><bold>Recent Admin uploads</bold></strong>
            </div>

<div className="admin-uploads">
           
            { 
             DataToRender.dynamicDiv.adminUploads.length>0 && DataToRender.dynamicDiv.adminUploads.map(
                row=>{
                     //   alert(row.path);
                return(    <div className='rowItem'>
                        <label>{row.fileName}</label>
                        <label>{row.date}</label>
                        <FileDownload filename={row.fileName}  filePath={row.filePath}/>
                        <DeleteFile ID={DataToRender.ID} adminFile={true} filename={row.fileName} path={row.filePath}/>
                        </div>
            )}
            ) } 
            </div>
            </div>
        )
    }


            if(DataToRender.dynamicDiv.title==='Admin'){
                if(DataToRender.adminDetails.length<=0) return(
                    <div><label>Not available...</label></div>
                )

                return(
                    <div className="dynamicDiv">
                                <div>
                                    {DataToRender.adminDetails.length>0 && DataToRender.adminDetails
                              //      .filter(admin=>admin.deviceID===DataToRender.ID)
                                    .map(admin=>{
                                        return(
                                            <div className={'adminDetails'}>
                                               <div><label>Name:<strong>{admin.name}</strong></label></div> 
                                            <div><label>email:<strong>{admin.email}</strong></label></div>
                                             <div className="deviceID"><label>Device ID:<strong>{admin.deviceID}</strong></label></div>
                                             <div>
                                                 <em>last updated:<strong>{admin.lastUpdated}</strong></em>
                                                 <label>{DataToRender.lastDate}</label>
                                                 </div>
                                    </div>
                                        )
                                    })
                               
            }
                                    <div className="aside">
                                    <aside>
                                        <p>Inorder to delete this account,you must initiate the request from the mobile app</p>
                                        </aside>
                                        </div>
                            </div>
                    
                    </div>
                )
            }

                if(DataToRender.dynamicDiv.title==='Behavior')
                    if(DataToRender.behavior.length<=0) return(
                        <div><label>Not available...</label></div>
                    )

                    return(
                        <div className="dynamicDiv">
                    <div className={'behavior'}>
                                        <h2>Recent sessions:</h2>
                                        <div className="lastSession">
                                            <em>last updated:<strong>{DataToRender.behavior[1].lastUpdated}</strong></em>
                                </div>

                                <div className="server-state">
                                {DataToRender.behavior.length>0 && DataToRender.behavior.map(
                                    messageObj=>{
                                        return(
                                                <label>{messageObj.message}</label>
                                        )
                                    }
                                )}

                               </div>

                    </div></div>
                    )


            }