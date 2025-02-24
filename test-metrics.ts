// test-metrics.ts
import { fetchAndStoreMetrics } from './src/app/api/utils/cronJob'; // Adjust the path

async function test() {
  console.log('Testing fetchAndStoreMetrics...');
  await fetchAndStoreMetrics();
  console.log('Test completed.');
}

test().catch((error) => {
  console.error('Test failed:', error);
});
