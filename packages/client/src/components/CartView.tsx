import React from 'react';

interface Product {
  id: string;
  title: string;
  price: number;
}

interface Props {
  product: Product | null;
  onProceed: () => void;
  disabled: boolean;
}

export default function CartView({ product, onProceed, disabled }: Props) {
  if (!product) {
    return <p className="text-gray-500">No product in cart yet. Search and buy a product first.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Cart</h2>
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div>
          <p className="font-medium">{product.title}</p>
          <p className="text-green-600 font-bold">${product.price.toFixed(2)}</p>
        </div>
        <span className="text-gray-500">Qty: 1</span>
      </div>
      <button
        onClick={onProceed}
        disabled={disabled}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
