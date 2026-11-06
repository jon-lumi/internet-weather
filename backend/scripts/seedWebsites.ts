import db from '../src/db.ts';

const websites = [
  // { name: 'Google', url: 'https://www.google.com' },
  // { name: 'YouTube', url: 'https://www.youtube.com' },
  // { name: 'Facebook', url: 'https://www.facebook.com' },
  // { name: 'Instagram', url: 'https://www.instagram.com' },
  // { name: 'ChatGPT', url: 'https://chatgpt.com' },
  // { name: 'Reddit', url: 'https://www.reddit.com' },
  // { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
  // { name: 'X', url: 'https://x.com' },
  // { name: 'WhatsApp', url: 'https://www.whatsapp.com' },
  // { name: 'Yahoo', url: 'https://www.yahoo.com' },
  // { name: 'Amazon', url: 'https://www.amazon.com' },
  // { name: 'TikTok', url: 'https://www.tiktok.com' },
  // { name: 'DuckDuckGo', url: 'https://duckduckgo.com' },
  // { name: 'Bing', url: 'https://www.bing.com' },
  // { name: 'Yahoo Japan', url: 'https://www.yahoo.co.jp' },
  // { name: 'LinkedIn', url: 'https://www.linkedin.com' },
  { name: 'Netflix', url: 'https://www.netflix.com' },
  { name: 'Temu', url: 'https://www.temu.com' },
  { name: 'Microsoft', url: 'https://www.microsoft.com' },
  { name: 'MSN', url: 'https://www.msn.com' },
  { name: 'Live', url: 'https://www.live.com' },
  { name: 'Fandom', url: 'https://www.fandom.com' },
  { name: 'Pinterest', url: 'https://www.pinterest.com' },
  { name: 'The Weather Channel', url: 'https://weather.com' },
  { name: 'Twitch', url: 'https://www.twitch.tv' },
  { name: 'Yandex', url: 'https://yandex.ru' },
  { name: 'Google Gemini', url: 'https://gemini.google.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Canva', url: 'https://www.canva.com' },
  { name: 'Discord', url: 'https://discord.com' },
  { name: 'Spotify', url: 'https://www.spotify.com' },
  { name: 'Naver', url: 'https://www.naver.com' },
  { name: 'Apple', url: 'https://www.apple.com' },
  { name: 'Microsoft 365', url: 'https://www.office.com' },
  { name: 'Globo', url: 'https://www.globo.com' },
  { name: 'PayPal', url: 'https://www.paypal.com' },
  { name: 'Brave', url: 'https://brave.com' },
  { name: 'IMDb', url: 'https://www.imdb.com' },
  { name: 'Twitter', url: 'https://twitter.com' },
  { name: 'Claude', url: 'https://claude.ai' },
  { name: 'Roblox', url: 'https://www.roblox.com' },
  { name: 'AliExpress', url: 'https://www.aliexpress.com' },
  { name: 'eBay', url: 'https://www.ebay.com' },
  { name: 'The New York Times', url: 'https://www.nytimes.com' },
  { name: 'BBC', url: 'https://www.bbc.com' },
  { name: 'Telegram', url: 'https://telegram.org' },
  { name: 'Walmart', url: 'https://www.walmart.com' },
  { name: 'CNN', url: 'https://www.cnn.com' },
];

async function seed() {
  try {
    // Clear existing checks and services
    await db.none('TRUNCATE TABLE checks, services RESTART IDENTITY CASCADE');

    // Insert all websites
    for (const website of websites) {
      await db.none(
        'INSERT INTO services (name, url) VALUES ($1, $2)',
        [website.name, website.url]
      );
    }

    console.log(`Successfully seeded ${websites.length} websites.`);
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exitCode = 1;
  } finally {
    await db.$pool.end();
  }
}

seed();