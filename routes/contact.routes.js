import express from "express";
import sgMail from "@sendgrid/mail";

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

  // Set API key fresh on each request so Render env vars are always picked up
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.EMAIL_USER;

  console.log("[Contact] SENDGRID_API_KEY present:", !!apiKey);
  console.log("[Contact] EMAIL_USER:", fromEmail);

  if (!apiKey) {
    console.error("[Contact] SENDGRID_API_KEY is missing from environment");
    return res.status(500).json({ message: "Email service not configured" });
  }

  sgMail.setApiKey(apiKey);

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
      to: fromEmail,
      from: fromEmail, // MUST be a verified sender in SendGrid
      replyTo: email,
      subject: `New Contact Query – ${subject}`,
      html,
    };

    const [response] = await sgMail.send(msg);
    console.log("[Contact] SendGrid response status:", response?.statusCode);

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    const errBody = err.response?.body;
    console.error("[Contact] SendGrid error — HTTP status:", err.code);
    console.error("[Contact] SendGrid error — body:", JSON.stringify(errBody, null, 2));
    console.error("[Contact] SendGrid error — message:", err.message);
    return res.status(500).json({
      message: "Failed to send email",
      detail: errBody?.errors?.[0]?.message,
    });
  }
});

export default router;
