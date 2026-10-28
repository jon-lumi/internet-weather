
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  matchByDataKey,
} from 'recharts';

type TimeRange = '1h' | '6h' | '24h' | '7d';

type Check = {
  checked_at: string;
  response_time_ms: number | null;
  is_up: boolean;
};

type ChartPoint = {
  checkedAt: number;
  latency: number | null;
  isUp: boolean;
};

type Props = {
  serviceId: number;
  refreshVersion: number;
};

const ranges: TimeRange[] = ['1h', '6h', '24h', '7d'];

export default function LatencyChart({
  serviceId,
  refreshVersion,
}: Props) {
  const [range, setRange] = useState<TimeRange>('24h');
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchChecks() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/services/${serviceId}/checks?range=${range}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const checks: Check[] = await response.json();

        const points = checks
          .map((check) => ({
            checkedAt: new Date(check.checked_at).getTime(),
            latency: check.response_time_ms,
            isUp: check.is_up,
          }))
          .sort((a, b) => a.checkedAt - b.checkedAt);

        setData(points);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        setError(
          err instanceof Error ? err.message : 'Failed to load checks'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchChecks();

    return () => controller.abort();
  }, [serviceId, range, refreshVersion]);

  return (
    <section className="mt-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold">Response time</h3>

        <div className="flex gap-2">
          {ranges.map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`rounded px-3 py-1 text-sm ${
                range === item
                  ? 'bg-(--accent) text-white'
                  : 'border border-(--border) text-gray-400'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading && data.length === 0 ? (
        <p className="text-sm text-gray-400">Loading history...</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-400">
          No measurements available for this period.
        </p>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 15, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                stroke="#273244"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="checkedAt"
                type="number"
                scale="time"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value: number) =>
                  new Date(value).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }
                stroke="#8995a8"
                tick={{ fontSize: 11 }}
                minTickGap={30}
              />

              <YAxis
                stroke="#8995a8"
                tick={{ fontSize: 11 }}
                width={55}
                tickFormatter={(value: number) => `${value} ms`}
              />

              <Tooltip
                labelFormatter={(value) =>
                  new Date(Number(value)).toLocaleString()
                }
                formatter={(value) => [
                  value == null ? 'No response' : `${value} ms`,
                  'Latency',
                ]}
                contentStyle={{
                  backgroundColor: '#0b1220',
                  border: '1px solid #273244',
                  borderRadius: '6px',
                }}
              />

              <Line
                type="linear"
                dataKey="latency"
                name="Latency"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls={false}
                isAnimationActive={true}
                animationDuration={700}
                animationEasing="ease-in-out"
                animationMatchBy={matchByDataKey('checkedAt')}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="mt-3 text-xs text-gray-500">
        Measurements are in milliseconds. Failed checks without a response
        time appear as gaps in the line.
      </p>
    </section>
  );
}
