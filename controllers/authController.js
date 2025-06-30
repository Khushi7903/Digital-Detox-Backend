const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtp } = require("../utils/sendOtp");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.signup = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    await sendOtp(email, otp);
    res.status(200).json({ msg: "OTP sent to email", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Signup error", error: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || user.otp !== otp || user.otpExpiry < Date.now())
      return res.status(400).json({ msg: "Invalid or expired OTP" });

    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ msg: "OTP verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "OTP verification error", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Incorrect password" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOtp(email, otp);
    res.status(200).json({ msg: "OTP sent", userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Login error", error: err.message });
  }
};

exports.verifyLoginOtp = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || user.otp !== otp || user.otpExpiry < Date.now())
      return res.status(400).json({ msg: "Invalid or expired OTP" });

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1d",
    });

    res.status(200).json({ msg: "Login success", token });
  } catch (err) {
    res.status(500).json({ msg: "OTP login error", error: err.message });
  }
};
