const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', 
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor', 
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', 
  },
  payment: {
    type: Number,
    required: true,
  },
  timeCreation: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
