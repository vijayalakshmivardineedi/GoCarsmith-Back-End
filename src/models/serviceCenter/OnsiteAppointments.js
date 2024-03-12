const mongoose = require('mongoose');

const onsiteAppointmentSchema = new mongoose.Schema({
   userId:{type: String,
    required: true,
  },
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
  customerName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  carModel: {
    type: String,
    required: true,
  },
  Brand: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  fuelType:{
    type:String,
    required:true
  },
  listOfServices: [{
    name: String,
    price: Number,
  }],
  email: {
    type: String,
    required: true,
  },
  serviceCenterId:{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCenter',
        required:true
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  time:{
    type:String,
    required:true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
paymentMethod:{
  type: String,
    enum: ['CASH', 'PAID'],
    required:true
},
  // Add any other fields you need for appointments
  subTotal:{type:Number,
    required:true},
    gst:{type:Number,
      required:true},
    Discount:{type:Number,
      required:true},
    SafetyFee:{type:Number,
      required:true}
});
const onSiteAppointmentData=mongoose.model("OnsiteAppointment", onsiteAppointmentSchema)
module.exports =onSiteAppointmentData