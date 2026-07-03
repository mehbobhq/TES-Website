import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, otp, token } = req.body;

    if (!otp || !token || !email) {
      return res.status(400).json({ error: 'Missing verification details' });
    }

    try {
      // 1. Verify and decrypt the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 2. Cross-reference email and matching OTP code
      if (decoded.email !== email || decoded.otp !== otp) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }

      // 3. If it passes everything, return a strict validation success payload
      return res.status(200).json({
        success: true,
        status: "success",
        ok: true,
        message: "OTP verified successfully"
      });

    } catch (jwtError) {
      // Catches expired or tampered tokens automatically
      return res.status(400).json({ error: 'Verification session expired. Please request a new code.' });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
