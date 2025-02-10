import { NextResponse } from 'next/server';
import { executeInstantQuery } from '@/app/api/utils/prometheus';
import { handleError } from '@/app/api/utils/errorHandler';
import { getMiniKubeConfig } from '@/app/api/utils/promConfig';

export async function GET() {
  try {
    const { memory } = getMiniKubeConfig();

    // Memory Usage Gauge in percentage
    const query = `sum(container_memory_usage_bytes) by (pod) / ${memory} * 100 / 1_000_000`;

    // Execute instant query
    const data = await executeInstantQuery(query);

    return NextResponse.json(data);
  } catch (error) {
    return handleError(error, 'Failed to fetch memory percentage usage');
  }
}
