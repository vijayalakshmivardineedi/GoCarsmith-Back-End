const InventoryItem = require("../../models/serviceCenter/serviceCenterInventory");
const Category = require('../../models/admin/category')

// Controller function to add a new inventory item
exports.addInventoryItem = async (req, res) => {
  try {
    // Get the data for the new inventory item from the request body
    const {
      categoryID,
      serviceCenterID,
      modelID,
      itemName,
      purchaseDate,
      ExpiryDate,
      quantityInStock,
      minimumStockLevel,
      maximumStockLevel,
      locationInServiceCenter,
      status,
    } = req.body;

    // Parse the date strings into Date objects
    const parsedPurchaseDate = new Date(purchaseDate);
    const parsedExpiryDate = new Date(ExpiryDate);

    // Create a new instance of the InventoryItem model with the provided data
    const newInventoryItem = new InventoryItem ({
      categoryID,
      serviceCenterID: Array.isArray(serviceCenterID) ? serviceCenterID : [serviceCenterID],
      modelID,
      itemName,
      purchaseDate: parsedPurchaseDate,
      ExpiryDate: parsedExpiryDate,
      quantityInStock: parseInt(quantityInStock), // Convert to number
      minimumStockLevel: parseInt(minimumStockLevel), // Convert to number
      maximumStockLevel: parseInt(maximumStockLevel), // Convert to number
      locationInServiceCenter,
      status,
    });

    // Save the new inventory item to the database
    await newInventoryItem.save();

    res.status(201).json({ message: 'Inventory item added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the inventory item' });
  }
};

exports.getInventoryItemsByCategory = async (req, res) => {
  try {
    // Extract the category ID from the request parameters
    const categoryId = req.params.categoryId;

    // Query the database to find inventory items with the specified category ID
    const items = await InventoryItem.find({ categoryID: categoryId });

    // Respond with the retrieved items in JSON format
    res.json(items);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: 'An error occurred while fetching inventory items by category' });
  }
};

exports.getInventoryByServiceCenter = async (req, res) => {
  try {
      const serviceCenterId = req.params.ServiceCenterId;
      // Fetch all inventory items for the given service center
      const items = await InventoryItem.find({ serviceCenterID: serviceCenterId });

      // Log items and their quantities
      

      // Calculate total quantity
      const totalQuantity = items.reduce((total, item) => {
        ;
          return total + (item.quantityInStock || 0);
      }, 0);

   

      // Send both items and total quantity in the response
      res.json({
          items: items,
          totalQuantity: totalQuantity,
      });
  } catch (error) {
      console.error('Error fetching inventory items:', error);
      res.status(500).json({ error: 'An error occurred while fetching all inventory items' });
  }
};

exports.getAllInventoryItems = async (req, res) => {
  try {
    // Query the database to find all inventory items
    const items = await InventoryItem.find();

    // Respond with the retrieved items in JSON format
    res.json(items);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: 'An error occurred while fetching all inventory items' });
  }
};
exports.deleteInventoryItem = async (req, res) => {
  try {
    // Extract the item ID from the request parameters
    const itemId = req.params.itemId;

    // Query the database to find the inventory item by its ID and delete it
    const deletedItem = await InventoryItem.findByIdAndRemove(itemId);

    if (deletedItem) {
      // If the item was found and deleted, respond with a success message
      res.json({ message: 'Inventory item deleted successfully' });
    } else {
      // If the item was not found, respond with an error message
      res.status(404).json({ error: 'Inventory item not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: 'An error occurred while deleting the inventory item' });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    // Extract the item ID from the request parameters
    const itemId = req.params.itemId;

    // Extract the updated data from the request body
    const updatedData = req.body;

    // Query the database to find the inventory item by its ID and update it
    const updatedItem = await InventoryItem.findByIdAndUpdate(itemId, updatedData, { new: true });

    if (updatedItem) {
      // If the item was found and updated, respond with the updated item
      res.json(updatedItem);
    } else {
      // If the item was not found, respond with an error message
      res.status(404).json({ error: 'Inventory item not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: 'An error occurred while updating the inventory item' });
  }
};
exports.getInventoryCount = async (req, res) => {
  try {
    const result = await InventoryItem.aggregate([
      {
        $group: {
          _id: '$categoryID', // Assuming categoryID is the field referencing Category
          count: { $sum: 1 },
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
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error('Error fetching inventory items with count:', error);
    res.status(500).json({ error: 'An error occurred while fetching inventory items with count' });
  }
};