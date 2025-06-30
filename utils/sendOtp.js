const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendOtp = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Suraksha Buddy",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
  } catch (err) {
    console.error("Failed to send OTP:", err);
    throw new Error("OTP sending failed");
  }
};
