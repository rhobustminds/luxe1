const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Collect body data (since Vercel Node runtime doesn't auto-parse JSON)
  let body = '';
  req.on('data', chunk => body += chunk);
  await new Promise(resolve => req.on('end', resolve));

  let parsed;
  try {
    parsed = JSON.parse(body || '{}');
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON' });
  }

  const { email } = parsed;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    let emails = await kv.get('emails') || '';
    const lines = emails.trim().split('\n').filter(line => line.trim() !== '');
    const nextNumber = lines.length + 1;
    const timestamp = new Date().toISOString();
    const entry = `${nextNumber}. ${email} - ${timestamp}\n`;

    await kv.set('emails', emails + entry);

    res.json({ success: true, message: `Thank you! We'll notify you at ${email} when we launch.` });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
  }
};
