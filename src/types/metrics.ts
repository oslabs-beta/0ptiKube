// Shape for CPU or Memory usage results
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
  
  // Shape of the historical data results
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