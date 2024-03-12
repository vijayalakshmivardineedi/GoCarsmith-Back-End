const express=require('express');
const {signup, signin, signout, getTotalEmployeeWithDetails, forgotPassword, verifyCodeAndResetPassword, updateEmployee, deleteEmployee, getEmployeesByServiceCenter}=require("../../../controllers/serviceCenter/employee/auth");
const { validateSignUpRequest, isRequestValidated, validateSignInRequest} = require('../../../validator/auth');
const router=express.Router();
const { requireSignIn, adminMiddleware, serviceCenterMiddleware } = require('../../../common-middleware');
router.post('/ServiceCenter/employee/signup', validateSignUpRequest , isRequestValidated, requireSignIn, serviceCenterMiddleware, signup);
router.post('/ServiceCenter/getTotalEmployeeWithDetails', requireSignIn, adminMiddleware, getTotalEmployeeWithDetails);
router.get('/ServiceCenter/getTotalEmployee', requireSignIn, serviceCenterMiddleware, getTotalEmployeeWithDetails);
router.post('/ServiceCenter/verifyCodeAndResetPassword',  verifyCodeAndResetPassword);
router.get('/ServiceCenter/getEmployees/:serviceCenterId', requireSignIn, serviceCenterMiddleware, getEmployeesByServiceCenter);
router.put('/ServiceCenter/update/:employeeId', requireSignIn, serviceCenterMiddleware, updateEmployee);
router.delete('/ServiceCenter/deleteEmployee/:employeeId', requireSignIn, serviceCenterMiddleware, deleteEmployee);


//admin
router.put('/admin/employee/update/:employeeId', requireSignIn, adminMiddleware, updateEmployee);
router.get('/admin/getEmployees/:serviceCenterId', requireSignIn, adminMiddleware, getEmployeesByServiceCenter);
router.delete('/admin/deleteEmployee/:employeeId', requireSignIn, adminMiddleware, deleteEmployee);


module.exports=router;