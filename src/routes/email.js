const express=require('express');
const { verifyEmail, sendVerificationEmail, forgotPassword, verifyCodeAndResetPassword, getEmailNotifications, sendEmailNotificationsToAllUsers, sendEmailNotificationsToAllEmployee, sendEmailNotificationsToAllServiceCenters, sendNotifications} = require("../controllers/email");
const { validateSignUpRequest, isRequestValidated, validateSignInRequest} = require('../validator/auth');
const router=express.Router();
//const { requireSignIn, userMiddleware, adminMiddleware} = require('../common-middleware');

//router.post('/user/signupp', validateSignUpRequest , isRequestValidated, signupp);

router.get('/verifyEmail', verifyEmail);

router.post('/sendVerificationEmail', sendVerificationEmail);
router.post('/forgotPassword', forgotPassword);
router.get('/getEmailNotifications', getEmailNotifications);
router.post('/forgotPassword', verifyCodeAndResetPassword);
router.post('/sendEmailNotificationsToAllUsers', sendEmailNotificationsToAllUsers);
router.post('/sendEmailNotificationsToAllEmployee', sendEmailNotificationsToAllEmployee);
router.post('/sendEmailNotificationsToAllServiceCenters', sendEmailNotificationsToAllServiceCenters);
router.post('/sendNotifications', sendNotifications);



module.exports=router;