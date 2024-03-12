const mongoose = require('mongoose');

const notificationServicecentersSchema = new mongoose.Schema({
  sender: {
    type: String,
  },
  receivers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCenter',
  },
  viewed: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: { type: Date, default: Date.now, expires: 24 * 60 * 60 }, // Set TTL to 1 day (24 hours * 60 minutes * 60 seconds)
});

// Create methods for retrieving sent and viewed messages
notificationServicecentersSchema.statics.getSentMessages = function (serviceCenterId) {
  return this.find({
    'receivers': serviceCenterId,
  });
};

notificationServicecentersSchema.statics.getViewedMessages = function (serviceCenterId) {
  return this.find({
    'receivers': serviceCenterId,
    'viewed': true,
  });
};

module.exports = mongoose.model('NotificationServiceCenters', notificationServicecentersSchema);
