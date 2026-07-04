// Shared in-memory store with send-otp.js (same module cache within one Vercel deployment)
const otpStore = new Map();

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, otp } = req.body || {};

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and verification code are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const submittedCode   = String(otp).trim();
  const stored          = otpStore.get(normalizedEmail);

  if (!stored) {
    return res.status(400).json({
      error: 'No verification code found for this email. Please request a new one.'
    });
  }

  if (stored.expiresAt < Date.now()) {
    otpStore.delete(normalizedEmail);
    return res.status(400).json({
      error: 'Your verification code has expired. Please request a new one.'
    });
  }

  if (stored.code !== submittedCode) {
    return res.status(400).json({
      error: 'Incorrect verification code. Please check and try again.'
    });
  }

  // Valid — consume immediately to prevent reuse
  otpStore.delete(normalizedEmail);
  return res.status(200).json({ success: true, message: 'Email verified successfully.' });
}
