const mongoose = require('mongoose');

const onSiteInvoiceSchema = new mongoose.Schema({


    customerName: {
        type: String,
        required: true,
      },
  customerEmail:{type:String,
    required:true,},

  
  serviceCenterLocation: {
    type: String,
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
  },

  serviceDate: {
    type: Date,
    required: true,
    
  },
  invoiceDate: {
    type: Date,
    required: true,
  },

  serviceDate: {
    type: Date,
    required: true,
    
  },
 
  addedItems: [
    {
      discription: String,
      quantity: Number,
      unitPrice: Number,
    },


  ],
  tax: {
    type: Number,
    required: true,
  },
  discount:{
    type: Number,
    required: true,
  },
  carModel:{
    type:String,
    required:true
  },
 

  ServiceName:[
    {
    name:{type:String,required:true},
    price:{type:Number,required:true}
  }
],

  

  total: {
    type: Number,
    required: true,
  },
 
  status: {
    type: String,
    enum: ['Draft', 'Paid', 'Overdue'],
    default: 'Paid',
  },

  Service_Charges:{
    type:Number,
    required:true
  },
  customLocation:{
    type:String,
    required:true
  }

});




const onSiteInvoiceModel = mongoose.model('onSiteInvoice', onSiteInvoiceSchema);

module.exports = onSiteInvoiceModel;