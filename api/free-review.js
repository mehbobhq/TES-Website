const { createHmac, timingSafeEqual } = require('crypto');

const SECRET = process.env.OTP_SECRET || 'truckease-otp-fallback-secret';
const VERIFIED_TOKEN_TTL_SECONDS = 900;

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, fullName, phone, dotNumber, operations, cargoType, haulPattern, quizAnswers, verifiedToken } = req.body || {};

  const quizRows = Array.isArray(quizAnswers) && quizAnswers.length
    ? quizAnswers.map(q => `
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:8px 0;color:#64748b;font-size:12px;width:60%;">${q.question}</td>
                <td style="padding:8px 0;color:${q.answer === 'Not sure' ? '#e8720c' : '#0c1a36'};font-size:12px;font-weight:600;">${q.answer}</td>
              </tr>`).join('')
    : '';

  if (!email || !fullName) {
    return res.status(400).json({ ok: false, error: 'Required fields are missing.' });
  }

  // Require proof the email was OTP-verified — this is the actual
  // spam/junk gate. Without this check, /api/free-review could be
  // called directly, skipping OTP entirely.
  if (!verifiedToken) {
    return res.status(400).json({ ok: false, error: 'Email verification is required before submitting.' });
  }

  let vEmail, vFlag, vIssuedAt, vSig;
  try {
    const decoded = Buffer.from(verifiedToken, 'base64url').toString('utf8');
    const parts = decoded.split('|');
    if (parts.length !== 4) throw new Error('malformed');
    [vEmail, vFlag, vIssuedAt, vSig] = parts;
  } catch {
    return res.status(400).json({ ok: false, error: 'Invalid verification. Please verify your email again.' });
  }

  if (vFlag !== 'verified' || vEmail !== email.toLowerCase().trim()) {
    return res.status(400).json({ ok: false, error: 'Verification does not match this email. Please verify again.' });
  }

  if (Math.floor(Date.now() / 1000) - parseInt(vIssuedAt, 10) > VERIFIED_TOKEN_TTL_SECONDS) {
    return res.status(400).json({ ok: false, error: 'Your verification has expired. Please verify your email again.' });
  }

  const expectedSig = createHmac('sha256', SECRET).update(`${vEmail}|verified|${vIssuedAt}`).digest('hex');
  try {
    const sigValid = timingSafeEqual(Buffer.from(vSig, 'hex'), Buffer.from(expectedSig, 'hex'));
    if (!sigValid) throw new Error('bad sig');
  } catch {
    return res.status(400).json({ ok: false, error: 'Invalid verification. Please verify your email again.' });
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
    to: [{ email: 'truckeasesolutions@gmail.com', name: 'TruckEase Admin' }],
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
              <tr>
                <td style="padding:12px 0;color:#64748b;font-size:13px;font-weight:600;vertical-align:top;">Cargo type</td>
                <td style="padding:12px 0;color:#0c1a36;font-size:14px;">${cargoType || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;color:#64748b;font-size:13px;font-weight:600;vertical-align:top;">Haul pattern</td>
                <td style="padding:12px 0;color:#0c1a36;font-size:14px;">${haulPattern || 'Not provided'}</td>
              </tr>
            </table>

            ${quizRows ? `
            <h3 style="color:#0c1a36;font-size:14px;margin:24px 0 4px;">Self-assessment answers</h3>
            <table style="width:100%;border-collapse:collapse;">${quizRows}</table>` : ''}

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
