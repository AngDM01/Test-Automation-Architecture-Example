import { buildApp } from './app.js';
import { env } from './env.js';

const app = buildApp();

const shutdown = async (signal: string) => {
  app.log.info({ signal }, 'Cerrando el servidor');
  await app.close();
  process.exit(0);
};

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

try {
  await app.listen({ host: env.host, port: env.port });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
