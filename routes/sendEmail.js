const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/send-email", async (req, res) => {
  const { email, name, role } = req.body;

  const msg = {
    from: `"Suraksha Buddy Team" <${process.env.EMAIL_USER}>`,
    to: email,
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
    console.log("Email sent to:", email);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Email send error:", error.response ? error.response.body : error.message);
    res.status(500).json({ message: "Failed to send email." });
  }
});

module.exports = router;
