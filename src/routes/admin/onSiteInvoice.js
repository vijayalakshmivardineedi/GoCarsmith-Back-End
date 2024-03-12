const express = require('express');
const { generateOnSiteInvoice, getCovertDataToOnSiteInvoicePDFById, getAllOnSiteInvoices, updateOnsiteInvoice, updateOnsiteInvoiceById, deleteOnSiteInvoice } = require('../../controllers/admin/onSiteInvoice');
const { requireSignIn, adminMiddleware } = require('../../common-middleware');
const router = express.Router();


router.post('/addOnsiteInvoice',generateOnSiteInvoice)
router.get('/generatePdf/:_id', requireSignIn, adminMiddleware, getCovertDataToOnSiteInvoicePDFById);
router.get('/getAllOnSiteInvoices', getAllOnSiteInvoices)
router.put('/updateOnsiteInvoiceById/:id',updateOnsiteInvoiceById)

router.delete('/deleteOnSiteInvoices/:invoiceId', deleteOnSiteInvoice);

module.exports = router;