const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
    try {
        const emails = await kv.get('emails') || '';
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', 'attachment; filename="emails.txt"');
        res.send(emails);
    } catch (error) {
        console.error('Error retrieving emails:', error);
        res.status(500).json({ success: false, message: 'Error retrieving emails' });
    }
};
