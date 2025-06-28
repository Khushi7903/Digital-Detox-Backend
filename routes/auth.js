// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, id } = req.body;

    if (!name || !email || !password || !role || !id) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role, id });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please provide email, password, and role." });
    }

    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ message: "Invalid email or role." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password." });

    res.status(200).json({ message: `Welcome back, ${role.charAt(0).toUpperCase() + role.slice(1)}!` });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
});


router.get("/mentors", async (req, res) => {
  try {
    const mentors = await User.find({ role: { $in: ["mentor", "buddy"] } });
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch mentors" });
  }
});

module.exports = router;
