const Router  = require('express').Router();
const databaseObject=require('../controllers/database_controller');

Router.post("/getAgents",databaseObject.getAgents);

Router.post("/backup",databaseObject.updateDatabase);

module.exports=Router;