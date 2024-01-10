const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  rating: {
    type: Number,
    min: 1, 
    max: 5, 
  },
  comment: {
    type: String,
  },
  customerName:{ 
    type: String,
  },
  productName:{ 
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
