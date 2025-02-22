import { useData } from './useData';
import type { PrometheusVectorData } from '@/types/metrics';
import type { PrometheusMatrixResponse } from '@/types/metrics';

/**
 * Build standard endpoint paths:
 *
 *   cluster/memory/percent
 *   cluster/cpu/history
 *   container/memory/percent
 *   etc.
 */
function buildEndpoint(
  sourceType: 'cluster' | 'container',
  metric: 'cpu' | 'memory',
  dataType: 'percent' | 'history',
) {
  return `${sourceType}/${metric}/${dataType}`;
}

/**
 * Specialized hook for CPU usage (percent):
 */
export function useCPUUsage(sourceType: 'cluster' | 'container') {
  const endpoint = buildEndpoint(sourceType, 'cpu', 'percent');
  return useData<PrometheusVectorData>(endpoint);
}

/**
 * Specialized hook for Memory usage (percent):
 */
export function useMemoryUsage(sourceType: 'cluster' | 'container') {
  const endpoint = buildEndpoint(sourceType, 'memory', 'percent');
  return useData<PrometheusVectorData>(endpoint);
}

/**
 * Specialized hook for CPU history:
 */
export function useCPUHistory(
  sourceType: 'cluster' | 'container',
  preset?: string,
) {
  const endpoint = buildEndpoint(sourceType, 'cpu', 'history');
  return useData<PrometheusMatrixResponse>(endpoint, preset);
}

/**
 * Specialized hook for Memory history:
 */
export function useMemoryHistory(
  sourceType: 'cluster' | 'container',
  preset?: string,
) {
  const endpoint = buildEndpoint(sourceType, 'memory', 'history');
  return useData<PrometheusMatrixResponse>(endpoint, preset);
}
