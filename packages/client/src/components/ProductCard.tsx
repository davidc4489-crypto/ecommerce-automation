import React from 'react';

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageURL?: string;
}

interface Props {
  product: Product;
  onBuy: (productId: string) => void;
  disabled: boolean;
}

export default function ProductCard({ product, onBuy, disabled }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      {product.imageURL && (
        <img
          src={product.imageURL}
          alt={product.title}
          className="w-full h-40 object-contain mb-3 rounded"
        />
      )}
      <h3 className="font-medium text-gray-800 mb-1">{product.title}</h3>
      <p className="text-lg font-bold text-green-600 mb-3">
        ${product.price.toFixed(2)}
      </p>
      <button
        onClick={() => onBuy(product.id)}
        disabled={disabled}
        className="mt-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Buy
      </button>
    </div>
  );
}
