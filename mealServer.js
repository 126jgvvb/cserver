const http=require("http");
const express=require("express");
const expressFiles=require('express-fileupload');
const cors=require("cors");
const path=require('path');
const bodyparser=require("body-parser");
require('dotenv').config();


//const serverCloner=require('./certusMealServer/cloneServer');
const Database=require("./Database");
const AdminLogin=require("./AdminLogin");
const BehaviorExport=require('./serverBehavior');
const saveUploadedFile=require('./uploadProcessor');
const AdminSignup=require("./AdminSignup");
const getData=require('./getInitialObj');
const deleteFile=require('./deleteFile');
const downloadFile=require('./downloadFile');
const stateManager=require('./jsonReader');
const admin_authentication=require('./admin_authenticator');
const authenticated=require('./authenticated');

//serverCloner.start();
const app=express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'pages/build')));
app.use(expressFiles({createParentPath:true}));

const server=http.createServer(app);

app.get('*',(req,resp)=>{
    resp.sendFile(path.join(__dirname+'/pages/build/index.html'));
})

//dashboard endpoints
app.get('/authenticated',(req,resp)=>{authenticated(req,resp)});

app.post('/admin-auth',(req,resp)=>{admin_authentication(req,resp)});

app.post('/upload-file',(req,resp)=>{ saveUploadedFile(req,resp)});

app.get('/load-page-data',(req,resp)=>{ getData(req,resp);})

app.get("/verification-code",(req,resp)=>{AdminSignup.verifyEmail(req,resp)});

app.post('/delete-file',(req,resp)=>{ deleteFile(req,resp);})

app.get('/download',(req,resp)=>{downloadFile(req,resp)});




//mobile app endpoints
app.post("/login",(req,resp)=>{ AdminLogin.confirmUser(req,resp)});

app.get("/logout",(req,resp)=>{ AdminLogin.logoutUser(req,resp)});

app.post("/signup",(req,resp)=>{ AdminSignup.createUser(req,resp)});

app.post("/delete-account",(req,resp)=>{ AdminSignup.deleteUser(req,resp)});

app.post("/change-password",(req,resp)=>{AdminSignup.changePassword(req,resp)});

app.post("/forgot-password",(req,resp)=>{AdminSignup.getPassword(req,resp)});

app.post("/newAdmin",(req,resp)=>{AdminSignup.createAnotherUser(req,resp)});

app.post("/getAgents",(req,resp)=>{ Database.getAgents(req,resp)});

app.post("/backup",(req,resp)=>{ Database.updateDatabase(req,resp)});



//simulating 10 concurrent users with a request rate of 100 reqeusts per second
//command:::::loadtest -c 10 --rps 100 -n 100 http://localhost:2000/heavy-duty
//results::without clusters------->totalTime:14.444s
//results::with clusters------->totalTime:5.669s
app.get('/heavy-duty',(req,resp)=>{
    let total=0;
    for(let i=0; i<50000000; ++i){
        ++total;
    }
    resp.send("Total:"+total);
})

app.get("/ping",(req,resp)=>{
    let queryParams=req.query;

    console.log('connection detected...DeviceID:'+queryParams.id);
    stateManager.set_logger_message('connection detected...DeviceID:'+queryParams.id);
    
    resp.writeHead(200,{'Content-Type':'application/json'});
    const data={
        message:'active',
        timestamp:Date.now()
    }
    resp.end(JSON.stringify(data));
    });


server.listen(2000,()=>{
    console.log("mealServer running at port:2000");
    stateManager.load_stored_admins_into_memory();
    Database.readTextFile();
    Database.analyze();

        //constantly polling the time function to check whether its midnight
        setInterval(()=>{
            console.log('checking time...current Time:'+(new Date).getHours()+":"+(new Date).getMinutes());
          BehaviorExport('checking time...current Time:'+(new Date).getHours()+":"+(new Date).getMinutes());
            //at the time(0:30) only...always reseting
            if((new Date).getHours()==0 && (new Date).getMinutes()==30) Database.resetLunchState();  //at midnight reached? erase/reset hadLunch values
        },50000);

});
