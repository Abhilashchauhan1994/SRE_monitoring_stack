// app.js
const express = require('express');
const promClient = require('prom-client');
const app = express();

// -------------------- Configuration --------------------
const ERROR_PROB_500 = parseFloat(process.env.ERROR_PROB_500 || '0.001');
const ERROR_PROB_400 = parseFloat(process.env.ERROR_PROB_400 || '0.002');
const LATENCY_MS_P50 = parseFloat(process.env.LATENCY_MS_P50 || '80');
const LATENCY_MS_JITTER = parseFloat(process.env.LATENCY_MS_JITTER || '120');
const PORT = process.env.PORT || 5000;

// -------------------- Prometheus Metrics --------------------
promClient.collectDefaultMetrics();

const httpRequests = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['path', 'code']
});

const httpErrors = new promClient.Counter({
  name: 'http_request_errors_total',
  help: 'Total HTTP errors',
  labelNames: ['path', 'code']
});

const httpLatency = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Request latency in seconds',
  labelNames: ['path'],
  buckets: [0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1, 1.5, 2, 3, 5]
});

// -------------------- Helper Functions --------------------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Middleware: measure latency and count requests
app.use(async (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const path = req.path;
    const code = res.statusCode.toString();

    httpRequests.inc({ path, code });
    if (res.statusCode >= 400) httpErrors.inc({ path, code });
    httpLatency.observe({ path }, duration);
  });
  next();
});

// -------------------- Routes --------------------
app.get('/api', async (req, res) => {
  const base = LATENCY_MS_P50;
  const jitter = Math.random() * LATENCY_MS_JITTER;
  await sleep(base + jitter);

  const rand = Math.random();
  if (rand < ERROR_PROB_500) {
    return res.status(500).json({ status: 'internal_error' });
  }
  if (rand < ERROR_PROB_500 + ERROR_PROB_400) {
    return res.status(400).json({ status: 'bad_request' });
  }

  res.json({ status: 'ok' });
});

// Forced error endpoints (for testing dashboards)
app.get('/error500', (req, res) => {
  res.status(500).json({ status: 'forced_internal_error' });
});

app.get('/error400', (req, res) => {
  res.status(400).json({ status: 'forced_bad_request' });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.get('/', (req, res) => res.send('App is running'));

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
