/**
 * Type definitions for Prometheus query response data structures
 *
 * These types define the shape of data returned from Prometheus metrics queries for both instant queries (vector data) and range queries (matrix data).
 */

/**
 * Type definition for instant query results (vector data)
 * Represents a single point in time for CPU or Memory metrics
 */
export type PrometheusVectorData = {
  resultType: string;
  result: {
    metric: {
      labels: {
        pod?: string;
      };
    };
    value: {
      time: string;
      value: number;
    };
  }[];
};

/**
 * Type definition for range query results (matrix data)
 * Represents historical time-series data for CPU or Memory metrics
 */
export type PrometheusMatrixResponse = {
  resultType: string;
  result: Array<{
    metric: {
      labels: {
        pod?: string;
      };
    };
    values: Array<{ time: string; value: number }>;
  }>;
};
