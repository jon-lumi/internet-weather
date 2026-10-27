
import db from '../db.js';
import { checkWebsite } from './checker.js';

async function runChecks() {
  const services = await db.any(
    'SELECT id, url FROM services ORDER BY id'
  );

  console.log(`Checking ${services.length} services...`);

  // Check services concurrently.
  await Promise.all(
    services.map((service) => checkWebsite(service))
  );

  await db.none("NOTIFY checks_updated");

  console.log('All checks completed.');
}

async function startScheduler() {
  while (true) {
    try {
      await runChecks();
    } catch (error) {
      console.error('Worker run failed:', error);
    }

    // Wait 60 seconds after the current run finishes.
    await new Promise((resolve) => setTimeout(resolve, 60_000));
  }
}

startScheduler();
