const express=require('express');
const {getAllRequestsFromDataBase, editStatusOfInventoryRequestApproveOrRejected, getRequestsByStatus, deleteRequestById } = require('../../controllers/serviceCenter/inventoryRequest');
const { requireSignIn, adminMiddleware} = require('../../common-middleware');
const router=express.Router();

router.get ('/admin/getAllOrders', requireSignIn, adminMiddleware, getAllRequestsFromDataBase);
router.patch('/admin/editStatusAfterAcceptedOrRejected/:requestId', requireSignIn, adminMiddleware, editStatusOfInventoryRequestApproveOrRejected )
router.get ('/admin/getRequestsByStatus/:status', requireSignIn, adminMiddleware, getRequestsByStatus);
router.delete('/admin/deleteRequestById/:requestId', requireSignIn, adminMiddleware, deleteRequestById);


module.exports=router;