const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    
  },
  category: {
    type: String,
  },
  subCategory: {
    type: String,
  },
  subtype: {
    type: String,
  },
  startDate: {
    type: Date, 
  },
  endDate: {
    type: Date, 
  },
  address: {
    type: String,
    required: true,
  },
  selectedCategories: {
    type: [String],
    required: true,
  },
  attachments: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['open', 'closed'], 
    default: 'open', 
  },
  bids: [
    {
      vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor', // Reference to the vendor who submitted the bid
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      details: {
        type: String,
        default: '',
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending', // Default status is "pending"
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
     
    },
  ],
});

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;
