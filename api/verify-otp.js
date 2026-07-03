import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // 1. Pull everything from the frontend form submission
    const { email, otp, fullName, phone, message } = req.body;

    if (!otp || !email) {
      return res.status(400).json({ error: 'Missing verification details' });
    }

    const secret = process.env.JWT_SECRET || 'truckease_secure_secret_2026_xYz';
    const timeWindow = Math.floor(Date.now() / (5 * 60 * 1000));

    // 2. Verify against current 5-minute window
    const hashCurrent = crypto.createHmac('sha256', secret).update(`${email.toLowerCase()}.${timeWindow}`).digest('hex');
    const expectedOtpCurrent = (parseInt(hashCurrent.substring(0, 8), 16) % 900000 + 100000).toString();

    // Verify against previous 5-minute window (grace period)
    const hashPrevious = crypto.createHmac('sha256', secret).update(`${email.toLowerCase()}.${timeWindow - 1}`).digest('hex');
    const expectedOtpPrevious = (parseInt(hashPrevious.substring(0, 8), 16) % 900000 + 100000).toString();

    // 3. Strict cross-checking
    if (otp !== expectedOtpCurrent && otp !== expectedOtpPrevious) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // 4. CODE IS CORRECT! Now fire the Lead Notification to your inbox via Brevo
    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: "TruckEase Web System",
            email: "leads@truckeasesolutions.com"
          },
          to: [{ email: "leads@truckeasesolutions.com" }], // Sends directly to you
          subject: `🔥 New Verified Lead: ${fullName || 'Unknown Name'}`,
          htmlContent: `
            <html>
              <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                  <h2 style="color: #ff6b00; margin-top: 0;">New Contact Form Submission</h2>
                  <p>A user has successfully verified their email and submitted a message.</p>
                  <hr style="border: 0; border-top: 1px solid #eee;" />
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; width: 120px;">Full Name:</td>
                      <td style="padding: 8px 0;">${fullName || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold;">Work Email:</td>
                      <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                      <td style="padding: 8px 0;">${phone || 'Not provided'}</td>
                    </tr>
                  </table>
                  <hr style="border: 0; border-top: 1px solid #eee;" />
                  <p style="font-weight: bold; margin-bottom: 5px;">Message:</p>
                  <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 4px solid #ff6b00;">
                    ${message ? message.replace(/\n/g, '<br>') : 'No message left.'}
                  </div>
                </div>
              </body>
            </html>
          `
        })
      });
    } catch (emailError) {
      // Fail silently for the user so their form experience doesn't break if Brevo hiccups
      console.error('Failed to forward lead email:', emailError);
    }

    // 5. Return validation success to the frontend app
    return res.status(200).json({
      success: true,
      status: "success",
      ok: true,
      message: "OTP verified and lead submitted successfully"
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
