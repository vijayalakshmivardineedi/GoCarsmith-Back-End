const mongoose = require('mongoose');

const carSchemaModel=new mongoose.Schema({
    
        BrandId: {
             type: mongoose.Schema.Types.ObjectId,
             ref: "Brands",
             required: true,
         },
         model: {
             type: String,
             required: true,
         },
         locations: [
             {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: 'City',
             }
         ],
         modelImage: {
             type: String, 
             required: true 
         },
         slug: String,
         createdBy: {
             type: mongoose.Schema.Types.ObjectId,
             ref: "Admin",
             required: true,
         },
         fuelType:{
             type:[String],
             enum:["Petrol","CNG","Diesel","Electric"],
             default:["Petrol"]
         } 
     
        },{timestamps: true}
    
)
const CarModel=mongoose.model('carModel', carSchemaModel);
module.exports=CarModel;