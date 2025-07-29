const express = require('express');
const webhook = require('./api/webhook');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware für JSON parsing
app.use(express.json());

// CORS für alle Routen
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Webhook Route
app.post('/api/webhook', webhook);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'UUID Check API ist bereit' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 UUID Check API läuft auf http://localhost:${PORT}`);
  console.log(`📋 Webhook Endpunkt: http://localhost:${PORT}/api/webhook`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;
