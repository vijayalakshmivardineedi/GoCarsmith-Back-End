const Category = require('../../models/admin/category')
const slugify = require('slugify');

// Add a new category
exports.addCategory = async (req, res) => {
  try {
    const { name, createdBy } = req.body;

    const newCategory = new Category({
      name,
      slug: slugify(name), // You can customize how you generate the slug
      createdBy, // Assuming you have the ID of the admin who created the category
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating category' });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving categories' });
  }
};
