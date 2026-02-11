import { apiGet } from './client.js';

export interface AutomationStep {
  name: string;
  status: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  error?: string;
  screenshot?: string;
}

export interface AutomationRun {
  runId: string;
  status: string;
  steps: AutomationStep[];
  result?: unknown;
  error?: string;
}

export function createSSEConnection(runId: string, onMessage: (run: AutomationRun) => void): EventSource {
  const es = new EventSource(`/api/status/${runId}`);

  es.onmessage = (event) => {
    const data = JSON.parse(event.data) as AutomationRun;
    onMessage(data);
  };

  return es;
}

export function getResults(runId: string): Promise<AutomationRun> {
  return apiGet<AutomationRun>(`/results/${runId}`);
}
