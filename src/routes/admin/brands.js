const express = require('express');
const { addBrands, deleteBrand, putBrand, getBrands, brandLocation } = require('../../controllers/admin/brands');
const router = express.Router();
const { requireSignIn, adminMiddleware, serviceCenterMiddleware, userMiddleware } = require('../../common-middleware');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads')); // Adjust the destination path as needed
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/admin/addBrands', upload.single('brandImage'), requireSignIn, adminMiddleware, addBrands);
router.get('/admin/getBrands', requireSignIn, adminMiddleware, getBrands);

router.get('/user/getBrands',  getBrands);

router.delete('/admin/brands/:id', requireSignIn, adminMiddleware, deleteBrand);
router.put('/admin/brands/:id', upload.single('brandImage'),  requireSignIn, adminMiddleware, putBrand);
router.get('/admin/brands/location/:locationId', requireSignIn, adminMiddleware, brandLocation)


//
router.get('/serviceCenter/getBrands', requireSignIn, serviceCenterMiddleware, getBrands);
module.exports = router;
