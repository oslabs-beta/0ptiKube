import { NextResponse } from 'next/server';
import { executeRangeQuery } from '@/app/api/utils/prometheus';
import { handleError } from '@/app/api/utils/errorHandler';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = url.searchParams;

    // Provide some defaults if not set:
    const start = queryParams.get('start')
      ? new Date(Number(queryParams.get('start')) * 1000)
      : new Date(Date.now() - 3600 * 1000);
    const end = queryParams.get('end')
      ? new Date(Number(queryParams.get('end')) * 1000)
      : new Date();
    const step = queryParams.get('step') || '30s'; // Default: 30-second intervals

    // Historical CPU usage over 30s intervals in millicores
    const query = `sum(rate(container_cpu_usage_seconds_total[30s])) by (cluster) * 1000`;

    // The library expects start/end in milliseconds if you pass a JS Date or a number
    const rangeResult = await executeRangeQuery(query, start, end, step);

    return NextResponse.json(rangeResult);
  } catch (error) {
    return handleError(error, 'Failed to query historical CPU usage');
  }
}
