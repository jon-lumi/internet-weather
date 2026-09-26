import './App.css'
import WebsiteStatus from './components/WebsiteStatus'
import type { Website } from './types/website.ts';
import { useState } from 'react';

const websites: Website[] = [
  {
    name: "GitHub",
    url: "https://github.com",
    currentLatency: 42,
    currentStatus: "up",
    isSelected: false
  },
  {
    name: "Google",
    url: "https://google.com",
    currentLatency: 28,
    currentStatus: "up",
    isSelected: true
  },
  {
    name: "YouTube",
    url: "https://youtube.com",
    currentLatency: 67,
    currentStatus: "up",
    isSelected: false
  },
  {
    name: "Cloudflare",
    url: "https://cloudflare.com",
    currentLatency: 35,
    currentStatus: "up",
    isSelected: false
  },
  {
    name: "OpenAI",
    url: "https://openai.com",
    currentLatency: 91,
    currentStatus: "degraded",
    isSelected: false
  },
  {
    name: "Wikipedia",
    url: "https://wikipedia.org",
    currentLatency: 54,
    currentStatus: "up",
    isSelected: false
  },
  {
    name: "Reddit",
    url: "https://reddit.com",
    currentLatency: 73,
    currentStatus: "up",
    isSelected: false
  },
  {
    name: "Discord",
    url: "https://discord.com",
    currentLatency: 120,
    currentStatus: "degraded",
    isSelected: false
  },
  {
    name: "Example",
    url: "https://example.com",
    currentLatency: 0,
    currentStatus: "down",
    isSelected: false
  },
];

function App() {
  const [selectedWebsite, setSelectedWebsite] = useState(websites[0]);
  
  return (
    <>
      <header className='font-extrabold text-3xl p-5 border-b-2 border-t-2 border-(--border)'>
        Internet Weather
      </header>

      <main className='grid grid-cols-[30%_70%] border-b-2 border-(--border) h-max'>
        <aside className='flex flex-col gap-5 p-5'>
          {websites.map((website) => (
            <div
              key={website.url}
              onClick={() => setSelectedWebsite(website)}
            >
              <WebsiteStatus
                {...website}
                isSelected={website.url === selectedWebsite.url}
              />
            </div>
          ))}
        </aside>

        <section className='border-l-2 border-(--border) p-10'>
          <header className='text-2xl font-bold'>
            {selectedWebsite.name} Stats:
          </header>

          
        </section>
      </main>
    </>
  )
}

export default App
