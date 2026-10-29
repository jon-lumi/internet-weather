export type Check = {
  checked_at: string;
  response_time_ms: number | null;
  status: 'up' | 'degraded' | 'down';
  status_code: number | null;
};