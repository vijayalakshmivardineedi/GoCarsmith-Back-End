const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const shortid=require('shortid');
const { deleteModel,updateModel,getModel, addModel, getModelById, getFuelTypesByBrandAndModel, getModelByIdOrName } = require('../../controllers/admin/model');
const { requireSignIn, adminMiddleware, serviceCenterMiddleware, userMiddleware } = require('../../common-middleware');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname);
  }
});

const upload = multer({ storage });
router.post('/admin/addModel', upload.single('modelImage'), requireSignIn, adminMiddleware, addModel);
router.delete('/admin/deleteModel/:id', requireSignIn, adminMiddleware, deleteModel);
router.put('/admin/updateModel/:id', upload.single('modelImage'), requireSignIn, adminMiddleware, updateModel,);
router.get('/admin/getModel/:BrandId', requireSignIn, adminMiddleware, getModel);
router.get('/admin/getCarModel/:id', requireSignIn, adminMiddleware, getModelById);
router.get('/admin/getFuelTypesByBrandAndModel/:brandId/:modelId',  requireSignIn, adminMiddleware, getFuelTypesByBrandAndModel);


//router.get('/serviceCenter/CarmodelBy/:id', requireSignIn, serviceCenterMiddleware, getModelByIdOrName)
router.get('/serviceCenter/getCarModel/:id', requireSignIn, serviceCenterMiddleware, getModelById);
router.get('/serviceCenter/CarmodelNameBy/:id', requireSignIn, serviceCenterMiddleware, getModelByIdOrName)
router.get('/serviceCenter/getModel/:BrandId', requireSignIn, serviceCenterMiddleware, getModel);
router.get('/serviceCenter/getFuelTypesByBrandAndModel/:brandId/:modelId',  requireSignIn, serviceCenterMiddleware, getFuelTypesByBrandAndModel);


// user
router.get('/user/getModel/:BrandId', getModel);
router.get('/user/getFuelTypesByBrandAndModel/:brandId/:modelId', getFuelTypesByBrandAndModel);

module.exports = router;

 


