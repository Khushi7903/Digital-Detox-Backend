// const nodemailer = require("nodemailer");

// exports.sendOtp = async (email, otp) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // set this in your .env
//         pass: process.env.EMAIL_PASS, // set this in your .env (App Password if Gmail)
//       },
//     });

//     await transporter.sendMail({
//       from: `"Suraksha Buddy" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your OTP Code",
//       html: `<h3>Your OTP is: <strong>${otp}</strong></h3>`,
//     });

//     console.log("✅ OTP sent to:", email);
//   } catch (err) {
//     console.error("❌ sendOtp error:", err.message);
//     throw err;
//   }
// };


const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");

dotenv.config();

// Set your SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendOtp = async (email, otp) => {
  try {
    const msg = {
      to: email, // Receiver
      from: {
        email: process.env.SENDGRID_VERIFIED_EMAIL, // Must be verified on SendGrid
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
    console.log("✅ OTP sent successfully to:", email);
  } catch (err) {
    console.error("❌ sendOtp error:", err.response?.body?.errors || err.message);
    throw err;
  }
};

