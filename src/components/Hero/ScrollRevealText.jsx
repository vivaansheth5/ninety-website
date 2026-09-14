import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const QUOTE =
  "From Maradona's Hand of God to Ronaldinho's Joga Bonito, we've loved every minute of this beautiful game. It runs in the soul of our youth. It's about time we found clothing that represented that.";

// Words finish revealing by REVEAL_END (not 1.0) so the fully-revealed quote
// sits still and readable for the remaining scroll before the section
// releases — otherwise the last word only finishes exactly as the pin lets
// go and reads as cut off.
const REVEAL_END = 0.72;

function Word({ word, index, total, progress }) {
  const start = (index / total) * REVEAL_END;
  const end = start + (1 / total) * REVEAL_END;
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
  // Tracks progress across the FULL pinned duration of the section (from the
  // moment its top hits the viewport top to the moment its bottom leaves the
  // viewport bottom), so progress reliably reaches 1 while still pinned —
  // never releasing the section before the reveal has finished.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const words = QUOTE.split(' ');

  return (
    <section ref={ref} className="relative h-[220vh] md:h-[280vh]">
      <div className="sticky top-0 h-screen flex items-center container-px">
        <p className="max-w-5xl font-display font-semibold text-[28px] leading-[1.35] sm:text-[34px] sm:leading-[1.32] md:text-[46px] md:leading-[1.28] tracking-tight">
          {words.map((w, i) => (
            <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
          ))}
        </p>
      </div>
    </section>
  );
}
