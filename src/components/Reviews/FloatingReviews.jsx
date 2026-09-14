import { motion } from 'framer-motion';
import { REVIEWS } from '../../data/reviews.js';

const FLOAT_OFFSETS = [
  { y: [0, -14, 0], duration: 6.5, delay: 0 },
  { y: [0, 12, 0], duration: 7.5, delay: 0.4 },
  { y: [0, -10, 0], duration: 8.2, delay: 0.8 },
  { y: [0, 14, 0], duration: 7, delay: 0.2 },
];

function Stars({ count }) {
  return (
    <div className="flex gap-1 text-brand-live" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M10 1.5 12.47 7l6.03.5-4.57 4 1.36 5.9L10 14.6 4.71 17.4l1.36-5.9L1.5 7.5 7.53 7 10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

export default function FloatingReviews() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-px">
        <p className="text-cream/45 text-xs tracking-widest2 uppercase mb-3">What the terraces say</p>
        <h2 className="font-display font-bold text-3xl md:text-5xl max-w-2xl mb-16">
          Loved by people who actually watch the game.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {REVIEWS.map((review, i) => {
            const float = FLOAT_OFFSETS[i % FLOAT_OFFSETS.length];
            return (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <motion.div
                  animate={{ y: float.y }}
                  transition={{ duration: float.duration, delay: float.delay, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full border border-cream/10 bg-[#131311] p-7 md:p-8 rounded-sm"
                >
                  <Stars count={review.stars} />
                  <p className="mt-5 text-cream/85 leading-relaxed text-[15px] md:text-base">“{review.quote}”</p>
                  <p className="mt-6 font-display font-semibold tracking-widest2 uppercase text-sm text-cream/60">
                    {review.name}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
