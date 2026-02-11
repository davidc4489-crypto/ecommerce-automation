import { Router, type Request, type Response } from 'express';
import { cartAddSchema } from '@ecommerce-automation/shared';
import { validate } from '../middleware/validation.js';
import { runStore } from '../stores/run-store.js';
import { addToCart } from '../services/purchase.service.js';

const router = Router();

router.post('/add', validate(cartAddSchema), (req: Request, res: Response) => {
  const { runId, productId, selectionPolicy } = req.body;
  const run = runStore.getRun(runId);
  if (!run) {
    res.status(404).json({ error: 'Run not found' });
    return;
  }
  // Start add-to-cart async
  addToCart(runId, productId, selectionPolicy);
  res.json({ runId, status: 'running' });
});

export default router;
