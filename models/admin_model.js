const mongoose=require('mongoose');

const admin_schema=new mongoose.Schema({
   name:{
      type:String,
      required:true
   },
   email:{
      type:String,
      required:true
   },
   password:{
      type:String,
      required:true
   },
   deviceID:{
      type:String,
      required:true
   }
})