
import type { Stats } from '../types/stats.ts';

type Props = {
  stats: Stats | null;
};

export default function StatsHeader({ stats }: Props) {
  const items = [
    {
      label: 'Uptime',
      value:
        stats?.uptimePercentage != null
          ? `${stats.uptimePercentage.toFixed(2)}%`
          : '—',
      color: 'text-(--status-up)',
    },
    {
      label: 'Average Latency',
      value:
        stats?.averageLatency != null
          ? `${Math.round(stats.averageLatency)} ms`
          : '—',
      color: 'text-(--text)',
    },
    {
      label: 'P95 Latency',
      value:
        stats?.p95Latency != null
          ? `${Math.round(stats.p95Latency)} ms`
          : '—',
      color: 'text-(--text)',
    },
    {
      label: 'Incidents',
      value:
        stats?.incidents != null
          ? stats.incidents.toString()
          : '—',
      color:
        stats?.incidents && stats.incidents > 0
          ? 'text-(--status-down)'
          : 'text-(--text)',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
        >
          <p className="text-md">
            {item.label}
          </p>
          <p className={`text-xl font-bold tracking-wider ${item.color}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
