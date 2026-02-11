import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm.js';
import StepTracker from '../components/StepTracker.js';
import ScreenshotViewer from '../components/ScreenshotViewer.js';
import ErrorBanner from '../components/ErrorBanner.js';
import { startCheckout } from '../api/checkout.api.js';
import { useAutomationStatus } from '../hooks/useAutomationStatus.js';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    runId?: string;
    items?: { id: string; title: string; price: number; imageURL?: string }[];
  } | null;
  const runId = state?.runId || null;
  const items = state?.items || [];
  const { run } = useAutomationStatus(runId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  if (!runId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No active automation run. Start by searching for products.</p>
        <button
          onClick={() => navigate('/search')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Go to Search
        </button>
      </div>
    );
  }

  const handleCheckout = async (
    shipping: { address: string; city: string; state: string; country: string; postcode: string },
    payment: { method: string; bankName?: string; accountName?: string; accountNumber?: string },
  ) => {
    setLoading(true);
    setError(null);

    try {
      await startCheckout({ runId, shipping, payment });

      // Poll for completion
      const poll = setInterval(async () => {
        try {
          const res = await fetch(`/api/results/${runId}`);
          const data = await res.json();
          const checkoutStep = data.steps?.find((s: { name: string }) => s.name === 'checkout');
          if (checkoutStep?.status === 'completed') {
            clearInterval(poll);
            setLoading(false);
            setCompleted(true);
          } else if (data.status === 'failed') {
            clearInterval(poll);
            setLoading(false);
            setError(data.error || 'Checkout failed');
          }
        } catch {
          // Continue polling
        }
      }, 2000);

      setTimeout(() => {
        clearInterval(poll);
        if (loading) {
          setLoading(false);
          setError('Checkout timed out');
        }
      }, 120000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

      {items.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 space-y-2">
          <h3 className="font-medium text-gray-700">Order Summary</h3>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2">
              <span>{item.title}</span>
              <span className="text-green-600 font-bold">${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2 font-bold">
            <span>Total</span>
            <span>${items.reduce((sum, i) => sum + i.price, 0).toFixed(2)}</span>
          </div>
        </div>
      )}

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {run && run.steps.length > 0 && <StepTracker steps={run.steps} />}

      {completed ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-2">Order Complete!</h2>
            <p>Payment was successful. See the confirmation screenshot below.</p>
          </div>
          <ScreenshotViewer runId={runId} />
          <button
            onClick={() => navigate('/search')}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Start New Search
          </button>
        </div>
      ) : (
        <CheckoutForm onCheckout={handleCheckout} loading={loading} />
      )}
    </div>
  );
}
