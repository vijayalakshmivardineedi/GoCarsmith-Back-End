
const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  liked: {
    type: String,
    enum: ["like","dislike","null"],
  },
  likedItemId: {
    type: String, // Assuming the ID is a string
  },
}, { timestamps: true });

module.exports = mongoose.model('Interaction', interactionSchema);