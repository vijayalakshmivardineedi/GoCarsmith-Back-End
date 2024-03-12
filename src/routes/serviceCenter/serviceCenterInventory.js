const express = require('express');
const { addInventoryItem, getInventoryItemsByCategory, getAllInventoryItems, deleteInventoryItem, updateInventoryItem, getInventoryByServiceCenter, getInventoryCount } = require('../../controllers/serviceCenter/serviceCenterInventory');
const { serviceCenterMiddleware, requireSignIn, adminMiddleware } = require('../../common-middleware');

const router=express.Router();

  

router.post('/ServiceCenter/addInventoryItem',requireSignIn,serviceCenterMiddleware, addInventoryItem)
router.put('/ServiceCenter/updateInventory/:itemId',requireSignIn,serviceCenterMiddleware, updateInventoryItem);
router.delete('/ServiceCenter/Itemsdelete/:itemId',requireSignIn,serviceCenterMiddleware,deleteInventoryItem);
router.get('/ServiceCenter/ AllInventoryItems/get',requireSignIn,serviceCenterMiddleware, getAllInventoryItems);
router.get('/ServiceCenter/inventoryItems/:categoryId',requireSignIn,serviceCenterMiddleware, getInventoryItemsByCategory);
router.get('/ServiceCenter/get/getInventoryCount',requireSignIn,serviceCenterMiddleware, getInventoryCount)
router.get('/ServiceCenter/inventoryByServiceCenter/:ServiceCenterId',requireSignIn,serviceCenterMiddleware, getInventoryByServiceCenter);

//admin
router.get('/admin/inventoryByServiceCenter/:ServiceCenterId', requireSignIn, adminMiddleware, getInventoryByServiceCenter);
module.exports = router;