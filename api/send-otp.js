import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // 1. Generate a secure, deterministic OTP based on email + current 5-minute time window
    const secret = process.env.JWT_SECRET || 'truckease_secure_secret_2026_xYz';
    const timeWindow = Math.floor(Date.now() / (5 * 60 * 1000)); // Changes every 5 minutes
    
    const hash = crypto.createHmac('sha256', secret).update(`${email.toLowerCase()}.${timeWindow}`).digest('hex');
    const generatedOtp = (parseInt(hash.substring(0, 8), 16) % 900000 + 100000).toString();

    // 2. Dispatch email via Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: "TruckEase Solutions",
          email: "leads@truckeasesolutions.com"
        },
        to: [{ email: email }],
        subject: "Your TruckEase verification code",
        htmlContent: `<html><body><h1>Your verification code is: <strong>${generatedOtp}</strong></h1><p>This code expires in 5 minutes.</p></body></html>`
      })
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json();
      return res.status(brevoResponse.status).json({ error: errorData.message || 'Email delivery failed' });
    }

    // 3. Return a clean success payload matching what your frontend expects
    return res.status(200).json({
      success: true,
      status: "success",
      ok: true,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
