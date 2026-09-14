// Server-side product catalog — the ONLY source of truth for prices.
// The client sends product ids + quantities; prices are always looked up here,
// never trusted from the request body. Add/replace products by editing this
// array (and the matching entries in src/data/products.js for display copy).
//
// price is in paise (INR smallest unit) as Razorpay expects.

export const PRODUCTS = [
  {
    id: 'joga-bonito-tee',
    name: 'Joga Bonito Tee',
    category: 'Tees',
    price: 249900,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    active: true,
  },
  {
    id: 'hand-of-god-jersey',
    name: "Hand of God '86 Jersey",
    category: 'Jerseys',
    price: 349900,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    active: true,
  },
  {
    id: 'invincibles-hoodie',
    name: 'Invincibles Hoodie',
    category: 'Hoodies',
    price: 429900,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    active: true,
  },
  {
    id: 'la-decima-track-jacket',
    name: 'La Última Danza Track Jacket',
    category: 'Outerwear',
    price: 459900,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    active: true,
  },
  {
    id: 'ninety-core-shorts',
    name: 'Ninety+ Core Shorts',
    category: 'Shorts',
    price: 179900,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    active: true,
  },
  {
    id: 'bicycle-kick-windbreaker',
    name: 'Bicycle Kick Windbreaker',
    category: 'Outerwear',
    price: 399900,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    active: true,
  },
];

export function getActiveProducts() {
  return PRODUCTS.filter((p) => p.active);
}

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id && p.active);
}
