const mongoose = require('mongoose');

const keySpecsSchema = new mongoose.Schema({
  BrandId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brands',
    required: true,
  },
  modelId:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarModel',
    required: true,
  }],
  name: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
    required: true,
  },
  Value: {
    type: String,
    required: true,
  }
});

const KeySpecModel = mongoose.model('KeySpec', keySpecsSchema);

module.exports = KeySpecModel;
