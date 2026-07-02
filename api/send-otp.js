export default async function handler(req, res) {
  // Only allow POST requests (like the one your form sends)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Generate a simple 6-digit random code
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

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
          name: "TruckEase Solutions",
          email: "leads@truckeasesolutions.com" // Your verified sender domain!
        },
        to: [{ email: email }],
        subject: "Your TruckEase verification code",
        htmlContent: `<html><body><h1>Your verification code is: <strong>${generatedOtp}</strong></h1><p>This code expires in 10 minutes.</p></body></html>`
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.message || 'Brevo API error' });
    }

   // Ultimate success payload to satisfy any frontend validation logic
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
