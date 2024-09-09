const http=require("http");
const express=require("express");
const expressFiles=require('express-fileupload');
const cors=require("cors");
const path=require('path');
const bodyparser=require("body-parser");

require('dotenv').config();
const app=express();

const stateManager=require('./server_methods/jsonReader');
const scheduler=require('./server_methods/scheduler');
//routes
const dashboard_routes=require('./routes/dashboard_routes');
const admin_routes=require('./routes/admin_routes');
const database_routes=require('./routes/database_routes');



app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'views/build/public')));
app.use(expressFiles({createParentPath:true}));
app.use('/dashboard',dashboard_routes);  //dashboard endpoints
app.use('/admin',admin_routes);  //credential requests
app.use('/database',database_routes);  //all data related requests


app.get('/',(req,resp)=>{
    resp.sendFile(path.join(__dirname+'/views/build/public/index.html'));
})
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


//simulating 10 concurrent users with a request rate of 100 reqeusts per second
//command:::::loadtest -c 10 --rps 100 -n 100 http://localhost:2000/heavy-duty
//results::without clusters------->totalTime:14.444s
//results::with clusters------->totalTime:5.669s

const server=http.createServer(app);

server.listen(2000,()=>{
    console.log("mealServer running at port:2000");
    stateManager.load_stored_admins_into_memory();
    setInterval(scheduler,50000);  //constantly polling the time function to check whether its midnight
  
});
