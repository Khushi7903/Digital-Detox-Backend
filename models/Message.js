const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  room: String,
  sender: String,
  receiver: String,
  senderName: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
