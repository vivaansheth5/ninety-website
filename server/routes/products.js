import { Router } from 'express';
import { getActiveProducts } from '../data/products.js';

export const productsRouter = Router();

productsRouter.get('/', (req, res) => {
  // Only ever return the fields the storefront needs; keeps the internal
  // catalog shape (e.g. `active`) from leaking.
  const products = getActiveProducts().map(({ id, name, category, price, sizes }) => ({
    id,
    name,
    category,
    price,
    sizes,
  }));
  res.json({ products });
});
