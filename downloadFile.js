const http=require('http');
const fs=require('fs');
const Logger=require('./Logger');

module.exports=async (req,resp)=>{
    const path=(req.query).path;
    const file=fs.createReadStream(path,'utf8');

    const fileName=path.slice(path.lastIndexOf('/'));
    resp.setHeader('Content-Disposition',`attachment; filename=${fileName}`);
    resp.setHeader('Content-Type','application/octet-stream');
    file.pipe(resp);

    file.on('data',()=>{
        console.log('data has been retrieved successfully...');
        Logger('data has been retrieved successfully...');
    })
    .on('end',()=>{
        console.log('done reading data...');
        Logger('Done reading data...');
    })

    .on('error',(error)=>{
        console.log('Error while downloading the file...');
        Logger('Error while downloading the file...');
        resp.status(500).json({message:"The server failed to read file..."})
    })
}