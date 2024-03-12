const KeySpecModel = require('../../models/user/keySpecs')

exports.addKeySpecs = async (req, res) => {
    const { modelId,BrandId,name, Value } = req.body;
    let Image = '';

    if (req.file) {
        Image = `/public/${req.file.filename}`
    }
    if (!Array.isArray(modelId)) {
        return res.status(400).json({ error: 'model must be an array' });
      }
    const newKeySpecs = KeySpecModel({
        BrandId,
        modelId,
        name,
        Value,
        Image
    })
    try {
        const savedKeySpec = await newKeySpecs.save();
        res.json(savedKeySpec);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to add the KeySpecs', details: err.message });
    }
}

exports.getKeySpecs = async (req, res) => {
    try {
      const BrandId = req.params.BrandId;

      // Find brands that have the specified location ID in their 'locations' array
      const KeySpecs = await KeySpecModel.find({ BrandId: BrandId });

      if (KeySpecs.length === 0) {
        return res.status(404).json({ message: 'No priceList found for the specified location' });
      }

      res.json({ message: 'PriceList found for the location', KeySpecs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve brands for the location' });
    }
  };
  exports.getKeySpecsByModel = async (req, res) => {
    try {
      const modelId = req.params.modelId;

      // Find brands that have the specified location ID in their 'locations' array
      const KeySpecs = await KeySpecModel.find({ modelId: modelId });

      if (KeySpecs.length === 0) {
        // return res.status(404).json({ message: 'No KeySpecs found for the specified Model' });
      }

      res.json({ message: 'KeySpecs found for the location', KeySpecs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve KeySpecs for the Model' });
    }
  };



exports.keySpecsBymodel = async (req, res) => {
    try {
      const modelId = req.params.modelId; // Assuming models is an array of modelId strings
     
      // Find KeySpecs where modelId is in the array of models
      const KeySpecs = await KeySpecModel.find({ modelId: { $in: modelId } });
  
      console.log('Executed query:', { modelId: { $in: modelId } });
      console.log('Found KeySpecs:', KeySpecs);
  
      if (KeySpecs.length === 0) {
        return res.status(404).json({ message: 'No KeySpecs found for the specified Model' });
      }
  
      res.json({ message: 'KeySpecs found for the Model', KeySpecs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve KeySpecs for the Model' });
    }
  };
  