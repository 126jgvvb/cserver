const { json } = require('express');
let saveDataToJSON=require('./jsonWriter');
const fs=require('fs');
const fileCreator=require('./fileCreator');

class stateObject{
    constructor(){
        this.id='default';
       this.layoutObj={
            adminDetails:[],
            dynamicDiv:{adminUploads:[],files:[]},
            logChildren:[],
            behavior:[]
    },
    this.authorizedAdmins=[],
    this.unVerifiedAdmins=[]
    }

    add_new_admin(newAdmin){
        this.authorizedAdmins.push({id:newAdmin});
        saveDataToJSON({fileName:'authorizedAdmins',obj:this.authorizedAdmins})
    }

    get_stored_admins(){
        return this.authorizedAdmins;
    }

    delete_admin(ID){
     this.authorizedAdmins=this.authorizedAdmins.filter(admin=>admin.id!=ID);   
    saveDataToJSON({fileName:'authorizedAdmins',obj:this.authorizedAdmins})
    }

    load_stored_admins_into_memory(){
        console.log(`Reading file: authorizedAdmins.json`);
        fs.readFile(`certusMealServer/files/authorizedAdmins.json`,(err,data)=>{
            if(err){
                console.error(`Error reading from file:authorizedAdmins.json`,err);
                fileCreator('certusMealServer/files/authorizedAdmins.json');
                return false;
            }
            else{
                if(data!=undefined){
                    this.authorizedAdmins=JSON.parse(data).obj; //forming an array
                    console.log('Admins Object successfully loaded in memory');
                    return true;
                }
                else{
                    console.log('Error: object is undefined')
                    return false;
                }
        }})
    }

    delete_client_uploaded_file(fileName){
        if(this.layoutObj.dynamicDiv.files.length>0){
            let filesArray=this.layoutObj.dynamicDiv.files.filter(i=>i.name!=fileName);
            this.layoutObj.dynamicDiv.files=filesArray;
            saveDataToJSON({fileName:`initialState-${this.id}`,obj:this.layoutObj});
    }
    }

    delete_admin_uploaded_file(fileName){
        if(this.layoutObj.dynamicDiv.adminUploads.length>0){
            let filesArray=this.layoutObj.dynamicDiv.adminUploads.filter(i=>i.name!=fileName);
            this.layoutObj.dynamicDiv.adminUploads=filesArray;
            saveDataToJSON({fileName:`initialState-${this.id}`,obj:this.layoutObj});
    }
    }

    create_another_admin(obj){
        let layoutObj={
            adminDetails:[],
            dynamicDiv:{adminUploads:[],files:[]},
            logChildren:[],
            behavior:[]
    }

layoutObj.adminDetails.push(obj);
saveDataToJSON({fileName:`initialState-${obj.deviceID}`,obj:layoutObj})

    }

    save_admin_details(obj){
        this.layoutObj.adminDetails.push({obj});
        saveDataToJSON({fileName:`initialState-${this.id}`,obj:this.layoutObj});
        return true;
    }

    get_current_writeFile_path(){
        let obj=this.layoutObj.dynamicDiv.adminUploads.filter(obj=>obj.status==true)
        return obj.fileName;
    }

    save_uploaded_file(obj){
    if(this.layoutObj.dynamicDiv.adminUploads.length!=0)    this.layoutObj.dynamicDiv.adminUploads.map(obj=>obj.status=false); //changing the default write/update file
        this.layoutObj.dynamicDiv.adminUploads.push(obj);
        saveDataToJSON({fileName:`initialState-${this.id}`,obj:this.layoutObj})
        return true;
    }

    load_state_object(){
    console.log(`Reading file: initialState-${this.id}.json`);
    fs.readFile(`certusMealServer/json/initialState-${this.id}.json`,(err,data)=>{
        if(err){
            console.error(`Error reading from file:initialState.json`,err);
            fileCreator(`certusMealServer/json/initialState-${this.id}.json`);
            return false;
        }
        else{
            console.log('Object successfully loaded in memory');
            if(data!=undefined){
                data=JSON.parse(data);
                this.layoutObj.adminDetails=data.obj.adminDetails;
                this.layoutObj.dynamicDiv.files=data.obj.dynamicDiv.files;
                this.layoutObj.dynamicDiv.adminUploads=data.obj.dynamicDiv.adminUploads;
                this.layoutObj.behavior=data.obj.behavior;
                this.layoutObj.logChildren=data.obj.logChildren;
                return true;
            }
            else{
                console.log('Error: object is undefined')
                return false;
            }
    }})
}

    /**
     * @param {(arg0: any) => void} id
     */
     set_admin_id(id){
    this.id=id;
    return true;
}

    /**
     * @param {(arg0: any) => void} message
     */
 set_behavior_message(message){
    this.layoutObj.behavior.push({
        lastUpdated:(new Date).getDate()+"-"+(new Date).getMonth()+"-"+(new Date).getFullYear(),
        message:message
    });

    saveDataToJSON({fileName:`initialState-${this.id}`,obj:this.layoutObj});
}

    /**
     * @param {(arg0: any) => void} message
     */
 set_logger_message(message){
    this.layoutObj.logChildren.push({message:message});
    saveDataToJSON({fileName:`initialState-${this.id}`,obj:this.layoutObj});
}


 get_stateObject(){
    return this.layoutObj;
}

 get_admin_id(){
    return this.id;
}

}



module.exports=(new stateObject());







