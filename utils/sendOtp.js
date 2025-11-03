const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendOtp = async (email, otp) => {
  try {
    const msg = {
      to: email, 
      from: {
        email: process.env.EMAIL_USER, 
        name: "Suraksha Buddy",
      },
      subject: "Your OTP Code - Suraksha Buddy",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Suraksha Buddy</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h3 style="color: #007bff;">${otp}</h3>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log("OTP sent successfully to:", email);
  } catch (err) {
    console.error("sendOtp error:", err.response?.body?.errors || err.message);
    throw err;
  }
};

