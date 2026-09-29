import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const services = await db.any(`
      SELECT
        s.id,
        s.name,
        s.url,
        c.checked_at,
        c.response_time_ms,
        c.status_code,
        c.is_up
      FROM services s
      LEFT JOIN (
        SELECT DISTINCT ON (service_id)
          service_id,
          checked_at,
          response_time_ms,
          status_code,
          is_up
        FROM checks
        ORDER BY service_id, checked_at DESC
      ) c
        ON s.id = c.service_id
      ORDER BY s.id;
    `);

    if (services.length === 0) {
      res.status(404).json({ error: 'Services not found' });
      return;
    }

    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;