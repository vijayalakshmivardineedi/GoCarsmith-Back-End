const mongoose = require('mongoose');

// Define a schema for inventory categories
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: String,
  createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
  },
  
},{timestamps: true}
);

// Create a model from the schema
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
