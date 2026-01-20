import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

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
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // contact@edudarshi.in
        pass: process.env.EMAIL_PASS, // email password
      },
    });

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

    await transporter.sendMail({
      from: `"EduDarshi Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Query – ${subject}`,
      html,
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ message: "Failed to send email" });
  }
});

export default router;
