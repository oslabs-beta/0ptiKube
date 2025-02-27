'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [phase, setPhase] = useState('starting');
  const [isRunning, setIsRunning] = useState(true); // Default to true for auto-start
  const [metrics, setMetrics] = useState({ cpu: 0, memory: 0 });

  const runPhaseUpdate = async (newPhase: string) => {
    try {
      const response = await fetch('/api/stress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phase: newPhase }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stress phase');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const stopLoadGenerator = () => {
    setIsRunning(false);
    setPhase('stopped');
    setMetrics({ cpu: 0, memory: 0 });
    runPhaseUpdate('stop');
  };

  const startLoadGenerator = () => {
    setIsRunning(true);
    setPhase('starting');
    runPhaseUpdate('low');
  };

  // Main load generation cycle
  useEffect(() => {
    if (!isRunning) return;

    let intervalId: NodeJS.Timeout;
    
    intervalId = setInterval(() => {
      const time = Date.now() % 300000; // 5-minute cycle
      
      if (time < 60000) { // First minute
        setPhase('low');
        setMetrics({ cpu: 20, memory: 20 });
        runPhaseUpdate('low');
      } else if (time < 240000) { // Next 3 minutes
        setPhase('high');
        setMetrics({ cpu: 75, memory: 75 });
        runPhaseUpdate('high');
      } else { // Last minute
        setPhase('low');
        setMetrics({ cpu: 20, memory: 20 });
        runPhaseUpdate('low');
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  // Auto-start effect
  useEffect(() => {
    startLoadGenerator();
    return () => {
      runPhaseUpdate('stop');
    };
  }, []); // Run once on mount

  const getPhaseColor = () => {
    switch (phase) {
      case 'high':
        return 'bg-red-50 text-red-800';
      case 'low':
        return 'bg-yellow-50 text-yellow-800';
      case 'stopped':
        return 'bg-gray-50 text-gray-800';
      case 'starting':
        return 'bg-blue-50 text-blue-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'high':
        return 'High Load (75%)';
      case 'low':
        return 'Low Load (20%)';
      case 'stopped':
        return 'Load Generator Stopped';
      case 'starting':
        return 'Starting Load Generator...';
      default:
        return 'Unknown State';
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Load Generator</h1>
        
        <div className="flex flex-col items-center gap-8">
          {/* Status Display */}
          <div className={`w-full text-center p-4 rounded-lg ${getPhaseColor()}`}>
            <div className="text-xl font-bold">
              {getPhaseText()}
            </div>
            <div className="text-sm mt-2">
              {isRunning ? 'Running' : 'Stopped'}
            </div>
          </div>

          {/* Metrics Display */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-blue-50 p-4 rounded text-center">
              <div className="text-lg font-semibold text-blue-800">CPU Usage</div>
              <div className="text-3xl font-bold text-blue-600">
                {metrics.cpu}%
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded text-center">
              <div className="text-lg font-semibold text-green-800">Memory Usage</div>
              <div className="text-3xl font-bold text-green-600">
                {metrics.memory}%
              </div>
            </div>
          </div>

          {/* Control Button */}
          <button
            onClick={isRunning ? stopLoadGenerator : startLoadGenerator}
            className={`px-6 py-3 rounded-lg font-semibold ${
              isRunning 
                ? 'bg-red-500 hover:bg-red-700' 
                : 'bg-blue-500 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            {isRunning ? '⏹️ Stop Load Generator' : '▶️ Start Load Generator'}
          </button>
        </div>
      </div>
    </main>
  );
}
