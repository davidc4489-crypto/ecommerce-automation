import { Router, type Request, type Response } from 'express';
import { cartAddSchema } from '@ecommerce-automation/shared';
import { validate } from '../middleware/validation.js';
import { runStore } from '../stores/run-store.js';
import { cartStore } from '../stores/cart-store.js';
import { addToCart } from '../services/purchase.service.js';

const router = Router();

// Get all cart items
router.get('/', (_req: Request, res: Response) => {
  res.json({ items: cartStore.getItems() });
});

// Add product to cart
router.post('/add', validate(cartAddSchema), (req: Request, res: Response) => {
  const { runId, productId, selectionPolicy } = req.body;
  const run = runStore.getRun(runId);
  if (!run) {
    res.status(404).json({ error: 'Run not found' });
    return;
  }
  addToCart(runId, productId, selectionPolicy);
  res.json({ runId, status: 'running' });
});

// Clear cart
router.delete('/', (_req: Request, res: Response) => {
  cartStore.clear();
  res.json({ status: 'ok' });
});

export default router;
