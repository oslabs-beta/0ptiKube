/*import { NextRequest, NextResponse } from 'next/server';
import { processPrometheusMetrics } from '@/app/api/utils/processMetrics';
import { db } from '../../../db'; // Adjusted to go up two levels and access the db folder
import { metricsTable } from '../../../db/schema'; // Same adjustment for schema

const prometheusUrl = process.env.PROMETHEUS_URL || 'http://localhost:9090'; // Use env variable for flexibility

export async function GET(req: NextRequest) {
  try {
    // Fetch Prometheus metrics
    const response = await fetch(`${prometheusUrl}/api/v1/query?query=up`);

    // Check if the response is successful
    if (!response.ok) {
      console.error(
        `Failed to fetch data from Prometheus. Status: ${response.status}`
      );
      throw new Error('Failed to fetch Prometheus metrics');
    }

    const data = await response.json();
    console.log('Fetched Prometheus Data:', data); // Log the raw data for debugging
    console.log('Fetched Prometheus Data:', JSON.stringify(data, null, 2));

    // Check if the data is valid
    if (!data || !data.data || !Array.isArray(data.data.result)) {
      throw new Error('Invalid data format from Prometheus');
    }

    // Process the metrics
    const processedMetrics = data.data.result.map((metric) => {
      return {
        pod_name: metric.metric.pod || 'unknown', // Ensure pod_name is set
        container_name: metric.metric.container || 'unknown',
        endpoint: metric.metric.endpoint || 'unknown',
        instance: metric.metric.instance || 'unknown',
        job: metric.metric.job || 'unknown',
        namespace: metric.metric.namespace || 'unknown',
        service: metric.metric.service || 'unknown',
        cpu_usage: metric.value[1] ? parseFloat(metric.value[1]) : 0, // Ensure cpu_usage is set
        timestamp: new Date(Number(metric.value[0]) * 1000), // Convert UNIX timestamp
      };
    });

    // Insert the metrics into the database in one batch to optimize performance
    await db.insert(metricsTable).values(processedMetrics);

    return NextResponse.json({ message: 'Metrics successfully inserted' });
  } catch (error) {
    console.error('Error fetching Prometheus metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Prometheus metrics' },
      { status: 500 }
    );
  }
}
*/
