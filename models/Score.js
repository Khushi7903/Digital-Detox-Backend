const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    userId: String,
    score: Number,
    zone: String,
    feedback: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);