import 'dotenv/config';
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json({ limit: '1mb' }));

// Validate API key on startup
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('\n  Missing ANTHROPIC_API_KEY in .env file.');
  console.error('  Copy .env.example to .env and add your key.\n');
  process.exit(1);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Standard (non-streaming) chat endpoint
app.post('/api/chat', async (req, res) => {
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
});

// Streaming chat endpoint (SSE) for diagnostic conversation
app.post('/api/chat/stream', async (req, res) => {
  const { messages, system, model, max_tokens } = req.body;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  try {
    const stream = await client.messages.create({
      model: model || 'claude-opus-4-5-20250514',
      max_tokens: max_tokens || 1024,
      system,
      messages,
      stream: true,
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Streaming error:', error.message);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`  Vibe Learning API running on http://localhost:${port}`);
});
