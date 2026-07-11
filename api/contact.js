module.exports = async (req, res) => {
    // 1. Preflight CORS handler to prevent 405 errors
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 3. Dynamic field extraction with fallbacks
    // This ensures it works whether the frontend sends 'email' or 'workEmail', etc.
    const body = req.body || {};
    const email = body.email || body.workEmail || '';
    const name = body.name || body.fullName || '';
    const phone = body.phone || body.phoneNumber || '';
    const message = body.details || body.message || '';

    try {
        // 4. Send the request to Brevo
        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                // Using a 'noreply' sender address prevents soft-bounces
                sender: { name: 'TruckEase Solutions', email: 'noreply@truckeasesolutions.com' },
                to: [{ email: 'truckeasesolutions@gmail.com' }],
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

        // 5. Handle and log API errors
        if (!brevoResponse.ok) {
            console.error('Brevo API Error:', brevoData);
            return res.status(brevoResponse.status).json({ ok: false, error: brevoData });
        }

        return res.status(200).json({ ok: true, message: 'Message sent successfully.' });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ ok: false, error: 'Internal Server Error' });
    }
};
