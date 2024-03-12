const mongoose = require('mongoose');

const brandsSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: false,
    },
    locations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
        }
    ],
    brandImage: {
        type: String, // Store the image path as a string
        required: false// Add this line if the image is required
    },
    slug: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    updatedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Brands', brandsSchema);
