const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  locality: {
    type: String,
    required: true
  },
  workshopDetails: {
    type: String,
    required: true
  },
  workshopName: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  approvalStatus: {
    type: String,
    enum: ['approved', 'declined', 'pending'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Request", requestSchema);
