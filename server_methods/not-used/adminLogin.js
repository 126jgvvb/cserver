const mongoClient = require("mongodb").MongoClient;
const  Logger = require("./Logger");
const IDStore=require('./getDeviceID');
//const passport=require("passport"); //experimental(recommended),not yet used it
const crypto=require("crypto");
const express=require("express");
const app=express();
const stateManager=require('./jsonReader');
const decrypter=require('./encryption_service');
//app.use(passport.initialize());
//app.use(passport.session());

const client=new mongoClient("mongodb://localhost:27017");

const dbName="certusAdmin";
const collectionName="admins";


let  clientX={
    confirmUser:async (req,resp)=>{
        let network_obj=req.body;
        let paramsObj= decrypter.Decrypt_data(network_obj.encrypted_data);

        console.log("user login initiated...",paramsObj);
        if(!IDStore.confirmID(paramsObj.ID)) return resp.status(402).json({message:"invalid device-ID"});
    
        try{
        if(!paramsObj.name||!paramsObj.password) return resp.status(400).json({message:"fill all the fields"});
        findUser(req,resp,paramsObj.name,paramsObj.password);
        }
        catch(e){
            console.log("error logging in: "+e)
        }
    },

    logoutUser:(req,resp)=>{
        let network_obj=req.body;
        let paramsObj= decrypter.Decrypt_data(network_obj.encrypted_data);

        if(!IDStore.confirmID(paramsObj.ID)) return resp.status(402).json({message:"invalid device-ID"});

        LogOutUser(resp,paramsObj.name,paramsObj.password);
}
}


//functions
async function findUser(req,resp,username,password){  
    try{
        await client.connect();

  const db=client.db(dbName);
  const collection=db.collection(collectionName);
  var flag=true;


//checking if user exists
collection.findOne({name:username})    //actually check using this->{name,deviceID} to ensure the same device
.then(dat=>{
 if(dat!=null) {   //user exists
        sha1=crypto.createHash("sha1");
        sha1.update(password);
       passwdHash=sha1.digest("hex");

       if(passwdHash!=dat.password) {
        console.log(`invalid provided password for ${username}`);
        resp.status(402).json({error:"This user is already logged in..."});
       } //hashes must be the same

        if(dat.loggedIn==true){
            console.log("user already logged in...");
            stateManager.set_admin_id((req.body).id);
            resp.status(200).json({error:"This user is already logged in..."});
        }
             else{
        collection.findOneAndUpdate({name:username},{$set:{loggedIn:true}})
        .then(()=>{
            console.log("user logged in successfully...");
            stateManager.set_admin_id((req.body).id);
            resp.status(200).json({message:"done"});
           // resp.sendFile(path.resolve("","proxyPac","chargedDust.html")); 
        });
    }
    }
     else{
        console.log('------------------user "'+username+'" does not exist...');
        resp.status(402).json({message:"user does not exist"});
        flag=false;
     }
     })
    }
    catch(e){
        console.log("error while logging in.."+e);
        Logger("error while logging in.."+e);
    }
}





async function LogOutUser(resp,username,password){
    try{
        await client.connect();

  const db=client.db(dbName);
  const collection=db.collection(collectionName);
await collection.findOne({name:username})
                                .then(data=>{
                                    if(data.name!=null && data.password!=null){
                                        collection.findOneAndUpdate({name:username},{$set:{loggedIn:false}})
                                                    .then(()=>{
                                                        console.log("user logged out successfully..");
                                                        Logger("user logged out successfully..");
                                                        resp.json({message:"user logged out..."})
                                                    })
                                    }
                                    else PromiseRejectionEvent();
                                })
                                .then(()=>{},()=>{
                                    console.log("invalid username/password");
                                   Logger("invalid username/password");
                                    resp.json({error:"invalid username/password"})
                                })

   
}
    catch(e){
        console.log("error while logging out:"+e);
     //   Logger("error while logging out:"+e);
    }
}






module.exports=clientX;





