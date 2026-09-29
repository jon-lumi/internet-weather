import pool from '../src/db.ts';

const websites = [
  {
    name: 'Google',
    url: 'https://www.google.com',
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
  },
  {
    name: 'Cloudflare',
    url: 'https://www.cloudflare.com',
  },
];

async function seed() {
  try {
    for (const website of websites) {
      await pool.query(
        `
        INSERT INTO services (name, url)
        VALUES ($1, $2)
        `,
        [website.name, website.url]
      );
    }

    console.log('Websites seeded successfully');
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    await pool.end();
  }
}

seed();