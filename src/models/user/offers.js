const mongoose = require('mongoose');

const offersSchema = new mongoose.Schema({
    
    code: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'], // Define the types of discounts
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
    },
    Date: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    image:{
        type:String
    }

})
module.exports = mongoose.model('Offer', offersSchema);