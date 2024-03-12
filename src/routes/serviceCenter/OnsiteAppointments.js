const express = require('express');
const { requireSignIn, adminMiddleware, serviceCenterMiddleware,userMiddleware } = require('../../common-middleware');
const {
    getAppointmentByServiceCenterId, getAppointmentsByDate,
    updateServiceCenterApponitmentStatus, deleteServiceCenterAppointment,
    AddAppointmentInServiceCenter,
    getUserDetailsByAppointments, getUserServicesFromAppointment,
    getTotalAppointmentByServiceCenterId,
    getOnsiteAppointmentsByDate, 
    updateServiceCenterOnsiteApponitmentStatus,
    deleteServiceCenterOnsiteAppointment,
    getTotalOnsiteAppointmentByServiceCenterId,
    getAllAppointmentDetailsByServiceCenterId,
    getAllAppointmentDatesByServiceCenterId,
    getTotalOnsiteAppointments,
    TotalOnsiteAppointment,
    TotalAppointments,
    getServiceCenterAppointmnetsByServiceId,
    getOnsiteAppointmentsById} = require('../../controllers/serviceCenter/OnsiteAppointments');
const router = express.Router();



router.post('/user/AddAppointment',
     requireSignIn, userMiddleware, 
    AddAppointmentInServiceCenter);
    router.post('/ServiceCenter/AddAppointment',
   requireSignIn, serviceCenterMiddleware, 
    AddAppointmentInServiceCenter);


router.get('/ServiceCenter/appointments/:serviceCenterId/:date',requireSignIn, serviceCenterMiddleware, getAppointmentsByDate)

router.get('/ServiceCenter/getAppointmentByServiceCenterId/:ServiceCenterId',requireSignIn, serviceCenterMiddleware, getAppointmentByServiceCenterId)

router.put('/ServiceCenter/completedAppointment/:_id',requireSignIn, serviceCenterMiddleware, updateServiceCenterApponitmentStatus);

router.delete('/ServiceCenter/deleteAppointmnetBy/:appointmentId',requireSignIn, serviceCenterMiddleware, deleteServiceCenterAppointment)

router.post('/ServiceCenter/getUsersByIds',requireSignIn, serviceCenterMiddleware, getUserDetailsByAppointments)

router.get("/ServiceCenter/ListOfSevicesBy/:userId",requireSignIn, serviceCenterMiddleware, getUserServicesFromAppointment)
router.get('/ServiceCenter/appointments/:serviceCenterId',requireSignIn, serviceCenterMiddleware, getServiceCenterAppointmnetsByServiceId)

//dash board


router.get('/ServiceCenter/getTotalAppointmentsBy/:ServiceCenterId',requireSignIn, serviceCenterMiddleware, getTotalAppointmentByServiceCenterId)

//onsiteAppointms

router.put('/ServiceCenter/completedOnsiteAppointment/:_id',requireSignIn, serviceCenterMiddleware,updateServiceCenterOnsiteApponitmentStatus)
router.get("/serviceCenter/getOnsiteAppointMentBydate/:serviceCenterId/:date",requireSignIn, serviceCenterMiddleware, getOnsiteAppointmentsByDate)

router.delete("/ServiceCenter/deleteOnsitEAppointmnetBy/:appointmentId", requireSignIn, serviceCenterMiddleware,deleteServiceCenterOnsiteAppointment)
router.get('/ServiceCenter/getTotalOnsiteAppointmentsBy/:ServiceCenterId' , requireSignIn, serviceCenterMiddleware,getTotalOnsiteAppointmentByServiceCenterId)
router.get('/ServiceCenter/getAllAppointmentDatesByServiceCenterId/:ServiceCenterId', requireSignIn, serviceCenterMiddleware, getAllAppointmentDatesByServiceCenterId);


//admin
router.get('/admin/onsite/getOnsiteAppointmentsById/:appointmentId', requireSignIn, adminMiddleware, getOnsiteAppointmentsById)
router.get('/admin/getAllAppointments', requireSignIn, adminMiddleware, getTotalOnsiteAppointments);
router.get('/admin/TotalAllAppointments', requireSignIn, adminMiddleware, TotalOnsiteAppointment);
router.get('/admin/TotalAllAppointments/ALL', requireSignIn, adminMiddleware, TotalAppointments);

router.delete("/admin/deleteOnsitEAppointmnetBy/:appointmentId", requireSignIn, adminMiddleware,deleteServiceCenterOnsiteAppointment)

module.exports = router;