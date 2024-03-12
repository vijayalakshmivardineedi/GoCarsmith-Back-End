const express=require('express');
const { addPriceList, priceLocation, priceByLocationByBrand, getPriceListByLocationBrandLabel } = require('../../controllers/user/priceList');
const router=express.Router();

router.post('/addPriceList', addPriceList)
router.get('/getPriceList/:locationId', priceLocation)
router.get('/getPriceByLocationByBrand/:locationId/:BrandId',priceByLocationByBrand)
router.get('/getpricelist/:location/:BrandId/:LabelName', getPriceListByLocationBrandLabel);
module.exports=router;