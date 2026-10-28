
import db from '../db.js';

export async function checkWebsite(
  service: { id: number; url: string }
) {
  const start = performance.now();

  let responseTimeMs: number | null = null;
  let statusCode: number | null = null;
  let status = "down";

  try {
    const response = await fetch(service.url, {
      signal: AbortSignal.timeout(10_000),
    });

    responseTimeMs = Math.round(performance.now() - start);
    statusCode = response.status;

    // For now, treat HTTP 2xx and 3xx responses as up.
    status = response.status >= 200 && response.status < 400 ? "up" : "down";
    if (status === "up" && responseTimeMs > 500) {
      status = "degraded";
    }
  } catch (error) {
    // Network errors and timeouts mean the site is unreachable.
    console.error(`Check failed for ${service.url}:`, error);
  }

  try {
    await db.none(
      `INSERT INTO checks
        (service_id, checked_at, response_time_ms, status_code, status)
       VALUES ($1, NOW(), $2, $3, $4)`,
      [service.id, responseTimeMs, statusCode, status]
    );
  } catch (error) {
    console.error(`Failed to save check for ${service.url}:`, error);
  }
}
