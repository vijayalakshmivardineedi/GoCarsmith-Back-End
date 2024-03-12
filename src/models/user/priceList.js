const mongoose = require('mongoose');

const priceListSchema = new mongoose.Schema({
  locations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  }],
  BrandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brands',
    required: true,
  },
  LabelName: {
    type: String
  },
  List:
  [{ServiceType: {
    type: String,
    required: true,
  },
  Price: {
    type: String,
    required: true,
  },
  Total: {
    type: Number,
    required: true,
  },
  Saving: {
    type: Number, // Change the type to Number for percentage savings
    required: true,
  },}]


});

const PriceListModel = mongoose.model('PriceList', priceListSchema);

module.exports = PriceListModel;
