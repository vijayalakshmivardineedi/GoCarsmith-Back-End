
const mongoose=require('mongoose');

const AddToCartSchema=new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' ,
        required: true
      },
      listOfServices: [{
        name: String,
        price: Number,
      }],


})

const AddToCartModel=mongoose.model("Cart",AddToCartSchema)
module.exports=AddToCartModel;