import db from '../src/db.ts';

const websites = [
  { name: 'Google', url: 'https://www.google.com' },
  { name: 'YouTube', url: 'https://www.youtube.com' },
  { name: 'Facebook', url: 'https://www.facebook.com' },
  { name: 'Instagram', url: 'https://www.instagram.com' },
  { name: 'ChatGPT', url: 'https://chatgpt.com' },
  { name: 'Reddit', url: 'https://www.reddit.com' },
  { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
  { name: 'X', url: 'https://x.com' },
  { name: 'WhatsApp', url: 'https://www.whatsapp.com' },
  { name: 'Yahoo', url: 'https://www.yahoo.com' },
  { name: 'Amazon', url: 'https://www.amazon.com' },
  { name: 'TikTok', url: 'https://www.tiktok.com' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com' },
  { name: 'Bing', url: 'https://www.bing.com' },
  { name: 'Yahoo Japan', url: 'https://www.yahoo.co.jp' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com' },
  { name: 'Microsoft Online', url: 'https://www.microsoftonline.com' },
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
  { name: 'VK', url: 'https://vk.com' },
  { name: 'eBay', url: 'https://www.ebay.com' },
  { name: 'The New York Times', url: 'https://www.nytimes.com' },
  { name: 'BBC', url: 'https://www.bbc.com' },
  { name: 'Telegram', url: 'https://telegram.org' },
  { name: 'Walmart', url: 'https://www.walmart.com' },
  { name: 'Amazon Japan', url: 'https://www.amazon.co.jp' },
  { name: 'Supercell', url: 'https://supercell.com' },
  { name: 'Dailymotion', url: 'https://www.dailymotion.com' },
  { name: 'ESPN', url: 'https://www.espn.com' },
  { name: 'USPS', url: 'https://www.usps.com' },
  { name: 'OpenAI', url: 'https://openai.com' },
  { name: 'CNN', url: 'https://www.cnn.com' },
  { name: 'Samsung', url: 'https://www.samsung.com' },
  { name: 'Booking.com', url: 'https://www.booking.com' },
  { name: 'Zoom', url: 'https://zoom.us' },
  { name: 'Adobe', url: 'https://www.adobe.com' },
  { name: 'BBC UK', url: 'https://www.bbc.co.uk' },
  { name: 'Ecosia', url: 'https://www.ecosia.org' },
  { name: 'Indeed', url: 'https://www.indeed.com' },
  { name: 'UOL', url: 'https://www.uol.com.br' },
  { name: 'Amazon Germany', url: 'https://www.amazon.de' },
  { name: 'Etsy', url: 'https://www.etsy.com' },
  { name: 'Bilibili', url: 'https://www.bilibili.com' },
  { name: 'Rakuten', url: 'https://www.rakuten.co.jp' },
  { name: 'Steam', url: 'https://store.steampowered.com' },
  { name: 'Quora', url: 'https://www.quora.com' },
  { name: 'Instructure', url: 'https://www.instructure.com' },
  { name: 'Mail.ru', url: 'https://mail.ru' },
  { name: 'Shopify', url: 'https://www.shopify.com' },
  { name: 'Disney+', url: 'https://www.disneyplus.com' },
  { name: 'Amazon UK', url: 'https://www.amazon.co.uk' },
  { name: 'SHEIN', url: 'https://www.shein.com' },
  { name: 'The Guardian', url: 'https://www.theguardian.com' },
  { name: 'Steam Community', url: 'https://steamcommunity.com' },
  { name: 'DeepSeek', url: 'https://www.deepseek.com' },
  { name: 'Prime Video', url: 'https://www.primevideo.com' },
  { name: 'Shop', url: 'https://shop.app' },
  { name: 'Marca', url: 'https://www.marca.com' },
  { name: 'Gmail', url: 'https://mail.google.com' },
  { name: 'Linktree', url: 'https://linktr.ee' },
  { name: 'Amazon India', url: 'https://www.amazon.in' },
  { name: 'AccuWeather', url: 'https://www.accuweather.com' },
  { name: 'iLovePDF', url: 'https://www.ilovepdf.com' },
  { name: 'TradingView', url: 'https://www.tradingview.com' },
  { name: 'Threads', url: 'https://www.threads.com' },
  { name: 'HBO Max', url: 'https://www.hbomax.com' },
  { name: 'Messenger', url: 'https://www.messenger.com' },
  { name: 'Genius', url: 'https://genius.com' },
  { name: 'DeepSeek Chat', url: 'https://chat.deepseek.com' },
  { name: 'Trendyol', url: 'https://www.trendyol.com' },
  { name: 'Opera', url: 'https://www.opera.com' },
  { name: 'IKEA', url: 'https://www.ikea.com' },
  { name: 'Ozon', url: 'https://www.ozon.ru' },
  { name: 'Snapchat', url: 'https://www.snapchat.com' },
  { name: 'Google Brazil', url: 'https://www.google.com.br' },
  { name: 'Acesso Gov BR', url: 'https://acesso.gov.br' },
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