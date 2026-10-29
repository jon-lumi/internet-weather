import db from '../db.js';
import pgPromise from 'pg-promise';
import { checkWebsite } from './checker.js';

const pgp = pgPromise();

async function runChecks() {
  const services = await db.any(
    'SELECT id, url FROM services ORDER BY id'
  );

  console.log(`Checking ${services.length} services...`);

  const start = performance.now();

  const results = await Promise.all(
    services.map((service) => checkWebsite(service))
  );

  const rows = results.map((result) => ({
    service_id: result.serviceId,
    checked_at: new Date(),
    response_time_ms: result.responseTimeMs,
    status_code: result.statusCode,
    status: result.status,
  }));

  const insertQuery = pgp.helpers.insert(
    rows,
    [
      'service_id',
      'checked_at',
      'response_time_ms',
      'status_code',
      'status',
    ],
    'checks'
  );

  await db.none(insertQuery);
  await db.none('NOTIFY checks_updated');

  console.log(
    `Checked and saved ${results.length} services in ${
      Math.round(performance.now() - start)
    } ms`
  );
}

async function startScheduler() {
  while (true) {
    try {
      await runChecks();
    } catch (error) {
      console.error('Worker run failed:', error);
    }

    await new Promise((resolve) => setTimeout(resolve, 60_000));
  }
}

startScheduler();