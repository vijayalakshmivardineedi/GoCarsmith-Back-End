const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  posttitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  cover: [
    { img: { type: String } }
  ],
  tags: [{
    type: String,
    required: true,
  }],
  author: {
    type: String,
    required: true,
  },
  
  isDeleted: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    enum: ["Auto News","Featured Articles","Car Accessories",],
    required: true,
  },
  subCategories: {
    type: String,
    enum: ["Latest Car News","Latest Spy Shot","Electric Car News","Basics","Fun Reads","Infomation Articles",''],
    required: false,
  },


}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
