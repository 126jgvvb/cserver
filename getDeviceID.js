const stateManager=require('./jsonReader');

module.exports=obj={
   IDArray:[],
    
    confirmID:(ID)=>{
        let found=false;
        this.IDArray=stateManager.get_stored_admins()
            
            console.log("Environment IDs>>>>>>>",this.IDArray);
            console.log('------searching: '+ID);
            this.IDArray.map(obj=>(obj.id==ID)? found=true:false)
        return found;
     },
     addID:(ID)=>{
        stateManager.add_new_admin(ID);
    },

deleteID:(ID)=>{
    stateManager.delete_admin(ID);
}

}

