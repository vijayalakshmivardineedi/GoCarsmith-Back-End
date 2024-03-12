const express = require('express');
const router = express.Router();
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const { addKeySpecs, getKeySpecs, getKeySpecsByModel, keySpecsBymodel } = require('../../controllers/user/keySpec');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads')); // Adjust the destination path as needed
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/user/addKeySpecs', upload.single('Image'), addKeySpecs)
router.get('/user/getKeySpecs/:BrandId', getKeySpecs)
router.get('/user/getKeySpecsModel/:modelId', getKeySpecsByModel)
router.get('/user/keySpecsByModel/:modelId',keySpecsBymodel)
module.exports = router;
