import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system, model, max_tokens } = req.body;

  try {
    const response = await client.messages.create({
      model: model || 'claude-haiku-4-5-20251001',
      max_tokens: max_tokens || 4096,
      system,
      messages,
    });

    res.json({ content: response.content[0].text });
  } catch (error) {
    console.error('Anthropic API error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
