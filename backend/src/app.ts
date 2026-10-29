import express, { type Express } from 'express';
import servicesRouter from './routes/services.js';
import checksRouter from './routes/checks.ts';
import eventsRouter from './routes/events.ts';
import statsRouter from './routes/stats.ts';

const app: Express = express();
app.use(express.json());

app.use('/api', eventsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/services', servicesRouter);
app.use('/api/services/:id/checks', checksRouter);
app.use('/api/services/:id/stats', statsRouter);

export default app;