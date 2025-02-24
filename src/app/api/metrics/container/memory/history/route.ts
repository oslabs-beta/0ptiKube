import { NextResponse } from 'next/server';
import { executeRangeQuery } from '@/app/api/utils/prometheus';
import { handleError } from '@/app/api/utils/errorHandler';
import { getTimeRangeFromPreset } from '@/app/api/utils/timePresets';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = url.searchParams;

    // Get preset ID from query params (if provided)
    const presetId = queryParams.get('preset');

    // Get time range parameters based on preset
    const { start, end, step } = getTimeRangeFromPreset(presetId);

    // Historical memory usage over time in MebiBytes (MiB)
    const query = `sum(container_memory_usage_bytes) by (pod) / 1024 / 1024`;

    // Execute the query with our preset-derived parameters
    const rangeResult = await executeRangeQuery(query, start, end, step);

    return NextResponse.json(rangeResult);
  } catch (error) {
    return handleError(error, 'Failed to query historical memory usage');
  }
}
