const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceCenterInventorySchema = new Schema({
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // You can reference the Inventory Categories model
        required: true,
    },
    serviceCenterID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'serviceCenter', // You can reference the Inventory Categories model
        required: true,
    }],
    modelID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carModel', // You can reference the Inventory Categories model
        required: false,
    },
    itemName: {
        type: String,
        required: true,
    },
    purchaseDate: {type: Date},
    ExpiryDate: {type: Date},
    quantityInStock:{type: Number},
    minimumStockLevel:{type: Number},
    maximumStockLevel:{type: Number},
    locationInServiceCenter:{type: String},
    status:{type: String},
});

// Create a Mongoose model based on the schema
const InventoryItem = mongoose.model('InventoryItem', serviceCenterInventorySchema);

module.exports = InventoryItem;
