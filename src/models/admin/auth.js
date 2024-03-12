const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    secondName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    adminName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    hash_password: {
      type: String,
      required: true,
    },
    role: {
        type: String,
        enum: ["admin"],
        default: "admin",
      },

    isVerified: {
      type: Boolean, // Ensure it's defined as a Boolean
      default: false, // Set a default value if necessary
      required: false,
    },

    contactNumber: { 
      type: String 
    },
    profilePicture: { 
      type: String 
    },
  },
  { timestamps: true }
);



adminSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.secondName}`;
});

adminSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
};
adminSchema.virtual("password").set(function (password) {
  // Hash the password with the defined salt rounds
  this.hash_password = bcrypt.hashSync(password, saltRounds);
});

module.exports = mongoose.model("Admin", adminSchema);

