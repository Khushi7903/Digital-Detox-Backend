const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  expertise: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  preferredTime: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  userType: {
    type: String,
    enum: ["volunteer", "consultant"],
    required: true,
  },
}, {
  timestamps: true,
});

const Mentor = mongoose.model("Mentor", mentorSchema);
module.exports = Mentor;