// WHY THIS APPROACH:
// Vercel serverless functions are stateless — each function file gets its own
// isolated module scope. A Map() in send-otp.js is NEVER visible to verify-otp.js.
// This was the root cause of OTP verification always failing.
//
// Fix: generate the OTP, then HMAC-sign it into a token we send back to the
// browser. The browser submits that token with the code. verify-otp re-derives
// the expected HMAC and compares — no shared state needed at all.
//
// Required env var: OTP_SECRET — any long random string, set in Vercel dashboard.

import { createHmac } from 'crypto';

const SECRET = process.env.OTP_SECRET || 'truckease-otp-fallback-secret';
const OTP_TTL_SECONDS = 600; // 10 minutes

function signToken(email, code, issuedAt) {
  const payload = `${email}|${code}|${issuedAt}`;
  const sig = createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}|${sig}`).toString('base64url');
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const issuedAt = Math.floor(Date.now() / 1000);
  const token = signToken(normalizedEmail, code, issuedAt);

  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'TruckEase Solutions',
          email: 'leads@truckeasesolutions.com'
        },
        to: [{ email: normalizedEmail }],
        subject: 'Your TruckEase verification code',
        htmlContent: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
            <img src="https://truckeasesolutions.com/truckease-logo.png"
                 alt="TruckEase Solutions" style="height:36px;margin-bottom:24px;" />
            <h2 style="color:#0c1a36;margin-bottom:8px;">Your verification code</h2>
            <p style="color:#444;margin-bottom:24px;">
              Use the code below to confirm your email address. It expires in 10 minutes.
            </p>
            <div style="background:#f3f4f7;border-radius:8px;padding:24px;text-align:center;
                        letter-spacing:0.25em;font-size:34px;font-weight:700;color:#0c1a36;">
              ${code}
            </div>
            <p style="color:#888;font-size:13px;margin-top:24px;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        `
      })
    });

    if (!brevoRes.ok) {
      const err = await brevoRes.json().catch(() => ({}));
      console.error('Brevo error:', JSON.stringify(err));
      return res.status(502).json({ error: 'Failed to send code. Please try again.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Verification code sent.',
      token
    });

  } catch (err) {
    console.error('send-otp error:', err);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}
