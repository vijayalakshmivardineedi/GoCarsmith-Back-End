const express=require('express');
const { getAllRequests, deleteRequest, approveRequest } = require("../../controllers/admin/requestsNotify");
const { adminMiddleware, requireSignIn } = require("../../common-middleware");
const router = express.Router();
router.get('/admin/getAllRequests', requireSignIn, adminMiddleware, getAllRequests);
router.post('/admin/approveRequest', requireSignIn, adminMiddleware, approveRequest);
router.post('/admin/deleteRequest', requireSignIn, adminMiddleware, deleteRequest);
module.exports = router;