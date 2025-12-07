export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="color-scheme" content="dark light">
  <meta name="supported-color-schemes" content="dark light">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification Code</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #0d1117;
      color: #e6edf3;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #161b22;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      overflow: hidden;
      border: 1px solid #21262d;
    }
    .header {
      background: linear-gradient(90deg, #00ff87, #00b86b);
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      color: #0d1117;
    }
    .content {
      padding: 30px;
      text-align: center;
      line-height: 1.6;
    }
    .content p {
      color: #c9d1d9;
      margin: 10px 0;
    }
    .otp-box {
      display: inline-block;
      background: #0d1117;
      padding: 15px 30px;
      font-size: 30px;
      letter-spacing: 6px;
      font-weight: bold;
      border-radius: 10px;
      margin: 20px 0;
      border: 2px solid #00ff87;
      color: #00ff87;
      box-shadow: 0 0 10px rgba(0,255,135,0.6);
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #8b949e;
      background: #161b22;
      border-top: 1px solid #21262d;
    }
    @media (max-width: 600px) {
      .otp-box {
        font-size: 24px;
        letter-spacing: 4px;
        padding: 12px 20px;
      }
      .content {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Email Verification</h1>
    </div>
    <div class="content">
      <p>Hi,</p>
      <p>Use the OTP code below to verify your email address:</p>
      <div class="otp-box">{verificationCode}</div>
      <p>This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const WELCOME_VERIFIED_EMAIL_TEMPLATE = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="color-scheme" content="dark light">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome & Verified</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #0d1117;
      color: #e6edf3;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #161b22;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      overflow: hidden;
      border: 1px solid #21262d;
    }
    .header {
      background: linear-gradient(90deg, #00ff87, #00b86b);
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      color: #0d1117;
    }
    .content {
      padding: 30px;
      text-align: center;
      line-height: 1.6;
    }
    .content p {
      color: #c9d1d9;
      margin: 10px 0;
      font-size: 16px;
    }
    .status-box {
      display: inline-block;
      background: #00ff87;
      color: #0d1117;
      padding: 12px 24px;
      font-weight: bold;
      border-radius: 8px;
      font-size: 18px;
      box-shadow: 0 4px 10px rgba(0,255,135,0.4);
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #8b949e;
      background: #161b22;
      border-top: 1px solid #21262d;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Welcome Section -->
    <div class="header">
      <h1>Welcome 🎉</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>
      <p>We’re excited to have you on board! 🎊</p>
      <p>Here’s some great news...</p>
    </div>

    <!-- Verified Section -->
    <div class="header" style="background: linear-gradient(90deg, #4caf50, #2e7d32);">
      <h1>Account Verified ✅</h1>
    </div>
    <div class="content">
      <p>Your account has been successfully verified.</p>
      <div class="status-box">Verified</div>
      <p>You now have full access to all features on our platform.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const SIGNIN_EMAIL_TEMPLATE = (name, loginTime, ipAddress) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sign In Notification</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #0d1117;
      color: #e6edf3;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #161b22;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      border: 1px solid #21262d;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(90deg, #00ff87, #00b86b);
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      color: #0d1117;
    }
    .content {
      padding: 30px;
      text-align: center;
      line-height: 1.6;
    }
    .content p {
      color: #c9d1d9;
      font-size: 16px;
      margin: 10px 0;
    }
    .status-box {
      background: #00ff87;
      color: #0d1117;
      display: inline-block;
      padding: 12px 24px;
      font-weight: bold;
      border-radius: 8px;
      font-size: 16px;
      box-shadow: 0 4px 10px rgba(0,255,135,0.4);
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #8b949e;
      background: #161b22;
      border-top: 1px solid #21262d;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Sign In Successful</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>
      <p>You have successfully signed in to your account.</p>
      <div class="status-box">Login Confirmed</div>
      <p><strong>Time:</strong> ${loginTime}</p>
      <p><strong>IP Address:</strong> ${ipAddress}</p>
      <p>If this wasn’t you, please <a href="#" style="color:#00ff87;">secure your account</a> immediately.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const RESET_PASSWORD_EMAIL_TEMPLATE = (resetLink) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background-color: #0f172a;
      color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #1e293b;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(90deg, #16a34a, #065f46);
      padding: 20px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      color: #e2e8f0;
    }
    .reset-btn {
      display: inline-block;
      background: #22c55e;
      color: #ffffff !important;
      padding: 14px 28px;
      margin: 20px 0;
      font-size: 18px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 8px;
      transition: background 0.3s ease;
    }
    .reset-btn:hover {
      background: #16a34a;
    }
    .footer {
      padding: 15px;
      text-align: center;
      font-size: 12px;
      background: #0f172a;
      color: #94a3b8;
    }
    @media (max-width: 600px) {
      .content {
        padding: 20px;
      }
      .reset-btn {
        font-size: 16px;
        padding: 12px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <a href="${resetLink}" class="reset-btn">Reset Password</a>
      <p>If you didn’t request this, you can safely ignore this email. This link will expire in <strong>30 minutes</strong>.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="color-scheme" content="dark light">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset Successful</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #0d1117;
      color: #e6edf3;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #161b22;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      overflow: hidden;
      border: 1px solid #21262d;
    }
    .header {
      background: linear-gradient(90deg, #2196f3, #1976d2);
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      color: #0d1117;
    }
    .content {
      padding: 30px;
      text-align: center;
      line-height: 1.6;
    }
    .content p {
      color: #c9d1d9;
      margin: 10px 0;
      font-size: 16px;
    }
    .status-box {
      display: inline-block;
      background: #2196f3;
      color: #0d1117;
      padding: 12px 24px;
      font-weight: bold;
      border-radius: 8px;
      font-size: 18px;
      box-shadow: 0 4px 10px rgba(33,150,243,0.4);
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #8b949e;
      background: #161b22;
      border-top: 1px solid #21262d;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Password Reset Successful 🔑</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your password has been successfully reset. You can now log in with your new credentials.</p>
      <div class="status-box">Password Changed</div>
      <p>If this action was not performed by you, please contact our support team immediately.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const NEW_ORDER_ADMIN_TEMPLATE = (order) => {
  const itemsHtml = (order.items || [])
    .map(
      (item, index) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #2d333b; font-size: 14px; color: #e6edf3;">
            ${index + 1}.
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #2d333b; font-size: 14px; color: #e6edf3;">
            ${item.title || "Item"}
            <div style="font-size: 12px; color: #8b949e; margin-top: 2px;">
              Qty: ${item.quantity || 1}
            </div>
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #2d333b; font-size: 14px; color: #e6edf3; text-align: right;">
            ₹${item.price || 0}
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #2d333b; font-size: 14px; color: #e6edf3; text-align: right;">
            ₹${(item.price || 0) * (item.quantity || 1)}
          </td>
        </tr>
      `
    )
    .join("");

  const addressHtml = order.customerAddress
    ? String(order.customerAddress).replace(/\n/g, "<br/>")
    : "—";

  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN")
    : "Not available";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="color-scheme" content="dark light">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Order - Shree Shayam Café</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      background-color: #0d1117;
      color: #e6edf3;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 640px;
      margin: 32px auto;
      background: #161b22;
      border-radius: 12px;
      border: 1px solid #21262d;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.45);
    }
    .header {
      background: radial-gradient(circle at top left, #fbbf24, #f97316);
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      width: 40px;
      height: 40px;
      border-radius: 999px;
      border: 2px solid rgba(15,23,42,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(15,23,42,0.35);
      font-size: 22px;
    }
    .header-text h1 {
      margin: 0;
      font-size: 22px;
      color: #0f172a;
    }
    .header-text p {
      margin: 4px 0 0;
      font-size: 13px;
      color: rgba(15,23,42,0.9);
    }
    .content {
      padding: 24px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 4px;
      color: #e6edf3;
    }
    .section-sub {
      font-size: 12px;
      color: #8b949e;
      margin: 0 0 12px;
    }
    .order-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(148,163,184,0.1);
      border: 1px solid #374151;
      font-size: 12px;
      color: #e5e7eb;
      margin-top: 8px;
    }
    .order-pill span {
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(15,23,42,0.9);
      border: 1px solid rgba(148,163,184,0.4);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
    .grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 16px;
      margin-top: 16px;
    }
    .card {
      background: #0d1117;
      border-radius: 10px;
      border: 1px solid #21262d;
      padding: 14px 16px;
    }
    .label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #8b949e;
      margin-bottom: 4px;
    }
    .value {
      font-size: 14px;
      color: #e6edf3;
    }
    .value-sm {
      font-size: 13px;
      color: #c9d1d9;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #21262d;
    }
    .items-table thead {
      background: #111827;
    }
    .items-table th {
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 500;
      color: #9ca3af;
      text-align: left;
      border-bottom: 1px solid #2d333b;
    }
    .items-table th:last-child,
    .items-table td:last-child {
      text-align: right;
    }
    .totals {
      margin-top: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      background: #0b1120;
      border: 1px solid rgba(251,191,36,0.4);
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin-bottom: 4px;
      color: #e5e7eb;
    }
    .totals-row span:last-child {
      font-weight: 600;
    }
    .totals-row.total {
      font-size: 14px;
      margin-top: 4px;
      padding-top: 4px;
      border-top: 1px dashed rgba(148,163,184,0.6);
      color: #fde68a;
    }
    .cta {
      margin-top: 18px;
      text-align: center;
    }
    .cta a {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 999px;
      background: linear-gradient(90deg, #fbbf24, #f97316);
      color: #0f172a;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
    }
    .note {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 10px;
      text-align: center;
    }
    .footer {
      text-align: center;
      padding: 16px 12px 20px;
      font-size: 11px;
      color: #8b949e;
      background: #161b22;
      border-top: 1px solid #21262d;
    }
    .footer a {
      color: #fbbf24;
      text-decoration: none;
    }
    @media (max-width: 600px) {
      .container {
        margin: 16px;
      }
      .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="badge">☕</div>
      <div class="header-text">
        <h1>New order at Shree Shayam Café</h1>
        <p>Near CLC, Sikar, Rajasthan · ${createdAt}</p>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <p style="margin: 0 0 12px; font-size: 14px; color: #c9d1d9;">
        A new order has been placed. Please review the details below and start preparing it.
      </p>

      <div class="order-pill">
        <span>${order.status || "PENDING"}</span>
        <div>
          <div style="font-size: 12px; color: #e5e7eb;">
            Order ID: <strong>${order._id}</strong>
          </div>
          <div style="font-size: 11px; color: #9ca3af;">
            Source: ${order.source || "Online"}
          </div>
        </div>
      </div>

      <!-- Top Grid: Customer + Order meta -->
      <div class="grid">
        <div class="card">
          <div class="label">Customer</div>
          <div class="value">${order.customerName || "Guest"}</div>
          <div class="value-sm">
            Phone: ${order.customerPhone || "—"}
          </div>

          <div style="margin-top: 10px;">
            <div class="label">Address / Instructions</div>
            <div class="value-sm">
              ${addressHtml}
              ${
                order.notes
                  ? `<div style="margin-top:8px; font-size:12px; color:#fbbf24;">
                       Note: ${String(order.notes)}
                     </div>`
                  : ""
              }
            </div>
          </div>
        </div>

        <div class="card">
          <div class="label">Order Summary</div>
          <div class="value-sm">
            Items: ${(order.items || []).length || 0}
          </div>
          <div class="value-sm">
            Type: ${order.source || "Online"}
          </div>
          <div class="value-sm">
            Status: ${order.status || "Pending"}
          </div>
          <div style="margin-top: 10px;">
            <div class="label">Total amount</div>
            <div class="value" style="font-size:18px; color:#fde68a;">
              ₹${order.totalAmount || 0}
            </div>
          </div>
        </div>
      </div>

      <!-- Items table -->
      <div style="margin-top: 18px;">
        <p class="section-title">Items in this order</p>
        <p class="section-sub">
          Each row shows item name, quantity, rate and line total.
        </p>

        <table class="items-table" role="presentation">
          <thead>
            <tr>
              <th style="width: 8%;">#</th>
              <th>Item</th>
              <th style="width: 20%;">Rate</th>
              <th style="width: 24%;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${
              itemsHtml ||
              `<tr>
                <td colspan="4" style="padding: 10px 12px; font-size: 13px; color: #9ca3af; text-align: center;">
                  No items found for this order.
                </td>
              </tr>`
            }
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal</span>
            <span>₹${order.subtotal || order.totalAmount || 0}</span>
          </div>
          ${
            order.taxAmount
              ? `<div class="totals-row">
                   <span>Tax</span>
                   <span>₹${order.taxAmount}</span>
                 </div>`
              : ""
          }
          <div class="totals-row total">
            <span>Grand Total</span>
            <span>₹${order.totalAmount || 0}</span>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="cta">
        <a href="${
          process.env.ADMIN_DASHBOARD_URL || "#"
        }" target="_blank" rel="noopener noreferrer">
          Open Shree Shayam Café Admin Dashboard
        </a>
        <div class="note">
          If the button doesn&apos;t work, open your admin dashboard and view the latest orders.
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      &copy; ${new Date().getFullYear()} Shree Shayam Café · Near CLC, Sikar, Rajasthan · 
      <a href="mailto:sainilalit275@gmail.com">sainilalit275@gmail.com</a>
    </div>
  </div>
</body>
</html>
`;
};
