module.exports = async (req, res) => {
    // 1. Add this preflight CORS handler
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Keep your existing POST check
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, name, phone, dot, details } = req.body || {};
    // ... rest of your existing code

  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'TruckEase Solutions', email: 'noreply@truckeasesolutions.com' },
    to: [{ email: 'leads@truckeasesolutions.com' }],
      subject: 'New Contact Form Lead',
      htmlContent: `
        <h2>New Risk Screening Lead</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>DOT/MC/NSC/CVOR:</strong> ${dot}</p>
        <p><strong>Details:</strong> ${details}</p>
      `
    })
  });

  return res.status(200).json({ ok: true, message: 'Lead submitted successfully.' });
};
