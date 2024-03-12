const express=require('express');

const {getEmailNotifications, getAllEmails, getAttachmentsById, commonEmailSend}=require("../../controllers/admin/email");
const {sendSingleUserNotifications, sendSingleEmployeeNotifications, sendSingleServiceCenterNotifications}=require("../../controllers/admin/email");
const {sendAllUsersNotifications, sendAllEmployeeNotifications, sendAllServiceCentersNotifications}=require("../../controllers/admin/email");

const { requireSignIn, adminMiddleware,} = require('../../common-middleware');



const router=express.Router();

router.post('/admin/commonEmailSend', requireSignIn, adminMiddleware, commonEmailSend);

router.get('/admin/getEmailNotifications', requireSignIn, adminMiddleware, getEmailNotifications);
router.get('/admin/getAllEmails', requireSignIn, adminMiddleware, getAllEmails);
router.get('/admin/attachments/:fileName', getAttachmentsById);



router.post('/admin/sendSingleUserNotifications', requireSignIn, adminMiddleware, sendSingleUserNotifications);
router.post('/admin/sendSingleEmployeeNotifications', requireSignIn, adminMiddleware, sendSingleEmployeeNotifications);
router.post('/admin/sendSingleServiceCenterNotifications', requireSignIn, adminMiddleware, sendSingleServiceCenterNotifications);


router.post('/admin/sendAllUsersNotifications', requireSignIn, adminMiddleware, sendAllUsersNotifications);
router.post('/admin/sendAllEmployeeNotifications', requireSignIn, adminMiddleware, sendAllEmployeeNotifications);
router.post('/admin/sendAllServiceCentersNotifications', requireSignIn, adminMiddleware, sendAllServiceCentersNotifications);



module.exports=router;
