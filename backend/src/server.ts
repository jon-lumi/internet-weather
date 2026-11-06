import app from './app.js';
import db from './db.js';
import { startWorkerListener } from './listener.ts';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await db.one('SELECT NOW()');
    console.log('Connected to PostgreSQL');

    await startWorkerListener();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();