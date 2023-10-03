const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: true,
  },
  measurement: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  // Add other fields as needed for your specific use case
});

// Create the Product model using the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;