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

    // Extract just the value and unit for the rate calculation window
    // Uses the same interval as our step for consistency in our PromQL query
    const rateWindow = step;

    // Historical CPU usage over intervals in millicores
    const query = `sum(rate(container_cpu_usage_seconds_total[${rateWindow}])) by (cluster) * 1000`;

    // Execute the query with the preset-derived parameters
    const rangeResult = await executeRangeQuery(query, start, end, step);

    return NextResponse.json(rangeResult);
  } catch (error) {
    return handleError(error, 'Failed to query historical CPU usage');
  }
}
