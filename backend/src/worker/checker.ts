type Service = {
  id: number;
  url: string;
};

export type CheckResult = {
  serviceId: number;
  responseTimeMs: number | null;
  statusCode: number | null;
  status: 'up' | 'degraded' | 'down';
};

export async function checkWebsite(
  service: Service
): Promise<CheckResult> {
  const start = performance.now();

  let responseTimeMs: number | null = null;
  let statusCode: number | null = null;
  let status: CheckResult['status'] = 'down';

  try {
    const response = await fetch(service.url, {
      signal: AbortSignal.timeout(5_000),
    });

    responseTimeMs = Math.round(performance.now() - start);
    statusCode = response.status;

    status =
      response.status >= 200 && response.status < 400
        ? responseTimeMs > 500
          ? 'degraded'
          : 'up'
        : 'down';

    await response.body?.cancel();
  } catch (error) {
    console.error(`Check failed for ${service.url}:`, error);
  }

  return {
    serviceId: service.id,
    responseTimeMs,
    statusCode,
    status,
  };
}