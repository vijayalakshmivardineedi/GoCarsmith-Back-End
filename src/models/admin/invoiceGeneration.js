
const mongoose = require('mongoose');
const InvoiceSchema = new mongoose.Schema({
  
  serviceCenterId:{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCenter',
        required:true
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  carModel: {
    type: String
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  serviceDate: {
    type: Date,
    required: true,
  },
  SafetyFee:{ type: Number, required: true },
  listOfServices: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ],
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  addedItems: [
    {
      description: String,
      quantity: Number,
      unitPrice: Number,
    },
  ],
  serviceCenterLocation: {
    type: String,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending',  'Completed'],
    default: 'Pending',
  },
  labourCharges: {
    type: Number,
    required: true
  },
  discounts: {
    type: Number,
    required: true
  },
  // service_Charges: {
  //   type: Number,
  //   required: true
  // },
  customerLocation: {
    firstName: {type: String,
      required: true,},
    lastName: {type: String,
      required: true,},
    address1: {type: String,
      required: true,},
    address2: {type: String,
      required: true,},
    city: {type: String,
      required: true,},
    state:{type: String,
      required: true,},
    zip:{type: Number,
      required: true,},
    country:{type: String,
      required: true,},
    phoneNumber: {type: String,
      required: true,},
  },
});
const InvoiceModel = mongoose.model('Invoice', InvoiceSchema);
module.exports = InvoiceModel;