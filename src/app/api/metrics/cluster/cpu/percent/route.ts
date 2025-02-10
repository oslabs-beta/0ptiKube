import { NextResponse } from 'next/server';
import { handleError } from '@/app/api/utils/errorHandler';
import { getMiniKubeConfig } from '@/app/api/utils/promConfig';
import { executeInstantQuery } from '@/app/api/utils/prometheus';

export async function GET() {
  try {
    const { cpus } = getMiniKubeConfig();
    // CPU Usage Gauge in percentage
    const query = `sum(rate(container_cpu_usage_seconds_total[30s])) by (cluster) / ${cpus} * 100`;

    console.log('Executing query:', query);

    const data = await executeInstantQuery(query);

    return NextResponse.json(data);
  } catch (error) {
    return handleError(error, 'Failed to query CPU usage');
  }
}