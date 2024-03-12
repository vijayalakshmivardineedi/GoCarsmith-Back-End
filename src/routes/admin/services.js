const express=require('express');
 const { addServices,getAllServicesData,
        getServicesForAdmin,
        getServicesByLocationsAndModelIdAndFuelType,
        getIndividualServiceDetailsById,
        getSingleServiceDetailsFromIndividualService,
        AddNewServiceinAlreadyExistedService,
        getServiceByModelId,
        getServicesByLocationModelFuelTypeAndField,
        updateCarServiceByUsingModelIdAndLocationsAndFuelType} = require('../../controllers/admin/services');
const { requireSignIn, adminMiddleware, userMiddleware } = require('../../common-middleware');
const router=express.Router();

router.post("/admin/addService",addServices)
router.post("/admin/addNewServiceInAlreadyExistedServiceBy/:modelId/:fuelType/:serviceId", requireSignIn, adminMiddleware, AddNewServiceinAlreadyExistedService);
router.get("/admin/getServiceForAdmin", requireSignIn, adminMiddleware, getServicesForAdmin);
router.get('/admin/getServicesByModelIdAndFuelType/:locations/:modelId/:fuelType', requireSignIn, adminMiddleware, getServicesByLocationsAndModelIdAndFuelType);
router.get("/admin/getAllServicesData", requireSignIn, adminMiddleware, getAllServicesData);
router.get("/admin/getServiceByModelId/:modelId", requireSignIn, adminMiddleware, getServiceByModelId);
router.get("/admin/getService/:_id/:serviceId", requireSignIn, adminMiddleware, getIndividualServiceDetailsById);
router.get('/admin/getSingleDetailBy/:_id/:serviceId/:singleId', requireSignIn, adminMiddleware, getSingleServiceDetailsFromIndividualService);
router.get('/admin/getServicesByLocationModelFuelTypeAndField/:location/:modelId/:fuelType/:field', requireSignIn, adminMiddleware, getServicesByLocationModelFuelTypeAndField);
router.put('/admin/updateCarServiceByUsingModelIdAndLocationsAndFuelType/:locations/:modelId/:fuelType', requireSignIn, adminMiddleware, updateCarServiceByUsingModelIdAndLocationsAndFuelType);


//user 
 
router.get('/user/getServicesByLocationModelFuelTypeAndField/:location/:modelId/:fuelType/:field', getServicesByLocationModelFuelTypeAndField);

module.exports=router;