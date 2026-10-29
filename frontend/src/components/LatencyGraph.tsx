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
import type { Check } from '../types/check.ts';

type ChartPoint = {
  checkedAt: number;
  latency: number | null;
  status: 'up' | 'degraded' | 'down';
};

type Props = {
  checks: Check[];
};

export default function LatencyChart({ checks }: Props) {
  const data: ChartPoint[] = checks
    .map((check) => ({
      checkedAt: new Date(check.checked_at).getTime(),
      latency: check.response_time_ms,
      status: check.status,
    }))
    .sort((a, b) => a.checkedAt - b.checkedAt);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold">Response Time Graph:</h3>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-(--text)">
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
                stroke="#8b96a8"
                tick={{ fontSize: 11 }}
                minTickGap={30}
              />

              <YAxis
                stroke="#8b96a8"
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
                  backgroundColor: '#1b2432',
                  border: '1px solid #8b96a8',
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

      <p className="text-sm text-(--text)">
        Measurements are in milliseconds. Failed checks without a response
        time appear as gaps in the line.
      </p>
    </div>
  );
}