import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm.js';
import ProductList from '../components/ProductList.js';
import StepTracker from '../components/StepTracker.js';
import ErrorBanner from '../components/ErrorBanner.js';
import { startSearch } from '../api/search.api.js';
import { addToCart } from '../api/cart.api.js';
import { useAutomationStatus } from '../hooks/useAutomationStatus.js';

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageURL?: string;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [runId, setRunId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { run } = useAutomationStatus(runId);

  const handleSearch = async (query: string, maxPrice?: number) => {
    setLoading(true);
    setError(null);
    setProducts([]);

    try {
      const res = await startSearch({ query, maxPrice });
      setRunId(res.runId);

      const poll = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/results/${res.runId}`);
          const data = await statusRes.json();
          if (data.status === 'completed' && data.result?.products) {
            setProducts(data.result.products);
            setLoading(false);
            clearInterval(poll);
          } else if (data.status === 'failed') {
            setError(data.error || 'Search failed');
            setLoading(false);
            clearInterval(poll);
          }
        } catch {
          // Continue polling
        }
      }, 2000);

      setTimeout(() => {
        clearInterval(poll);
        setLoading((prev) => {
          if (prev) setError('Search timed out');
          return false;
        });
      }, 90000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setLoading(false);
    }
  };

  const handleBuy = async (productId: string) => {
    if (!runId) return;
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setLoading(true);
    setError(null);

    try {
      await addToCart({ runId, productId, selectionPolicy: 'first' });
      // Navigate to cart immediately — cart page will track progress
      navigate('/cart', { state: { runId, product } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SearchForm onSearch={handleSearch} loading={loading} />
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {run && run.steps.length > 0 && <StepTracker steps={run.steps} />}
      {products.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Found {products.length} product{products.length !== 1 ? 's' : ''}
          </h2>
          <ProductList products={products} onBuy={handleBuy} disabled={loading} />
        </div>
      )}
    </div>
  );
}
