const express=require('express');
const { sendInventoryRequest, getInventoryRequest, deleteRequestById, updateInventoryRequest, approveInventoryRequest, rejectInventoryRequest, editStatusOfInventoryRequestApproveOrRejected } = require('../../controllers/serviceCenter/inventoryRequest');
const { requireSignIn, serviceCenterMiddleware, adminMiddleware} = require('../../common-middleware');
const router=express.Router();

router.post('/serviceCenter/sendInventoryRequest', requireSignIn, serviceCenterMiddleware, sendInventoryRequest);
router.get('/serviceCenter/getInventoryRequest/:serviceCenterId',  requireSignIn, serviceCenterMiddleware, getInventoryRequest);
router.delete('/serviceCenter/deleteRequestById/:requestId', requireSignIn, serviceCenterMiddleware, deleteRequestById);
router.put('/serviceCenter/updateRequest/:requestId', requireSignIn, serviceCenterMiddleware, updateInventoryRequest);

//admin
router.get('/admin/getInventoryRequest/:serviceCenterId',  requireSignIn, adminMiddleware, getInventoryRequest);

module.exports=router;