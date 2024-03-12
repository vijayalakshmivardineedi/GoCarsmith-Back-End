const express=require('express');
const { requireSignIn, adminMiddleware } = require('../../common-middleware');
const { generateAndSendServiceCenterOTP, verifyOTP, getservicecenterbyemail } = require('../../controllers/serviceCenter/admincreation');
const router=express.Router();


router.post('/admin/serviceCenter/generateAndSendServiceCenterOTP',  requireSignIn, adminMiddleware , generateAndSendServiceCenterOTP);
router.post('/admin/serviceCenter/verifyOTP',  verifyOTP);
router.get('/admin/serviceCenter/getservicecenterbyemail/:email',  getservicecenterbyemail);

module.exports=router;
