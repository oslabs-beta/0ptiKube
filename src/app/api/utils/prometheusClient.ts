import { PrometheusDriver } from 'prometheus-query';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getMiniKubeConfig } from './promConfig';

// Get Prometheus URL from environment or minikube config
const getPrometheusUrl = () => {
  const envUrl = process.env.PROMETHEUS_BASE_URL;
  if (envUrl) return envUrl;

  // Fallback to minikube config
  const config = getMiniKubeConfig();
  return `http://localhost:${config.prometheus_port || '9090'}`;
};

const prometheusUrl = getPrometheusUrl();

if (!prometheusUrl) {
  throw new Error('Could not determine Prometheus URL');
}

export const prom = new PrometheusDriver({
  endpoint: prometheusUrl,

  requestInterceptor: {
    onFulfilled: (config: InternalAxiosRequestConfig) => {
      return config;
    },

    onRejected: (error) => {
      // Useful encase there's an issue reading a token from storage
      console.error('Request setup error:', error);
      return Promise.reject(
        new Error('Failed to set up request: ' + error.message)
      );
    },
  },

  responseInterceptor: {
    onFulfilled: (response: AxiosResponse) => {
      // Check Prometheus status
      if (response.data?.status === 'error') {
        return Promise.reject(
          new Error(`Prometheus returned an error: ${response.data.error}`)
        );
      }
      return response;
    },

    onRejected: (error: AxiosError) => {
      if (error.response) {
        // No response recieved
        return Promise.reject(
          new Error(
            `Response error [${error.response.status}]: ${error.response.statusText}`
          )
        );
      } else if (error.request) {
        return Promise.reject(
          new Error('No response recieved from Prometheus')
        );
      } else {
        return Promise.reject(new Error('Axios error: ' + error.message));
      }
    },
  },
});
