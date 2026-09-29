import { Router } from 'express';
import db from "../db.ts";

const router = Router();

router.get('/api/services/:id/checks', async (req, res) => {
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
        is_up
      FROM checks
      WHERE service_id = $1
        AND checked_at >= NOW() - $2::interval
      ORDER BY checked_at ASC
      `,
      [req.params.id, interval]
    );

    if (checks.length === 0) {
      res.status(404).json({ error: 'Service history data not found' });
      return;
    }

    res.json(checks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;