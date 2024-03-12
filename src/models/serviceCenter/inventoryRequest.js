const mongoose = require('mongoose');

const inventoryRequestSchema = new mongoose.Schema({
  serviceCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCenter', // Reference to the service center making the request
  },

  items: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],

  status: {
    type: String,
    default: 'Pending', // Initial status
  },

  created_at: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('InventoryRequest', inventoryRequestSchema);