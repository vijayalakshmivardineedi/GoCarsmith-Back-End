const PriceListModel = require('../../models/user/priceList');
const City = require('../../models/admin/city')

exports.addPriceList = async (req, res) => {
  try {
     
      const { locations, BrandId, LabelName,List } = req.body;

    // Validate that 'locations' is an array
    if (!Array.isArray(locations)) {
      return res.status(400).json({ error: 'Locations must be an array' });
    }

    // Convert city names to corresponding MongoDB ObjectId
    const locationObjectIds = await City.find({ name: { $in: locations } }).distinct('_id');

    // Create a new price list entry
    const newPriceList = new PriceListModel({
      locations: locationObjectIds,
      BrandId: BrandId,
      LabelName: LabelName,
      List
    });

    // Save the new entry to the database
    await newPriceList.save();

    // Send a success response
    res.status(201).json({ message: 'Price list entry added successfully', data: newPriceList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.priceLocation = async (req, res) => {
    try {
      const location = req.params.location;

      // Find brands that have the specified location ID in their 'locations' array
      const pricelists = await PriceListModel.find({ locations: location });

      if (pricelists.length === 0) {
        return res.status(404).json({ message: 'No priceList found for the specified location' });
      }

      res.json({ message: 'PriceList found for the location', pricelists });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve brands for the location' });
    }
  };
  exports.priceByLocationByBrand = async (req, res) => {
  try {
    const location = req.params.location;
    const BrandId = req.params.BrandId;

    // Find brands that have the specified location ID in their 'locations' array
    const pricelists = await PriceListModel.find({ locations: location, BrandId: BrandId })
      .populate('locations', 'name') // Populate the 'locations' field with the 'name' property
      .populate('BrandId', 'brandName'); // Populate the 'BrandId' field with the 'brandName' property

    if (pricelists.length === 0) {
      return res.status(404).json({ message: 'No priceList found for the specified location and brand' });
    }

    res.json({ message: 'PriceList found for the location and brand', pricelists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve brands for the location' });
  }
};
exports.getPriceListByLocationBrandLabel = async (req, res) => {
  try {
    const location = req.params.location;
    const BrandId = req.params.BrandId;
    const LabelName = req.params.LabelName;

    // Find price lists that match the specified location, BrandId, and LabelName
    const pricelists = await PriceListModel.find({
      locations: { $in: [location] },
      BrandId: BrandId,
      LabelName: LabelName,
    })
      .populate('locations', 'name')
      .populate('BrandId', 'brandName')
      .populate('LabelName', 'LabelName');

    if (pricelists.length === 0) {
      return res.status(404).json({ message: 'No priceList found for the specified location and brand' });
    }

    res.json({ message: 'PriceList found for the location, brand, and label', pricelists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve price lists' });
  }
};
