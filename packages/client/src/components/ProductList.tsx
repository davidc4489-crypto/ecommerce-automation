import React from 'react';
import ProductCard from './ProductCard.js';

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageURL?: string;
}

interface Props {
  products: Product[];
  onBuy: (productId: string) => void;
  disabled: boolean;
}

export default function ProductList({ products, onBuy, disabled }: Props) {
  if (products.length === 0) {
    return <p className="text-gray-500 text-center py-8">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onBuy={onBuy} disabled={disabled} />
      ))}
    </div>
  );
}
