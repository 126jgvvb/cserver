const getData=require('../server_methods/getInitialObj');
const deleteFile=require('../server_methods/deleteFile');
const downloadFile=require('../server_methods/downloadFile');
const admin_authentication=require('../server_methods/admin_authenticator');
const authenticated=require('../server_methods/authenticated');
const saveUploadedFile=require('../server_methods/uploadProcessor');

module.exports={
admin_login:(req,resp)=>{
   return admin_authentication(req,resp);
},

isAdmnin_authenticated:(req,resp)=>{
 return authenticated(req,resp);
},

upload_file:(req,resp)=>{
 return saveUploadedFile(req,resp);
},

load_page_data:(req,resp)=>{
return getData(req,resp);
},

delete_file:(req,resp)=>{
return deleteFile(req,resp);
},

download_file:(req,resp)=>{
return downloadFile(req,resp);
}
}