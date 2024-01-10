const mongoose = require('mongoose');
const vendorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  payment: {
    type: Number,
    default: 0,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
  },
  province: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  accountstatus: {
    type: String,
    enum: ['approved', 'suspended'],
  },
  // profilePicture: {
  //   data: Buffer, // Store image data as a Buffer
  //   contentType: String, // Store image content type (e.g., 'image/jpeg')
  // },
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
