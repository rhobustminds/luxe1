const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
        // Get current emails from KV
        let emails = await kv.get('emails') || '';

        // Calculate next number
        const lines = emails.trim().split('\n').filter(line => line.trim() !== '');
        const nextNumber = lines.length + 1;

        // Get timestamp
        const timestamp = new Date().toISOString();

        // Format entry
        const entry = `${nextNumber}. ${email} - ${timestamp}\n`;

        // Append to emails
        emails += entry;

        // Store back to KV
        await kv.set('emails', emails);

        res.json({ success: true, message: `Thank you! We'll notify you at ${email} when we launch.` });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
};
