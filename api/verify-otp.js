const { createHmac, timingSafeEqual } = require('crypto');

const SECRET = process.env.OTP_SECRET || 'truckease-otp-fallback-secret';
const OTP_TTL_SECONDS = 600;

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, otp, token } = req.body || {};

  if (!email || !otp || !token) {
    return res.status(400).json({ ok: false, error: 'Email, verification code, and session token are required.' });
  }

  let tokenEmail, tokenCode, tokenIssuedAt, tokenSig;
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const parts = decoded.split('|');
    if (parts.length !== 4) throw new Error('malformed');
    [tokenEmail, tokenCode, tokenIssuedAt, tokenSig] = parts;
  } catch {
    return res.status(400).json({ ok: false, error: 'Invalid session. Please request a new code.' });
  }

  if (tokenEmail !== email.toLowerCase().trim()) {
    return res.status(400).json({ ok: false, error: 'Session mismatch. Please request a new code.' });
  }

  if (Math.floor(Date.now() / 1000) - parseInt(tokenIssuedAt, 10) > OTP_TTL_SECONDS) {
    return res.status(400).json({ ok: false, error: 'Your verification code has expired. Please request a new one.' });
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
    return res.status(400).json({ ok: false, error: 'Invalid session. Please request a new code.' });
  }

  if (String(otp).trim() !== tokenCode) {
    return res.status(400).json({ ok: false, error: 'Incorrect verification code. Please check and try again.' });
  }

  // Issue a short-lived signed proof that this email was verified,
  // so downstream endpoints (e.g. free-review) can require it and
  // can't be called directly, skipping the OTP step.
  const verifiedAt = Math.floor(Date.now() / 1000);
  const verifiedPayload = `${tokenEmail}|verified|${verifiedAt}`;
  const verifiedSig = createHmac('sha256', SECRET).update(verifiedPayload).digest('hex');
  const verifiedToken = Buffer.from(`${verifiedPayload}|${verifiedSig}`).toString('base64url');

  return res.status(200).json({ ok: true, success: true, message: 'Email verified successfully.', verifiedToken });
};
