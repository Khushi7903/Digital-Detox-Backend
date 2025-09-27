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
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Your SendGrid API key in .env

exports.sendOtp = async (email, otp) => {
  try {
    const msg = {
      from: `"Suraksha Buddy" <${process.env.EMAIL_USER}>`, // Verified sender in SendGrid
      to: email,
      subject: "Your OTP Code",
      html: `<h3>Your OTP is: <strong>${otp}</strong></h3>`,
    };

    await sgMail.send(msg);
    console.log("✅ OTP sent to:", email);
  } catch (err) {
    console.error("❌ sendOtp error:", err.response ? err.response.body : err.message);
    throw err;
  }
};
