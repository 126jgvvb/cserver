const Router  = require('express').Router();
const admin_controller=require('../controllers/dashboard_controller');
//console.log('------------>'+Object.keys(admin_controller))

Router.get('/authenticated',admin_controller.isAdmnin_authenticated);
Router.get('/load-page-data',admin_controller.load_page_data);
Router.get('/download',admin_controller.download_file);

Router.post('/admin-auth',admin_controller.admin_login);
Router.post('/upload-file',admin_controller.upload_file);
Router.post('/delete-file',admin_controller.delete_file);

module.exports=Router;