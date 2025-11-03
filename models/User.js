const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,

  password: {
    type: String,
    required: function () {
      // Only require password for non-Google users
      return !this.googleAuth;
    },
    validate: {
      validator: function (v) {
        // Allow empty password for Google users
        if (this.googleAuth) return true;
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v);
      },
      message:
        "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.",
    },
  },

  role: { type: String, enum: ["student", "parent", "teacher"], required: true },

  otp: String,
  otpExpiry: Date,
  verified: { type: Boolean, default: false },
  resetOtp: String,
  resetOtpExpires: Date,

  newPassword: {
    type: String,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v);
      },
      message:
        "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.",
    },
  },

  // ✅ Add these two fields
  googleAuth: { type: Boolean, default: false },
  profilePic: { type: String },
});

module.exports = mongoose.model("User", userSchema);
