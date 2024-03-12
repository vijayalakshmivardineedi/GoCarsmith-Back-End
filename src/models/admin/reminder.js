const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  imageFilename: {
    type: String, // Store the filename of the uploaded image
  },
  videoFilename: {
    type: String, // Store the filename of the uploaded video
  },
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
