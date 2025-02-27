import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { cpus } from 'os';

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
      const numWorkers = Math.min(4, cpus().length);
      
      this.running = true;

      if (this.config.memoryIntensive) {
        console.log('Creating memory pressure...');
        // Create memory pressure
        for (let i = 0; i < 100; i++) {
          this.memoryPressure.push(new Array(10000).fill('x'));
        }
      }

      if (this.config.cpuIntensive) {
        console.log(`Creating ${numWorkers} CPU workers...`);
        // Create worker for each CPU
        for (let i = 0; i < numWorkers; i++) {
          const worker = new Worker(__filename, {
            workerData: { 
              ...this.config,
              workerId: i,
              running: true 
            }
          });

          worker.on('error', (error) => {
            console.error(`Worker ${i} error:`, error);
          });

          worker.on('exit', (code) => {
            console.log(`Worker ${i} exited with code ${code}`);
          });

          worker.on('message', (message) => {
            console.log(`Worker ${i}: ${message}`);
          });

          this.workers.push(worker);
        }
      }

      console.log(`Load generator running with ${numWorkers} workers`);
    } else {
      // Worker thread code
      this.generateCPULoad();
    }
  }

  private generateCPULoad() {
    const { durationMinutes, workerId } = workerData;
    const endTime = Date.now() + (durationMinutes * 60 * 1000);
    
    console.log(`Worker ${workerId} starting CPU load for ${durationMinutes} minutes`);
    
    while (Date.now() < endTime) {
      // CPU-intensive calculation
      let x = 0;
      for (let i = 0; i < 1000000; i++) {
        x += Math.sqrt(i) * Math.sin(i);
      }
      
      // Small delay to prevent complete CPU lockup
      if (Date.now() % 1000 === 0) {
        if (parentPort) parentPort.postMessage(`Still running, load: ${x}`);
      }
    }
    
    if (parentPort) {
      parentPort.postMessage('Completed CPU load cycle');
    }
  }

  stop(): void {
    console.log('Stopping load generation...');
    this.running = false;
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers = [];
    this.memoryPressure = [];
    console.log('Load generation stopped');
  }
}

// Handle worker thread execution
if (!isMainThread) {
  const loadGen = new LoadGenerator(workerData);
  loadGen.start();
} 