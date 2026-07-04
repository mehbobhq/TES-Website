// In-memory OTP store: { email -> { code, expiresAt } }
// Note: This resets on cold starts. For production, replace with
// a persistent KV store (e.g. Vercel KV / Redis / Upstash).
const otpStore = new Map();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

export default async function handler(req, res) {
  // Handle preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Rate-limit: block if a valid unexpired OTP already exists for this email
  const existing = otpStore.get(normalizedEmail);
  if (existing && existing.expiresAt > Date.now()) {
    const secondsLeft = Math.ceil((existing.expiresAt - Date.now()) / 1000);
    return res.status(429).json({
      error: `A code was already sent. Please wait ${secondsLeft} seconds before requesting a new one.`
    });
  }

  // Generate a 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + OTP_TTL_MS;

  // Store it
  otpStore.set(normalizedEmail, { code, expiresAt });

  // Clean up expired entries periodically (simple GC)
  for (const [key, val] of otpStore.entries()) {
    if (val.expiresAt < Date.now()) otpStore.delete(key);
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
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
            <h2 style="color:#0c1a36;margin-bottom:8px;">Your verification code</h2>
            <p style="color:#444;margin-bottom:24px;">Use the code below to confirm your email address. It expires in 10 minutes.</p>
            <div style="background:#f3f4f7;border-radius:8px;padding:24px;text-align:center;letter-spacing:0.2em;font-size:32px;font-weight:700;color:#0c1a36;">
              ${code}
            </div>
            <p style="color:#888;font-size:13px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Brevo error:', err);
      // Remove stored OTP so user can retry
      otpStore.delete(normalizedEmail);
      return res.status(502).json({ error: 'Failed to send email. Please try again.' });
    }

    return res.status(200).json({ success: true, message: 'Verification code sent.' });

  } catch (error) {
    console.error('send-otp error:', error);
    otpStore.delete(normalizedEmail);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}
