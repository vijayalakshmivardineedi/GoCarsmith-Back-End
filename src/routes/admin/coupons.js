const express=require('express');
const { createCoupon, getCoupons, deleteCoupon, updateCoupon, applyCoupon} = require('../../controllers/admin/coupons');
const { requireSignIn, adminMiddleware } = require('../../common-middleware');
const router = express.Router();

router.post('/admin/create', requireSignIn, adminMiddleware, createCoupon);
router.get('/admin/getCoupons', requireSignIn, adminMiddleware, getCoupons);
router.delete('/admin/coupons/:id', requireSignIn, adminMiddleware, deleteCoupon);
router.put('/admin/updateCoupon/:id', requireSignIn, adminMiddleware, updateCoupon);


router.get('/user/getCoupons',  getCoupons);
router.post("/user/applayCoupon",applyCoupon)
module.exports = router;