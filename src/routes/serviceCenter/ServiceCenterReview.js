const express=require('express');
const { requireSignIn, adminMiddleware, serviceCenterMiddleware } = require('../../common-middleware');
const { addReview, getReviewsByServiceId, getAllreviews } = require('../../controllers/serviceCenter/ServiceCenterReviews');
const router = express.Router();


router.post('/ServiceCenterReviews', addReview);

router.get('/ServiceCenterReviews/:serviceCenterId', requireSignIn, adminMiddleware, getReviewsByServiceId);
router.get('/ServiceCenter/ServiceCenterReviews/:serviceCenterId', requireSignIn, serviceCenterMiddleware, getReviewsByServiceId);
router.get('/ServiceCenter/getAllServiceCenterReviews', requireSignIn, serviceCenterMiddleware, getAllreviews);

router.get('/admin/ServiceCenterReviews/:serviceCenterId', requireSignIn, adminMiddleware, getReviewsByServiceId);
module.exports = router;