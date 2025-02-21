'use client';
import { useState, useEffect } from 'react';
import Gauge from '@/components/Gauge';
import TimeGraph from '@/components/TimeGraph';
import { useData } from '@/hooks/useData';
import './page.css';
import Pods from '@/components/Pods';
import SourceTypeSelector from '@/components/SourceTypeSelector';

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
      <div
        className={`min-w-screen ${sourceType === 'container' ? 'container' : 'container-no-pods'} min-h-screen bg-[#0a192f]`}
      >
        <div className='gauge grid grid-cols-1 place-items-center rounded-lg bg-[#112240] p-4 shadow-lg'>
          {/* Source Type Selector */}
          <SourceTypeSelector
            sourceType={sourceType}
            setSourceType={setSourceType}
            setSelectedPod={setSelectedPod}
          />

          {/* Gauges */}
          <div className='flex space-x-40 rounded-lg'>
            <Gauge value={memoryValue} name='Memory' />
            <Gauge value={cpuValue} name='CPU' />
          </div>
        </div>

        <div className='time-graph rounded-lg bg-[#112240] p-4 shadow-lg'>
          {/* Time Graphs */}
          <TimeGraph
            data={historicalCpuData}
            metric='CPU'
            units='Millicores (m)'
          />
          <TimeGraph
            data={historicalMemoryData}
            metric='Memory'
            units='Mebibytes (MiB)'
          />
        </div>

        {/* Show pods only if sourceType === 'container' */}
        {sourceType === 'container' && (
          <div className='pods rounded-lg bg-[#112240] p-6 shadow-lg'>
            <Pods
              podNames={podNames}
              selectedPod={selectedPod}
              setSelectedPod={setSelectedPod}
            />
          </div>
        )}
      </div>
    </>
  );
}
