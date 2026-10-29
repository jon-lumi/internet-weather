
type Check = {
  checked_at: string;
  response_time_ms: number | null;
  status: 'up' | 'degraded' | 'down';
  status_code?: number | null;
};

type Props = {
  checks: Check[];
};

const statusColors = {
  up: '#22c55e',
  degraded: '#f59e0b',
  down: '#ef4444',
};

export default function HealthHistory({ checks }: Props) {
  if (checks.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        No health history available.
      </p>
    );
  }

  return (
    <div>
      <h3 className="mb-3 text-lg font-bold">
        Health History Bar:
      </h3>

      <div className="flex h-6 w-full gap-[3px]">
        {checks.map((check, index) => (
          <div
            key={`${check.checked_at}-${index}`}
            className="group relative min-w-0 flex-1"
          >
            <div
              className="h-full rounded-sm transition-opacity hover:opacity-70"
              style={{
                backgroundColor: statusColors[check.status],
              }}
            />

            <div
              className="pointer-events-none absolute bottom-full left-1/2 z-50
                        mb-2 hidden -translate-x-1/2 group-hover:block
                        whitespace-nowrap rounded-md border border-(--border)
                        bg-(--bg) px-3 py-2 text-s text-(--text)
                        shadow-lg"
            >
              <div>{new Date(check.checked_at).toLocaleString()}</div>
              <div>
                Latency: {check.response_time_ms != null
                  ? `${check.response_time_ms} ms`
                  : 'unavailable'}
              </div>
              {check.status_code != null && (
                <div>HTTP: {check.status_code}</div>
              )}
              <div className="text-(--accent)">Status: {check.status}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-(--text)">
        Each bar represents a health check, with each being about one minute apart.
      </p>
    </div>
  );
}
