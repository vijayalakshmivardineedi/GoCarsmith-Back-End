const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const employeeSchema = new mongoose.Schema(
  {
    serviceCenterId: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCenter',
    },
    
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
    employeeName: {
      type: String,
      required: true,
      trim: true,
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
    employeeId:{
      type: String,
      required: true,
      unique: true,

    },
    role: {
      type: String,
      enum: ["Manager", "Mechanic", "Incharge","Accountant"], 
      default: "Mechanic",
    },
    Address: {
      type: String
    },
    verificationToken: {
      type: String
    },

    isVerified: {
      type: Boolean, // Ensure it's defined as a Boolean
      default: false, // Set a default value if necessary
    },

    contactNumber: { type: String },
    profilePicture: { type: String },
  },
  { timestamps: true }
);



employeeSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.secondName}`;
});
employeeSchema.pre("save", function (next) {
  // Set the employeeName field to the full name before saving
  this.employeeName = this.fullName;
  next();
});
employeeSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
};
employeeSchema.virtual("password").set(function (password) {
  // Hash the password with the defined salt rounds
  this.hash_password = bcrypt.hashSync(password, saltRounds);
});

module.exports = mongoose.model("Employee", employeeSchema);