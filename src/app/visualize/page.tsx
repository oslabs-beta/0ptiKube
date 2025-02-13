'use client';
import { useState, useEffect } from 'react';
import Gauge from '@/components/Gauge';
import TimeGraph from '@/components/TimeGraph';
import { useData } from '@/hooks/useData';
import './page.css';

// Shape for CPU or Memory usage results
interface PromVectorData {
  resultType: string;
  result: {
    metric: {
      labels: {
        pod: string;
      };
    };
    value: {
      time: string;
      value: number;
    };
  }[];
}

// Shape of the historical data you expect
interface PrometheusMatrixResponse {
  resultType: string;
  result: Array<{
    metric: Record<string, string>;
    values: Array<{ time: string; value: number }>;
  }>;
}

export default function VisualizePage() {
  // Fetch container memory usage
  const {
    data: memoryData,
    error: memoryError,
    loading: memoryLoading,
  } = useData<PromVectorData>('container/memory/percent');

  // Fetch container CPU usage
  const {
    data: cpuData,
    error: cpuError,
    loading: cpuLoading,
  } = useData<PromVectorData>('container/cpu/percent');

  // Fetch cluster CPU history
  const {
    data: cpuHistoryData,
    loading: cpuHistoryLoading,
    error: cpuHistoryError,
  } = useData<PrometheusMatrixResponse>('cluster/cpu/history');

  // Fetch cluster memory history
  const {
    data: memoryHistoryData,
    loading: memoryHistoryLoading,
    error: memoryHistoryError,
  } = useData<PrometheusMatrixResponse>('cluster/memory/history');

  // State for which pod is selected
  const [selectedPod, setSelectedPod] = useState<string>('');

  // Prepare arrays + unique pod names
  const memoryResults = memoryData?.result || [];
  const cpuResults = cpuData?.result || [];

  // Using set because names are duplicated
  const allPodNames = new Set<string>();
  // Adding the names of pods from container memory endpoint
  for (const item of memoryResults) {
    allPodNames.add(item.metric.labels.pod);
  }
  // Adding the names of pods from container CPU endpoint
  for (const item of cpuResults) {
    allPodNames.add(item.metric.labels.pod);
  }

  // Convert the set to an array
  const podNames = Array.from(allPodNames);

  useEffect(() => {
    if (!selectedPod && podNames.length > 0) {
      setSelectedPod(podNames[0]);
    }
  }, [selectedPod, podNames]);

  // handle loading states
  if (
    memoryLoading ||
    cpuLoading ||
    cpuHistoryLoading ||
    memoryHistoryLoading
  ) {
    return <div>Loading...</div>;
  }

  // handle error states
  if (memoryError || cpuError || cpuHistoryError || memoryHistoryError) {
    return (
      <div>
        Error:{' '}
        {memoryError ?? cpuError ?? cpuHistoryError ?? memoryHistoryError}
      </div>
    );
  }

  // Find the selected pod's metrics
  const memoryEntry = memoryResults.find(
    (item) => item.metric.labels.pod === selectedPod,
  );
  const cpuEntry = cpuResults.find(
    (item) => item.metric.labels.pod === selectedPod,
  );

  const memoryValue = memoryEntry?.value.value ?? 0;
  const cpuValue = cpuEntry?.value.value ?? 0;

  return (
    <>
      <div className='container min-w-screen min-h-screen w-full h-full bg-[#0a192f]'>
        <div className='time-graph bg-[#112240] p-4 rounded-lg shadow-lg'>
          <TimeGraph data={cpuHistoryData} />
          <TimeGraph data={memoryHistoryData} />
        </div>
        <div className='gauge bg-[#112240] flex justify-around items-center p-6 my-4 rounded-lg shadow-lg'>
          <Gauge value={memoryValue} name='Memory' />
          <Gauge value={cpuValue} name='CPU' />
        </div>
        <div className='pods bg-[#112240] p-6 rounded-lg shadow-lg'>
          <h1 className='text-2xl text-center font-semibold mb-2 bg-gradient-to-r from-columbia_blue-300 to-columbia_blue-900 bg-clip-text text-transparent'>Pods</h1>
          <div className='grid grid-cols-1 gap-4 place-items-center'>
            {podNames.map((pod) => (
              <button
                key={pod}
                className={`
                h-24 w-72 rounded-xl bg-[#172a45] shadow-md transition-all
                hover:shadow-lg hover:scale-105 flex items-center font-semibold text-md px-3 justify-center text-[#8892b0]
                ${pod === selectedPod ? 'border border-cyan-400' : ''}
              `}
                onClick={() => setSelectedPod(pod)}
              >
                {pod}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}