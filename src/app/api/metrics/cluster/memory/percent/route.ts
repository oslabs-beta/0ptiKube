import { NextResponse } from 'next/server';
import { handleError } from '@/app/api/utils/errorHandler';
import { getMiniKubeConfig } from '@/app/api/utils/promConfig';
import { executeInstantQuery } from '@/app/api/utils/prometheus';


//richard example
export async function GET() {
  try {
    const { memory } = getMiniKubeConfig();
    // Memory usage as a percent of total memory allocated to cluster, 
    // not total memory of the users computer
    const query = `sum(container_memory_usage_bytes) by (cluster) / ${memory} * 100 / 1_000_000`;

    const data = await executeInstantQuery(query);

    return NextResponse.json(data);
  } catch (error) {
    return handleError(error, 'Failed to query memory usage');
  }
}