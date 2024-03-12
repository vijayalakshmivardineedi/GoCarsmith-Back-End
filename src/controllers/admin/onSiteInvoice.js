const onSiteInvoiceModel = require("../../models/admin/onSiteInvoice")

const mongoose=require('mongoose')
const { v4: uuidv4 } = require('uuid');

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateInvoiceNumber(prefix = 'INV') {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based.
  
    // Generate a random UUID and remove dashes to make it shorter.
    const uniqueIdentifier = uuidv4().replace(/-/g, '');
  
    // Construct the invoice number.
    const invoiceNumber = `${prefix}-${uniqueIdentifier}`;
  
    return invoiceNumber;
    
  }
  
  const newInvoiceNumber = generateInvoiceNumber()

exports.generateOnSiteInvoice = async (req, res) => {

    try {
      const {  customerName, invoiceDate,
        serviceDate, addedItems, tax, total, status,
        Service_Charges, customLocation,discount,ServiceName, serviceCenterLocation, carModel, customerEmail } = req.body
  
      const newInvoice = new onSiteInvoiceModel({
        
        customerName: customerName,
        customerEmail: customerEmail,
        serviceCenterLocation:serviceCenterLocation,
        invoiceNumber: newInvoiceNumber,
        invoiceDate: invoiceDate,
        serviceDate: serviceDate,
        addedItems: addedItems,
        tax: tax,
        carModel: carModel,
        ServiceName: ServiceName,
        discount:discount,
        total: total,
        customLocation:customLocation,
        status: status,
        Service_Charges: Service_Charges,
      })
  
      const saveInvoice = await newInvoice.save()
      res.json(saveInvoice)
  
    } catch (error) {
      res.json(error)
    }
  
  }
function generateInvoicePDF(invoiceData) {
    // Create a new PDF document
    const doc = new PDFDocument();
  
    // Create a unique file name for the PDF based on the invoice details
    const invoiceFileName = `invoice_${invoiceData._id}.pdf`;
  
    // Define the path where the PDF will be saved
    const invoiceFilePath = path.join(__dirname, './invoices', invoiceFileName);
  
    // Pipe the PDF content to a writable stream
    doc.pipe(fs.createWriteStream(invoiceFilePath));
  
    // Add content to the PDF
    doc.fontSize(18).text('Invoice', { align: 'center' });
  
    doc.moveDown(1.5);
  
    doc.fontSize(14).text(`Customer Name: ${invoiceData.customerName}`);
    doc.moveDown(1);
    doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`);
    doc.moveDown(1);
    doc.text(`Invoice Date: ${invoiceData.invoiceDate}`);
    doc.moveDown(1);
    doc.text(`Servic eDate: ${invoiceData.serviceDate}`);
    doc.moveDown(1);
  
    doc.text(`Booking Id: ${invoiceData.bookingId}`);
    doc.moveDown(1);
    doc.text(`Customer Email: ${invoiceData.customerEmail}`);
    doc.moveDown(1);
    doc.text(`Car Model: ${invoiceData.carModel}`);
    doc.moveDown(1);
  
    doc.text(`Service Id: ${invoiceData.serviceItd}`);
    doc.moveDown(1);
    doc.text(`Service Name: ${invoiceData.ServiceName[0].name}`);
    doc.moveDown(1);
    doc.text(`Service Price: ${invoiceData.ServiceName[0].price}`);
    doc.moveDown(1);
    doc.text(`Part Name: ${invoiceData.addedItems[0].part_name}`);
    doc.moveDown(1);
    doc.text(`Quantity: ${invoiceData.addedItems[0].quantity}`);
    doc.moveDown(1);
    doc.text(`Unit Price: ${invoiceData.addedItems[0].unitPrice}`);
    doc.moveDown(1);
  
    doc.text(`Tax: ${invoiceData.tax}`);
    doc.moveDown(1);
    doc.text(`Status: ${invoiceData.status}`);
    doc.moveDown(1);
    doc.text(`Extra Charges: ${invoiceData.Service_Charges}`);
    doc.moveDown(1);
  
    doc.text(`Total: ${invoiceData.total}`)
  
    doc.end();
  
    return invoiceFilePath;
  }
  
  
  
  exports.getCovertDataToOnSiteInvoicePDFById = async (req, res) => {
    try {
      const invoiceId = req.params._id;
  
  
      // Fetch the data from MongoDB
      const invoiceData = await InvoiceModel.findById(invoiceId);
      const invoiceFilePath = generateInvoicePDF(invoiceData);
  
      if (fs.existsSync(invoiceFilePath)) {
        res.download(invoiceFilePath, `invoice_${invoiceId}.pdf`);
      } else {
        res.status(404).json({ message: 'Invoice not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error generating invoice');
    }
  };
  
  exports.getAllOnSiteInvoices = async (req, res) => {
    try {
      // Find all on-site invoices
      const allInvoices = await onSiteInvoiceModel.find();
  
      res.json(allInvoices);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  exports.updateOnsiteInvoiceById = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      // Validate and update the invoice
      const updatedInvoice = await onSiteInvoiceModel.findByIdAndUpdate(
        id,
        { $set: updatedData },
        { new: true } // Return the updated document
      );
      if (!updatedInvoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      res.json(updatedInvoice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };


  exports.deleteOnSiteInvoice = async (req, res) => {
    try {
      const { invoiceId } = req.params; // Assuming the invoiceId is passed as a parameter in the URL
      // Check if the invoiceId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
        return res.status(400).json({ message: 'Invalid invoiceId' });
      }
      // Find the invoice by its ID and delete it
      const deletedInvoice = await onSiteInvoiceModel.findByIdAndDelete(invoiceId);
      if (!deletedInvoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      res.json({ message: 'Invoice deleted successfully', deletedInvoice });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };