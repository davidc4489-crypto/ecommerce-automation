export type RunStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AutomationStep {
  name: string;
  status: RunStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  error?: string;
  screenshot?: string;
}

export interface AutomationRun {
  runId: string;
  status: RunStatus;
  steps: AutomationStep[];
  result?: unknown;
  error?: string;
  createdAt: string;
  updatedAt: string;
}
