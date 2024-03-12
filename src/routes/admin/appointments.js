

const express=require('express');

const { getAppointmentBookingById, 
    getAppointmentBooking, 
    updateApponitmentStatus, 
    CancelAppointment,getOnsiteAppointmentsForAdmin,
    completedAppointment,
    updateAppointment,
    getServicesHistoryByStatus} = require('../../controllers/admin/appointments');
const { requireSignIn, adminMiddleware } = require('../../common-middleware');

const router=express.Router();


router.get('/admin/getAppointments', requireSignIn, adminMiddleware, getAppointmentBooking)
router.get('/getAppointments/:_id', requireSignIn, adminMiddleware, getAppointmentBookingById)
router.put('/approvedAppointment/:_id', requireSignIn, adminMiddleware, updateApponitmentStatus)
router.put('/completedAppointment/:_id', requireSignIn, adminMiddleware, completedAppointment);
router.put('/cancelAppointment/:_id', requireSignIn, adminMiddleware, CancelAppointment);
router.put('/updateDataForReschedule', requireSignIn, adminMiddleware, updateAppointment)
router.get ('/serviceHistory', requireSignIn, adminMiddleware, getServicesHistoryByStatus)
router.get('/admin/totalOnsiteAppointments', requireSignIn, adminMiddleware,getOnsiteAppointmentsForAdmin)
module.exports=router