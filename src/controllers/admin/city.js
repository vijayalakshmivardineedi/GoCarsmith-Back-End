const City = require('../../models/admin/city')
const slugify = require("slugify");
const shortid = require("shortid");

exports.getChildCities = (req, res) => {
  // Assuming you're using the 'parentId' parameter to identify child locations
  const parentId = req.params.parentId;
  City.find({ parentId })
    .exec((error, childLocations) => {
      if (error) return res.status(400).json({ error });
      if (childLocations.length > 0) {
        return res.status(200).json({ childLocations });
      } else {
        return res.status(404).json({ message: 'No child locations found.' });
      }
    });
};

function createLocationTree(locations, parentId = null) {
  const locationList = [];
  let location;

  if (parentId === null) {
    location = locations.filter((loc) => loc.parentId === null || loc.parentId === undefined);
  } else {
    location = locations.filter((loc) => loc.parentId == parentId); // Use == to handle both null and undefined
  }

  for (let loc of location) {
    locationList.push({
      _id: loc._id,
      name: loc.name,
      state: loc.state,
      country: loc.country,
      slug: loc.slug,
      parentId: loc.parentId,
      latitude: loc.latitude,
      longitude: loc.longitude,
      image:loc.image,
      // Add other location properties as needed
      children: createLocationTree(locations, loc._id),
    });
  }

  return locationList;
}

exports.addCity = (req, res) => {
  const { name, state, country, latitude, longitude } = req.body;

  let image = ''; // Initialize image as an empty string

  if (req.file) {
    // Assuming you're using a middleware that uploads a single image file
    image = `/public/${req.file.filename}`;
  }

  const locationObj = {
    name,
    state,
    country,
    slug: `${slugify(name)}-${shortid.generate()}`,
    latitude,
    longitude,
    createdBy: req.user._id,
    image, // Assign the image to the location object
  };

  if (req.body.parentId) {
    locationObj.parentId = req.body.parentId;
  }

  const location = new City(locationObj);

  location.save((error, newLocation) => {
    if (error) return res.status(400).json({ error });
    if (newLocation) {
      return res.status(201).json({ location: newLocation });
    }
  });
};
exports.getLocations = (req, res) => {
  City.find({}).exec((error, locations) => {
    if (error) return res.status(400).json({ error });
    if (locations) {
      const locationList = createLocationTree(locations);
      res.status(200).json({ locationList });
    }
  });
};

exports.updateCity= async (req, res) => {
  try {
    const locationId = req.params.id;
    const updatedData = req.body;

    // Check if there's a file in the request
    if (req.file) {
      // Assuming the image field is named 'image' in your City schema
      updatedData.image = `/public/${req.file.filename}`;
    }

    // Find and update the city by ID
    const updatedCity = await City.findByIdAndUpdate(locationId, updatedData, { new: true });

    res.json({ success: true, data: updatedCity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Could not update city.' });
  }
};