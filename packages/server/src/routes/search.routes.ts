import { Router, type Request, type Response } from 'express';
import { searchQuerySchema } from '@ecommerce-automation/shared';
import { validate } from '../middleware/validation.js';
import { runStore } from '../stores/run-store.js';
import { startSearch } from '../services/search.service.js';

const router = Router();

router.post('/', validate(searchQuerySchema), (req: Request, res: Response) => {
  const run = runStore.createRun();
  // Start search async — don't await
  startSearch(run.runId, req.body);
  res.json({ runId: run.runId, status: 'running' });
});

export default router;
