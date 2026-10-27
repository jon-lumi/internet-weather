import db from '.././db.js';
import { updates } from '.././events.js';

export async function startWorkerListener() {
  const connection = await db.connect();

  try {
    await connection.client.query('LISTEN checks_updated');

    connection.client.on('notification', (message) => {
      if (message.channel === 'checks_updated') {
        updates.emit('checks-updated');
      }
    });

    console.log('Listening for database notifications');

    return () => connection.done();
  } catch (error) {
    connection.done();
    throw error;
  }
}