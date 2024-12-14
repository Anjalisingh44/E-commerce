const mongoose = require('mongoose');

// Define the Product schema
const product = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    
  },
  description: {
    type: String,
    required: true,
    
  },
  price: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 0) {
        throw new Error("Price must be a positive number");
      }
    }
  },
 
  size: {
    type: String, // Example: ['S', 'M', 'L', 'XL']
    required: true,
  },
 
  images: {
    type: [String], 
    required: true,
  },
 
},
{
    timestamps:true
});


const products = mongoose.model('products', product);

module.exports = products;
