const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "participants.userType",
      },
      userType: {
        type: String,
        enum: ["Vendor", "User"],
        required: true,
      },
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // Reference to the Message model
    },
  ],
 
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
