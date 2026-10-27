import './App.css'
import WebsiteStatus from './components/WebsiteStatus'
import type { Website } from './types/website.ts';
import { useEffect, useState } from 'react';

// query the /api/services endpoint to get the list of websites and their current status and latency
async function fetchWebsites(): Promise<Website[]> {
  const response = await fetch('/api/services');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Websites:', data);

  return data.map((website: any) => ({
    name: website.name,
    url: website.url,
    currentLatency: website.response_time_ms,
    currentStatus: !website.is_up
      ? 'down'
      : website.response_time_ms > 500
        ? 'degraded'
        : 'up',
    isSelected: false,
  }));
}

function App() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsiteUrl, setSelectedWebsiteUrl] = useState<string | null>(null);

  const selectedWebsite = websites.find(
    (website) => website.url === selectedWebsiteUrl
  ) ?? websites[0];

  useEffect(() => {
    const loadWebsites = () => {
      fetchWebsites()
        .then(setWebsites)
        .catch((error) =>
          console.error('Error fetching websites:', error)
        );
    };

    // Fetch immediately when the component mounts.
    loadWebsites();

    // Subscribe to server-sent events.
    const events = new EventSource('/api/events');

    events.addEventListener('checks-updated', loadWebsites);

    events.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    // Clean up when the component unmounts.
    return () => {
      events.close();
    };
  }, []);

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
              onClick={() => setSelectedWebsiteUrl(website.url)}
            >
              <WebsiteStatus
                {...website}
                isSelected={website.url === selectedWebsite.url}
              />
            </div>
          ))}
        </aside>

{selectedWebsite && (
  <section className="border-l-2 border-(--border) p-10">
    <header className="text-2xl font-bold">
      {selectedWebsite.name} Stats:
    </header>
  </section>
)}
      </main>
    </>
  )
}

export default App
