import React from 'react';
import type { AutomationStep } from '../api/status.api.js';

interface Props {
  steps: AutomationStep[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-200 text-gray-600',
  running: 'bg-blue-200 text-blue-700',
  completed: 'bg-green-200 text-green-700',
  failed: 'bg-red-200 text-red-700',
};

export default function StepTracker({ steps }: Props) {
  if (steps.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Automation Progress</h3>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${statusColors[step.status] || statusColors.pending}`}
            >
              {step.status}
            </span>
            <span className="text-gray-700">{step.name}</span>
            {step.durationMs !== undefined && (
              <span className="text-gray-400 text-sm">{step.durationMs}ms</span>
            )}
            {step.error && <span className="text-red-500 text-sm">{step.error}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
