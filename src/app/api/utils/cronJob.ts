import cron from 'node-cron';
import axios from 'axios';
import { db } from '../../../db/index'; // Adjust this path based on your project structure
import { metricsTable } from '../../../db/schema'; // Adjust schema import

// Define a type for the API response
interface MetricResponse {
  metric: {
    labels: {
      pod: string;
      namespace?: string; // Optional, as it might not always be present
    };
  };
  values: Array<{ time: string; value: number }>; // Updated to match the actual API response
}

// Export the function
export async function fetchAndStoreMetrics() {
  try {
    console.log('Fetching CPU and memory metrics...');

    // Fetch CPU usage data
    const cpuResponse = await axios.get<{ result: MetricResponse[] }>(
      'http://localhost:3000/api/metrics/container/cpu/history'
    );
    console.log('CPU API Response:', JSON.stringify(cpuResponse.data, null, 2));

    const cpuData = cpuResponse.data.result.flatMap((item) =>
      item.values.map((value) => ({
        pod_name: item.metric.labels.pod, // Use pod_name instead of pod
        namespace: item.metric.labels.namespace || 'default', // Add namespace (default if missing)
        cpu_usage: value.value, // Use cpu_usage instead of value
        memory_usage: 0, // Placeholder, fetch memory data separately
        embedding: JSON.stringify({}), // Placeholder for embedding data
        timestamp: new Date(value.time), // Convert time to Date
      }))
    );

    console.log('CPU data fetched successfully:', cpuData.length, 'records');

    // Fetch Memory usage data
    const memoryResponse = await axios.get<{ result: MetricResponse[] }>(
      'http://localhost:3000/api/metrics/container/memory/history'
    );
    console.log(
      'Memory API Response:',
      JSON.stringify(memoryResponse.data, null, 2)
    );

    const memoryData = memoryResponse.data.result.flatMap((item) =>
      item.values.map((value) => ({
        pod_name: item.metric.labels.pod, // Use pod_name instead of pod
        namespace: item.metric.labels.namespace || 'default', // Add namespace (default if missing)
        cpu_usage: 0, // Placeholder, fetch CPU data separately
        memory_usage: value.value, // Use memory_usage instead of value
        embedding: JSON.stringify({}), // Placeholder for embedding data
        timestamp: new Date(value.time), // Convert time to Date
      }))
    );

    console.log(
      'Memory data fetched successfully:',
      memoryData.length,
      'records'
    );

    // Merge CPU and memory data
    const TIME_RANGE_MS = 5000; // 5 seconds tolerance for timestamp matching
    const combinedData = cpuData.map((cpuItem) => {
      const memoryItem = memoryData.find(
        (mem) =>
          mem.pod_name === cpuItem.pod_name &&
          mem.namespace === cpuItem.namespace &&
          Math.abs(mem.timestamp.getTime() - cpuItem.timestamp.getTime()) <=
            TIME_RANGE_MS
      );

      // Debugging: Log if memoryItem is not found
      if (!memoryItem) {
        console.warn(
          `No memory data found for pod: ${cpuItem.pod_name}, namespace: ${cpuItem.namespace}, timestamp: ${cpuItem.timestamp}`
        );
      }

      return {
        ...cpuItem,
        memory_usage: memoryItem ? memoryItem.memory_usage : 0,
      };
    });

    // Log sample combined data for debugging
    console.log('Sample combined data:', combinedData.slice(0, 5));

    console.log('Combined data:', combinedData.length, 'records');

    // Insert data into PostgreSQL using Drizzle
    await db.insert(metricsTable).values(combinedData);

    console.log('Metrics updated successfully');
  } catch (error) {
    console.error('Error fetching or inserting metrics:');
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

// Schedule the job to run every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  console.log('Fetching and storing new metrics...');
  await fetchAndStoreMetrics();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  // Add any cleanup logic here if needed
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  // Add any cleanup logic here if needed
  process.exit(0);
});
