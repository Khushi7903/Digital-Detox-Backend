const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtp } = require("../utils/sendOtp");
const { OAuth2Client } = require("google-auth-library");


// 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Signup 
exports.signup = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ msg: "User already exists" });

    if(!strongPasswordRegex.test(password)) {
      return res.status(400).json({ msg: "Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character." });
    }
    
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
    console.error("Sign up error:", err);
    res.status(500).json({ msg: "Signup error", error: err.message });
  }
};

// Signup OTP
exports.verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ msg: "OTP verified" });
  } catch (err) {
    res.status(500).json({ msg: "OTP verification error", error: err.message });
  }
};

// Login 
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
    res.status(500).json({ msg: "Login error", error: err.message });
  }
};

// Verify Login OTP
exports.verifyLoginOtp = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, "secret", { expiresIn: "1d" });
    res.status(200).json({ msg: "Login success", token });
  } catch (err) {
    res.status(500).json({ msg: "OTP login error", error: err.message });
  }
};

// ---------------- FORGOT PASSWORD (Send OTP via SendGrid) ----------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = generateOTP();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // ✅ Send password reset OTP via SendGrid
    await sendOtp(email, otp);

    res.status(200).json({ msg: "Password reset OTP sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ---------------- RESET PASSWORD ----------------
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    res.status(200).json({ msg: "Password reset successful." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Auth Login
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify token from Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await User.create({
        name,
        email,
        password: null,
        role: "student", // or infer from UI
        googleAuth: true,
        profilePic: picture,
      });
    }

    // Generate JWT
    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      msg: "Google login successful",
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.profilePic,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ msg: "Google login failed" });
  }
};
