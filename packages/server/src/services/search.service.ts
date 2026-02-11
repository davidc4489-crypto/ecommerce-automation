import type { SearchQuery, SearchResult } from '@ecommerce-automation/shared';
import { loginFlow, searchFlow } from '@ecommerce-automation/automation';
import { getBrowserForRun } from './automation.service.js';
import { runStore } from '../stores/run-store.js';
import pino from 'pino';

const logger = pino({ name: 'search-service' });

export async function startSearch(runId: string, query: SearchQuery): Promise<void> {
  const manager = await getBrowserForRun(runId);

  try {
    runStore.updateStatus(runId, 'running');
    const page = await manager.launch();

    // Login first
    runStore.addStep(runId, { name: 'login', status: 'running', startedAt: new Date().toISOString() });
    await loginFlow(page);
    runStore.addStep(runId, { name: 'login', status: 'completed', completedAt: new Date().toISOString() });

    // Search
    runStore.addStep(runId, { name: 'search', status: 'running', startedAt: new Date().toISOString() });
    const result = await searchFlow(page, query);
    runStore.addStep(runId, { name: 'search', status: 'completed', completedAt: new Date().toISOString() });

    runStore.setResult(runId, result);
    runStore.updateStatus(runId, 'completed');

    logger.info({ runId, productCount: result.products.length }, 'Search completed');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ runId, error: message }, 'Search failed');
    runStore.setError(runId, message);
  }
}
