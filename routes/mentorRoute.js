const express = require("express");
const Mentor = require("../models/Mentor.js");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      email,
      expertise,
      experience,
      preferredTime,
      description,
      userType,
    } = req.body;

    if (
      !fullName ||
      !mobileNumber ||
      !email ||
      !expertise ||
      !experience ||
      !preferredTime ||
      !userType
    ) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const newMentor = new Mentor({
      fullName,
      mobileNumber,
      email,
      expertise,
      experience,
      preferredTime,
      description,
      userType,
    });

    await newMentor.save();
    res.status(201).json({ message: "Mentor registered successfully." });
  } catch (error) {
    console.error("Error in mentor registration:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ Use CommonJS export
module.exports = router;
