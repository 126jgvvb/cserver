const Router  = require('express').Router();
const adminObject=require('../controllers/admin_controller');

Router.get("/logout",adminObject.logoutUser);

Router.get("/verification-code",adminObject.verifyEmail);

Router.post("/login",adminObject.confirmUser);

Router.post("/create-another-user",adminObject.createAnotherUser);

Router.post("/signup",adminObject.createUser);

Router.post("/delete-account",adminObject.deleteUser);

Router.post("/change-password",adminObject.changePassword);

Router.post("/forgot-password",adminObject.getPassword);


module.exports=Router;
