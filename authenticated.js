let stateManager=require('./jsonReader');

module.exports=(req,resp)=>{
if(!stateManager.get_admin_id==null) return resp.status(402).json({message:'No instance in memory'});
return resp.status(200).json({message:'ready to proceed...'});

}