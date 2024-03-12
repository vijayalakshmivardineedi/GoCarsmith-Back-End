// notificationRoutes.js
const express = require('express');
const router = express.Router();
const { sendNotificationToAll, getNotificationsByReceivers, getUnreadNotificationsCount, markNotificationsAsViewed } = require('../../controllers/admin/notificationsSendService');
const { requireSignIn, adminMiddleware, serviceCenterMiddleware } = require('../../common-middleware');


// Define your notification routes
router.post('/admin/sendNotificationToAll',  requireSignIn, adminMiddleware, sendNotificationToAll);
router.get('/ServiceCenter/getNotificationsByReceivers/:serviceCenterId',  requireSignIn, serviceCenterMiddleware, getNotificationsByReceivers);
router.put('/ServiceCenter/markNotificationsAsViewed',  requireSignIn, serviceCenterMiddleware, markNotificationsAsViewed);
router.get('/ServiceCenter/getUnreadNotificationsCount/:serviceCenterId',  requireSignIn, serviceCenterMiddleware, getUnreadNotificationsCount);
module.exports = router;
