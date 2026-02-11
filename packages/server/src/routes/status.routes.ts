import { Router, type Request, type Response } from 'express';
import { runStore } from '../stores/run-store.js';
import * as path from 'path';
import * as fs from 'fs';

const router = Router();

// SSE endpoint for real-time status updates
router.get('/status/:runId', (req: Request, res: Response) => {
  const { runId } = req.params;
  const run = runStore.getRun(runId);

  if (!run) {
    res.status(404).json({ error: 'Run not found' });
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // Send current state
  res.write(`data: ${JSON.stringify(run)}\n\n`);

  // Listen for updates
  const onUpdate = (updatedRun: unknown) => {
    res.write(`data: ${JSON.stringify(updatedRun)}\n\n`);
  };

  runStore.on(`update:${runId}`, onUpdate);

  req.on('close', () => {
    runStore.off(`update:${runId}`, onUpdate);
  });
});

// Get results
router.get('/results/:runId', (req: Request, res: Response) => {
  const { runId } = req.params;
  const run = runStore.getRun(runId);

  if (!run) {
    res.status(404).json({ error: 'Run not found' });
    return;
  }

  res.json({
    runId: run.runId,
    status: run.status,
    result: run.result,
    error: run.error,
    steps: run.steps,
  });
});

// Serve screenshot
router.get('/screenshot/:runId', (req: Request, res: Response) => {
  const { runId } = req.params;
  const run = runStore.getRun(runId);

  if (!run) {
    res.status(404).json({ error: 'Run not found' });
    return;
  }

  // Find screenshot from steps
  const screenshotStep = run.steps.find((s) => s.screenshot);
  if (!screenshotStep?.screenshot) {
    res.status(404).json({ error: 'No screenshot available' });
    return;
  }

  const screenshotPath = path.resolve(screenshotStep.screenshot);
  if (!fs.existsSync(screenshotPath)) {
    res.status(404).json({ error: 'Screenshot file not found' });
    return;
  }

  res.sendFile(screenshotPath);
});

export default router;
