import type { AutomationRun, AutomationStep, RunStatus } from '@ecommerce-automation/shared';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';

class RunStore extends EventEmitter {
  private runs = new Map<string, AutomationRun>();

  createRun(): AutomationRun {
    const run: AutomationRun = {
      runId: uuidv4(),
      status: 'pending',
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.runs.set(run.runId, run);
    return run;
  }

  getRun(runId: string): AutomationRun | undefined {
    return this.runs.get(runId);
  }

  updateStatus(runId: string, status: RunStatus): void {
    const run = this.runs.get(runId);
    if (!run) return;
    run.status = status;
    run.updatedAt = new Date().toISOString();
    this.emit(`update:${runId}`, run);
  }

  addStep(runId: string, step: AutomationStep): void {
    const run = this.runs.get(runId);
    if (!run) return;

    const existing = run.steps.findIndex((s) => s.name === step.name);
    if (existing >= 0) {
      run.steps[existing] = step;
    } else {
      run.steps.push(step);
    }
    run.updatedAt = new Date().toISOString();
    this.emit(`step:${runId}`, step);
    this.emit(`update:${runId}`, run);
  }

  setResult(runId: string, result: unknown): void {
    const run = this.runs.get(runId);
    if (!run) return;
    run.result = result;
    run.updatedAt = new Date().toISOString();
    this.emit(`update:${runId}`, run);
  }

  setError(runId: string, error: string): void {
    const run = this.runs.get(runId);
    if (!run) return;
    run.error = error;
    run.status = 'failed';
    run.updatedAt = new Date().toISOString();
    this.emit(`update:${runId}`, run);
  }
}

export const runStore = new RunStore();
