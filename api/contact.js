module.exports = async (req, res) => {
    // 1. Preflight CORS handler
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 3. Extract fields specifically for the Contact page
    const body = req.body || {};
    const email = body.email || body.workEmail || '';
    const name = body.name || body.fullName || '';
    const phone = body.phone || body.phoneNumber || '';
    const message = body.details || body.message || '';

    // 4. Send to Brevo (DOT field removed)
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            sender: { name: 'TruckEase Solutions', email: 'leads@truckeasesolutions.com' },
            to: [{ email: 'leads@truckeasesolutions.com' }],
            replyTo: { email: email, name: name },
            subject: 'New Contact Form Submission',
            htmlContent: `
                <h2>New Contact Message</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        })
    });

    const brevoData = await brevoResponse.json();

    if (!brevoResponse.ok) {
        console.error('Brevo API Error:', brevoData);
        return res.status(brevoResponse.status).json({ ok: false, error: brevoData });
    }

    return res.status(200).json({ ok: true, message: 'Message sent successfully.' });
};
