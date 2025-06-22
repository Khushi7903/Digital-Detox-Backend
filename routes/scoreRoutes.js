// backend/routes/scoreRoutes.js
const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

// POST /api/score - Save score
router.post("/", async (req, res) => {
  try {
    const { userId, score, zone, feedback } = req.body;
    const newScore = new Score({ userId, score, zone, feedback });
    await newScore.save();
    res.status(200).json({ message: "Score saved successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to save score." });
  }
});

// GET /api/score/:userId - Get previous scores
router.get("/:userId", async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(scores);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch scores." });
  }
});

module.exports = router;
