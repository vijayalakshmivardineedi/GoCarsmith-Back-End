
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
      trim: true,
      min: 3,
      max: 20,
    },
    secondName: {
      type: String,
      required: false,
      trim: true,
      min: 3,
      max: 20,
    },
    username: {
      type: String,
      required: false,
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
      required: false,
    },
    
    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    
    verificationToken: {
      type: String
    },

    contactNumber: { 
      type: String 
    },
    profilePicture: { 
      type: String 
    },
    mycars: [
      {
        BrandId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Brands",
      },
        brandName: {
          type: String,
          required: false,
        },
      modelId: {
          type: String,
      },
      modelName: {
        type: String,
        required: false,
      },
      modelImage: {
        type: String, 
    },
    fuelType:{
      type: String,
  },
  registrationNumber: {
    type: String, 
},
year: {
  type: String, 
},
kilometers: {
  type: String, 
},
      },
    ],
  },
  { timestamps: true }
);



userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.secondName}`;
});

userSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
};
userSchema.virtual("password").set(function (password) {
  // Hash the password with the defined salt rounds
  this.hash_password = bcrypt.hashSync(password, saltRounds);
});

module.exports = mongoose.model("User", userSchema);
