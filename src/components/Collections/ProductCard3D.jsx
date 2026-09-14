import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { formatINR } from '../../data/products.js';
import ProductVisual from './ProductVisual.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function ProductCard3D({ product }) {
  const ref = useRef(null);
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);
  const [size, setSize] = useState('M');
  const [added, setAdded] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springConfig = { stiffness: 220, damping: 20, mass: 0.6 };
  const spx = useSpring(px, springConfig);
  const spy = useSpring(py, springConfig);

  const rotateX = useTransform(spy, [0, 1], [10, -10]);
  const rotateY = useTransform(spx, [0, 1], [-12, 12]);
  const glowX = useTransform(spx, [0, 1], ['0%', '100%']);
  const glowY = useTransform(spy, [0, 1], ['0%', '100%']);

  function handleMove(e) {
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  function handleAdd() {
    addItem(product.id, size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        className="relative aspect-[5/6] rounded-sm overflow-hidden bg-[#141412] border border-cream/10 cursor-pointer select-none"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(244,244,239,0.18), transparent 60%)`
            ),
          }}
        />
        <div style={{ transform: 'translateZ(40px)' }} className="w-full h-full">
          {!imgError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <ProductVisual product={product} />
          )}
        </div>
      </motion.div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-cream/45 text-xs tracking-widest2 uppercase">{product.category}</p>
          <h3 className="font-display font-semibold text-lg leading-snug mt-1">{product.name}</h3>
          <p className="text-brand-live font-semibold mt-1">{formatINR(product.price)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="bg-transparent border border-cream/20 text-sm px-2 py-2 rounded-sm text-cream/80 focus:outline-none focus:border-brand-live"
          aria-label={`Size for ${product.name}`}
        >
          {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
            <option key={s} value={s} className="bg-ink">
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="flex-1 border border-cream/25 hover:border-brand-live hover:text-brand-live transition-colors duration-200 text-sm tracking-widest2 uppercase py-2.5"
        >
          {added ? 'Added ✓' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
