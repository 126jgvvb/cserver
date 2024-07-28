const  Logger  = require("./serverBehavior");
const IDStore=require('./getDeviceID');
const stateManager=require('./jsonReader');

module.exports=function saveUploadedFile(req,resp){
    if(!IDStore.confirmID(req.body.ID)) return resp.status(402).json({message:"invalid device-ID"});

    if(req.files===null){
    return resp.status(400).json({message:"Invalid file uploaded"});
}

const file=req.files.file;
if(file.mimetype!='text/plain'){return resp.status(402).json({message:'invalid file type'})}

const filePath=path.join(__dirname,'files',file.name);

file.mv(filePath,error=>{
    if(error){
        console.error(error);
        Logger(error);
        return resp.status(500).send(error);
    }

     console.group("file path:--->"+filePath);
    stateManager.save_uploaded_file({fileName:file.name,status:true,filePath:filePath,date:(new Date).getDate()+"-"+(new Date).getMonth()+"-"+(new Date).getFullYear()});
    resp.status(200).json({message:'file upload process finished....'});
})


}


