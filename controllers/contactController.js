const nodemailer = require("nodemailer");

const sendContactForm = async (req, res) => {
  const { name, email, subject, query, message } = req.body;

  if (!name || !email || !query) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Suraksha Buddy Contact" <${process.env.EMAIL_USER}>`,
      to: "surakshabuddyindia@gmail.com",
      subject: `📩 New Contact Form Submission: ${subject || "No Subject"}`,
      html: `
        <h3>Contact Form Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Query:</strong> ${query}</p>
        <p><strong>Message:</strong> ${message || "No additional message"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Email failed to send" });
  }
};

module.exports = { sendContactForm };