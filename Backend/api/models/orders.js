const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userName: {
    type: String,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
      },
    },
  ],
  Totalpayment: {
    type: Number,
  },
  Productname: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orderStatus: {
    type: [
      {
        type: String,
        enum: ['Pending', 'Cancelled','Approved', 'Declined', 'Delivered'],
      },
    ],
    default: ['Pending'],
  },
  paymentMethod: {
    type: String,
  },
  customerAddress: {
    type: String,
  },
  customerPhoneNumber: {
    type: String, 
  },
  customerCity: {
    type: String, 
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
