const InvoiceModel = require("../../models/admin/invoiceGeneration");

const AppointmentModel = require("../../models/user/appointments");

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


exports.generateInvoice = async (req, res) => {
  try {
    const {
      customerName,
      invoiceDate,
      serviceDate,
      bookingId,
      tax,
      labourCharges,
      discounts,
     total,
      service_Charges,
      serviceItd,
      status,
      carModel,
      email,
      listOfServices,
      contactNumber,
      customerLocation,
      items,
      serviceCenterLocation
    } = req.body;

      
    const newInvoice = new InvoiceModel({
      bookingId: bookingId,
      customerEmail: email,
      customerName: customerName,
      contactNumber: contactNumber,
      carModel: carModel,
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: invoiceDate,
      serviceDate: serviceDate,
      ServiceName: listOfServices,
      serviceId: serviceItd,
      tax: tax,
      serviceCenterLocation:serviceCenterLocation,
      addedItems:items,
      total: total,
      status:status,
      labourCharges: labourCharges,
      discounts: discounts,
      service_Charges: service_Charges,
      customerLocation: customerLocation,
    });

    const saveInvoice = await newInvoice.save();
    res.json(saveInvoice);
    
  } catch (error) {
    res.json(error);
  }
};

function generateInvoicePDF(invoiceData) {
  // Create a new PDF document
  const doc = new PDFDocument();
  // Create a unique file name for the PDF based on the invoice details
  const invoiceFileName = `invoice_${invoiceData._id}.pdf`;
  // Define the path where the PDF will be saved
  const invoiceFilePath = path.join(__dirname, './invoices', invoiceFileName);

  doc.pipe(fs.createWriteStream(invoiceFilePath));

  // Add content to the PDF
  const primaryColor = '#3498db';

  // Set the text color before rendering "Invoice"
  doc.fillColor(primaryColor).fontSize(35).text('Invoice', { align: 'center' });
  doc.moveDown(1); // Move down after rendering the "Invoice" text
  doc.fillColor('black');

  // Invoice ID and Date
  doc.fontSize(12).text(`Invoice ID: ${invoiceData._id}`, { align: 'right' });
  const invoiceDate = new Date(invoiceData.invoiceDate);
  doc.fontSize(12).text(`Invoice Date: ${invoiceDate.toLocaleDateString()}`, { align: 'right' });
  doc.moveDown(2);



  // Customer information
 
  const primarColor = '#3498db';
  // Set the text color before rendering "Invoice"
  doc.fillColor(primarColor).fontSize(18).text('Customer Details', { align: 'left' });
  doc.fillColor('black');

  const customerDetails = [
    { key: 'Name', value: `${invoiceData.customerLocation.firstName} ${invoiceData.customerLocation.lastName}` },
    { key: 'Number', value: invoiceData.contactNumber },
    { key: 'Email', value: invoiceData.customerEmail },
    { key: 'Address', value: `${invoiceData.customerLocation.address1}, ${invoiceData.customerLocation.address2}` },
    { key: 'City, State', value: `${invoiceData.customerLocation.city}, ${invoiceData.customerLocation.state}` },
    { key: 'Country, Pin', value: `${invoiceData.customerLocation.country}, ${invoiceData.customerLocation.zip}` },
  ];

  const reducedFontSize = 11; // Set the reduced font size for values

  for (const detail of customerDetails) {
    doc.fontSize(detail.key === 'Name' ? 11 : reducedFontSize).text(`${detail.key}: ${detail.value}`);
  }

  doc.moveDown(2);


  // List of services
  
  const primaColor = '#3498db';
  // Set the text color before rendering "Invoice"
  doc.fillColor(primaColor).fontSize(14).text('Services Details', { align: 'left' });
  doc.fillColor('black');
  for (const service of invoiceData.listOfServices) {
    const { name, price } = service;
    doc.text(`Service Name: ${name}`, { align: 'left' });
    doc.text(`Service Price: ${price}`, { align: 'right' });
    doc.moveDown(2);
  }

  // Additional item details
  const [addedItem] = invoiceData.addedItems || [];
  if (addedItem) {
    const { description, quantity, unitPrice } = addedItem;
    doc.text(`Part Name: ${description}`, { align: 'left' });
    doc.text(`Quantity: ${quantity}`, { align: 'right' });
    doc.text(`Unit Price: ${unitPrice}`, { align: 'right' });
    doc.moveDown(2);
  }

  // Other details
  const primColor = '#3498db';
  // Set the text color before rendering "Invoice"
  doc.fillColor(primColor).fontSize(14).text('Additional Details', { align: 'left' });
  doc.fillColor('black');
  doc.text(`Tax: ${invoiceData.tax}`, { align: 'left' });
  doc.text(`Safety Fee: ${invoiceData.SafetyFee}`, { align: 'left' });
  doc.text(`Discounts: ${invoiceData.discounts}`, { align: 'left' });
  doc.text(`Labour Charges: ${invoiceData.labourCharges}`, { align: 'left' });
  doc.text(`Total: ${invoiceData.total}`, { align: 'right' });
  doc.moveDown(2);

  // End the document
  doc.end();
  return invoiceFilePath;
}
exports.getCovertDataToInvoicePDFById = async (req, res) => {
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


//download invoice pdf



exports.getInvoicePdfById=async(req, res) => {
  const invoiceId = req.params._id;
  
  const invoiceFilePath = path.join(__dirname, './invoices', `invoice_${invoiceId}.pdf`);

  if (fs.existsSync(invoiceFilePath)) {
    res.download(invoiceFilePath, `invoice_${invoiceId}.pdf`);
  } else {
    res.status(404).json({ message: 'Invoice PDF not found' });
  }
}




exports.deleteInvoiceById=async (req, res) => {
  try {
    const invoiceId = req.params._id;

    // Fetch the data from MongoDB
    const invoiceData = await InvoiceModel.findById(invoiceId);

    // Check if the invoice data exists
    if (!invoiceData) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Generate the file path based on the invoice data
    const invoiceFileName = `invoice_${invoiceId}.pdf`;
    const invoiceFilePath = path.join(__dirname, './invoices', invoiceFileName);

    // Check if the PDF file exists, and if it does, delete it
    if (fs.existsSync(invoiceFilePath)) {
      fs.unlinkSync(invoiceFilePath);
    }

    // Delete the invoice data from MongoDB
    await InvoiceModel.findByIdAndRemove(invoiceId);

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the invoice' });
  }
}
exports.getAllGeneratedInvoices=async (req,res)=>{
  try {
    // Fetch the data from MongoDB
    const invoiceData = await InvoiceModel.find();
    // Check if the invoice data exists
    if (!invoiceData) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    // Generate the file path based on the invoice data
    res.json(invoiceData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the invoice' });
  }
}
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    // Validate and update the invoice
    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
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
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await InvoiceModel.findById(id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

//Service Center
exports.getInvoiceByServiceCenterId=async(req,res)=>{
  try {
    const { serviceCenterId } = req.params;
    const invoice = await InvoiceModel.find({serviceCenterId});

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

exports.updateServiceCenterInvoice = async (req, res) => {
  try {
    const { _id } = req.params;
    const updatedData = req.body;
    // Validate and update the invoice
    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      _id,
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


exports.generateServiceCenterInvoice = async (req, res) => {
  try {
    const {
      customerName,
      invoiceDate,
      serviceDate,
      serviceCenterId,
      tax,
      labourCharges,
      discounts,
      total,
      service_Charges,
      serviceItd,
      status,
      carModel,
      email,
      listOfServices,
      contactNumber,
      customerLocation,
      items,
      serviceCenterLocation,
      gst,
      Discount,
      SafetyFee



    } = req.body;


    const newInvoice = new InvoiceModel({
      serviceCenterId:serviceCenterId,
      customerEmail: email,
      customerName: customerName,
      contactNumber: contactNumber,
      carModel: carModel,
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: invoiceDate,
      serviceDate: serviceDate,
      listOfServices: listOfServices,
      serviceId: serviceItd,
      tax: tax,
      serviceCenterLocation: serviceCenterLocation,
      addedItems: items,
      total: total,
      status: status,
      labourCharges: labourCharges,
      discounts: discounts,
      service_Charges: service_Charges,
      customerLocation: customerLocation,
      gst: gst,
      Discount: Discount,
      SafetyFee: SafetyFee

    });

    const saveInvoice = await newInvoice.save();
    res.json(saveInvoice);

  } catch (error) {
    res.json(error);
  }
};


exports.deleteServiceCenterInvoiceById = async (req, res) => {
  try {
    const invoiceId = req.params._id;

    // Fetch the data from MongoDB
    const invoiceData = await InvoiceModel.findById(invoiceId);

    // Check if the invoice data exists
    if (!invoiceData) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Generate the file path based on the invoice data
    const invoiceFileName = `invoice_${invoiceId}.pdf`;
    const invoiceFilePath = path.join(__dirname, './invoices', invoiceFileName);

    // Check if the PDF file exists, and if it does, delete it
    if (fs.existsSync(invoiceFilePath)) {
      fs.unlinkSync(invoiceFilePath);
    }

    // Delete the invoice data from MongoDB
    await InvoiceModel.findByIdAndRemove(invoiceId);

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the invoice' });
  }
}

exports.getCovertDataToServiceCenterInvoicePDFById = async (req, res) => {
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

exports.getServiceCenterInvoicePdfById = async (req, res) => {
  const invoiceId = req.params._id;

  const invoiceFilePath = path.join(__dirname, './invoices', `invoice_${invoiceId}.pdf`);

  if (fs.existsSync(invoiceFilePath)) {
    res.download(invoiceFilePath, `invoice_${invoiceId}.pdf`);
  } else {
    res.status(404).json({ message: 'Invoice PDF not found' });
  }
}

exports.getTotalInvoices = async(req,res)=>{
  try {
    
    const invoice = await InvoiceModel.find();

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}