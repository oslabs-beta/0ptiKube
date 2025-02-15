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
        pod?: string;
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
    metric: {
      labels: {
        pod?: string;
      };
    };
    values: Array<{ time: string; value: number }>;
  }>;
}

export default function VisualizePage() {
  // ------------------------------------------------------------------
  // Toggle State (cluster/container)
  // ------------------------------------------------------------------
  const [sourceType, setSourceType] = useState<'cluster' | 'container'>(
    'container',
  );

  // Build dynamic endpoints based on source type:
  const memoryEndpoint = `${sourceType}/memory/percent`;
  const cpuEndpoint = `${sourceType}/cpu/percent`;
  const memoryHistoryEndpoint = `${sourceType}/memory/history`;
  const cpuHistoryEndpoint = `${sourceType}/cpu/history`;

  // ------------------------------------------------------------------
  // Fetch Data from the Right Endpoints
  // ------------------------------------------------------------------
  // Memory usage
  const {
    data: memoryData,
    error: memoryError,
    loading: memoryLoading,
  } = useData<PromVectorData>(memoryEndpoint);

  // CPU usage
  const {
    data: cpuData,
    error: cpuError,
    loading: cpuLoading,
  } = useData<PromVectorData>(cpuEndpoint);

  // CPU history
  const {
    data: cpuHistoryData,
    loading: cpuHistoryLoading,
    error: cpuHistoryError,
  } = useData<PrometheusMatrixResponse>(cpuHistoryEndpoint);

  // Memory history
  const {
    data: memoryHistoryData,
    loading: memoryHistoryLoading,
    error: memoryHistoryError,
  } = useData<PrometheusMatrixResponse>(memoryHistoryEndpoint);

  // ------------------------------------------------------------------
  // Pods selection (only relevant if sourceType === 'container')
  // ------------------------------------------------------------------
  const [selectedPod, setSelectedPod] = useState<string>('');

  // If container data, parse out pod names from CPU and memory results
  const cpuResults = cpuData?.result || [];
  const memoryResults = memoryData?.result || [];
  const allPodNames = new Set<string>();

  if (sourceType === 'container') {
    for (const item of memoryResults) {
      if (item.metric.labels?.pod) {
        allPodNames.add(item.metric.labels.pod);
      }
    }
    for (const item of cpuResults) {
      if (item.metric.labels?.pod) {
        allPodNames.add(item.metric.labels.pod);
      }
    }
  }

  const podNames = Array.from(allPodNames);

  // Auto-select first pod if none is selected
  useEffect(() => {
    if (sourceType === 'container' && !selectedPod && podNames.length > 0) {
      setSelectedPod(podNames[0]);
    }
  }, [sourceType, selectedPod, podNames]);

  // ------------------------------------------------------------------
  // Handle Loading and Errors
  // ------------------------------------------------------------------
  if (
    memoryLoading ||
    cpuLoading ||
    cpuHistoryLoading ||
    memoryHistoryLoading
  ) {
    return <div>Loading...</div>;
  }

  if (memoryError || cpuError || cpuHistoryError || memoryHistoryError) {
    return (
      <div>
        Error:{' '}
        {memoryError ?? cpuError ?? cpuHistoryError ?? memoryHistoryError}
      </div>
    );
  }

  let filteredCpuHistoryData: PrometheusMatrixResponse | null = null;
  let filteredMemoryHistoryData: PrometheusMatrixResponse | null = null;
  if (cpuHistoryData && memoryHistoryData && selectedPod) {
    // Filter out only the result object(s) that match the selected pod
    const filteredCpuResults = cpuHistoryData.result.filter(
      (r) => r.metric.labels?.pod === selectedPod,
    );

    const filteredMemoryResults = memoryHistoryData.result.filter(
      (r) => r.metric.labels?.pod === selectedPod,
    );

    // Create a new object that mimics the shape of your PrometheusMatrixResponse
    // but contains only the matching timeseries
    filteredCpuHistoryData = {
      resultType: cpuHistoryData.resultType,
      result: filteredCpuResults,
    };

    filteredMemoryHistoryData = {
      resultType: cpuHistoryData.resultType,
      result: filteredMemoryResults,
    };
  }

  // ------------------------------------------------------------------
  // Extract the Data for Time Graphs
  // ------------------------------------------------------------------
  let historicalCpuData: PrometheusMatrixResponse | null = null;
  let historicalMemoryData: PrometheusMatrixResponse | null = null;

  if (sourceType === 'container') {
    historicalCpuData = filteredCpuHistoryData;
    historicalMemoryData = filteredMemoryHistoryData;
  } else {
    historicalCpuData = cpuHistoryData;
    historicalMemoryData = memoryHistoryData;
  }

  // ------------------------------------------------------------------
  // Extract the Values for Gauges
  // ------------------------------------------------------------------
  let memoryValue = 0;
  let cpuValue = 0;

  if (sourceType === 'container') {
    // Container-level: find by the selected pod
    const memoryEntry = memoryResults.find(
      (item) => item.metric.labels.pod === selectedPod,
    );
    const cpuEntry = cpuResults.find(
      (item) => item.metric.labels.pod === selectedPod,
    );

    memoryValue = memoryEntry?.value.value ?? 0;
    cpuValue = cpuEntry?.value.value ?? 0;
  } else {
    // Cluster-level: typically only one result in the array
    // but you can adapt if you have multiple
    memoryValue = memoryResults?.[0]?.value?.value ?? 0;
    cpuValue = cpuResults?.[0]?.value?.value ?? 0;
  }

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <>
      <div className='container min-w-screen min-h-screen bg-[#0a192f]'>
        <div className='gauge bg-[#112240] grid grid-cols-1 place-items-center p-4 rounded-lg shadow-lg'>
          {/* Source Type Selector */}
          <div className='flex justify-center items-center p-4 bg-[#0a192f] w-full h-full'>
            <select
              className='h-10 w-40 bg-[#172a45] border border-cyan-400 text-[#8892b0] rounded-md px-2'
              value={sourceType}
              onChange={(e) => {
                setSourceType(e.target.value as 'cluster' | 'container');
                if (e.target.value === 'cluster') setSelectedPod('');
              }}
            >
              <option value='cluster'>Cluster</option>
              <option value='container'>Container</option>
            </select>
          </div>

          {/* Gauges */}
          <div className='flex rounded-lg space-x-40'>
            <Gauge value={memoryValue} name='Memory' />
            <Gauge value={cpuValue} name='CPU' />
          </div>
        </div>

        <div className='time-graph bg-[#112240] p-4 rounded-lg shadow-lg'>
          <TimeGraph data={historicalCpuData} />
          <TimeGraph data={historicalMemoryData} />
        </div>

        {/* Show pods only if sourceType === 'container' */}
        {sourceType === 'container' && (
          <div className='pods bg-[#112240] p-6 rounded-lg shadow-lg'>
            <h1 className='text-2xl text-center font-semibold mb-2 bg-gradient-to-r from-columbia_blue-300 to-columbia_blue-900 bg-clip-text text-transparent'>
              Pods
            </h1>
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
        )}
      </div>
    </>
  );
}
