const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
  Title: {type: String},
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'], // Define the types of discounts
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  Date:{type: Date,
        required: true},
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
