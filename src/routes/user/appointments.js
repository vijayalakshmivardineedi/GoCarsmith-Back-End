
const express=require('express');
// const { requireSignIn, adminMiddleware, userMiddleware } = require('../../common-middleware');
const { AddAppointment, getAppointmentsByUserIdAndStatus ,getAppointmentsByDate, 
    getUserDetailsByAppointments,getAppointmentByServiceCenterId,
    getUserServicesFromAppointment,AddAppointmentInServiceCenter,
    updateServiceCenterApponitmentStatus,deleteServiceCenterAppointment, getUserDetailsByAppointmentByServiceCenterId, getServiceCenterAppointmnetsByServiceId} = require('../../controllers/user/appointments');
const router=express.Router();
// router.post('/user/AddAppointment',requireSignIn, userMiddleware, AddAppointment);

router.post('/user/AddAppointment', AddAppointment);

router.get('/getAppointmentBookingById/:userId',getAppointmentsByUserIdAndStatus)

//service center


router.get('/ServiceCenter/appointments/:serviceCenterId', getServiceCenterAppointmnetsByServiceId)


router.get ('/getUserDetailsByAppointmentByServiceCenterId/:ServiceCenterId',getUserDetailsByAppointmentByServiceCenterId)

router.put('/ServiceCenter/completedAppointment/:_id',updateServiceCenterApponitmentStatus);

router.delete('/ServiceCenter/deleteAppointmnetBy/:appointmentId',deleteServiceCenterAppointment)
// Customers in Service Centers
router.post('/ServiceCenter/getUsersByIds',getUserDetailsByAppointments)
router.get("/ServiceCenter/ListOfSevicesBy/:userId", getUserServicesFromAppointment)
module.exports=router;

router.get('/getAppointmentByServiceCenterId/:ServiceCenterId', getAppointmentByServiceCenterId)