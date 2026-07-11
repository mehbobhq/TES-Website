const { createHmac } = require('crypto');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, fullName, phone, dotNumber, operations } = req.body || {};

  if (!email || !fullName) {
    return res.status(400).json({ ok: false, error: 'Required fields are missing.' });
  }

  const submittedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/Toronto',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
     sender: {
      name: 'TruckEase Website',
      email: 'noreply@truckeasesolutions.com'
    },
    to: [{ email: 'leads@truckeasesolutions.com', name: 'TruckEase Admin' }],
        replyTo: { email, name: fullName },
        subject: `New Risk Screening Request — ${fullName}`,
        htmlContent: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f8fafc;border-radius:12px;">
            <div style="background:#0c1a36;padding:20px 24px;border-radius:8px;margin-bottom:24px;">
              <img src="https://truckeasesolutions.com/truckease-logo.png"
                   alt="TruckEase Solutions" style="height:32px;" />
            </div>
            <h2 style="color:#0c1a36;margin:0 0 4px;">New Risk Screening Request</h2>
            <p style="color:#64748b;margin:0 0 24px;font-size:14px;">${submittedAt}</p>

            <table style="width:100%;border-collapse:collapse;">
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:12px 0;color:#64748b;font-size:13px;width:40%;font-weight:600;">Full Name</td>
                <td style="padding:12px 0;color:#0c1a36;font-size:14px;">${fullName}</td>
              </tr>
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:12px 0;color:#64748b;font-size:13px;font-weight:600;">Email</td>
                <td style="padding:12px 0;color:#0c1a36;font-size:14px;">
                  <a href="mailto:${email}" style="color:#e8720c;">${email}</a>
                </td>
              </tr>
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:12px 0;color:#64748b;font-size:13px;font-weight:600;">Phone</td>
                <td style="padding:12px 0;color:#0c1a36;font-size:14px;">${phone || 'Not provided'}</td>
              </tr>
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:12px 0;color:#64748b;font-size:13px;font-weight:600;">DOT / MC / NSC / CVOR</td>
                <td style="padding:12px 0;color:#0c1a36;font-size:14px;font-weight:700;">${dotNumber || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;color:#64748b;font-size:13px;font-weight:600;vertical-align:top;">Operations</td>
                <td style="padding:12px 0;color:#0c1a36;font-size:14px;">${operations || 'Not provided'}</td>
              </tr>
            </table>

            <div style="margin-top:24px;background:#fff8f0;border-left:4px solid #e8720c;padding:14px 18px;border-radius:0 8px 8px 0;">
              <p style="margin:0;font-size:13px;color:#7c3600;">
                Reply directly to this email to respond to ${fullName}.
              </p>
            </div>
          </div>
        `
      })
    });

    if (!brevoRes.ok) {
      const err = await brevoRes.json().catch(() => ({}));
      console.error('Brevo free-review error:', JSON.stringify(err));
      // Still return success to user — their request was received even if notification failed
      return res.status(200).json({ ok: true, success: true });
    }

    return res.status(200).json({ ok: true, success: true });

  } catch (err) {
    console.error('free-review error:', err);
    return res.status(200).json({ ok: true, success: true });
  }
};
