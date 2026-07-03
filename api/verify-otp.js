import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, otp, token } = req.body;

    if (!otp || !token || !email) {
      return res.status(400).json({ error: 'Missing verification details' });
    }

    // 1. Unpack the native token structure [hash, expires]
    const [providedHash, expiresStr] = token.split('.');
    const expires = parseInt(expiresStr, 10);

    // 2. Security Check: Has the 5-minute window expired?
    if (Date.now() > expires) {
      return res.status(400).json({ error: 'Verification session expired. Please request a new code.' });
    }

    // 3. Cryptographical Re-verification
    const dataToSign = `${email}.${otp}.${expires}`;
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_123';
    const computedHash = crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');

    // 4. If the data or signature was tampered with, it won't match
    if (providedHash !== computedHash) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // 5. Success! Strict verification complete.
    return res.status(200).json({
      success: true,
      status: "success",
      ok: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
