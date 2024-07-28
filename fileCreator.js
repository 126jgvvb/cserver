const fs=require('fs');


module.exports=(fileNameAndPAth)=>{
    console.log(`creating file: ${fileNameAndPAth}`);

fs.open(fileNameAndPAth,"w",(error)=>{
    if(error){
        console.log(`failed to create file:${fileNameAndPAth}`);
    }
    else{
        console.log('file created  successfully...');
    }
})

}