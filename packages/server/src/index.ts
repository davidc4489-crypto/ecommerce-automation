import { createApp } from './app.js';
import { config } from './config.js';
import pino from 'pino';

const logger = pino({ name: 'server' });

const app = createApp();

app.listen(config.port, () => {
  logger.info({ port: config.port, env: config.nodeEnv }, 'Server started');
});
