const Inventory = require('../../models/admin/inventory')
const Category = require('../../models/admin/category')
const slugify = require("slugify");



exports.addInventory = async (req, res) => {
try {
    const { category, modelId, name, quantity, createdBy } = req.body;

    let image = '';
    
    if (req.file) {
      image = `/public/${req.file.filename}`;
    }

    // Create a new inventory item
    const newItem = new Inventory({
        category,
        modelId,
        name,
        slug:slugify(name),
        quantity,
        image: image, // Use req.file.buffer to set the image data
        createdBy: req.user._id,
      });

    // Save the item to the database
    const savedItem = await newItem.save();
   
    res.json(savedItem);
  } catch (error) {
    console.error("Error while saving item:", error);
    res.status(500).json({ error: 'Failed to add item to the inventory.' });
  }
}
exports.updateInventory = async (req, res) => {
  try {
    const { category, modelId, name, quantity, createdBy } = req.body;
    const { itemId } = req.params; // Extract the item ID from the URL

    // Find the inventory item by ID
    const existingItem = await Inventory.findById(itemId);

    if (!existingItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    // Update the item's properties
    existingItem.category = category;
    existingItem.modelId = modelId;
    existingItem.name = name;
    existingItem.quantity = quantity;

    // Save the updated item
    const updatedItem = await existingItem.save();

    res.json(updatedItem);
  } catch (error) {
    console.error("Error while updating item:", error);
    res.status(500).json({ error: 'Failed to update item.' });
  }
};
exports.deleteInventory = async (req, res) => {
  try {
    const { itemId } = req.params; // Extract the item ID from the URL

    // Find the inventory item by ID
    const existingItem = await Inventory.findById(itemId);

    if (!existingItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    // Delete the item
    await existingItem.remove();

    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error("Error while deleting item:", error);
    res.status(500).json({ error: 'Failed to delete item.' });
  }
};


exports.getInventory = async (req, res) => {
  try {
    // Fetch all inventory items from the database
    const inventoryItems = await Inventory.find();

    res.json(inventoryItems);
  } catch (error) {
    console.error("Error while fetching inventory items:", error);
    res.status(500).json({ error: 'Failed to fetch inventory items.' });
  }
};


exports.getInventoryByCategoryID = async (req, res) => {
  try {
    const { categoryId } = req.params; // Assuming the category ID is passed as a URL parameter

    // Find inventory items that match the category ID
    const inventoryItems = await Inventory.find({ 'category': categoryId });

    if (inventoryItems.length === 0) {
      return res.status(404).json({ error: 'Inventory items not found for this category.' });
    }

    res.status(200).json(inventoryItems);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error retrieving inventory items.' });
  }
};



exports.getInventoryCount = async (req, res) => {
  try {
    const result = await Inventory.aggregate([
      {
        $group: {
          _id: '$category', // Assuming categoryID is the field referencing Category
          count: { $sum: 1 },
          items: { $push: '$$ROOT' }, // Accumulate inventory items for each category
        },
      },
      {
        $lookup: {
          from: Category.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          categoryName: '$category.name',
          itemCount: '$count',
          items: 1, // Include the accumulated inventory items
        },
      },
    ]);
    res.json(result);
  } catch (error) {
    console.error('Error fetching inventory items with count:', error);
    res.status(500).json({ error: 'An error occurred while fetching inventory items with count' });
  }
};