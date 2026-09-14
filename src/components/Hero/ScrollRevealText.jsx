import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const QUOTE =
  "From Maradona's Hand of God to Ronaldinho's Joga Bonito, we've loved every minute of this beautiful game. It runs in the soul of our youth. It's about time we found clothing that represented that.";

function Word({ word, index, total, progress }) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const blur = useTransform(progress, [start, end], [6, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.span className="inline-block mr-[0.28em]" style={{ opacity, filter }}>
      {word}
    </motion.span>
  );
}

export default function ScrollRevealText() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.35'],
  });

  const words = QUOTE.split(' ');

  return (
    <section ref={ref} className="relative py-[26vh] md:py-[34vh]">
      <div className="container-px sticky top-24 md:top-32">
        <p className="max-w-5xl font-display font-semibold text-[28px] leading-[1.35] sm:text-[34px] sm:leading-[1.32] md:text-[46px] md:leading-[1.28] tracking-tight">
          {words.map((w, i) => (
            <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
          ))}
        </p>
      </div>
    </section>
  );
}
