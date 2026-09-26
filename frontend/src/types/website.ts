export type Website = {
  name: string;
  url: string;
  currentLatency: number;
  currentStatus: 'up' | 'degraded' | 'down';
  isSelected: boolean;
};