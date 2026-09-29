import { type Request, type Response } from 'express';
import app from './app.ts';
import pool from './db.ts';

const PORT = 3000;

async function startServer() {
  try {
    await pool.query('SELECT NOW()');

    console.log('Connected to PostgreSQL');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error);
    process.exit(1);
  }
}

startServer();