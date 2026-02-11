import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CartView from '../components/CartView.js';
import StepTracker from '../components/StepTracker.js';
import { useAutomationStatus } from '../hooks/useAutomationStatus.js';

export default function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { runId?: string; product?: { id: string; title: string; price: number } } | null;
  const { run } = useAutomationStatus(state?.runId || null);

  const handleProceed = () => {
    navigate('/checkout', { state });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
      {run && run.steps.length > 0 && <StepTracker steps={run.steps} />}
      <CartView
        product={state?.product || null}
        onProceed={handleProceed}
        disabled={!state?.runId}
      />
      {!state?.runId && (
        <p className="text-gray-500 text-center">
          Start by{' '}
          <button onClick={() => navigate('/search')} className="text-blue-600 underline">
            searching for products
          </button>
          .
        </p>
      )}
    </div>
  );
}
