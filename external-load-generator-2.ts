import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import axios from 'axios';

interface LoadConfig {
  targetUrls: string[];
  durationMinutes: number;
  concurrentUsers: number;
  requestsPerSecond: number;
  rampUpSeconds: number;
  memoryIntensive: boolean;
}

class LoadGenerator {
  private running: boolean = false;
  private startTime: number = 0;
  private completedRequests: number = 0;
  private errors: number = 0;
  private workers: Worker[] = [];
  private memoryPressure: number[][] = [];

  public async runWorker(): Promise<void> {
    return this.generateLoad();
  }

  constructor(private config: LoadConfig) {}

  async start(): Promise<void> {
    if (isMainThread) {
      console.log('Main thread starting...');

      // Calculate number of workers
      const numWorkers = Math.min(this.config.concurrentUsers, 5); // Limit to 5 workers for testing
      console.log(`Creating ${numWorkers} workers...`);

      this.running = true;
      this.startTime = Date.now();

      // Create workers
      for (let i = 0; i < numWorkers; i++) {
        console.log(`Creating worker ${i + 1}...`);
        const worker = new Worker(__filename, {
          workerData: this.config,
        });
        this.workers.push(worker);

        worker.on('message', (message) => {
          if (message.type === 'completed') {
            this.completedRequests++;
          } else if (message.type === 'error') {
            this.errors++;
            console.error(`Worker error: ${message.error}`);
          }
        });

        worker.on('error', (error) => {
          console.error('Worker error:', error);
          this.errors++;
        });

        worker.on('exit', (code) => {
          if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
          }
        });
      }

      // Set test duration
      setTimeout(() => {
        this.stop();
      }, this.config.durationMinutes * 60 * 1000);

      // Print stats every 5 seconds
      const statsInterval = setInterval(() => {
        this.printStats();
        if (!this.running) {
          clearInterval(statsInterval);
        }
      }, 5000);
    } else {
      // Worker process
      await this.generateLoad();
    }
  }

  stop(): void {
    this.running = false;
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers = [];
    this.printStats();
  }

  public async generateLoad(): Promise<void> {
    if (!parentPort) {
      console.log('No parent port available');
      return;
    }

    console.log('Worker starting load generation');

    // Get config from worker data
    const config = workerData as LoadConfig;
    console.log('Worker received config:', config);

    const delayMs = 1000 / config.requestsPerSecond;

    while (true) {
      try {
        if (config.memoryIntensive) {
          // Lighter computations that won't block requests
          const numbers = new Array(10000).fill(0).map(() => Math.random());
          numbers.sort(); // Quick operation but still uses CPU

          // Keep a reference to prevent garbage collection (memory pressure)
          if (!this.memoryPressure) {
            this.memoryPressure = [];
          }
          this.memoryPressure.push(numbers);

          // Cap the memory usage to prevent crashes
          if (this.memoryPressure.length > 100) {
            this.memoryPressure.shift();
          }
        }

        const url =
          config.targetUrls[
            Math.floor(Math.random() * config.targetUrls.length)
          ];

        const startTime = Date.now();

        await axios({
          method: 'GET',
          url,
          timeout: 5000,
        });

        parentPort.postMessage({ type: 'completed' });

        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, delayMs - elapsed);
        await this.sleep(remainingDelay);
      } catch (error) {
        parentPort.postMessage({
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  private printStats(): void {
    const elapsed = (Date.now() - this.startTime) / 1000;
    const rps = this.completedRequests / elapsed;
    console.log(`
Load Test Statistics:
-------------------
Runtime: ${elapsed.toFixed(0)}s
Requests Completed: ${this.completedRequests}
Errors: ${this.errors}
Requests/second: ${rps.toFixed(2)}
Error rate: ${((this.errors / this.completedRequests) * 100).toFixed(2)}%
        `);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Main execution
if (isMainThread) {
  console.log('Starting in main thread mode');
  const config: LoadConfig = {
    targetUrls: [
      'http://localhost:3000/api/metrics/container/cpu/percent',
      'http://localhost:3000/api/metrics/container/cpu/history',
      'http://localhost:3000/api/metrics/container/memory/percent',
      'http://localhost:3000/api/metrics/container/memory/history',
      'http://localhost:3000/api/metrics/cluster/cpu/percent',
      'http://localhost:3000/api/metrics/cluster/cpu/history',
      'http://localhost:3000/api/metrics/cluster/memory/percent',
      'http://localhost:3000/api/metrics/cluster/memory/history',
    ],
    durationMinutes: 10,
    concurrentUsers: 100,
    requestsPerSecond: 200,
    rampUpSeconds: 15,
    memoryIntensive: true,
  };

  const generator = new LoadGenerator(config);
  generator.start().catch((error) => {
    console.error('Load generation failed:', error);
  });
} else {
  console.log('Starting in worker mode');
  const generator = new LoadGenerator(workerData as LoadConfig);
  generator.runWorker().catch((error) => {
    console.error('Worker failed:', error);
  });
}

export { LoadGenerator };
export type { LoadConfig };
