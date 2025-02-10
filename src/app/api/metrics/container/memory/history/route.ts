import { NextResponse } from 'next/server';
import { executeRangeQuery } from '@/app/api/utils/prometheus';
import { handleError } from '@/app/api/utils/errorHandler';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = url.searchParams;

    // Extract query parameters for time range
    const start = queryParams.get('start')
      ? new Date(Number(queryParams.get('start')) * 1000)
      : new Date(Date.now() - 3600 * 1000);
    const end = queryParams.get('end')
      ? new Date(Number(queryParams.get('end')) * 1000)
      : new Date();
    const step = queryParams.get('step') || '30s'; // Default: 30-second intervals

    // Query: Pod memory for specific container in mebibytes
    const query = `sum(rate(container_cpu_usage_seconds_total[30s])) by (pod) * 1000`;

    const data = await executeRangeQuery(query, start, end, step);

    return NextResponse.json(data);
  } catch (error) {
    return handleError(error, 'Failed to fetch historical CPU usage');
  }
}
