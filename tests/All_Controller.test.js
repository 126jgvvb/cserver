const encryption_service=require('../utils/encryption_service');
const admin_authenticator=require('../server_methods/admin_authenticator');
const authenticated=require('../server_methods/authenticated');
const delete_file=require('../server_methods/deleteFile');
const download_file=require('../server_methods/downloadFile');
const fileCreator=require('../server_methods/fileCreator');
const deviceID=require('../server_methods/getDeviceID');
const getInitialObj=require('../server_methods/getInitialObj');
const helper_functions=require('../server_methods/helperFunctions');
const jsonReader=require('../server_methods/jsonReader');
const saveAdminState=require('../server_methods/saveAdminState');
const uploadProcessor=require('../server_methods/uploadProcessor');
const jsonWriter=require('../server_methods/jsonWriter');

const mailer=require('nodemailer');
const fs=require('fs');

jest.mock('fs');
jest.mock('nodemailer');
jest.mock('../server_methods/admin_authenticator.js');
jest.mock('../server_methods/authenticated.js');
jest.mock('../server_methods/deleteFile.js');
jest.mock('../server_methods/downloadFile.js');
jest.mock('../server_methods/fileCreator.js');
jest.mock('../server_methods/getDeviceID.js');
jest.mock('../server_methods/getInitialObj.js');
jest.mock('../server_methods/helperFunctions.js');
jest.mock('../server_methods/jsonReader.js');
jest.mock('../server_methods/saveAdminState.js');
jest.mock('../server_methods/uploadProcessor.js');
jest.mock('../server_methods/jsonWriter.js');


describe('critical methods',()=>{

    test('checking jsonWriter method',()=>{
        expect(jest.isMockFunction(jsonWriter)).toBeTruthy;
        jsonWriter.mockReturnValue({})
    })


    test('checking uploadedProcessor method',()=>{
        expect(jest.isMockFunction(uploadProcessor)).toBeTruthy;
        uploadProcessor.mockReturnValue({})
    })

    test('checking saveAdminState method',()=>{
        expect(jest.isMockFunction(saveAdminState)).toBeTruthy;
        saveAdminState.mockReturnValue({})
    })

    test('checking jsonReader.load-state-object method',()=>{
        expect(jest.isMockFunction(jsonReader.load_state_object)).toBeTruthy;
        jsonReader.load_state_object.mockReturnValue()
    })



    test('checking jsonReader.delete-uploaded-file method',()=>{
        expect(jest.isMockFunction(jsonReader.delete_admin_uploaded_file)).toBeTruthy;
        jsonReader.delete_admin_uploaded_file.mockReturnValue('uploaded-file')
    })

    
    test('checking jsonReader.delete_admin method',()=>{
        expect(jest.isMockFunction(jsonReader.delete_admin)).toBeTruthy;
        jsonReader.delete_admin.mockReturnValue('1234');
    })

    
    test('checking jsonReader.saveAdmniDetails method',()=>{
        expect(jest.isMockFunction(jsonReader.save_admin_details)).toBeTruthy;
        jsonReader.save_admin_details.mockReturnValue({})
    })


    test('checking jsonReader.create_another_admin method',()=>{
        expect(jest.isMockFunction(jsonReader.create_another_admin)).toBeTruthy;
        jsonReader.create_another_admin.mockReturnValue({name:'abc'})
    })

    test('checking helperFunctions method',async ()=>{
        expect(jest.isMockFunction(helper_functions.saveAgents)).toBeTruthy;
   //   await  helper_functions.saveAgents.mockReturnValu({})
    })


    test('checking getInitialObj method',()=>{
        expect(jest.isMockFunction(getInitialObj)).toBeTruthy;
        getInitialObj.mockReturnValue({body:'anyValue'},{})
    })

    test('checking getDevice method',()=>{
        expect(jest.isMockFunction(deviceID.confirmID)).toBeTruthy;
        deviceID.confirmID.mockReturnValue({body:'anyValue'},{})
    })


    test('checking fileCreator method',()=>{
        expect(jest.isMockFunction(fileCreator)).toBeTruthy;
        fileCreator.mockReturnValue({body:'anyValue'},{})
    })

    test('checking admin download method',async ()=>{
        expect(jest.isMockFunction(download_file)).toBeTruthy;
       await download_file.mockReturnValue({body:'anyValue'},{})
    })


    test('checking deleteFile method',()=>{
        expect(jest.isMockFunction(delete_file)).toBeTruthy;
        delete_file.mockReturnValue({body:'anyValue'},{})
    })


    test('checking admin authenticated method',()=>{
        expect(jest.isMockFunction(authenticated)).toBeTruthy;
        authenticated.mockReturnValue({body:'anyValue'},{})
    })

test('checking admin authenticator method',()=>{
    expect(jest.isMockFunction(admin_authenticator)).toBeTruthy;
    admin_authenticator.mockReturnValue({body:'anyValue'},{})
})


    test('checking whether readFileSync works fine',()=>{
        expect(jest.isMockFunction(fs.readFileSync)).toBeTruthy();
        fs.readFileSync.mockReturnValue('certusMealServer/securityKey/private_key2.pem');
        encryption_service;
    });



    test('checking the mailing functionality',()=>{
        expect(jest.isMockFunction(mailer.createTransport)).toBeTruthy;
        mailer.createTransport.mockReturnValue({
            service:'gmail',
            auth:{
                user:process.env.USER_EMAIL,
                pass:process.env.USER_PASSWORD
            }
        })
        mailer;
        })





})




