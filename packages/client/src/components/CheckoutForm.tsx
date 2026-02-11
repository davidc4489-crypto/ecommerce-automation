import React, { useState } from 'react';

interface ShippingDetails {
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
}

interface PaymentDetails {
  method: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
}

interface Props {
  onCheckout: (shipping: ShippingDetails, payment: PaymentDetails) => void;
  loading: boolean;
}

export default function CheckoutForm({ onCheckout, loading }: Props) {
  const [shipping, setShipping] = useState<ShippingDetails>({
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'US',
    postcode: '10001',
  });
  const [payment, setPayment] = useState<PaymentDetails>({
    method: 'bank-transfer',
    bankName: 'Test Bank',
    accountName: 'John Doe',
    accountNumber: '1234567890',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckout(shipping, payment);
  };

  const updateShipping = (field: keyof ShippingDetails, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Address</label>
            <input
              type="text"
              value={shipping.address}
              onChange={(e) => updateShipping('address', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">City</label>
            <input
              type="text"
              value={shipping.city}
              onChange={(e) => updateShipping('city', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">State</label>
            <input
              type="text"
              value={shipping.state}
              onChange={(e) => updateShipping('state', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Country</label>
            <input
              type="text"
              value={shipping.country}
              onChange={(e) => updateShipping('country', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Postcode</label>
            <input
              type="text"
              value={shipping.postcode}
              onChange={(e) => updateShipping('postcode', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Method</label>
            <select
              value={payment.method}
              onChange={(e) => setPayment((prev) => ({ ...prev, method: e.target.value }))}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="bank-transfer">Bank Transfer</option>
              <option value="cash-on-delivery">Cash on Delivery</option>
              <option value="credit-card">Credit Card</option>
              <option value="buy-now-pay-later">Buy Now Pay Later</option>
              <option value="gift-card">Gift Card</option>
            </select>
          </div>
          {payment.method === 'bank-transfer' && (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={payment.bankName || ''}
                  onChange={(e) => setPayment((prev) => ({ ...prev, bankName: e.target.value }))}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Account Name</label>
                <input
                  type="text"
                  value={payment.accountName || ''}
                  onChange={(e) => setPayment((prev) => ({ ...prev, accountName: e.target.value }))}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Account Number</label>
                <input
                  type="text"
                  value={payment.accountNumber || ''}
                  onChange={(e) => setPayment((prev) => ({ ...prev, accountNumber: e.target.value }))}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Complete Purchase'}
      </button>
    </form>
  );
}
