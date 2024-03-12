const express = require('express');
const { createOffer, getOffers, applyOfferByServiceId, applyOfferByCode } = require('../../controllers/user/offer');
const router = express.Router();
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

router.post('/user/CreateOffer',upload.single('image'), createOffer);
router.get('/user/getoffers', getOffers)
router.post('/user/applyofferByServiceId', applyOfferByServiceId)
router.post('/user/applyofferByCode', applyOfferByCode);

module.exports = router;