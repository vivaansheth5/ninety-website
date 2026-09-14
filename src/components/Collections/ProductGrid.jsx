import { PRODUCTS } from '../../data/products.js';
import ProductCard3D from './ProductCard3D.jsx';

export default function ProductGrid({ limit }) {
  const items = limit ? PRODUCTS.slice(0, limit) : PRODUCTS;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
      {items.map((product) => (
        <ProductCard3D key={product.id} product={product} />
      ))}
    </div>
  );
}
