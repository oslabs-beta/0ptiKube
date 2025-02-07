export async function queryPrometheus(query: string) {
  const prometheusUrl = process.env.PROMETHEUS_BASE_URL;

  const response = await fetch(
    `${prometheusUrl}?query=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error(`Prometheus query failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.status === "error") {
    throw new Error(
      `Prometheus query returned an error: ${data.errorType} - ${data.error}`,
    );
  }

  // Report empty data response as an error
  if (data.status === "success" && data.data.result?.length === 0) {
    throw new Error(`Prometheus query returned no data for query "${query}".`);
  }

  return data;
}
