let stateManager=require('./jsonReader')
const IDStore=require('./getDeviceID');

module.exports=async (req,resp)=>{
let queryParams=req.query;
if(!IDStore.confirmID(queryParams.id)) return resp.status(402).json({message:"invalid device-ID"});

resp.writeHead(200,{'Content-Type':'application/json'});
resp.end(JSON.stringify(stateManager.get_stateObject()));
return true;
}