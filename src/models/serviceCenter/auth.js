const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const LatAndLog = new mongoose.Schema({
  Latitude: { type: Number, default: 0 },  // Set default values as needed
  Longitude: { type: Number, default: 0 }
});

const serviceCenterSchema = new mongoose.Schema(
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
    serviceCenterName: {
      type: String,
      required: true,
    },

    ServiceCenterActualName: {
      type: String,
      required: true,
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
    serviceCenterId: {
      type: String,
      required: true,
      unique: true,

    },
    role: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean, // Ensure it's defined as a Boolean
      default: false, // Set a default value if necessary
      required: true,
    },



    address: {
      type: LatAndLog,
      default: { Latitude: 0, Longitude: 0 }  // Set default values as needed
    },

    
    locations:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
    },

    CenterCity: {
      type: String,
      required: false,
      required: true,
    },

    CenterState: {
      type: String,
      required: true,
    },
    CenterCountry: {
      type: String,
      required: true,
    },

    postalCode: {
      type: Number,
      required: true,
    },

    contactPersonName: {
      type: String,
      required: false,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    approved: {
      type: Boolean,
      default: true,  // Set to true once approved by admin
    },

    contactNumber: { type: String },
    profilePicture: { type: String,
    default:"" },
  },
  { timestamps: true }

);



serviceCenterSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.secondName}`;
});

serviceCenterSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
};
serviceCenterSchema.virtual("password").set(function (password) {
  // Hash the password with the defined salt rounds
  this.hash_password = bcrypt.hashSync(password, saltRounds);
});





module.exports = mongoose.model("ServiceCenter", serviceCenterSchema);
