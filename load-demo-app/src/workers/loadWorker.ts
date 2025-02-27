function generateLoad() {
  const memoryPressure: number[][] = [];
  const HIGH_USAGE = 75;
  const LOW_USAGE = 20;
  const CYCLE_TIMES = {
    LOW_START: 60000,    // 1 minute low
    HIGH_LOAD: 180000,   // 3 minutes high
    LOW_END: 60000      // 1 minute low
  };
  
  function cpuIntensiveTask(targetLoad: number) {
    // Adjust matrix size based on target load
    const size = Math.floor((targetLoad / 100) * 200);
    const matrix1 = Array(size).fill(0).map(() => Array(size).fill(0).map(() => Math.random()));
    const matrix2 = Array(size).fill(0).map(() => Array(size).fill(0).map(() => Math.random()));
    
    const result = Array(size).fill(0).map(() => Array(size).fill(0));
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        for (let k = 0; k < size; k++) {
          result[i][j] += matrix1[i][k] * matrix2[k][j];
        }
      }
    }
    return result;
  }

  function adjustMemoryPressure(targetUsage: number) {
    const currentMemoryUsage = (memoryPressure.length / 200) * 100;
    
    if (currentMemoryUsage < targetUsage) {
      // Add memory pressure
      const numbers = new Array(50000).fill(0).map(() => Math.random());
      numbers.sort();
      memoryPressure.push(numbers);
    } else {
      // Reduce memory pressure
      while ((memoryPressure.length / 200) * 100 > targetUsage) {
        memoryPressure.shift();
      }
    }
  }

  let cycleStartTime = Date.now();
  
  while (true) {
    const timeInCycle = (Date.now() - cycleStartTime) % (CYCLE_TIMES.LOW_START + CYCLE_TIMES.HIGH_LOAD + CYCLE_TIMES.LOW_END);
    let targetUsage: number;
    let phase: string;

    // Determine which phase we're in and set target usage
    if (timeInCycle < CYCLE_TIMES.LOW_START) {
      targetUsage = LOW_USAGE;
      phase = 'low-start';
    } else if (timeInCycle < (CYCLE_TIMES.LOW_START + CYCLE_TIMES.HIGH_LOAD)) {
      targetUsage = HIGH_USAGE;
      phase = 'high-load';
    } else {
      targetUsage = LOW_USAGE;
      phase = 'low-end';
    }

    // Generate load according to current phase
    cpuIntensiveTask(targetUsage);
    adjustMemoryPressure(targetUsage);

    // Send status update with phase information
    self.postMessage({ 
      type: 'status', 
      usage: {
        memory: Math.min((memoryPressure.length / 200) * 100, targetUsage),
        cpu: targetUsage
      },
      phase: phase,
      cycleTime: timeInCycle
    });
  }
}

// Listen for messages from main thread
self.onmessage = (e) => {
  if (e.data === 'start') {
    generateLoad();
  }
}; 