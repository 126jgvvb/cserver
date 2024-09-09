const fs=require('fs');

module.exports= function saveDataToJSON(Obj){
    let StrObj=JSON.stringify(Obj,null,2); //null and 2 for easy readability
    let writing_status=true;

    if(Obj.fileName==undefined) return; 
   // console.log('commencing data writing to the file: '+Obj.fileName+'.json');

    fs.open(`certusMealServer/json/${Obj.fileName}.json`,"w",(error)=>{
        if(error){
            writing_status=false;
            console.log("*******************error while erasing:"+error);
            saveToLogFile("*******************error while erasing:"+error);
            return false;
        }
        else{
            return true;
        }
    });

        fs.writeFile(`certusMealServer/json/${Obj.fileName}.json`,StrObj,(err)=>{
            if(err){
                console.error(`Error writing to file:${Obj.fileName}.json`,err);
                writing_status=false;
            }
            else{
                return true;
            }
            
        })
        return writing_status;
    }