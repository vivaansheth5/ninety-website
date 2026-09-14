import { motion } from 'framer-motion';
import { HISTORY } from '../data/history.js';
import HistoryVisual from '../components/History/HistoryVisual.jsx';

function Connector() {
  return (
    <div className="flex justify-center py-6 md:py-10" aria-hidden="true">
      <svg width="18" height="40" viewBox="0 0 18 40" fill="none" stroke="#4aa870" strokeWidth="1.6">
        <line x1="9" y1="0" x2="9" y2="30" />
        <path d="M2 24 9 32 16 24" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Entry({ entry, reverse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}
    >
      <div className="aspect-[4/3] rounded-sm overflow-hidden border border-cream/10">
        <HistoryVisual entry={entry} />
      </div>
      <div>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-display font-extrabold text-4xl md:text-5xl text-brand-live">{entry.year}</span>
          {entry.minute && <span className="text-cream/45 text-sm tracking-widest2 uppercase">{entry.minute}</span>}
        </div>
        <h3 className="font-display font-bold text-2xl md:text-3xl mb-2">{entry.title}</h3>
        <p className="text-cream/50 text-xs tracking-widest2 uppercase mb-5">{entry.kicker}</p>
        <p className="text-cream/75 leading-relaxed max-w-md">{entry.body}</p>
      </div>
    </motion.div>
  );
}

export default function History() {
  return (
    <div className="pt-36 pb-32">
      <div className="container-px text-center mb-20 md:mb-28">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display font-extrabold text-5xl md:text-7xl leading-[0.95]"
        >
          FOOTBALL
          <br />
          HAS A MEMORY.
        </motion.h1>
      </div>

      <div className="container-px max-w-5xl mx-auto flex flex-col">
        {HISTORY.map((entry, i) => (
          <div key={entry.id}>
            <Entry entry={entry} reverse={i % 2 === 1} />
            {i < HISTORY.length - 1 && <Connector />}
          </div>
        ))}
      </div>

      <div className="container-px text-center mt-24 md:mt-32">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display font-extrabold text-4xl md:text-6xl"
        >
          FOOTBALL NEVER ENDS.
        </motion.h2>
      </div>
    </div>
  );
}
