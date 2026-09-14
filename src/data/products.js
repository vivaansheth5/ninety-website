// Display-only catalog for the storefront. Ids MUST match server/data/products.js —
// that file is the only place price is authoritative; this copy is for
// rendering. To add or replace a product: drop a photo at
// /public/products/<id>.jpg (or leave it out for the generated placeholder),
// add an entry here, and add the matching priced entry on the server.
export const PRODUCTS = [
  {
    id: 'joga-bonito-tee',
    name: 'Joga Bonito Tee',
    category: 'Tees',
    price: 2499,
    number: '10',
    accent: '#1e5632',
    accent2: '#4aa870',
    blurb: 'Heavyweight cotton, silhouette lifted from Ronaldinho’s step-over.',
    image: '/products/joga-bonito-tee.jpg',
  },
  {
    id: 'hand-of-god-jersey',
    name: "Hand of God '86 Jersey",
    category: 'Jerseys',
    price: 3499,
    number: '86',
    accent: '#0b0b0a',
    accent2: '#f4f4ef',
    blurb: 'Retro-cut jersey commemorating four minutes that broke the internet before the internet.',
    image: '/products/hand-of-god-jersey.jpg',
  },
  {
    id: 'invincibles-hoodie',
    name: 'Invincibles Hoodie',
    category: 'Hoodies',
    price: 4299,
    number: '38',
    accent: '#8c1d2b',
    accent2: '#f4f4ef',
    blurb: '38 games, 0 losses, heavyweight fleece built for the terraces.',
    image: '/products/invincibles-hoodie.jpg',
  },
  {
    id: 'la-decima-track-jacket',
    name: 'La Última Danza Track Jacket',
    category: 'Outerwear',
    price: 4599,
    number: '10',
    accent: '#1c3f94',
    accent2: '#f4f4ef',
    blurb: 'One last dance, 36 years in the making. Water-resistant shell.',
    image: '/products/la-decima-track-jacket.jpg',
  },
  {
    id: 'ninety-core-shorts',
    name: 'Ninety+ Core Shorts',
    category: 'Shorts',
    price: 1799,
    number: '90',
    accent: '#0b0b0a',
    accent2: '#4aa870',
    blurb: 'The everyday short. Match-weight fabric, street-weight fit.',
    image: '/products/ninety-core-shorts.jpg',
  },
  {
    id: 'bicycle-kick-windbreaker',
    name: 'Bicycle Kick Windbreaker',
    category: 'Outerwear',
    price: 3999,
    number: '9',
    accent: '#111827',
    accent2: '#facc15',
    blurb: 'Packable shell inspired by the overhead volley that defied gravity.',
    image: '/products/bicycle-kick-windbreaker.jpg',
  },
];

export function formatINR(rupees) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}
