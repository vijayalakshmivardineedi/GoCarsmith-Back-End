const Brands = require('../../models/admin/brands');
const slugify = require('slugify');
const shortid = require('shortid');
const City = require('../../models/admin/city')
exports.addBrands = async (req, res) => {
  const { brandName, locations } = req.body;
let brandImage = '';
if (req.file) {
  brandImage = `/public/${req.file.filename}`;
}
const locationObjectIds = await City.find({ name: { $in: locations } }).distinct('_id');
const newBrand = new Brands({
  brandName,
  locations: locationObjectIds, // Use ObjectId values instead of strings
  brandImage,
  slug: `${slugify(brandName)}-${shortid.generate()}`,
  createdBy: req.user._id,
});
try {
  const savedBrand = await newBrand.save();
  res.json(savedBrand);
} catch (err) {
  console.error(err);
  res.status(400).json({ error: 'Failed to add the brand', details: err.message });
}
}


// Define a route to delete a car brand by ID
exports.deleteBrand = async (req, res) => {
  try {
    const brandId = req.params.id;

    // Find the brand by its ID and remove it
    const deletedBrand = await Brands.findByIdAndRemove(brandId);

    if (!deletedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    return res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while deleting the brand' });
  }
};


// Define a route to update a car brand by ID
exports.putBrand = async (req, res) => {
  try {
    const brandId = req.params.id;

    // Create an object with the fields you want to update
    const updatedData = {};
    if (req.body.brandName) {
      updatedData.brandName = req.body.brandName;
    }
    if (req.body.locations) {
      updatedData.locations = req.body.locations;
    }
    if (req.file) {
      updatedData.brandImage = `/public/${req.file.filename}`;
    }

    // Find the brand by its ID and update it with the data from updatedData
    const updatedBrand = await Brands.findByIdAndUpdate(brandId, updatedData, { new: true });

    if (!updatedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    return res.json({ message: 'Brand updated successfully', brand: updatedBrand });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while updating the brand' });
  }
};

exports.getBrands = async (req, res) => {
    try {
        const brands = await Brands.find();
        res.json(brands);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get brands' });
    }
};




exports.brandLocation = async (req, res) => {
    try {
      const locationId = req.params.locationId;
  
      // Find brands that have the specified location ID in their 'locations' array
      const brands = await Brands.find({ locations: locationId });
  
      if (brands.length === 0) {
        return res.status(404).json({ message: 'No brands found for the specified location' });
      }
  
      res.json({ message: 'Brands found for the location', brands });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve brands for the location' });
    }
  };






const TrashItem = require('../../models/admin/trashBin');

exports.deleteBrand = async (req, res) => {
  try {
    const brandId = req.params.id;

    // Find the brand by its ID and remove it
    const deletedBrand = await Brands.findByIdAndRemove(brandId);

    if (!deletedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Construct the object with necessary fields
    const trashItemObject = {
      _id: deletedBrand._id,
      brandName: deletedBrand.brandName,
      locations: deletedBrand.locations,
      brandImage: deletedBrand.brandImage,
      slug: deletedBrand.slug,
      createdBy: deletedBrand.createdBy,
      // Add other fields as needed
    };

    // Path of the deleted item (modify this based on your application structure)
    const deletedPath = `/brand/${brandId}`;

    // Create a new TrashItem
    const trashItem = new TrashItem({
      original: [trashItemObject],
      deletedPath: deletedPath,
      dataFrom: 'Brands',
    });

    // Save the new TrashItem
    await trashItem.save();

    return res.json({ message: 'Brand moved to trash bin successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};