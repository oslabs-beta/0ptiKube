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

    // Historical memory usage over time in mebibytes
    const query = `sum(container_memory_usage_bytes) by (cluster) / 1024 / 1024`;

    // The library expects start/end in milliseconds if you pass a JS Date or a number
    // But if you pass numbers, it's easier to do: new Date(start * 1000)
    const rangeResult = await executeRangeQuery(query, start, end, step);

    // rangeResult.result: each element has .metric and an array of .values
    return NextResponse.json(rangeResult);
  } catch (error) {
    return handleError(error, 'Failed to query historical container health');
  }
}
