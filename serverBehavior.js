let stateManager=require('./jsonReader');
const { init } = require('create-react-app/createReactApp');

module.exports=(message)=>{
stateManager.set_behavior_message(message);
}




