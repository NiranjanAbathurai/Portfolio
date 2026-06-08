const express = require('express');
const bodyParser = require('body-parser');
const { handler } = require('./agent');

const app = express();
const PORT = process.env.PORT || 8888;

app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

function buildEvent(req) {
  const body = req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : req.rawBody || undefined;
  return {
    path: req.originalUrl || req.path,
    httpMethod: req.method,
    headers: req.headers,
    body: body
  };
}

app.all('/.netlify/functions/agent/*', async (req, res) => {
  const event = buildEvent(req);
  try {
    const result = await handler(event, {});
    const headers = result.headers || {};
    for (const k of Object.keys(headers)) res.setHeader(k, headers[k]);
    res.status(result.statusCode || 200).send(result.body || '');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Provide the same API surface as the redirects configured in netlify.toml
app.all('/api/*', async (req, res) => {
  const event = buildEvent(req);
  try {
    const result = await handler(event, {});
    const headers = result.headers || {};
    for (const k of Object.keys(headers)) res.setHeader(k, headers[k]);
    res.status(result.statusCode || 200).send(result.body || '');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Local Netlify-function wrapper listening on http://localhost:${PORT}`);
  console.log('Routes:');
  console.log(' - /.netlify/functions/agent/*');
  console.log(' - /api/*  (proxied to the function)');
});
