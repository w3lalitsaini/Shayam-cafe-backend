// backend/utils/sendEmail.js
import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";
import {
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  RESET_PASSWORD_EMAIL_TEMPLATE,
  SIGNIN_EMAIL_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_VERIFIED_EMAIL_TEMPLATE,
  NEW_ORDER_ADMIN_TEMPLATE,
} from "./emailtemplate.js";

// 🔑 Init Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Sender details
const FROM_NAME = "Shree Shayam Café";
const FROM_EMAIL = process.env.EMAIL_FROM || "onboarding@resend.dev";
const fromAddress = `${FROM_NAME} <${FROM_EMAIL}>`;

/* =========================
   GENERIC EMAIL HELPER
========================= */
export const sendEmail = async ({ to, subject, html, text }) => {
  const { error } = await resend.emails.send({
    from: fromAddress,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("❌ Generic email send error:", error);
    throw new Error("Could not send email");
  }

  console.log("✅ Generic email sent to", to);
};

/* =========================
   SEND VERIFICATION EMAIL
========================= */
export const sendVerificationEmail = async (email, otp) => {
  const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp);

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: "Verify your email – Shree Shayam Café",
    html,
  });

  if (error) {
    console.error("❌ Email OTP send error:", error);
    throw new Error("Could not send verification email");
  }

  console.log("✅ Verification email sent to", email);
};

/* =========================
   SEND WELCOME EMAIL
========================= */
export const sendWelcomeEmail = async (name, email) => {
  const html = WELCOME_VERIFIED_EMAIL_TEMPLATE(name);

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: "🎉 Welcome to Shree Shayam Café",
    html,
  });

  if (error) {
    console.error("❌ Welcome email error:", error);
    return;
  }

  console.log("✅ Welcome email sent to", email);
};

/* =========================
   LOGIN ALERT MAIL
========================= */
export const sendSigninEmail = async (req, name, email) => {
  const html = SIGNIN_EMAIL_TEMPLATE(name, new Date().toLocaleString(), req.ip);

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: "New login alert – Shree Shayam Café",
    html,
  });

  if (error) {
    console.error("❌ Sign-in email error:", error);
    return;
  }

  console.log("✅ Sign-in alert email sent to", email);
};

/* =========================
   FORGET PASSWORD LINK
========================= */
export const sendForgetPasswordEmail = async (email, resetUrl) => {
  const html = RESET_PASSWORD_EMAIL_TEMPLATE(resetUrl);

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: "Reset your password – Shree Shayam Café",
    html,
  });

  if (error) {
    console.error("❌ Reset email error:", error);
    throw new Error("Could not send reset password email");
  }

  console.log("✅ Password reset link email sent to", email);
};

/* =========================
   RESET SUCCESS MAIL
========================= */
export const sendResetPasswordEmail = async (name, email) => {
  const html = PASSWORD_RESET_SUCCESS_TEMPLATE(name);

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: "Password changed successfully ✔️",
    html,
  });

  if (error) {
    console.error("❌ Reset success email error:", error);
    return;
  }

  console.log("✅ Reset success email sent to", email);
};

/* =========================
   NEW ORDER → ADMIN NOTIFY
========================= */
export const sendNewOrderEmailToAdmin = async (order) => {
  const adminEmail =
    process.env.ADMIN_EMAIL ||
    process.env.EMAIL_USER ||
    "sainilalit275@gmail.com";

  const html = NEW_ORDER_ADMIN_TEMPLATE(order);

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: adminEmail,
    subject: `New order received – ${order._id}`,
    html,
  });

  if (error) {
    console.error("❌ Error sending new order email:", error);
    return;
  }

  console.log("✅ New order email sent to admin:", adminEmail);
};
