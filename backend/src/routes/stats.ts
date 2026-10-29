import { Router } from 'express';
import db from "../db.ts";

const router = Router({ mergeParams: true });

router.get<{ id: string }>('/', async (req, res) => {
  const serviceId = req.params.id;
  try {
    const range = req.query.range as string || '24h';

    const intervals: Record<string, string> = {
      '1h': '1 hour',
      '6h': '6 hours',
      '24h': '24 hours',
      '7d': '7 days',
      '30d': '30 days',
    };

    const interval = intervals[range];

    if (!interval) {
      res.status(400).json({
        error: 'Invalid range. Use 1h, 6h, 24h, 7d, or 30d.'
      });
      return;
    }

    const checks = await db.any(
      `
      SELECT
        checked_at,
        response_time_ms,
        status_code,
        status
      FROM checks
      WHERE service_id = $1
        AND checked_at >= NOW() - $2::interval
      ORDER BY checked_at ASC
      `,
      [serviceId, interval]
    );

    if (checks.length === 0) {
      res.status(404).json({ error: 'Service history data not found' });
      return;
    }

    const latencies = checks
    .map((check) => check.response_time_ms)
    .filter((latency): latency is number => latency !== null)
    .sort((a, b) => a - b);

    const averageLatency =
    latencies.length > 0
        ? latencies.reduce((sum, latency) => sum + latency, 0) /
        latencies.length
        : null;

    const p95Latency =
    latencies.length > 0
        ? latencies[Math.ceil(latencies.length * 0.95) - 1]
        : null;

    const uptimePercentage =
    checks.length > 0
        ? (checks.filter((check) => check.status === 'up').length /
            checks.length) *
        100
        : 0;

    const incidents = checks.filter(
    (check, index) =>
        check.status === 'down' &&
        (index === 0 || checks[index - 1].status !== 'down')
    ).length;

    res.json({
    averageLatency,
    p95Latency,
    uptimePercentage,
    incidents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;