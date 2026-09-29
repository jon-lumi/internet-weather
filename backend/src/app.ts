import express, { type Express } from 'express';
import servicesRouter from './routes/services.js';
import checksRouter from './routes/checks.ts'

const app: Express = express();
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/services', servicesRouter);
app.use('/api/services/:id/checks', checksRouter);

export default app;