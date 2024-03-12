const express=require('express');
const {verifyOTP, generateAndSendOTP, signup, 
    forgotPassword, signout, signin, 
    verifyCodeAndResetPassword, updateProfile, 
    addCarsToUser,getServicesCenterByLocation,
    getCarsByEmail,
    deleteCar,
    editKilometers,
    getUserByEmail, 
    getUsersForAdminPanel, 
    deleteProfileImage}=require("../../controllers/user/auth");
const { validateSignUpRequest, isRequestValidated, validateSignInRequest} = require('../../validator/auth');
const router=express.Router();
const { requireSignIn, userMiddleware, adminMiddleware} = require('../../common-middleware');


router.post('/user/signup', validateSignUpRequest , isRequestValidated, signup);
router.post('/user/generateAndSendOTP', generateAndSendOTP);
router.post('/user/verifyOTP', verifyOTP);
router.post('/user/signout', requireSignIn, userMiddleware, signout);
router.post('/user/signin', validateSignInRequest, isRequestValidated , signin );
router.post('/user/forgotPassword', forgotPassword);
router.post('/user/verifyCodeAndResetPassword',  verifyCodeAndResetPassword);
router.post('/user/updateProfile', requireSignIn, userMiddleware,  updateProfile);
router.post('/user/addCarsToUser',requireSignIn, userMiddleware,  addCarsToUser);
router.get('/user/getCarsByEmail/:email', requireSignIn, userMiddleware, getCarsByEmail);
router.delete('/user/deleteCar/:email/:carId', requireSignIn, userMiddleware, deleteCar);
router.get('/getServicesCenterByLocation/:_id',getServicesCenterByLocation);
router.put('/user/editKilometers/:email/:carId', requireSignIn, userMiddleware, editKilometers);
router.get('/user/getUserByEmail/:email', requireSignIn, userMiddleware, getUserByEmail);
//router.get('/getCustomers', requireSignIn, adminMiddleware, getUsersForAdminPanel);
router.delete('/user/deleteProfileImage', requireSignIn, userMiddleware, deleteProfileImage);

//admin

router.get('/admin/getCustomers', requireSignIn, adminMiddleware, getUsersForAdminPanel);
router.get('/admin/getUserByEmail/:email', requireSignIn, adminMiddleware, getUserByEmail);
module.exports=router;