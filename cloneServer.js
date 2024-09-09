const { exec } = require('child_process');
const cluster=require('cluster');
const { env } = require('process');
const cpuNo=require('os').cpus().length;


module.exports={
start:()=>{
    if(cluster.isMaster){
cluster.setupMaster({exec:__dirname+'/mealServer.js'});

        console.log('Master process started...');
        console.log('cpu count:'+cpuNo);
    
    for(let i=0; i<1; ++i){
        cluster.fork([env]);
    }
    }
    
    cluster.on('fork',(worker)=>{
        console.log(`worker ${worker.process.pid} forked`);
    });
    
    cluster.on('online',(worker)=>{
        console.log(`woker ${worker.process.pid} is online`);
    });
    
    cluster.on('listening',(worker)=>{
        console.log(`worker ${worker.process.pid} is listening`);
    })
    
    
    cluster.on('disconnect',(worker)=>{
        console.log(`worker ${worker.process.pid} has disconnected`);
    });
    
    cluster.on('message',(worker)=>{
        console.log(`Message recieved from worker with id: ${worker.process.pid}`)
    });
    
    cluster.on('exit',(worker,code,signal)=>{
        console.log(`worker with id:${worker.process.pid} and code:${code} and signsl:${signal}  has died`)
        console.log('creating worker again...');
        cluster.fork();
    })

}

}

