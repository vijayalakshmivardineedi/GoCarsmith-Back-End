
const Services = require("../../models/admin/services");
const mongoose=require('mongoose');
exports.addServices = async (req, res) => {
  try {
    const { modelId, locations, fuelType, PeriodicServices, model,
      AcServices, BatteriesService, TyresAndWheelsCare,
      DentingAndPainting, DetailsServicing, CarSpaCleaning, CarInspections,
      WindshielsLight, SuspensionAndFitness, ClutchBodyParts,
      InsuranceAndClaims,SOS_Services,
    } = req.body;
   
    const newServices = new Services({
      modelId: modelId,
      locations: locations,
      model: model,
      fuelType: fuelType,
      PeriodicServices: PeriodicServices,
      AcServices: AcServices,
      BatteriesService: BatteriesService,
      TyresAndWheelsCare: TyresAndWheelsCare,
      DentingAndPainting: DentingAndPainting,
      DetailsServicing: DetailsServicing,
      CarSpaCleaning: CarSpaCleaning,
      CarInspections: CarInspections,
      WindshielsLight: WindshielsLight,
      SuspensionAndFitness: SuspensionAndFitness,
      ClutchBodyParts:ClutchBodyParts,
      InsuranceAndClaims:InsuranceAndClaims,
      SOS_Services:SOS_Services
    });
    const savedCarServices = await newServices.save();
    res.json(savedCarServices);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error creating car model' });
  }
}
//get services by the _id
exports.getServicesForAdmin = async (req, res) => {
  try {
    const service = await Services.find()
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.getServicesByLocationsAndModelIdAndFuelType = async (req, res) => {
  try {
    // Construct the filter object based on the provided parameters
    const { locations, modelId, fuelType } = req.params;
   
    // Construct the filter object based on the provided params
    const filter = {};
    if (locations) filter.locations = { $in: locations.split(',') };
    if (modelId) filter.modelId = modelId;
    if (fuelType) filter.fuelType = fuelType;
    const getData = await Services.find(filter)
     // .populate('locations modelId fuelType')
      .populate({
        path: 'modelId', // Populate the modelId field to get the model details
        select: 'modelName', // Select only the modelName field
      })
      .exec();
    if (!getData || getData.length === 0) {
      return res.status(404).json({ message: 'Services not found' });
    }
    res.json(getData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}
// all data
exports.getAllServicesData = async (req, res) => {
  try {
    const service = await Services.find()
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}
//update services
//get individual services by id
exports.getIndividualServiceDetailsById = async (req, res) => {
  const { _id, serviceId } = req.params
  try {
    const service = await Services.findOne({ _id })
      .populate({
        path: 'PeriodicServices AcServices BatteriesService TyresAndWheelsCare DentingAndPainting DetailsServicing CarSpaCleaning CarInspections WindshielsLight SuspensionAndFitness ClutchBodyParts InsuranceAndClaims SOS_Services',
      });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    // Define a function to find the correct subdocument based on serviceId
    const findSubdocument = (field) => {
      if (field && field._id.toString() === serviceId) {
        return field;
      }
      return null;
    };
    // Find the matched subdocument based on serviceId
    const matchedSubdocument =
      findSubdocument(service.PeriodicServices) ||
      findSubdocument(service.AcServices) ||
      findSubdocument(service.BatteriesService) ||
      findSubdocument(service.TyresAndWheelsCare) ||
      findSubdocument(service.DentingAndPainting) ||
      findSubdocument(service.DetailsServicing) ||
      findSubdocument(service.CarSpaCleaning) ||
      findSubdocument(service.CarInspections) ||
      findSubdocument(service.WindshielsLight) ||
      findSubdocument(service.SuspensionAndFitness) ||
      findSubdocument(service.ClutchBodyParts) ||
      findSubdocument(service.InsuranceAndClaims) ||
      findSubdocument(service.SOS_Services);
    if (!matchedSubdocument) {
      return res.status(404).json({ message: 'Subdocument not found' });
    }
    res.json(matchedSubdocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.getSingleServiceDetailsFromIndividualService = async (req, res) => {
  const { _id, serviceId, singleId } = req.params
  try {
    const service = await Services.findOne({ _id })
      .populate({
        path: 'PeriodicServices AcServices BatteriesService TyresAndWheelsCare DentingAndPainting DetailsServicing CarSpaCleaning CarInspections WindshielsLight SuspensionAndFitness ClutchBodyParts InsuranceAndClaims SOS_Services',
      });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    // Define a function to find the correct subdocument based on serviceId
    const findSubdocument = (field) => {
      return field && field._id.toString() === serviceId ? field : null;
    };
    // Find the matched subdocument based on serviceId
    const matchedSubdocument =
      findSubdocument(service.PeriodicServices) ||
      findSubdocument(service.AcServices) ||
      findSubdocument(service.BatteriesService) ||
      findSubdocument(service.TyresAndWheelsCare) ||
      findSubdocument(service.DentingAndPainting) ||
      findSubdocument(service.DetailsServicing) ||
      findSubdocument(service.CarSpaCleaning) ||
      findSubdocument(service.CarInspections) ||
      findSubdocument(service.WindshielsLight) ||
      findSubdocument(service.SuspensionAndFitness) ||
      findSubdocument(service.ClutchBodyParts) ||
      findSubdocument(service.InsuranceAndClaims) ||
      findSubdocument(service.SOS_Services);
    if (!matchedSubdocument) {
      return res.status(404).json({ message: 'Subdocument not found' });
    }
    // Iterate through the keys to find the correct service by singleId
    for (const key in matchedSubdocument) {
      if (key !== '_id' && matchedSubdocument[key] && matchedSubdocument[key]._id && matchedSubdocument[key]._id.toString() === singleId) {
        return res.json(matchedSubdocument[key]);
      }
    }
    // If no match is found
    return res.status(404).json({ message: 'Single object not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}
// add new service in already existed service
exports.AddNewServiceinAlreadyExistedService = async (req, res) => {
  const { modelId, fuelType, serviceId } = req.params;
  const newData = req.body.Air_Filling
  
  try {
    // Find the document based on modelId and fuelType
    const existingDocument = await Services.findOne({ modelId, fuelType })
      .populate({
        path: 'PeriodicServices AcServices BatteriesService TyresAndWheelsCare DentingAndPainting DetailsServicing CarSpaCleaning CarInspections WindshielsLight SuspensionAndFitness ClutchBodyParts InsuranceAndClaims SOS_Services',
      });
    if (!existingDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    const findSubdocument = (field) => {
      return field && field._id.toString() === serviceId ? field : null;
    };
    // Find the matched subdocument based on serviceId
    const matchedSubdocument =
      findSubdocument(existingDocument.PeriodicServices) ||
      findSubdocument(existingDocument.AcServices) ||
      findSubdocument(existingDocument.BatteriesService) ||
      findSubdocument(existingDocument.TyresAndWheelsCare) ||
      findSubdocument(existingDocument.DentingAndPainting) ||
      findSubdocument(existingDocument.DetailsServicing) ||
      findSubdocument(existingDocument.CarSpaCleaning) ||
      findSubdocument(existingDocument.CarInspections) ||
      findSubdocument(existingDocument.WindshielsLight) ||
      findSubdocument(existingDocument.SuspensionAndFitness) ||
      findSubdocument(existingDocument.ClutchBodyParts) ||
      findSubdocument(existingDocument.InsuranceAndClaims) ||
      findSubdocument(existingDocument.SOS_Services);
    if (!matchedSubdocument) {
      return res.status(404).json({ message: 'Subdocument not found' });
    }
    // Add the new service data to the subdocument
    matchedSubdocument.newService = newData;
    // Save the changes to the database with suppressWarning
    await matchedSubdocument.save({ suppressWarning: true });
    res.json(matchedSubdocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
  exports.getServiceByModelId = async (req, res) => {
    try {
      // Assuming modelId is passed as a route parameter
      const { modelId } = req.params;
      // Check if modelId is provided in the request
      // Find services based on the provided modelId
      const services = await Services.findOne({modelId} );
      // Check if services are found
      if (!services || services.length === 0) {
        return res.status(404).json({ message: 'Services not found for the given modelId' });
      }
      // Return the found services
      res.json(services);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  exports.updateCarServiceByUsingModelIdAndLocationsAndFuelType = async (req, res) => {
    try {
      // Extract parameters from request
      const { locations, modelId, fuelType } = req.params;
      // Construct the filter object based on the provided parameters
      const filter = {};
      if (locations) filter.locations = { $in: locations.split(',') };
      if (modelId) filter.modelId = modelId;
      if (fuelType) filter.fuelType = fuelType;
      // Extract update data from request body
      const formData = req.body;
      // Exclude the _id field from the update operation
      delete formData._id;
      // Perform the update
      const updateResult = await Services.updateOne(filter, { $set: formData });
  
      // Check if any document was updated
      if (updateResult.nModified === 0) {
        return res.status(404).json({ message: 'No services found to update' });
      }
      // Optionally, you can return the updated document or a success message
      // const updatedService = await Services.findOne(filter);
      // res.json(updatedService, { message: 'Service updated successfully' });
      res.json({ message: 'Service updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  exports.getServicesByLocationModelFuelTypeAndField = async (req, res) => {
try {
      const { location, modelId, fuelType, field } = req.params;
      // Validate if the required parameters are present
      if (!location || !modelId || !fuelType || !field) {
        return res.status(400).json({ message: 'Please provide location, modelId, fuelType, and field in the route parameters' });
      }
      const service = await Services.findOne({
        locations: location,
        modelId: modelId,
        fuelType: fuelType,
      });
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      // Check if the specified field exists in the service object
      if (!service[field]) {
        return res.status(400).json({ message: `Field '${field}' not found in the service object` });
      }
      // Send only the specified field in the response
      res.json({ [field]: service[field] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };