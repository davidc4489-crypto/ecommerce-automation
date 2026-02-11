import { useEffect, useState, useCallback } from 'react';
import { createSSEConnection, type AutomationRun } from '../api/status.api.js';

export function useAutomationStatus(runId: string | null) {
  const [run, setRun] = useState<AutomationRun | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!runId) return;

    const es = createSSEConnection(runId, (data) => {
      setRun(data);
      if (data.error) {
        setError(data.error);
      }
    });

    es.onerror = () => {
      setError('Connection lost');
      es.close();
    };

    return () => {
      es.close();
    };
  }, [runId]);

  const reset = useCallback(() => {
    setRun(null);
    setError(null);
  }, []);

  return { run, error, reset };
}
