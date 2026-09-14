import Razorpay from 'razorpay';

let client = null;

// Lazily constructed so the server can boot (e.g. for local frontend work)
// even before Razorpay keys are configured; routes that need it will fail
// clearly instead of crashing the whole process at import time.
export function getRazorpayClient() {
  if (client) return client;

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay keys are not configured. Set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in .env');
  }

  client = new Razorpay({ key_id, key_secret });
  return client;
}
