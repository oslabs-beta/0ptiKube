import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    'http_req_duration': ['p(95)<5000'],
    'http_req_failed': ['rate<0.1'],
  },
};

export default function() {
  // Use the service URL via port-forward
  const serviceUrl = 'http://localhost:8080/metrics';
  const metricsResponse = http.get(serviceUrl);
  
  check(metricsResponse, {
    'metrics status is 200': (r) => r.status === 200,
    'metrics has content': (r) => r.body.length > 0,
    'metrics contains node_exporter data': (r) => r.body.includes('node_'),
  });

  // Generate more load with batch requests
  for (let i = 0; i < 20; i++) {
    http.get(serviceUrl);
  }

  sleep(0.1);
}