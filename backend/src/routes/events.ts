import { Router } from 'express';
import { updates } from '../events.js';

const router = Router();

router.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.flushHeaders();

  res.write('event: connected\ndata: {}\n\n');

  const sendUpdate = () => {
    res.write('event: checks-updated\ndata: {}\n\n');
  };

  updates.on('checks-updated', sendUpdate);

  req.on('close', () => {
    updates.off('checks-updated', sendUpdate);
  });
});

export default router;