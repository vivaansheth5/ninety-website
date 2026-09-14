import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext.jsx';
import { formatINR } from '../data/products.js';
import { createOrder, verifyPayment } from '../lib/api.js';
import { loadRazorpayScript } from '../lib/loadRazorpayScript.js';

function QtyStepper({ qty, onChange }) {
  return (
    <div className="flex items-center border border-cream/20 rounded-sm">
      <button
        onClick={() => onChange(qty - 1)}
        disabled={qty <= 1}
        className="w-8 h-8 flex items-center justify-center text-cream/70 hover:text-cream disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-8 text-center text-sm">{qty}</span>
      <button
        onClick={() => onChange(qty + 1)}
        disabled={qty >= 10}
        className="w-8 h-8 flex items-center justify-center text-cream/70 hover:text-cream disabled:opacity-30"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default function Cart() {
  const { lines, subtotal, removeItem, setQty, clear } = useCart();
  const [status, setStatus] = useState('idle'); // idle | processing | success | error
  const [error, setError] = useState('');
  const [paidOrderId, setPaidOrderId] = useState(null);

  async function handleCheckout() {
    setError('');
    setStatus('processing');
    try {
      await loadRazorpayScript();

      const items = lines.map((l) => ({ id: l.id, qty: l.qty, size: l.size || undefined }));
      const order = await createOrder(items);

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Ninety+',
        description: 'Football streetwear order',
        theme: { color: '#1e5632' },
        handler: async (response) => {
          try {
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (result.success) {
              setPaidOrderId(result.orderId);
              setStatus('success');
              clear();
            } else {
              throw new Error('Verification failed');
            }
          } catch (e) {
            setError(e.message || 'Payment could not be verified. If money was deducted, it will be refunded.');
            setStatus('error');
          }
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
      });

      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
        setStatus('error');
      });

      rzp.open();
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="pt-40 pb-32 container-px max-w-xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-full bg-brand-live/15 border border-brand-live flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-brand-live" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-display font-bold text-3xl mb-3">Order confirmed</h1>
          <p className="text-cream/60 mb-1">Payment verified and order placed.</p>
          <p className="text-cream/40 text-sm mb-10">Reference: {paidOrderId}</p>
          <Link to="/collections" className="border border-cream px-7 py-3.5 text-sm tracking-widest2 uppercase hover:bg-cream hover:text-ink transition-colors">
            Keep shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-36 pb-32 container-px">
      <h1 className="font-display font-extrabold text-4xl md:text-6xl mb-14">Cart</h1>

      {lines.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-cream/50 mb-8">Your cart is empty.</p>
          <Link to="/collections" className="border border-cream px-7 py-3.5 text-sm tracking-widest2 uppercase hover:bg-cream hover:text-ink transition-colors">
            Shop Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 flex flex-col divide-y divide-cream/10">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <motion.div
                  key={`${line.id}-${line.size}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-5 py-6"
                >
                  <div className="w-20 h-24 shrink-0 bg-[#141412] rounded-sm overflow-hidden border border-cream/10">
                    <div
                      className="w-full h-full"
                      style={{ background: `linear-gradient(135deg, ${line.product.accent}, #0b0b0a)` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold truncate">{line.product.name}</h3>
                    <p className="text-cream/45 text-xs tracking-widest2 uppercase mt-1">
                      {line.size ? `Size ${line.size}` : line.product.category}
                    </p>
                    <p className="text-brand-live text-sm mt-1">{formatINR(line.product.price)}</p>
                  </div>
                  <QtyStepper qty={line.qty} onChange={(q) => setQty(line.id, line.size, q)} />
                  <p className="w-24 text-right font-semibold">{formatINR(line.lineTotal)}</p>
                  <button
                    onClick={() => removeItem(line.id, line.size)}
                    className="text-cream/35 hover:text-red-400 transition-colors p-2"
                    aria-label={`Remove ${line.product.name}`}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="border border-cream/10 p-7 h-fit sticky top-28">
            <h2 className="font-display font-semibold text-lg mb-6">Order summary</h2>
            <div className="flex justify-between text-cream/70 mb-2">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <p className="text-cream/35 text-xs mb-6">Shipping and taxes calculated at checkout.</p>
            <div className="rule mb-6" />
            <div className="flex justify-between font-semibold text-lg mb-8">
              <span>Total</span>
              <span>{formatINR(subtotal)}</span>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <button
              onClick={handleCheckout}
              disabled={status === 'processing'}
              className="w-full bg-cream text-ink py-4 text-sm tracking-widest2 uppercase font-semibold hover:bg-brand-live transition-colors disabled:opacity-60"
            >
              {status === 'processing' ? 'Processing…' : 'Checkout with Razorpay'}
            </button>
            <p className="text-cream/30 text-[11px] mt-4 text-center">
              Secure checkout. We never see or store your card details.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
