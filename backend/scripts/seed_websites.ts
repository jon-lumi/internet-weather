import { url } from 'inspector/promises';
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
  {
    name: "YouTube",
    url: "https://https://www.youtube.com"
  },
  {
    name: "OpenAI",
    url: "https://openai.com"
  },
  {
    name: "Wikipedia",
    url: "https://wikipedia.com"
  },
  {
    name: "Reddit",
    url: 'https://reddit.com'
  },
  {
    name: "Discord",
    url: "https://discord.com"
  },
  {
    name: "X.com",
    url: "https://x.com"
  }
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