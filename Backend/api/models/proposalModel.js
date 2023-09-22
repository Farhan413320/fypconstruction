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
