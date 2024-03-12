const Notification = require('../../models/admin/notificationsSendService');
const ServiceCenter = require('../../models/serviceCenter/auth');
const mongoose = require('mongoose');

exports.sendNotificationToAll = async (req, res) => {
  try {
    const { message } = req.body;

    // Get all service centers
    const allServiceCenters = await ServiceCenter.find({}, '_id');

    // Use a for...of loop for better handling of asynchronous operations
    for (const serviceCenter of allServiceCenters) {
      const serviceCenterId = serviceCenter._id;

      // Create a new notification for each service center
      const notification = new Notification({
        sender: 'GOCARSMITH', // Set sender dynamically if needed
        message,
        receivers: serviceCenterId,
      });

      // Save the notification for the current service center
      await notification.save();

      // Assuming you have a socket connection stored in the service center object
      if (serviceCenter.socket) {
        serviceCenter.socket.emit('notification', { message, serviceCenterId });
      }
    }

    res.status(200).json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




exports.getNotificationsByReceivers = async (req, res) =>  {
  try {
    const { serviceCenterId } = req.params;

    // Validate that serviceCenterId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(serviceCenterId)) {
      return res.status(400).json({ success: false, message: 'Invalid service center ID' });
    }

    // Retrieve notifications for the specified service center ID
    const notifications = await Notification.find({
      'receivers': serviceCenterId,
    }).sort({ timestamp: -1 }); // Sort by timestamp in descending order

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



exports.markNotificationsAsViewed = async (req, res) => {
  try {
    const { serviceCenterId, messageId } = req.body;

    // Validate that serviceCenterId and messageId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(serviceCenterId) || !mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ success: false, message: 'Invalid service center ID or message ID' });
    }

    // Update the notification to mark it as viewed
    const updatedNotification = await Notification.findOneAndUpdate(
      { '_id': messageId, 'receivers': mongoose.Types.ObjectId(serviceCenterId) },
      { $set: { 'viewed': true } },
      { new: true } // Return the updated document
    );

    if (!updatedNotification) {
      return res.status(404).json({ success: false, message: 'Notification not found for the specified service center and message ID' });
    }

    res.status(200).json({ success: true, updatedNotification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


exports.getUnreadNotificationsCount = async (req, res) => {
  try {
    const { serviceCenterId } = req.params;

    // Validate that serviceCenterId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(serviceCenterId)) {
      return res.status(400).json({ success: false, message: 'Invalid service center ID' });
    }

    // Count unviewed notifications for the specified service center ID
    const unviewedCount = await Notification.countDocuments({
      'receivers': serviceCenterId,
      'viewed': false,
    });

    res.status(200).json({ success: true, unviewedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};