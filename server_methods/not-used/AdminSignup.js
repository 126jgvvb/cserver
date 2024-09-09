const json = require("body-parser/lib/types/json");
const crypto=require("crypto");
const mailer=require('nodemailer')
const IDStore=require('./getDeviceID');
const fs=require('fs')
const decrypter=require('./encryption_service');
const mongoClient=require("mongodb").MongoClient;

const stateManager= require("./jsonReader");
const saveAdmin=require('./saveAdminState');
const Logger=require('./Logger');

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

     
        let verificationCode=generateCode();
        let lastUpdated=(new Date()).getDate()+"-"+(new Date()).getMonth()+"-"+(new Date()).getFullYear();
      //  if(email=='wadikakevin@gmail.com') 

        IDStore.addID(deviceID);
     let passwdHash=Hash_password(password);

       
        const user={name:name,email:email,password:passwdHash,deviceID:deviceID,loggedIn:true,code:verificationCode,status:'pending'};
        insertUser(resp,user);//saving user

        //saing user to json file
        let admin={name:name,email:email,deviceID:deviceID,lastUpdated:lastUpdated}
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
return sendEmail(email,`Hello ${name},your password is: ${dataTosend}`);
}

}


//functions
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
       sendEmail(process.env.USER_EMAIL,`<p>A new admin with email ${user.name} has been added</p>`,resp);
      sendEmail(user.email,`<p>Please click the address to verify your email:<a>${process.env.SERVER_ADDRESS}/verification-code?ID=${user.deviceID}&username=${user.name}&clientCode=${user.verificationCode}</a></p>`,resp);
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


function sendEmail(clientEmail,data,resp){
    let transprter=mailer.createTransport(
        {
            service:'gmail',
            auth:{
                user:process.env.USER_EMAIL,
                pass:process.env.USER_PASSWORD
            }
        }
    )


    let mailOptions={
        from:`kevin<${process.env.USER_EMAIL}>`,
        to:clientEmail,
        subject:"SpaceMeals email confirmation",
        text:"A simple verification email from the server",
        html:data
    };


try{
    transprter.sendMail(mailOptions,(e,info)=>{
        if(e){
            resp.status(402).json({message:"Email not sent..."});
            return console.log('Email sending error: '+e);
        }
        console.log('Email has been sent');
        Logger('Email has been sent');
        console.log('Preview:',mailer.getTestMessageUrl(info))
        Logger('Preview:',mailer.getTestMessageUrl(info));
        resp.status(200).json({message:"your password has been sent to your email"})
})
}
catch(e){
    console.log('Email sending error: '+e);
    resp.status(402).json({message:"Email not sent..."+e})
}
}

function generateCode(){
    let codeStr='';
   let cnt=3;
    while(cnt>=0){
        codeStr+=Math.floor(Math.random()*9)+1;
        --cnt;
    }
return codeStr;
}


function Hash_password(password){
    let sha1,passwdHash;
      //encrpting password using sha1 algorithm
      sha1=crypto.createHash("sha1");
      sha1.update(password);
     passwdHash=sha1.digest("hex");
return passwdHash;
}

module.exports=inspector;




