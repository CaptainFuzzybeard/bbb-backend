import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ALLOWED_ORIGINS = [
  'https://captainfuzzybeard.github.io',  // update to your GitHub Pages URL
  'http://localhost',
  'http://127.0.0.1',
  'null' // for local file:// opens
];

function setCors(req, res) {
  const origin = req.headers.origin || '';
  const allowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));
  res.setHeader('Access-Control-Allow-Origin', allowed ? origin : ALLOWED_ORIGINS[0]);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCors(req, res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, mode } = req.body || {};

  if (!prompt || !mode) {
    return res.status(400).json({ error: 'Missing prompt or mode' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: 'You are a world-class brand strategist. Always respond with valid JSON only. No markdown, no backticks, no preamble.',
      messages: [{ role: 'user', content: prompt }]
    });

    const raw = message.content.map(c => c.text || '').join('');
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());

    return res.status(200).json({ result: parsed });

  } catch (err) {
    console.error('Anthropic error:', err.message);
    return res.status(500).json({ error: err.message || 'Analysis failed' });
  }
}
