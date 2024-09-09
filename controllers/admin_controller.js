const json = require("body-parser/lib/types/json");
const crypto=require("crypto");
const mailer=require('nodemailer')
const mongoClient=require("mongodb").MongoClient;

const IDStore=require('../server_methods/getDeviceID');
const decrypter=require('../utils/encryption_service');
const stateManager= require("../server_methods/jsonReader");
const saveAdmin=require('../server_methods/saveAdminState');
const Logger=require('../server_methods/Logger');
const utility_object=require('../utils/utility_object')

const client=new mongoClient("mongodb://localhost:27017");
const dbName="certusAdmin";
const collectionName="admins";

const db=client.db(dbName);
const collection=db.collection(collectionName);

let inspector={
    createUser:(req,resp)=>{
        console.log("new user creation initiated...", req.body);
        Logger("new user creation initiated..."+req.body);

        let network_obj=req.body;
        let {name,password,email,deviceID}=decrypter.Decrypt_data(network_obj.encrypted_data);
       

        if(!name||!password||!email||!deviceID)   return resp.status(400).json({error:"fill all the fields"});

     
        let verificationCode=utility_object.generateCode();
        let lastUpdated=(new Date()).getDate()+"-"+(new Date()).getMonth()+"-"+(new Date()).getFullYear();
      //  if(email=='wadikakevin@gmail.com') 

        IDStore.addID(deviceID);
     let passwdHash=utility_object.Hash_password(password);

       
        const user={name:name,email:email,password:passwdHash,deviceID:deviceID,loggedIn:true,code:verificationCode,status:'pending'};
        insertUser(resp,user);//saving user

        //saving user to json file
        let admin={name:name,email:email,cuurent_read_file:`excel${Math.floor(Math.random()*1)+199}`,deviceID:deviceID,lastUpdated:lastUpdated}
        saveAdmin(admin);
},

createAnotherUser:async(req,resp)=>{
    let inspector=this;
    let network_obj=req.body;
    let paramsObj=decrypter.Decrypt_data(network_obj.encrypted_data);
    let RefSigner=paramsObj.signer;

    try{
    await client.connect();
//checking if user exists
collection.findOne({deviceID:RefSigner})  //since here we expect only one admin already in place with id==1
           .then(data=>{
            if(data!=null){
           //     inspector.createUser(req,resp);------------createUser is not a function???

                let {name,password,email,deviceID}=req.body;
                if(!name||!password||!email||!deviceID)   return resp.status(400).json({error:"fill all the fields"});
        
                IDStore.addID(deviceID);
                let verificationCode=generateCode();
                let lastUpdated=(new Date()).getDate()+'-'+(new Date()).getMonth()+'-'+(new Date()).getUTCFullYear();
                let passwdHash=Hash_password(password);

                 //encrpting password using sha1 algorithm
                    sha1=crypto.createHash("sha1");
                    sha1.update(password);
                   passwdHash=sha1.digest("hex");
        
                const user={name:name,email:email,password:passwdHash,deviceID:deviceID,loggedIn:true,code:verificationCode,status:'pending'};
                insertUser(resp,user);//saving user
        
                //saing user to json file
                let admin={name:name,email:email,deviceID:deviceID,lastUpdated:lastUpdated}
                stateManager.create_another_admin(admin);



            }else{
                console.log('Error while registering new user...');
                Logger('Error while registering new user...');
                resp.status(400).json({message:'Somethng went wrong...'})
         
            }
           })
        
    }
    catch(e){
        console.log("Error occured while creating new admin: "+e);
        Logger("Error occured while creating new admin: "+e);
    }
},

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
},


deleteUser:async(req,resp)=>{
let network_obj=req.body;
let {username,ID}=decrypter.Decrypt_data(network_obj.encrypted_data);

if(!IDStore.confirmID(ID)) return resp.status(402).json({message:"invalid device-ID"});

await client.connect();
collection.findOne({name:username})
        .then(async data=>{
            if(data!=null){
               await collection.deleteOne({name:username})
               IDStore.deleteID(ID);
               console.log('user deletion successfull');
               Logger('user deletion successfull');
                resp.status(200).json({message:'user deleted successfully'});
            }
            else{
                console.log('user deletion failed');
                Logger('user deletion failed');
                resp.status(404).json({message:'user doesnt exist'});
            }
        })
},

changePassword:async(req,resp)=>{
    let network_obj=req.body;
    let  {username,newPassword,ID}=decrypter.Decrypt_data(network_obj.encrypted_data);

    let retrievedObj;
    let passwordHash=Hash_password(newPassword);

    if(!IDStore.confirmID(ID)) return resp.status(402).json({message:"invalid device-ID"});

collection.findOne({name:username,password:passwordHash})
.then(async data=>{
    if(data==null){
        retrievedObj=data;
       await collection.updateOne({name:username},{$set:{password:passwordHash}})
       console.log('password change successfull');
       Logger('password change successfull');
        resp.status(200).json({message:'password changed successfully'});
    }
    else{
        console.log('password already exists');
        Logger('password already exists');
        resp.status(402).json({message:'failed'});
    }
})
},

verifyEmail:async(req,resp)=>{  //this is a get request from the email
    let inspector=this;
    let {username,clientCode,ID}=req.query;

    if(!IDStore.confirmID(ID)) return resp.status(402).json({message:"invalid device-ID"});

    try{
    await client.connect();
    collection.findOne({name:username})
            then(async obj=>{
                if(obj!=null){
                    if(clientCode==obj.code){
                      await  collection.updateOne({name:username},{$set:{status:'active'}})
                      IDStore.addID(ID);  //very important--giving access to the dashboard actually
                        resp.status(200).json({message:"your account has been succesfsfully verified"})
                    }
                    else{
                        resp.status(400).json({message:"Invalid verification code"});
                    }
                }
            })
        }
        catch(e){
            console.log('Error while verifying email address:',e);
            Logger('Error while verifying email address:'+e);
        }
},

getPassword:async (req,resp)=>{
    let inspector=this;
let network_obj=req.body;
let {username,ID}=decrypter.Decrypt_data(network_obj.encrypted_data);


if(!IDStore.confirmID(ID)) return resp.status(402).json({message:"invalid device-ID"});
console.log('retrieving forgotten password...');

try{
    await client.connect();
    collection.findOne({name:username})
            .then(obj=>{
                if(obj!=null){
                    console.log('sending password-link to email...');
                    sendEmail(obj.email,`Hello ${username},go to this link to change your password: ${process.env.FORGOT_PASSWORD}?id=${ID}`,resp)
                }
                else{
                    console.log('user does not exist...'+username);
                }  resp.status(402).json({message:"user does not exist"})
            })
        }
        catch(e){
            console.log('Error while verifying email address:',e);
            Logger('Error while verifying email address:'+e)
        }
},

sendMail:(email,name,dataTosend)=>{
return utility_object.sendEmail(email,`Hello ${name},your password is: ${dataTosend}`);
}
}


//private functions
async function insertUser(resp,user){
    try{
        await client.connect();
  var flag=true;
//checking if user exists
collection.findOne({email:user.email})
.then(data=>{
    try{
 if(data!=null) {
    console.log("user: "+data.name+" already exists...");
    resp.status(403).json({message:"user exists..."})
    Logger("user: "+data.name+" already exists...");
    flag=false; //alternative since promisereject is not working
    //PromiseRejectionEvent();
    }
else{
    console.log("creating new user...")
    Logger("creating new user...");
}}
catch(e){ console.log("Error in sync:"+e)}}
)
.then(async()=>{
    if(flag==true){
        let stack=true,counter=1;

        collection.insertOne(user)
        .then(()=>{
    utility_object.sendEmail(process.env.USER_EMAIL,`<p>A new admin with email ${user.name} has been added</p>`,resp);
     utility_object.sendEmail(user.email,`<p>Please click the address to verify your email:<a>${process.env.SERVER_ADDRESS}/verification-code?ID=${user.deviceID}&username=${user.name}&clientCode=${user.verificationCode}</a></p>`,resp);
        console.log("user has been created successfully...");
        Logger("user has been created successfully...");
        resp.status(200).json({message:"user has been created successfully..."})
    })
    }
    else{
        console.log("operation aborted...");
        resp.status(400).json({message:'untrusted user signup...operation aborted'});
    }
},()=>{
    resp.json({error:"operation failed..."});
    console.log("operation aborted...");  
    Logger("operation aborted...");
    resp.status(400).json({message:'failed create new user...'});
})
    }

    catch(e){ //user exists
        if(e.code==11000) console.log("document key error,this user(document) already exists...");
        else console.log("An unknown error occured"+e);
    }
  
}

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




module.exports=inspector;