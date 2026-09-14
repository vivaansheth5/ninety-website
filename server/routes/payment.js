import { Router } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { getOrderByRazorpayId, markOrderPaid, markOrderFailed } from '../data/db.js';
import { requireCsrf } from '../middleware/csrf.js';

export const paymentRouter = Router();

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many verification attempts. Please try again later.' },
});

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1).max(128),
  razorpay_payment_id: z.string().min(1).max(128),
  razorpay_signature: z.string().min(1).max(256),
});

function timingSafeEqualHex(a, b) {
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// POST /api/payment/verify — called by the client after the Razorpay
// checkout modal succeeds. The signature is recomputed server-side from the
// key secret; a client can never fake a paid order without it.
paymentRouter.post('/verify', verifyLimiter, requireCsrf, (req, res) => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid verification payload' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const order = getOrderByRazorpayId(razorpay_order_id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  if (order.status === 'paid') {
    return res.json({ success: true, orderId: order.razorpay_order_id, status: 'paid' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  let valid = false;
  try {
    valid = timingSafeEqualHex(expectedSignature, razorpay_signature);
  } catch {
    valid = false;
  }

  if (!valid) {
    markOrderFailed(razorpay_order_id);
    return res.status(400).json({ error: 'Payment signature verification failed' });
  }

  markOrderPaid(razorpay_order_id, razorpay_payment_id);
  res.json({ success: true, orderId: razorpay_order_id, status: 'paid' });
});

// POST /api/payment/webhook — optional server-to-server confirmation from
// Razorpay, verified against RAZORPAY_WEBHOOK_SECRET. Registered as a
// fallback so a payment that succeeds but never gets an in-browser
// /verify call (closed tab, network drop) still gets reconciled.
// Note: this route needs the raw request body, mounted separately in server/index.js.
export function handleRazorpayWebhook(req, res) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(503).json({ error: 'Webhook not configured' });
  }

  const signature = req.get('x-razorpay-signature');
  if (!signature) {
    return res.status(400).json({ error: 'Missing signature' });
  }

  const expected = crypto.createHmac('sha256', webhookSecret).update(req.body).digest('hex');

  let valid = false;
  try {
    valid = timingSafeEqualHex(expected, signature);
  } catch {
    valid = false;
  }

  if (!valid) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  let payload;
  try {
    payload = JSON.parse(req.body.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Malformed payload' });
  }

  if (payload.event === 'payment.captured') {
    const entity = payload.payload?.payment?.entity;
    if (entity?.order_id && entity?.id) {
      markOrderPaid(entity.order_id, entity.id);
    }
  } else if (payload.event === 'payment.failed') {
    const entity = payload.payload?.payment?.entity;
    if (entity?.order_id) {
      markOrderFailed(entity.order_id);
    }
  }

  res.status(200).json({ received: true });
}
