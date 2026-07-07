import { createHmac, timingSafeEqual } from 'crypto';

const SECRET = process.env.OTP_SECRET || 'truckease-otp-fallback-secret';
const OTP_TTL_SECONDS = 600;

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, otp, token } = req.body || {};

  if (!email || !otp || !token) {
    return res.status(400).json({ error: 'Email, verification code, and session token are required.' });
  }

  let tokenEmail, tokenCode, tokenIssuedAt, tokenSig;
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const parts = decoded.split('|');
    if (parts.length !== 4) throw new Error('malformed');
    [tokenEmail, tokenCode, tokenIssuedAt, tokenSig] = parts;
  } catch {
    return res.status(400).json({ error: 'Invalid session. Please request a new code.' });
  }

  if (tokenEmail !== email.toLowerCase().trim()) {
    return res.status(400).json({ error: 'Session mismatch. Please request a new code.' });
  }

  if (Math.floor(Date.now() / 1000) - parseInt(tokenIssuedAt, 10) > OTP_TTL_SECONDS) {
    return res.status(400).json({ error: 'Your verification code has expired. Please request a new one.' });
  }

  const payload = `${tokenEmail}|${tokenCode}|${tokenIssuedAt}`;
  const expectedSig = createHmac('sha256', SECRET).update(payload).digest('hex');

  try {
    const sigValid = timingSafeEqual(
      Buffer.from(tokenSig, 'hex'),
      Buffer.from(expectedSig, 'hex')
    );
    if (!sigValid) throw new Error('bad sig');
  } catch {
    return res.status(400).json({ error: 'Invalid session. Please request a new code.' });
  }

  if (String(otp).trim() !== tokenCode) {
    return res.status(400).json({ error: 'Incorrect verification code. Please check and try again.' });
  }

  return res.status(200).json({ success: true, message: 'Email verified successfully.' });
}
