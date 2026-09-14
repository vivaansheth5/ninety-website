import { Router } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { getProductById } from '../data/products.js';
import { insertOrder } from '../data/db.js';
import { requireCsrf } from '../middleware/csrf.js';
import { getRazorpayClient } from '../utils/razorpayClient.js';

export const ordersRouter = Router();

const createOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many order attempts. Please try again later.' },
});

const cartItemSchema = z.object({
  id: z.string().min(1).max(64),
  qty: z.number().int().min(1).max(10),
  size: z.enum(['S', 'M', 'L', 'XL', 'XXL']).optional(),
});

const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(30),
});

ordersRouter.post('/', createOrderLimiter, requireCsrf, async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }

  const { items } = parsed.data;

  // Re-price the cart entirely from the server catalog. Nothing about price
  // is ever taken from the request.
  let amount = 0;
  const priced = [];
  for (const item of items) {
    const product = getProductById(item.id);
    if (!product) {
      return res.status(400).json({ error: `Unknown product: ${item.id}` });
    }
    if (product.sizes?.length && item.size && !product.sizes.includes(item.size)) {
      return res.status(400).json({ error: `Invalid size for ${item.id}` });
    }
    const lineTotal = product.price * item.qty;
    amount += lineTotal;
    priced.push({ id: product.id, name: product.name, qty: item.qty, size: item.size ?? null, unitPrice: product.price });
  }

  if (amount <= 0 || amount > 5_00_00_000) {
    // sanity ceiling: ₹5,00,000 — adjust for your catalog if needed
    return res.status(400).json({ error: 'Order amount out of range' });
  }

  try {
    const razorpay = getRazorpayClient();
    const receipt = `ninety_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt,
      notes: { source: 'ninety-plus-web' },
    });

    insertOrder({
      id: crypto.randomUUID(),
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency: 'INR',
      items: priced,
    });

    res.status(201).json({
      orderId: razorpayOrder.id,
      amount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    req.log?.error?.(err);
    console.error('Order creation failed:', err.message);
    res.status(502).json({ error: 'Unable to create order right now. Please try again.' });
  }
});
