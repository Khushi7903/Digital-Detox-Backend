const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", authController.login);
router.post("/verify-login-otp", authController.verifyLoginOtp);
router.post("/forgot-password",authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/google", authController.googleLogin);

router.get("/profile", authMiddleware, authController.getUserProfile);

router.put("/profile", authMiddleware, authController.updateUserProfile);

module.exports = router;
