import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;

if (accountSid && authToken && accountSid.startsWith("AC")) {
  client = twilio(accountSid, authToken);
} else {
  console.warn(
    "⚠️ Twilio not fully configured (check TWILIO_ACCOUNT_SID/Auth). SMS sending is disabled."
  );
}

export const sendOtpSms = async ({ to, otp }) => {
  if (!client) {
    console.log(
      `📱 [SMS DISABLED] Would send OTP ${otp} to ${to} (Twilio not configured)`
    );
    return;
  }

  const normalizedTo = to.startsWith("+") ? to : `+91${to}`; // default for India

  const msg = await client.messages.create({
    from: fromNumber,
    to: normalizedTo,
    body: `Your Brew Haven OTP is: ${otp}`,
  });

  console.log("✅ SMS sent:", msg.sid);
};
