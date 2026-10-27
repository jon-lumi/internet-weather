export type Website = {
  id: number;
  name: string;
  url: string;
  currentLatency: number;
  currentStatus: 'up' | 'degraded' | 'down';
  isSelected: boolean;
};