const mongoose = require('mongoose');

const trashItemSchema = new mongoose.Schema({
  original: [{
    type: mongoose.Schema.Types.Mixed,
    required: true,
  }],
  deletedPath: {
    type: String, // Modify this based on the actual type of the path
    required: true,
  },
  dataFrom: {
    type: String, // Modify this based on the actual type of the path
    required: true,
  },
  expirationDate: {
    type: Date,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  deletedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });


module.exports = mongoose.model('TrashItem', trashItemSchema);
