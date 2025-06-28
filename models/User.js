const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["student", "teacher", "mentor", "buddy", "parent"],
    required: true,
  },
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
