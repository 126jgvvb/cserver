import React from "react";


export const FileDownload=({filename,filePath})=>{
let path=filePath;
    const startDownload=async ()=>{
        try{
            const response=await fetch(`https://codedserver2-578ef8372d7c.herokuapp.com/download?path=${path}`);
            const blob=await response.blob();
            const url=window.URL.createObjectURL(new Blob([blob]));
            const link=document.createElement('a');
            link.href=url;
            link.setAttribute('download',filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }
        catch(e){
            console.error('Error while downloading file...');
        }
    }

return(
    <div style={{marginLeft:'200px'}}>
        <button className="downloadBtn" onClick={startDownload}>Downlad</button>
    </div>
)


}