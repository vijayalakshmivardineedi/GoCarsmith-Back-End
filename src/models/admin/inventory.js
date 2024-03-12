const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    modelId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarModel",
        required: false
    },
    name: {
        type: String,
        required: true,
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    quantity: {
        type: Number,
        required: true,
    },
    image: {
        type:String,
        required: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },
    updatedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
