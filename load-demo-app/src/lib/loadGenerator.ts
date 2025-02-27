import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

interface LoadConfig {
  durationMinutes: number;
  memoryIntensive: boolean;
  cpuIntensive: boolean;
}

export class LoadGenerator {
  private running: boolean = false;
  private workers: Worker[] = [];
  private memoryPressure: number[][] = [];

  constructor(private config: LoadConfig) {}

  async start(): Promise<void> {
    if (isMainThread) {
      console.log('Starting load generation...');
      
      // Use available CPU cores (max 4 for demo)
      const numWorkers = Math.min(4, navigator.hardwareConcurrency || 4);
      
      this.running = true;

      for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker(__filename, {
          workerData: this.config,
        });

        this.workers.push(worker);

        worker.on('error', (error) => {
          console.error('Worker error:', error);
        });
      }
    }
  }

  stop(): void {
    this.running = false;
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers = [];
  }
} 