const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", authController.login);
router.post("/verify-login-otp", authController.verifyLoginOtp);

module.exports = router;
