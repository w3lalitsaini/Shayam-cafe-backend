// backend/routes/contactRoutes.js
import express from "express";
import ContactMessage from "../models/ContactMessage.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sendEmail } from "../utils/emailService.js";

const router = express.Router();

// POST /api/contact  → public (Contact page form)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // ✅ Better validation: email is important for reply
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required",
      });
    }

    // 1) Save to DB
    const contact = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
      // status will default to "New" from schema (see model below)
    });

    // 2) Email notification to admin (non-blocking: errors are logged only)
    const adminTo = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    if (adminTo) {
      const emailSubject = subject
        ? `[Contact] ${subject} - ${name}`
        : `[Contact] New message from ${name}`;

      const textBody = `
New contact form submission:

Name: ${name}
Email: ${email}
Phone: ${phone || "-"}

Subject: ${subject || "-"}

Message:
${message}

Submitted at: ${new Date(contact.createdAt).toLocaleString()}
      `;

      const htmlBody = `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "-"}</p>
        <p><strong>Subject:</strong> ${subject || "-"}</p>
        <p><strong>Message:</strong></p>
        <p>${(message || "").replace(/\n/g, "<br/>")}</p>
        <p style="margin-top:16px;font-size:12px;color:#777;">
          Submitted at: ${new Date(contact.createdAt).toLocaleString()}
        </p>
      `;

      try {
        await sendEmail({
          to: adminTo,
          subject: emailSubject,
          text: textBody,
          html: htmlBody,
        });
      } catch (emailErr) {
        console.error("❌ Contact email send error:", emailErr);
        // Do NOT fail the request just because email failed
      }
    }

    res.status(201).json({
      message: "Message received. We'll get back to you soon.",
      contactId: contact._id,
    });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/contact  → admin, list messages
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const messages = await ContactMessage.find({})
      .sort({ createdAt: -1 })
      .lean();
    res.json(messages);
  } catch (err) {
    console.error("Get contact messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/contact/:id/status  → admin, update status (e.g. New → Seen → Replied)
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update contact status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
