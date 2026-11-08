import { Client } from 'pg';

const ALLOWED_HOSTS = ['localhost', '127.0.0.1', '::1', 'db'];

function getSafeConnectionString(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('Falta DATABASE_URL para la limpieza de datos de prueba.');
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Limpieza bloqueada: NODE_ENV=production.');
  }

  const host = new URL(databaseUrl).hostname;
  if (!ALLOWED_HOSTS.includes(host) && process.env.ALLOW_REMOTE_TEST_DB !== '1') {
    throw new Error(
      `Limpieza bloqueada: "${host}" no parece una base local de prueba.`,
    );
  }

  return databaseUrl;
}

async function withClient<T>(action: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client({ connectionString: getSafeConnectionString() });
  await client.connect();
  try {
    return await action(client);
  } finally {
    await client.end();
  }
}

export async function deleteProductsByNamePrefix(prefix: string): Promise<void> {
  if (!/^qa-good-[a-z0-9-]+$/i.test(prefix)) {
    throw new Error(`Prefijo de limpieza no permitido: ${prefix}`);
  }

  await withClient(async (client) => {
    await client.query('DELETE FROM "Product" WHERE name LIKE $1', [
      `${prefix}%`,
    ]);
  });
}

/**
 * Elimina restos de ejecuciones anteriores que hayan quedado por una
 * interrupción. Solo borra datos con el prefijo de la suite buena y con más de
 * una hora de antigüedad, para no interferir con otra ejecución en curso.
 */
export async function deleteStaleTestProducts(): Promise<void> {
  await withClient(async (client) => {
    await client.query(
      `DELETE FROM "Product"
       WHERE name LIKE 'qa-good-%'
         AND "createdAt" < NOW() - INTERVAL '1 hour'`,
    );
  });
}
