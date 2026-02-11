import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StepTracker from '../components/StepTracker.js';
import ErrorBanner from '../components/ErrorBanner.js';
import { useAutomationStatus } from '../hooks/useAutomationStatus.js';

interface CartProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageURL?: string;
  runId: string;
}

export default function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { runId?: string; product?: CartProduct } | null;
  const { run } = useAutomationStatus(state?.runId || null);
  const [items, setItems] = useState<CartProduct[]>([]);
  const [addingDone, setAddingDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart items from server
  const loadCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Track when add-to-cart completes, then reload cart
  useEffect(() => {
    if (!run) return;
    const cartStep = run.steps.find((s) => s.name === 'add-to-cart');
    if (cartStep?.status === 'completed') {
      setAddingDone(true);
      loadCart();
    } else if (cartStep?.status === 'failed') {
      setError(cartStep.error || 'Add to cart failed');
    }
  }, [run]);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  // Use the latest runId from the most recent item
  const latestRunId = items.length > 0 ? items[items.length - 1].runId : state?.runId;

  const handleProceed = () => {
    navigate('/checkout', { state: { runId: latestRunId, items } });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {run && run.steps.length > 0 && <StepTracker steps={run.steps} />}

      {state?.product && !addingDone && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          Adding "{state.product.title}" to cart...
        </div>
      )}

      {items.length > 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  {item.imageURL && (
                    <img src={item.imageURL} alt={item.title} className="w-12 h-12 object-contain rounded" />
                  )}
                  <div>
                    <p className="font-medium">{item.title}</p>
                  </div>
                </div>
                <p className="text-green-600 font-bold">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <p className="text-lg font-bold">Total: ${subtotal.toFixed(2)}</p>
            <button
              onClick={handleProceed}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        !state?.product && (
          <p className="text-gray-500 text-center py-8">
            Cart is empty.{' '}
            <button onClick={() => navigate('/search')} className="text-blue-600 underline">
              Search for products
            </button>
          </p>
        )
      )}
    </div>
  );
}
