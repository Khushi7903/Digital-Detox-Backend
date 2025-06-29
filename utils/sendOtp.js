const nodemailer = require("nodemailer");

exports.sendOtp = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // set this in your .env
        pass: process.env.EMAIL_PASS, // set this in your .env (App Password if Gmail)
      },
    });

    await transporter.sendMail({
      from: `"Suraksha Buddy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `<h3>Your OTP is: <strong>${otp}</strong></h3>`,
    });

    console.log("✅ OTP sent to:", email);
  } catch (err) {
    console.error("❌ sendOtp error:", err.message);
    throw err;
  }
};
