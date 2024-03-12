const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const admincreationSchema = new mongoose.Schema(
    {
      ServiceCenterActualName: {
        type: String,
        required: true,
        enum: ["GoCarsmith"],
        default: "GoCarsmith"
      },
      email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
      },
      serviceCenterId: {
        type: String,
        required: true,
        unique: true,
      },

      role: {
        type: String,
        enum: ["ServiceCenter"],
        default: "ServiceCenter",
      },
  
      verificationToken: {
        type: String
      },
  
      isVerified: {
        type: Boolean, // Ensure it's defined as a Boolean
        default: false, // Set a default value if necessary
      },
      approved: {
        type: Boolean,
        default: true,  // Set to true once approved by admin
      },
    },
    { timestamps: true }
  
  );
  
  
  
  module.exports = mongoose.model("AdminCreation", admincreationSchema);
  
