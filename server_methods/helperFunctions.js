const fs=require('fs');
const fileCreator=require('./fileCreator');
const stateManager=require('./jsonReader');
const BehaviorExport=require('./serverBehavior');
var cnt=0;

module.exports={
saveAgents:async(agent)=>{
    try{
        fs.open("certusMealServer/files/excel{"+(new Date).getDate()+"-"+(new Date).getMonth()+"-"+(new Date).getFullYear()+"}.txt","w",(error)=>{
                 if(error){
                     console.log("*******************error while erasing:"+error);
                     this.saveToLogFile("*******************error while erasing:"+error);
                     BehaviorExport("error while erasing:"+error);
                     state1=true;
                     return false;
                 }
                 else{
                     console.log("*****************Erasing done....");
                      BehaviorExport("*****************Erasing done....");
                     cnt++
                     return true;
                 }
             })
 //saving new data
    await fs.writeFile("certusMealServer/files/excel{"+(new Date).getDate()+"-"+(new Date).getMonth()+"-"+(new Date).getFullYear()+"}.txt",agent,(error)=>{
         if(error){
             console.log("*******************error while saving:"+error);
             this.saveToLogFile("*******************error while saving:"+error);
             BehaviorExport("error while saving:"+error);
             state1=true;
             return false;
         }
         else{
          //   console.log("*****************Agent saved successfully....");
             BehaviorExport("Agent saved successfully....");
             cnt++;
 
      //      jsonWiter({fileName:"excel{"+(new Date).getDate()+"-"+(new Date).getMonth()+"-"+(new Date).getFullYear()+"}",path:"certusMealServer/excel{"+(new Date).getDate()+"-"+(new Date).getMonth()+"-"+(new Date).getFullYear()+"}" })
             return true;
         }
     })
     }
     catch(e){
         throw(e)
     }
},
saveExcel:async(agentList)=>{
    try{
        fs.open(stateManager.get_current_writeFile_path(), "w", (error) => {
               if (error) {
                   console.log("*******************error while erasing:" + error);
                   this.saveToLogFile("*******************error while erasing:" + error);
                   BehaviorExport("error while erasing:" + error);
                   fileCreator(stateManager.get_current_writeFile_path());
                   state1 = true;
                   return false;
               }
               else {
                   console.log("*****************Erasing done....");
                   BehaviorExport("Erasing done....");
                   cnt++;
                   return true;
               }
           })
   //saving new data
      fs.writeFile(stateManager.get_current_writeFile_path(), agentList, (error) => {
               if (error) {
                   console.log("*******************error while saving:" + error);
                  this. saveToLogFile("*******************error while saving:" + error);
                   BehaviorExport("error while saving:" + error);
                   fileCreator(stateManager.get_current_writeFile_path());
                   state1 = true;
                   return false;
               }
               else {
                   console.log("*****************Agent saved successfully....");
                   BehaviorExport("Agent saved successfully....");
                   cnt++;
                   return true;
               }
           });
       }
       catch(e){
           throw(e)
       }
},
saveToLogFile:async(str)=>{
    try{
        //saving new data
           await fs.appendFile("certusMealServer/log.txt",('\n'+str),(error)=>{
                if(error){
                    console.log("*******************error while saving to log file:"+error);
                    BehaviorExport("error while saving to log file:"+error);
                    fileCreator("certusMealServer/log.txt");
                    return false;
                }
                else{
                    console.log("*****************Agent saved successfully....");
                    BehaviorExport("Agent saved successfully....");
                    return true;
                }
            })
            }
            catch(e){
                throw(e)
            }

}
}







