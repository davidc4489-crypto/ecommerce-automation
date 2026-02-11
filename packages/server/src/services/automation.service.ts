import { BrowserManager } from '@ecommerce-automation/automation';
import pino from 'pino';

const logger = pino({ name: 'automation-service' });

// Manage browser instances per run
const browsers = new Map<string, BrowserManager>();

export async function getBrowserForRun(runId: string): Promise<BrowserManager> {
  let manager = browsers.get(runId);
  if (!manager) {
    manager = new BrowserManager();
    browsers.set(runId, manager);
    logger.info({ runId }, 'Created browser manager');
  }
  return manager;
}

export async function closeBrowserForRun(runId: string): Promise<void> {
  const manager = browsers.get(runId);
  if (manager) {
    await manager.close();
    browsers.delete(runId);
    logger.info({ runId }, 'Closed browser manager');
  }
}
