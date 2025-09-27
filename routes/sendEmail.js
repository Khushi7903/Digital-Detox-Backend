// const express = require("express");
// const nodemailer = require("nodemailer");
// const router = express.Router();
// const dotenv = require("dotenv");

// dotenv.config();

// router.post("/send-email", async (req, res) => {
//   const { email, name, role } = req.body;

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"Suraksha Buddy Team" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Thank You for Registering!",
//       html: `
//         <p>Dear ${name},</p>
//         <p>Thank you for showing interest in joining as a <strong>${role}</strong> at Suraksha Buddy 🛡️.</p>
//         <p>We truly appreciate your willingness to contribute. Our team will get back to you shortly if you are a good fit for these roles according to our policies.</p>
//         <p>Warm regards,<br/>Suraksha Buddy Team</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: "Email sent successfully." });
//   } catch (error) {
//     console.error("Email Error:", error);
//     res.status(500).json({ message: "Failed to send email." });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/send-email", async (req, res) => {
  const { email, name, role } = req.body;

  const msg = {
    to: email,
    from: `"Suraksha Buddy Team" <${process.env.EMAIL_USER}>`, // Verified sender in SendGrid
    subject: "Thank You for Registering!",
    html: `
      <p>Dear ${name},</p>
      <p>Thank you for showing interest in joining as a <strong>${role}</strong> at Suraksha Buddy 🛡️.</p>
      <p>We truly appreciate your willingness to contribute. Our team will get back to you shortly if you are a good fit for these roles according to our policies.</p>
      <p>Warm regards,<br/>Suraksha Buddy Team</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Email sent to:", email);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("❌ Email send error:", error.response ? error.response.body : error.message);
    res.status(500).json({ message: "Failed to send email." });
  }
});

module.exports = router;
