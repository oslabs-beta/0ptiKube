export async function GET() {
  // Get current process metrics
  const metrics = {
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  };

  // Format in Prometheus text format
  const prometheusMetrics = [
    '# HELP process_memory_bytes Memory usage metrics',
    `process_memory_heap_total_bytes ${metrics.memory.heapTotal}`,
    `process_memory_heap_used_bytes ${metrics.memory.heapUsed}`,
    `process_memory_external_bytes ${metrics.memory.external}`,
    '# HELP process_cpu_seconds CPU usage metrics',
    `process_cpu_user_seconds_total ${metrics.cpu.user / 1000000}`, // Convert to seconds
    `process_cpu_system_seconds_total ${metrics.cpu.system / 1000000}`,
  ].join('\n');

  // Return with correct content type for Prometheus
  return new Response(prometheusMetrics, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

