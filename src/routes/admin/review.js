//this is not updated

const express=require('express');
const { requireSignIn, userMiddleware, adminMiddleware } = require('../../common-middleware');
const { addReview, getReviewsByServiceId, getAllreviews } = require('../../controllers/admin/review');
const router = express.Router();

router.post('/reviews', requireSignIn, userMiddleware, addReview);
router.get('/reviews/:serviceId', getReviewsByServiceId);
router.get('/getAllreviews', getAllreviews);


//admin
router.get('/admin/reviews/:serviceId', requireSignIn, adminMiddleware, getReviewsByServiceId);
router.get('/admin/getAllreviews', requireSignIn, adminMiddleware, getAllreviews);

module.exports = router;