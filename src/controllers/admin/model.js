const CarModel=require('../../models/admin/model') // Correct import statement
const slugify = require('slugify');
const shortid = require('shortid');
const City = require('../../models/admin/city');
const { default: mongoose } = require('mongoose');

// API route to add a car model
exports.addModel = async (req, res) => {
  try {
      const { model, BrandId, locations, fuelType } = req.body;
      let modelImage = '';

      if (req.file) {
          modelImage = `/public/${req.file.filename}`;
      }

      // Convert fuelType to an array if it's not already
      const fuelTypeArray = Array.isArray(fuelType) ? fuelType : [fuelType];

      const locationObjectIds = await City.find({ name: { $in: locations } }).distinct('_id');
      const slug = `${slugify(model)}-${shortid.generate()}`;

      const newModel = new CarModel({
          model: model,
          locations: locationObjectIds,
          modelImage: modelImage,
          BrandId: BrandId,
          fuelType: fuelTypeArray, // Ensure fuelType is an array
          slug: slug,
          createdBy: req.user._id,
      });

      const savedModel = await newModel.save();

      res.json(savedModel);
  } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Failed to add the model' });
  }
};


// API route to delete a car model by ID
exports.deleteModel = async (req, res) => {
    try {
        const carModelId = req.params.id;
        // Find and delete the car model by ID
        await CarModel.findByIdAndDelete(carModelId);
        res.json({ success: true, message: 'Car model deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Could not delete car model.' });
    }
};

exports.updateModel = async (req, res) => {
  try {
    const carModelId = req.params.id;
    const updatedData = req.body;
    if (req.file) {
      updatedData.modelImage = `/public/${req.file.filename}`;
    }
    // Convert locations string to an array of ObjectIds
    if (updatedData.locations && typeof updatedData.locations === 'string') {
      updatedData.locations = updatedData.locations.split(',').map(location => mongoose.Types.ObjectId(location));
    }
    // Ensure fuelType is an array of strings
    if (updatedData.fuelType && typeof updatedData.fuelType === 'string') {
      updatedData.fuelType = updatedData.fuelType.split(',');
    }
    const updatedCarModel = await CarModel.findByIdAndUpdate(carModelId, updatedData, { new: true });
    res.json({ success: true, data: updatedCarModel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Could not update car model.' });
  }
};


exports.getModel = async (req, res) => {
  try {
    const BrandId = req.params.BrandId; 
    // Find all car models that belong to the specified brand reference ID
    const carModels = await CarModel.find({ BrandId });

    if (!carModels || carModels.length === 0) {
      return res.status(404).json({ error: 'No car models found for the specified brand' });
    }

    res.json(carModels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve car models' });
  }
}


 

exports.getModelById = async (req, res) => {
  try {
    const carModel = await CarModel.findById(req.params.id)
    .populate({
      path: 'locations',
      select: 'name', // Assuming 'name' is the field in the City model that contains the city name
    })
    .populate({
      path: 'BrandId',
      select: 'brandName'
    })
    .exec();

  if (!carModel) {
    return res.status(404).json({ error: 'Model not found' });
  }

  const locations = carModel.locations.map(location => location.name);

  res.json({
    _id: carModel._id,
    model: carModel.model,
    BrandId: carModel.BrandId.brandName,
    modelImage: carModel.modelImage,
    fuelType: carModel.fuelType,
    locations: locations,
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to retrieve car model' });
}
};

exports.getFuelTypesByBrandAndModel = async (req, res) => {
  try {
    const { brandId, modelId } = req.params;

    // Find the car model that matches the brand and model
    const carModel = await CarModel.findOne({ BrandId: brandId, _id: modelId });

    if (!carModel) {
      return res.status(404).json({ error: 'Car model not found for the specified brand and model' });
    }

    const fuelTypes = carModel.fuelType;

    res.json({ fuelTypes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve fuel types' });
  }
};




exports.getModelByIdOrName = async (req, res) => {
  const { id } = req.params;

  try {
    let carModel;
    // Try to find by ID
    if (mongoose.Types.ObjectId.isValid(id)) {
      carModel = await CarModel.findById(id);
    }
    // If not found by ID, try to find by name
    if (!carModel) {
      carModel = await CarModel.findOne({ model: id });
    }
    
    // If still not found, respond with an error
    if (!carModel) {
      return res.status(404).json({ error: 'Car model not found' });
    }
    // Respond with the found car model
    res.json(carModel);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};