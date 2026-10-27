import app from './app.js';
import db from './db.js';
import { startWorkerListener } from './worker/listener.ts';

const PORT = 3000;

async function startServer() {
  try {
    await db.one('SELECT NOW()');
    console.log('Connected to PostgreSQL');

    await startWorkerListener();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error);
    process.exit(1);
  }
}

startServer();