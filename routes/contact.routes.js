import express from "express";
import sgMail from "@sendgrid/mail";

const router = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/", async (req, res) => {
  const {
    name,
    email,
    phone,
    qualification,
    subject,
    lastInstitute,
    purpose,
    plan,
  } = req.body;

  try {
    const html = `
      <h2>New Contact Query</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Qualification:</strong> ${qualification}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Last Institute:</strong> ${lastInstitute || "-"}</p>
      <p><strong>Plan:</strong> ${plan}</p>
      <p><strong>Purpose:</strong><br/>${purpose}</p>
    `;

    const msg = {
      to: process.env.EMAIL_USER, // receive mail
      from: process.env.EMAIL_USER, // MUST be verified sender in SendGrid
      replyTo: email,
      subject: `New Contact Query – ${subject}`,
      html,
    };

    await sgMail.send(msg);

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("SendGrid Email Error:", err.response?.body || err);
    return res.status(500).json({ message: "Failed to send email" });
  }
});

export default router;
