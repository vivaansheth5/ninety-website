import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = __dirname;

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'store.sqlite');
export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT,
    status TEXT NOT NULL DEFAULT 'created',
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    items_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export function insertOrder({ id, razorpayOrderId, amount, currency, items }) {
  db.prepare(
    `INSERT INTO orders (id, razorpay_order_id, status, amount, currency, items_json)
     VALUES (?, ?, 'created', ?, ?, ?)`
  ).run(id, razorpayOrderId, amount, currency, JSON.stringify(items));
}

export function getOrderByRazorpayId(razorpayOrderId) {
  return db.prepare(`SELECT * FROM orders WHERE razorpay_order_id = ?`).get(razorpayOrderId);
}

export function markOrderPaid(razorpayOrderId, razorpayPaymentId) {
  db.prepare(
    `UPDATE orders SET status = 'paid', razorpay_payment_id = ?, updated_at = datetime('now')
     WHERE razorpay_order_id = ?`
  ).run(razorpayPaymentId, razorpayOrderId);
}

export function markOrderFailed(razorpayOrderId) {
  db.prepare(
    `UPDATE orders SET status = 'failed', updated_at = datetime('now') WHERE razorpay_order_id = ?`
  ).run(razorpayOrderId);
}
