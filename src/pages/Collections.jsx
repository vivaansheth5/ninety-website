import { motion } from 'framer-motion';
import ProductGrid from '../components/Collections/ProductGrid.jsx';

export default function Collections() {
  return (
    <div className="pt-36 pb-24 container-px">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <p className="text-cream/45 text-xs tracking-widest2 uppercase mb-3">Full range</p>
        <h1 className="font-display font-extrabold text-4xl md:text-6xl mb-4">Collections</h1>
        <p className="text-cream/55 max-w-xl mb-16">
          Streetwear built from football's biggest moments. Hover any piece — it moves with you.
        </p>
      </motion.div>
      <ProductGrid />
    </div>
  );
}
