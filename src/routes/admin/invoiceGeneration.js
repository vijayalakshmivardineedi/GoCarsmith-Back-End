const express=require('express');
const { generateInvoice, getCovertDataToInvoicePDFById, getInvoicePdfById, deleteInvoiceById,getInvoiceByServiceCenterId,deleteServiceCenterInvoiceById, getAllGeneratedInvoices, updateInvoice, getInvoiceById, generateServiceCenterInvoice,updateServiceCenterInvoice,getCovertDataToServiceCenterInvoicePDFById,getServiceCenterInvoicePdfById, getTotalInvoices } = require('../../controllers/admin/invoiceGeneration');
const { requireSignIn, adminMiddleware } = require('../../common-middleware');
const router=express.Router();

//admin
router.post("/admin/invoiceGenerate", requireSignIn, adminMiddleware, generateInvoice);
router.get('/admin/generatePdf/:_id', requireSignIn, adminMiddleware, getCovertDataToInvoicePDFById);
router.get('/admin/getPdf/:_id',  getInvoicePdfById)
router.delete('/admin/deleteInvoice/:_id', requireSignIn, adminMiddleware, deleteInvoiceById)
router.get('/admin/getGeneratedInvoice',getAllGeneratedInvoices)
router.put('/admin/updateInvoice/:id',updateInvoice)
router.get('/admin/getInvoiceById/get/:id',getInvoiceById)

//ServiceCenter
router.post("/ServiceCenter/invoiceGenerate", generateServiceCenterInvoice);
router.put('/ServiceCenter/updateInvoice/:_id',updateServiceCenterInvoice)
router.get('/ServiceCenter/getServiceCenterInvoiceBy/:serviceCenterId',getInvoiceByServiceCenterId)
router.delete('/ServiceCenter/deleteInvoice/:_id',  deleteServiceCenterInvoiceById)
router.get('/ServiceCenter/generatePdf/:_id',getCovertDataToServiceCenterInvoicePDFById);
router.get('/ServiceCenter/getInvoiceById/:_id',getServiceCenterInvoicePdfById)
router.get('/admin/getTotalInvoices',getTotalInvoices);


module.exports=router;