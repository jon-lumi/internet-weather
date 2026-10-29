import { useCallback, useEffect, useState } from 'react';
import type { Website } from './types/website.ts';
import type { Check } from './types/check.ts';
import type { TimeRange } from './types/timeRange.ts';
import type { Stats } from './types/stats.ts';
import WebsiteStatus from './components/WebsiteStatus';
import LatencyChart from './components/LatencyGraph.tsx';
import HealthHistory from './components/HealthHistory.tsx';
import StatsHeader from './components/StatsHeader.tsx';

const statusColors = {
  up: 'bg-green-500',
  degraded: 'bg-yellow-500',
  down: 'bg-red-500',
};

async function fetchWebsites(): Promise<Website[]> {
  const response = await fetch('/api/services');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Websites:', data);

  return data.map((website: any) => ({
    id: website.id,
    name: website.name,
    url: website.url,
    currentLatency: website.response_time_ms,
    currentStatus: website.status,
    isSelected: false,
  }));
}

function App() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsiteUrl, setSelectedWebsiteUrl] = useState<string | null>(null);
  const [checks, setChecks] = useState<Check[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [range, setRange] = useState<TimeRange>('24h');
  const [checksLoading, setChecksLoading] = useState(false);

  const selectedWebsite = websites.find(
    (website) => website.url === selectedWebsiteUrl
  ) ?? websites[0];

  const fetchChecksAndStats = useCallback(
    async (websiteId: number | string, signal?: AbortSignal) => {
      try {
        const [checksResponse, statsResponse] = await Promise.all([
          fetch(`/api/services/${websiteId}/checks?range=${range}`, {
            signal,
          }),
          fetch(`/api/services/${websiteId}/stats?range=${range}`, {
            signal,
          }),
        ]);

        if (!checksResponse.ok || !statsResponse.ok) {
          throw new Error('Failed to fetch checks or stats');
        }

        const checksData: Check[] = await checksResponse.json();
        const statsData: Stats = await statsResponse.json();

        setChecks(checksData);
        setStats(statsData);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        console.error('Error fetching checks or stats:', error);
        setChecks([]);
        setStats(null);
      }
    },
    [range]
  );

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

    events.addEventListener('checks-updated', () => {
      loadWebsites();

      if (selectedWebsite) {
        fetchChecksAndStats(selectedWebsite.id);
      }
    });

    events.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    // Clean up when the component unmounts.
    return () => {
      events.close();
    };
  }, [selectedWebsite?.id, fetchChecksAndStats]);

  useEffect(() => {
    if (!selectedWebsite) {
      setChecks([]);
      setStats(null);
      return;
    }

    const controller = new AbortController();

    async function loadHistory() {
      setChecksLoading(true);

      try {
        await fetchChecksAndStats(selectedWebsite.id, controller.signal);
      } finally {
        if (!controller.signal.aborted) {
          setChecksLoading(false);
        }
      }
    }

    loadHistory();

    return () => controller.abort();
  }, [selectedWebsite?.id, fetchChecksAndStats]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex justify-between p-5 border-b-2 border-t-2 border-(--border)">
        <header className="font-extrabold text-3xl">
          Internet Weather
        </header>

        <div className="flex justify-end flex-wrap gap-4 text-xs text-gray-400">
          {(['up', 'degraded', 'down'] as const).map((status) => (
            <div key={status} className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${statusColors[status]}`}
              />
              <span className="capitalize">{status}</span>
            </div>
          ))}
        </div>
      </div>

      <main className="grid grid-cols-[30%_70%] flex-1 min-h-0 overflow-hidden">
        <aside className="flex flex-col gap-5 p-5 overflow-y-auto min-h-0">
          {websites.map((website) => (
            <div
              key={website.url}
              onClick={() => setSelectedWebsiteUrl(website.url)}
            >
              <WebsiteStatus
                {...website}
                isSelected={website.url === selectedWebsite?.url}
              />
            </div>
          ))}
        </aside>

        {selectedWebsite && (
          <section className="border-l-2 border-(--border) p-10 overflow-y-auto min-h-0 min-w-0">
            <div className="flex flex-wrap gap-2">
              <header className="text-2xl font-bold">
                {selectedWebsite.name}'s Statistics
              </header>

              <div className="ml-auto flex gap-2">
                {(['1h', '6h', '24h', '7d', '30d'] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setRange(item)}
                    className={`flex-1 rounded px-3 py-1 text-sm ${
                      range === item
                        ? 'bg-(--accent) text-white'
                        : 'border border-(--border) text-(--text)'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {checksLoading ? (
              <p className="mt-4">Loading history...</p>
            ) : (
              <div className="mt-6 flex flex-col gap-10">
                <StatsHeader stats={stats} />
                <HealthHistory checks={checks} />
                <LatencyChart checks={checks} />
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App
