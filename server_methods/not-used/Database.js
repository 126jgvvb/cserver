const fs=require("fs");
const crypto=require("crypto");
const mongoClient=require("mongodb").MongoClient;
const mailSender=require('./AdminSignup');
const IDStore=require('./getDeviceID');
const stateManager=require('./jsonReader');
const BehaviorExport=require('./serverBehavior');
const helper_functions=require('./helperFunctions');
const decrypter=require('./encryption_service');
const client=new mongoClient("mongodb://localhost:27017");
start();

const dbName="certusAdmin";
let collectionName="allAgents"; 
const db=client.db(dbName);
let collection=db.collection(collectionName);
let global_date; 
let DeviceID='';

async function start(){
    await client.connect();
}


let inspector={
    analyze:async function(){

        console.log('checking data validity...');
        helper_functions.saveToLogFile('checking data validity...');
        let date=new Date();
        let inspectorObj=this;
        let collectionX=db.collection('Admnin');

        try{
             collectionX=db.collection('collectionAnalyzer');

            //checking whether the month is done
            collectionX.findOne({name:"monitor"})
                        .then(async obj=>{
                            try{
                            if(obj!=null){
                                if(obj.totalDays==30){
                                    console.log('30 days reached,Erasing database...');
                                   helper_functions.saveToLogFile('30 days reached,Erasing database...');
                                    BehaviorExport('30 days reached,Erasing database...');

                                    if(date.getDate()!=obj.date){ //if its not the same day,we must do this in the next day 
                                        let totalCollections=await db.collections();
                                        
                                        for(let collection of totalCollections){
                                  //          console.log("::::::::::"+collection.collectionName);
                                            if(collection.collectionName!='allAgents' && collection.collectionName!='collectionAnalyzer')
                                          await  db.collection(collection.collectionName).drop();
                                        }

                                      await  collectionX.updateOne({name:"monitor"},{$set:{totalDays:Number(0)},$currentDate:{lastModified:true}})
                                        console.log("The database has been formated...");
                                       helper_functions.saveToLogFile("The database has been formated...");
                                        BehaviorExport("The database has been formated...");
                                    }
                                }
                                else{
                                    console.log('*************Database data still valid...');
                                  helper_functions.saveToLogFile('Database data still valid...');
                                    BehaviorExport('Database data still valid...');
                                }
                                if(obj.did_reset_clients==false){
                                    console.log('Reseting lunch stae...');
                                    inspectorObj.resetLunchState();
                                    obj.did_reset_clients==true;
                                    await  collectionX.updateOne({name:"monitor"},{$set:{did_reset_clients:true}})
                                }
                            
                            }
                            else{
                                console.log("Database check error...cannot continue");
                              helper_functions. saveToLogFile("Database check error...cannot continue");
                                BehaviorExport("Database check error...cannot continue");
                            }
         }
        catch(e){ console.log("Error occured:"+e)} });
        }

        catch(e){
            console.log("Error: "+e);
           helper_functions.saveToLogFile("Error: "+e);
        }
    },
    updateDatabase:async function(req,resp){
         let paramsObj=req.body;

        if(!IDStore.confirmID(paramsObj.ID)){ 
            console.log("=============="+paramsObj.Agents.length);
            BehaviorExport('Rejected access from deviceID:'+paramsObj.ID);
            return resp.status(402).json({message:"unknown device-id"});
        }

        let count=paramsObj.Agents.length-1;
        paramsObj=paramsObj.Agents;
        let hardCnt=count;
        let newCollectionName='';
        let inspectorObj=this;
        let str='name   signature   hadLunch    batch   date    \n';

        if(paramsObj==null||undefined) return console.log("Invalid data to process...");

        console.log('Data recieved,commencing update...');
        console.log('Data:'+JSON.stringify(paramsObj));

        try{
      const collectionName="collectionAnalyzer";
      const collection=db.collection(collectionName);

      await collection.findOne({name:"monitor"})
                        .then(async obj=>{
                            if(obj!=null){ //objects exists??
                               obj.totalDays=Number(Number(obj.totalDays)+1);
                                newCollectionName="collection"+Number(obj.totalDays); //new collection created
                                console.log('>>>>>>>>>>>>>>>>>>new collection name index:'+newCollectionName);
                                BehaviorExport('new collection name index:'+newCollectionName);
                              //we have to save the current date to assist in safe cleaning of the database
                              await  db.createCollection(newCollectionName);
                                collection.updateOne({name:"monitor"},{$set:{totalDays:Number(obj.totalDays)},$currentDate:{lastModified:true}})
                                .then(async ()=>{
                                    let newCollection=await db.collection(newCollectionName);
                                    while(count>=0){ //saving each agent uploaded
                                       if(count==(paramsObj.length-1)){
                                         newCollection.insertOne({"collectionDate":paramsObj[count].date}); //every collection with its date for selective retrievall
                                        global_date=paramsObj[count].date;
                                        }
                                         else{
                                            paramsObj[count].id2=count;
                                            let obj={
                                                id2:count,
                                                name: paramsObj[count].name,
                                                signature: paramsObj[count].signature,
                                                hadLunch:paramsObj[count].hadLunch,
                                                batch: paramsObj[count].batch,
                                                date:global_date
                                            }


                                      await newCollection.insertOne(obj); //saving agent
                                        str+=(paramsObj[count].name+"\t"+paramsObj[count].hadLunch+"\t"+paramsObj[count].batch+"\n");
                                    }
                                    --count;
                                }
                              await  inspectorObj.updateTextFile(newCollectionName,hardCnt);//creating new tx_file with today's date
                                console.log("Data update complete...");
                                BehaviorExport("Data update complete...");
                                resp.status(200).json({message:"Data update complete..."});
                                mailSender.sendMail(str);  //sending the data to the admins email address
                                 //   saveAgents(str,true);
                                },()=>{
                                    console.log('>>>>>>>>>>>>>>>Something went wrong while creating new collection')
                                   helper_functions.saveToLogFile('Something went wrong while creating new collection');
                                    BehaviorExport('Something went wrong while creating new collection');
                                })
                            }
                        })
                        

                       

                    }
    catch(e){
        console.log("Error ocurred: "+e);
       helper_functions.saveToLogFile("Error ocurred: "+e);
        BehaviorExport("Error ocurred: "+e);
    }

},
    getAgents:async function(req,resp){    
        let maxNo=1;
        let network_obj=req.body
        let {date ,ID}= decrypter.Decrypt_data(network_obj.encrypted_data);

            console.log('keys----->'+Object.keys(req.body));

        if(!IDStore.confirmID(ID)){
            BehaviorExport('Rejected access from deviceID:'+ID);
             return resp.status(402).json({message:"unknown device-id"});
    }

        let Farray=[]; //storing the result
        let inspectorObj=this;
        let specialCollection;

try{
//user commands to print data on a given date in a text file
if(date!=undefined && date!="empty"){
    console.log('---------->Date identified'+date);
    BehaviorExport('Date identified '+date);
    db.collections().then((collections)=>{
        let index=collections.length-1;
        let collectionObj;

        while(index>=0){
        collectionObj=collections[index];
        collection=db.collection(collectionObj.collectionName);

        collection.findOne({id2:1}).then((agent)=>{
            //if this object's date property has a a value==to the date in search,then this is the collection we are looking for 
            if((new RegExp((agent.date))).test(date)){
                console.log(collectionObj.collectionName+' found...');
                specialCollection=collectionName;
                this.getAgentsToExcel(specialCollection);  //fetching all items in this collection
                }});
        --index;
        }

    })

}
else{
    console.log('Retrieving data...');
    BehaviorExport('Retrieving data...');
    syncData(maxNo);
}


function syncData(cnt){
    collection.findOne({id2:cnt})
                    .then(agent=>{
                        obj=agent;
                     if(agent!=null||undefined){
                        Farray.push(agent);
                        ++maxNo;
                        syncData(maxNo);
                     } 
                     else {
                     console.log('Data retrieval successful...');
                        resp.status(200).json({maxCnt:maxNo!=1?maxNo-1:maxNo,data:Farray});
                    }
                    },()=>{})
       
}
    }

    catch(e){
        console.log("Error ocurred: "+e);
       helper_functions.saveToLogFile("Error ocurred: "+e);
        BehaviorExport("Error ocurred: "+e);
    }

    },
   getAgentsToExcel: async function(c_name){  
          let maxNo=1;
          let obj;
          let str='name signature   hadLunch    batch   date\n'; 
  
    const collectionName=c_name; //this collection helps incases where the app is new/accidentally uninstalled and looses data
  
    const db=client.db(dbName);
    const collection=db.collection(collectionName);
  
  try{
  function syncData(cnt){
      collection.findOne({id2:cnt})
                      .then(agent=>{
                          obj=agent;
                       if(agent!=null||undefined){
                        str+=(agent[maxNo].name+"\t"+agent[maxNo].hadLunch+"\t"+agent[maxNo].batch+"\t"+"\n");
                          ++maxNo;
                          syncData(maxNo);
                       } 
                       else {
                       console.log('Data retrieval successful...');
                       BehaviorExport('Data retrieval successful...');
                      }
                      },()=>{})
         
  }


  syncData(maxNo);
  helper_functions.saveAgents(str);
  console.log('Agents successfully saved in the text file...');
  BehaviorExport('Agents successfully saved in the text file...');
      }
  
      catch(e){
          console.log("Error ocurred: "+e);
         helper_functions.saveToLogFile("Error ocurred: "+e);
          BehaviorExport("Error ocurred: "+e);
      }
  
      },
    updateTextFile:async function(collectionName,count){ //sending back data to the requesst source and saving also in txt file incase the req fails
        let dataLength=count;
        let id2=0;
        let cnt=0;
        let str='name   signature   hadLunch    batch   date  \n'; //tab separator
        let inspectorObj=this;

        try{
      let collection=db.collection(collectionName);
    

    while((dataLength-1)>=cnt){ 
 await   collection.findOne({id2:id2})
                .then(agent=>{
                    if(agent!=null||undefined){ 
                        str+=(agent.name+"\t"+agent.signature+"\t"+agent.hadLunch+"\t"+agent.batch+"\t"+global_date+' \n'); //this is a tab separator
                        console.log("Agent "+id2+" retrieved...");
                       helper_functions.saveAgents(str); //saving to new txt file
                       helper_functions.saveExcel(str);  //saving to old major txt file ...so as to modify it incase of any deletions
                       inspectorObj.readTextFile();  //also updating the database at the same time for modifications to match every_where
                        id2++;
                       
                    }
                    ++cnt;
                },()=>{
                    console.log('Error while reading Agent with number:'+id2);
                    BehaviorExport('Error while reading Agent with number:'+id2);
                })
               
    }
    
console.group("*************Data length:"+dataLength);


}
    catch(e){
        console.log("Error ocurred: "+e);
      helper_functions.saveToLogFile("Error ocurred: "+e);
    }
    },
    readTextFile:async function(){
        console.log('Reading files...');
let extractedAgents;
let inspectorObj=this;
let len;
let indice=1;
collection=db.collection('allAgents');

            try{
                          fs.readFile("certusMealServer/files/excel.txt",'utf-8',(error,data)=>{
                            if(error){
                                console.log("*******************error while erasing:"+error);
                               helper_functions.saveToLogFile("*******************error while erasing:"+error);
                                BehaviorExport('error while erasing:'+error);
                                state1=true;
                                Promise.reject();
                            }
                            else{
                                console.log("*****************Retrieval successful....");
                                extractedAgents=data.split('\n');
                                len=extractedAgents.length-2;
                                  console.log(extractedAgents);
                                  console.log(">>>>>>>>>>>>>>>>>>>Data_length:"+len);
                                BehaviorExport('Data_length:'+len);

                                  if(len==0 || len==1) return; //icase the file is empty or not found? just retaint the current data
                                
                                  collection.deleteMany().then(()=>{
                                      while(len>0){
                                          syncData(extractedAgents[len]);
                                          ++indice;
                                          --len;
                                      }
                                  }).then(()=>{
                                    console.log('Reseting Agents lunch state for next day session...');
                                    collection.updateMany({hadLunch:'yes'},{$set:{hadLunch:'No'}});
                                  });
                          
                            }
                        })
                    

                    
        
       function syncData(item){
        item=item.split('\t');

        let obj={
            id2:indice,
            name:item[0],
            signature:item[1],
            hadLunch:item[2],
            batch:item[3],
            date:item[4]
        }

            collection.insertOne(obj)
            .then(()=>{
               // console.log('Item saved successfully...');
                BehaviorExport('Item saved successfully...');
             },()=>console.log("something went wrong while saving item..."));
               
        }          
            }
            catch(e){
                console.log('Error while reading text file:'+e);
              helper_functions.saveToLogFile('Error while reading text file:'+e);
            }
    }


}


/*functions
async function insertAgent(resp,document){
    try{
  const collectionName="collection1";
  const collection=db.collection(collectionName);
//checking if user exists
collection.findOne({name:document.name})
.then(data=>{
    try{
 if(data!=null) {
    console.log("Agent: "+data.name+" already exists...");
    BehaviorExport("Agent: "+data.name+" already exists...");
    flag=false; //alternative since promisereject is not working
    //return  PromiseRejectionEvent();
    }
else{
    console.log("creating new agent...");
    BehaviorExport("creating new agent...");
}}
catch(e){ console.log("Error in sync:"+e)}}
)
.then(function(){
    if(flag==true){
     collection.insertOne(document);
    console.log("Agent has been created successfully...");
    BehaviorExport("Agent has been created successfully...");
    resp.json({message:"Agent has been created successfully..."})
    }
    else{
        resp.json({error:"operation failed..."});
        console.log("Agent insertion failed...");
        helper_functions.saveToLogFile("Agent insertion failed...");
        BehaviorExport("Agent insertion failed...");
    }
},()=>{
    resp.json({error:"operation failed..."});
    console.log("operation aborted...")})  
    helper_functions.saveToLogFile("operation aborted...");
    BehaviorExport("operation aborted...");
}

    catch(e){ //user exists
        if(e.code==11000) console.log("document key error,this user(document) already exists...");
        else {
            console.log("Error occured"+e);
            helper_functions.saveToLogFile("Error occured"+e);
    }
    }
  
}*/

module.exports=inspector;
