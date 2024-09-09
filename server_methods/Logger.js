let fs=require('fs');
let stateManager=require('./jsonReader');

module.exports=(message)=>{stateManager.set_logger_message(message);}
