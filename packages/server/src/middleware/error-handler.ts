import type { Request, Response, NextFunction } from 'express';
import pino from 'pino';

const logger = pino({ name: 'server' });

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  logger.error({ err, requestId: req.requestId, path: req.path }, 'Unhandled error');

  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    requestId: req.requestId,
  });
}
