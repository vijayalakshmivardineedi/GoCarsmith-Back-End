const mongoose = require('mongoose');
const manageAddressSchema = new mongoose.Schema({
    locality: {
        type: String,
        required:true
    },
    Name: {
        type: String,
        required:true
    },
    FlatNo:{
        type: String,
        required:true
    },
    pincode:{
        type: Number,
        required: true
    },
    longitude:{
        type: String,
        required:true
    },
    latitude:{
        type: String,
        required: true
    }
});
module.exports = mongoose.model('ManageAddress', manageAddressSchema)