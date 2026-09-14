// Placeholder plate for a history moment. Drop a photo at
// /public/history/<id>.jpg and it renders in place of this automatically.
import { useState } from 'react';

export default function HistoryVisual({ entry }) {
  const [error, setError] = useState(false);
  const src = `/history/${entry.id}.jpg`;

  if (!error) {
    return (
      <img
        src={src}
        alt={`${entry.year} — ${entry.title}`}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#171712] via-[#0e0e0c] to-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #f4f4ef 0, #f4f4ef 1px, transparent 1px, transparent 14px)',
      }} />
      <span className="font-display font-extrabold text-6xl md:text-8xl text-cream/15">{entry.year}</span>
    </div>
  );
}
