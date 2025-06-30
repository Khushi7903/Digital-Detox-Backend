const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ['student', 'parent', 'teacher'], required: true },
  otp: String,
  otpExpiry: Date,
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
