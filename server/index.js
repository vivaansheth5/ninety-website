import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

import { productsRouter } from './routes/products.js';
import { ordersRouter } from './routes/orders.js';
import { paymentRouter, handleRazorpayWebhook } from './routes/payment.js';
import { issueCsrfToken } from './middleware/csrf.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 8083;
const APP_ORIGIN = process.env.APP_ORIGIN || `http://localhost:${PORT}`;

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// --- Security headers -------------------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: isProd
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://checkout.razorpay.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https://*.razorpay.com'],
            connectSrc: ["'self'", 'https://api.razorpay.com', 'https://lumberjack.razorpay.com'],
            frameSrc: ['https://api.razorpay.com', 'https://checkout.razorpay.com'],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'self'"],
            upgradeInsecureRequests: [],
          },
        }
      : false, // relaxed in dev so Vite's HMR client/inline preamble can run
    crossOriginEmbedderPolicy: false,
  })
);

// --- Core middleware ----------------------------------------------------
app.use(compression());
app.use(cors({ origin: APP_ORIGIN, credentials: true }));
app.use(cookieParser());

// Razorpay webhook needs the raw body for signature verification, so it's
// mounted before the JSON body parser (which would otherwise consume it).
app.post('/api/payment/webhook', express.raw({ type: 'application/json', limit: '256kb' }), handleRazorpayWebhook);

app.use(express.json({ limit: '256kb' }));

// Global API rate limit as defense-in-depth on top of the per-route limits.
app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --- API routes -----------------------------------------------------------
app.get('/api/csrf-token', (req, res) => {
  const token = issueCsrfToken(req, res);
  res.json({ csrfToken: token });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payment', paymentRouter);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// --- Frontend ---------------------------------------------------------
// A plain http.Server wrapping the app so Vite's dev-mode HMR websocket can
// share this same port (upgrade requests) instead of trying to bind its own.
const httpServer = http.createServer(app);

if (isProd) {
  const distDir = path.join(__dirname, '..', 'dist');
  app.use(express.static(distDir, { index: false, maxAge: '1y', immutable: true }));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: { server: httpServer } },
    appType: 'spa',
    root: path.join(__dirname, '..'),
  });
  app.use(vite.middlewares);
}

// --- Error handling -----------------------------------------------------
// Never leak stack traces or internals to the client.
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: 'Internal server error' });
});

httpServer.listen(PORT, () => {
  console.log(`Ninety+ running at http://localhost:${PORT} (${isProd ? 'production' : 'development'})`);
});
