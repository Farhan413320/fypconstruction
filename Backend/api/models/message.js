const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "senderModel",
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "recipientModel",
  },
  senderModel: {
    type: String,
    enum: ["User", "Vendor"],
    required: true,
  },
  recipientModel: {
    type: String,
    enum: ["User", "Vendor"],
    required: true,
  },
  messageType: {
    type: String,
    enum: ["text", "image"],
    required: true,
  },
  message: {
    type: String,
   
  },
  imageUrl: {
    type: String,
   
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;


