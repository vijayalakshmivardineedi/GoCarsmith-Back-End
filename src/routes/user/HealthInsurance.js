
const express=require('express');

const { createHealthInsuranceForCustomer, getHealthCardDetailsByUsingUserId } = require('../../controllers/user/HealthInsurance');

const router=express.Router();

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




router.post('/createHealthCard', upload.single('CoverPhoto'), createHealthInsuranceForCustomer)

router.get('/getHealthCardDetails/:userId',getHealthCardDetailsByUsingUserId)
module.exports=router;
