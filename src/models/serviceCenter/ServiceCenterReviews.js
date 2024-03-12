const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    serviceCenterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCenters', // Reference to the service for which the review is written
        //required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who wrote the review
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const ServiceCentersReview = mongoose.model('ServiceCentersReview', reviewSchema);

module.exports = ServiceCentersReview;
