const Review = require('../../models/admin/review');
const User = require('../../models/user/auth'); // Import the User model
//const service = require('../models/CarServicesModels/PeriodicServicesModel')

exports.addReview = async (req, res) => {
  try {
    const { service, user, rating, comment } = req.body;

    
    // Create a new review instance using the Review model
    const newReview = new Review({
      service,
      user,
      rating,
      comment,
    });

    // Save the review to the database
    const savedReview = await newReview.save();

    // Populate the user data to get the username
    const populatedReview = await Review.findById(savedReview._id)
    .populate('user', 'firstName')
    

    res.status(201).json({ message: 'Review added successfully', review: populatedReview });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to add the review' });
  }
};
exports.getReviewsByServiceId = async (req, res) => {
        try {
          const { serviceId } = req.params;
      
          // Find reviews that match the provided serviceId
          const reviews = await Review.find({ service: serviceId })
            .populate('user', 'firstName') // Populate the user data to get the username
      
          if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this service.' });
          }
      
          res.status(200).json({ reviews });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        }
      };
      exports.getAllreviews = async (req, res) => {
        try {
          // Fetch all reviews from the database
          const reviews = await Review.find()
          .populate('user','firstName');
      
          // Send the reviews as a JSON response
          res.status(200).json(reviews);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Failed to retrieve reviews' });
        }
      };