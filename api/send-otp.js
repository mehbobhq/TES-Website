import jwt from 'jsonwebtoken';

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

    // 3. Create an encrypted token containing the email and OTP (Expires in 5 mins)
    const token = jwt.sign(
      { email, otp: generatedOtp }, 
      process.env.JWT_SECRET, 
      { expiresIn: '5m' }
    );

    // 4. Return success along with the token to the frontend
    return res.status(200).json({
      success: true,
      status: "success",
      ok: true,
      token: token, // The frontend will hold this and pass it back to verify-otp
      message: 'OTP sent successfully'
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
