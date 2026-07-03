import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // 1. Generate a real 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

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

    // 3. Create a time-locked security signature natively (Expires in 5 mins)
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    const dataToSign = `${email}.${generatedOtp}.${expires}`;
    
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_123';
    const hash = crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');
    const secureToken = `${hash}.${expires}`;

    // 4. Return success along with the native token
    return res.status(200).json({
      success: true,
      status: "success",
      ok: true,
      token: secureToken,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
