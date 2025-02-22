import { prom } from './prometheusClient';
import { handleError } from './errorHandler';

/**
 * Executes an **instant** Prometheus query and returns the most recent data point.
 * @params query - The PromQL query string
 */
export async function executeInstantQuery(query: string) {
  try {
    console.log('Executing instant query:', query);
    return await prom.instantQuery(query);
  } catch (error) {
    return handleError(error, 'Failed to execute instant Prometheus query');
  }
}

/**
 * Executes a **range** Prometheus query and returns data over a time range.
 * @param query - The PromQL query string
 * @param start - Start time (timestamp)
 * @param end - End time (timestamp)
 * @param step - Interval step for data points (e.g., "30s", "1m")
 */
export async function executeRangeQuery(
  query: string,
  start: Date,
  end: Date,
  step: string,
) {
  try {
    // Convert timestamps to Date objects
    console.log(
      'Executing range query:',
      query,
      `Start: ${start}, End: ${end}, Step: ${step}`,
    );
    return await prom.rangeQuery(query, start, end, step);
  } catch (error) {
    return handleError(error, 'Failed to execute range Prometheus query');
  }
}
