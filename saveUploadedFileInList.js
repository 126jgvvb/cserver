let initialObj=require('./serverPageObj');
let saveDataToJSON=require('./jsonWriter');
const IDStore=require('./getDeviceID');
const { init } = require('create-react-app/createReactApp');

module.exports=(Obj)=>{
  //  if(!IDStore.confirmID(req.body.ID)) return resp.status(402).json({message:"invalid device-ID"});

let fileArray=initialObj.layoutObj.dynamicDiv.adminUploads;
if(fileArray==null || fileArray==undefined) fileArray=[];

fileArray.push(Obj);
initialObj.layoutObj.dynamicDiv.adminUploads=fileArray;

saveDataToJSON({fileName:"initialState",obj:initialObj});
}