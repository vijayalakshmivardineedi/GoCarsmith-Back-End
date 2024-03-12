const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  parentId:{
    type:String
},
  image: 
     { type: String } 
  ,
  latitude: {
    type: Number, // or 'Number' if you need more precision
    required: true,
  },
  longitude: {
    type: Number, // or 'Number' if you need more precision
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
