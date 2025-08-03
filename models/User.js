const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v);
      },
      message: "Password must be at least 8 characters long, contain uppercase, lowercase",
    },
  },
  role: { type: String, enum: ['student', 'parent', 'teacher'], required: true },
  otp: String,
  otpExpiry: Date,
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
