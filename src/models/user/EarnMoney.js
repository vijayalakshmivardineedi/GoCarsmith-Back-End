const mongoose = require('mongoose');

const EarnMoneySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    moneyReferal: {
        type: Number,
        required: true
    },
    referalDate: {
        type: Date, // Store the expiry date as a Date type
        required: true
    },
    expiryDate: {
        type: Date, // Store the expiry date as a Date type
        required: true
    },
    totalMoney:{
        type:Number,
        required:true,
        default:0
    }

});

const moneyEarn = mongoose.model("Coins", EarnMoneySchema);
module.exports = moneyEarn;