const express = require('express');
const multer = require('multer')
const path = require('path');
const router=express.Router();
//const shortid = require('shortid');
const { requireSignIn, adminMiddleware } = require('../../common-middleware');
const { addInventory, updateInventory, deleteInventory, getInventory, getInventoryByCategoryID, getInventoryCount } = require('../../controllers/admin/inventory');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Rename files if needed
    },
  });
  
const upload = multer({ storage: storage });
  
router.post('/admin/addInventory', upload.single('image'), requireSignIn, adminMiddleware, addInventory);// Update an inventory item
router.put('/admin/update/:itemId', upload.single('image'), requireSignIn, adminMiddleware, updateInventory);// Delete an inventory item
router.delete('/admin/delete/:itemId', requireSignIn, adminMiddleware, deleteInventory);
router.get('/admin/getInventory', requireSignIn, adminMiddleware, getInventory);

router.get('/admin/inventory/:categoryId', requireSignIn, adminMiddleware, getInventoryByCategoryID);
router.get('/admin/getInventoryCount/get', requireSignIn, adminMiddleware, getInventoryCount);

module.exports = router;