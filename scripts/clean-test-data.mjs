import { Client } from 'pg';

const TEST_NAME_PREFIXES = ['qa-good-%', 'qa-bad-%'];
const HARDCODED_BAD_NAMES = ['Producto Demo'];

function assertSafeDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('Falta DATABASE_URL.');
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Limpieza bloqueada: NODE_ENV=production.');
  }

  if (process.env.CONFIRM_TEST_DB !== '1') {
    throw new Error(
      'Limpieza bloqueada: ejecuta con CONFIRM_TEST_DB=1 para confirmar que es una base de prueba.',
    );
  }

  const host = new URL(databaseUrl).hostname;
  const allowedHosts = ['localhost', '127.0.0.1', '::1', 'db'];
  if (!allowedHosts.includes(host)) {
    throw new Error(
      `Limpieza bloqueada: el host "${host}" no es una base local de prueba.`,
    );
  }

  return databaseUrl;
}

const databaseUrl = assertSafeDatabase();
const client = new Client({ connectionString: databaseUrl });

try {
  await client.connect();

  const byPrefix = await client.query(
    'DELETE FROM "Product" WHERE name LIKE ANY($1::text[])',
    [TEST_NAME_PREFIXES],
  );

  const byName = await client.query(
    'DELETE FROM "Product" WHERE name = ANY($1::text[])',
    [HARDCODED_BAD_NAMES],
  );

  console.log(
    `Datos de prueba eliminados: ${byPrefix.rowCount} por prefijo, ${byName.rowCount} por nombre fijo.`,
  );
} finally {
  await client.end();
}
