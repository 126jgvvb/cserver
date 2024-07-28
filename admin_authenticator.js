let stateManager=require('./jsonReader');
let IDStore=require('./getDeviceID');
const jwt=require('jsonwebtoken');

module.exports=(req,resp)=>{
    if(!IDStore.confirmID((req.body).id)) return resp.status(402).json({message:'invalid id'});
    let token=generate_token((req.body).id);

    stateManager.set_admin_id((req.body).id)?
    resp.status(200).json({token}):
    resp.status(402).json({message:'Error incured while authenticating client...'})

    stateManager.load_state_object();  //finally loading the specific instance in memory
    setInterval(() => {
        stateManager.load_state_object();
    }, 3000);
}




const generate_token=(userID)=>{
    return jwt.sign({id:userID},process.env.SECRET_KEY,{expiresIn:'1h'});
}