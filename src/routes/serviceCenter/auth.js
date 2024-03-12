const express=require('express');
const {signup, signout, signin, getTotalServiceCentersWithDetails, forgotPassword, verifyCodeAndResetPassword, checkEmailVerified, getServiceCenterProfileDetailsByUsingServiceCenterId, updateTheserviceCenterProfile }=require("../../controllers/serviceCenter/auth");
const { validateSignUpRequest,validateSignInRequest, isRequestValidated } = require('../../validator/auth');
const { requireSignIn, adminMiddleware, serviceCenterMiddleware } = require('../../common-middleware');
const router=express.Router();


router.post('/serviceCenter/signup',validateSignUpRequest, isRequestValidated , signup);
router.post('/serviceCenter/signin', validateSignInRequest, isRequestValidated , signin );
router.post('/serviceCenter/signout', requireSignIn,  signout);
router.post('/serviceCenter/getTotalServiceCentersWithDetails', requireSignIn, adminMiddleware, getTotalServiceCentersWithDetails);
router.post('/serviceCenter/forgotPassword', forgotPassword);
router.post('/serviceCenter/verifyCodeAndResetPassword',  verifyCodeAndResetPassword);
router.post('/serviceCenter/checkEmailVerified', checkEmailVerified);
router.get("/serviceCenter/getServiceCenterDetailsBy/:serviceCenterId", requireSignIn, serviceCenterMiddleware, getServiceCenterProfileDetailsByUsingServiceCenterId);
router.put('/serviceCenter/updateProfileDetailsBy/:serviceCenterId', requireSignIn, serviceCenterMiddleware, updateTheserviceCenterProfile)
module.exports=router;