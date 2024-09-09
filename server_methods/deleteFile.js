const fs=require('fs').promises;
const Fs=require('fs');
const IDStore=require('./getDeviceID');
const stateManager=require('./jsonReader');

module.exports=(req,resp)=>{
    if(!IDStore.confirmID(req.body.ID)) return resp.status(402).json({message:"invalid device-ID"});
   let fileObj=(req.body);

fs.unlink(fileObj.path)
   .then(()=>{
    console.log('file deletion succesfull...')

    Fs.readFile(`certusMealServer/json/initialState-${fileObj.ID}.json`,(err,initialObj)=>{
        if(err){
            console.error(`Error reading from file:initialState.json`,err);
        }
        else{
            console.log('Data retrieval was succesfull');
            stateManager.delete_admin_uploaded_file(fileObj.name);
            stateManager.delete_client_uploaded_file(fileObj.name); //incase its a client file

            return resp.status(200).json({message:"deletion successfull..."});
        }
    })
})
   .catch((error)=>{
    console.error('failed to delete file');
    return resp.status(403).json({message:"deletion failed..."});
})


}