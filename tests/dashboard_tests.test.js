const dashboard_controller=require('../controllers/dashboard_controller');

jest.mock('../controllers/dashboard_controller.js');

describe('testing dashboard methods',()=>{

    test('checking admin login',()=>{
        expect(jest.isMockFunction(dashboard_controller.admin_login)).toBeTruthy;
        dashboard_controller.admin_login.mockReturnValue({body:'sample'},{body:''});
        dashboard_controller;
   })


    test('isAdmin authenticated',()=>{
        expect(jest.isMockFunction(dashboard_controller.isAdmnin_authenticated)).toBeTruthy;
        dashboard_controller.isAdmnin_authenticated.mockReturnValue({body:'sample'},{body:''});
        dashboard_controller;  
    })


    test('upload file',()=>{
        expect(jest.isMockFunction(dashboard_controller.upload_file)).toBeTruthy;
        dashboard_controller.upload_file.mockReturnValue({body:'sample'},{body:''});
        dashboard_controller;  
    })


    test('load page data',()=>{
        expect(jest.isMockFunction(dashboard_controller.load_page_data)).toBeTruthy;
        dashboard_controller.load_page_data.mockReturnValue({body:'sample'},{body:''});
        dashboard_controller;  
    })


    test('delete file',()=>{
        expect(jest.isMockFunction(dashboard_controller.delete_file)).toBeTruthy;
        dashboard_controller.delete_file.mockReturnValue({body:'sample'},{body:''});
        dashboard_controller;  
    })


    test('download file',()=>{
        expect(jest.isMockFunction(dashboard_controller.download_file)).toBeTruthy;
        dashboard_controller.download_file.mockReturnValue({body:'sample'},{body:''});
        dashboard_controller;  
    })


})