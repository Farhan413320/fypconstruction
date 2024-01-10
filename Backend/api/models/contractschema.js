const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor', 
    },
    userBankAccountHolder: {
      type: String,
    },
    userBankAccountNumber: {
      type: String,
    },
    proofOfPaymentUrl: {
      type: String,
    },
    comment: {
      type: String,
    },
    adminFee: {
      type: Number,
    },
    totalBidAmount: {
      type: Number,
    },
    proposalDetails: {
      title: {
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
      },
      categories: {
        type: [String],
      },
      description: {
        type: String,
      },
     
    },
    contractStatus: {
      type: String,
      enum: ['pending', 'approved', 'cancelled', 'declined'],
      default: 'pending',
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
 
);

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
