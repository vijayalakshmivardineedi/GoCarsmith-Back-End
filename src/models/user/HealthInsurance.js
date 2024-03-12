const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    contactNumber:{
        type:String,
        required:true
    },
    holderName: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    DOB: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true
    },
    CoverPhoto: {
        type: String, // Store the image path as a string
        required: false// Add this line if the image is required
    },
    insuranceCompany: {
        type: String,
        required: true
    },

    policyPlan: {
        type: String,
        required: true
    },

    policyNumber:{
        type: Number,
        required: true,
        unique:true
    },
    expiryDate: {
        type: Date,
        required: true
    },
  


})

const healthCardModel = mongoose.model("healthInsurance", healthSchema)
module.exports = healthCardModel;