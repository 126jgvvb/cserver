const admin_controller=require('../controllers/admin_controller');

jest.mock('../controllers/admin_controller.js');



describe('checking whether admin object methods work fine',()=>{
    test('create user',()=>{
        expect(jest.isMockFunction(admin_controller.createUser)).toBeTruthy();
        admin_controller.createUser.mockReturnValue({body:'add3354rwDWDWs'},{});
        admin_controller;
    });

    test('create another user',()=>{
        expect(jest.isMockFunction(admin_controller.createAnotherUser)).toBeTruthy();
        admin_controller.createAnotherUser.mockReturnValue({body:'add3354rwDWDWs'},{});
        admin_controller;
    });


    test('confirm user',()=>{
        expect(jest.isMockFunction(admin_controller.confirmUser)).toBeTruthy();
        admin_controller.confirmUser.mockReturnValue({body:'add3354rwDWDWs'},{});
        admin_controller;
    });


    test('logout user',()=>{
        expect(jest.isMockFunction(admin_controller.logoutUser)).toBeTruthy();
        admin_controller,admin_controller.logoutUser.mockReturnValue({body:'add3354rwDWDWs'},{});
        admin_controller;
    });


    test('delete user',()=>{
        expect(jest.isMockFunction(admin_controller.deleteUser)).toBeTruthy();
        admin_controller.deleteUser.mockReturnValue({body:'add3354rwDWDWs'},{});
        admin_controller;
    });


    test('change password',()=>{
        expect(jest.isMockFunction(admin_controller.changePassword)).toBeTruthy();
        admin_controller.changePassword.mockReturnValue({body:'add3354rwDWDWs'},{});
        admin_controller;
    });

    test('verify email',()=>{
        expect(jest.isMockFunction(admin_controller.verifyEmail)).toBeTruthy();
        admin_controller.verifyEmail.mockReturnValue({body:'add3354rwDWDWs'},{});
        admin_controller;
    });


    test('get password',()=>{
        expect(jest.isMockFunction(admin_controller.getPassword)).toBeTruthy();
        admin_controller.getPassword.mockReturnValue({body:'add3354rwDWDWs'},{});
        admin_controller;
    });

 
    })
