import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import OpeningAnimation from '../components/OpeningAnimation/OpeningAnimation.jsx';
import ScrollRevealText from '../components/Hero/ScrollRevealText.jsx';
import ProductGrid from '../components/Collections/ProductGrid.jsx';
import FloatingReviews from '../components/Reviews/FloatingReviews.jsx';

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <OpeningAnimation onComplete={() => setIntroDone(true)} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <section className="min-h-screen flex flex-col justify-end pb-20 pt-32 container-px">
          <p className="text-brand-live text-xs tracking-widest2 uppercase mb-5">Football streetwear</p>
          <h1 className="font-display font-extrabold text-[13vw] sm:text-[9vw] md:text-[6.5vw] leading-[0.92] tracking-tight max-w-5xl">
            CLOTHING FOR
            <br />
            THE BEAUTIFUL GAME.
          </h1>
          <div className="mt-10 flex items-center gap-6">
            <Link
              to="/collections"
              className="border border-cream px-7 py-3.5 text-sm tracking-widest2 uppercase hover:bg-cream hover:text-ink transition-colors duration-300"
            >
              Shop Collections
            </Link>
            <Link to="/history" className="text-sm tracking-widest2 uppercase text-cream/55 hover:text-cream transition-colors">
              Our History →
            </Link>
          </div>
        </section>

        <ScrollRevealText />

        <section id="collections" className="py-20 md:py-28">
          <div className="container-px">
            <div className="flex items-end justify-between mb-14 gap-6">
              <div>
                <p className="text-cream/45 text-xs tracking-widest2 uppercase mb-3">The collection</p>
                <h2 className="font-display font-bold text-3xl md:text-5xl">Built off the pitch.</h2>
              </div>
              <Link
                to="/collections"
                className="hidden sm:block text-sm tracking-widest2 uppercase text-cream/55 hover:text-cream transition-colors shrink-0"
              >
                View all →
              </Link>
            </div>
            <ProductGrid limit={6} />
          </div>
        </section>

        <FloatingReviews />
      </motion.div>
    </>
  );
}
