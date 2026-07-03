import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, otp } = req.body;

    if (!otp || !email) {
      return res.status(400).json({ error: 'Missing verification details' });
    }

    const secret = process.env.JWT_SECRET || 'truckease_secure_secret_2026_xYz';
    const timeWindow = Math.floor(Date.now() / (5 * 60 * 1000));

    // Verify against current 5-minute window
    const hashCurrent = crypto.createHmac('sha256', secret).update(`${email.toLowerCase()}.${timeWindow}`).digest('hex');
    const expectedOtpCurrent = (parseInt(hashCurrent.substring(0, 8), 16) % 900000 + 100000).toString();

    // Verify against previous 5-minute window (grace period for users)
    const hashPrevious = crypto.createHmac('sha256', secret).update(`${email.toLowerCase()}.${timeWindow - 1}`).digest('hex');
    const expectedOtpPrevious = (parseInt(hashPrevious.substring(0, 8), 16) % 900000 + 100000).toString();

    // Strict cross-checking
    if (otp !== expectedOtpCurrent && otp !== expectedOtpPrevious) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // If it matches either window, validation is a 100% cryptographical success
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
