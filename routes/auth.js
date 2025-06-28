const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Sign up
router.post("/signup", async (req, res) => {
  try {
    const { name, id, email, password, role, phone } = req.body;

    if (!name || !id || !email || !password || !role || !phone) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const existingUser = await User.findOne({ $or: [{ id }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User ID or Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      id,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error. Try again." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { id, email, password, role, phone } = req.body;

    if (!id || !email || !password || !role || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ id, email, role, phone });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password." });

    res.status(200).json({ message: `Welcome back, ${role}!` });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed." });
  }
});

// Mentor list (optional)
router.get("/mentors", async (req, res) => {
  try {
    const mentors = await User.find({ role: { $in: ["mentor", "buddy"] } });
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch mentors" });
  }
});

module.exports = router;
