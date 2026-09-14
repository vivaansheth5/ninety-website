// Generated placeholder art for a product — swap for a real photo by
// dropping a file at /public/products/<id>.jpg and it will be used instead
// (see ProductCard3D's onError fallback).
export default function ProductVisual({ product }) {
  const { name, number, accent, accent2, category } = product;
  return (
    <svg viewBox="0 0 400 480" className="w-full h-full" style={{ transform: 'translateZ(0)' }}>
      <defs>
        <linearGradient id={`bg-${product.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0b0b0a" />
        </linearGradient>
      </defs>
      <rect width="400" height="480" fill={`url(#bg-${product.id})`} />
      <circle cx="330" cy="60" r="140" fill={accent2} fillOpacity="0.08" />
      <circle cx="40" cy="430" r="100" fill={accent2} fillOpacity="0.08" />
      {/* jersey silhouette */}
      <path
        d="M140 70 L100 100 L120 150 L150 135 V400 H250 V135 L280 150 L300 100 L260 70 L230 90 H170 Z"
        fill="none"
        stroke={accent2}
        strokeOpacity="0.85"
        strokeWidth="3"
      />
      <text x="200" y="270" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="96" fill={accent2} fillOpacity="0.9">
        {number}
      </text>
      <text
        x="24"
        y="440"
        fontFamily="Archivo, sans-serif"
        fontWeight="600"
        fontSize="13"
        letterSpacing="3"
        fill={accent2}
        fillOpacity="0.6"
      >
        {category.toUpperCase()}
      </text>
      <text x="24" y="460" fontFamily="Archivo, sans-serif" fontWeight="700" fontSize="16" fill={accent2}>
        {name}
      </text>
    </svg>
  );
}
