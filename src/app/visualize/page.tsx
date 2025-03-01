'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_PRESET_ID } from '@/constants/timePresets';
import TimePresetSelector from '@/components/TimePresetSelector';
import Gauge from '@/components/Gauge';
import TimeGraph from '@/components/TimeGraph';
import Pods from '@/components/Pods';
import SourceTypeSelector from '@/components/SourceTypeSelector';
import type { PrometheusMatrixResponse } from '@/types/metrics';
import {
  useMemoryUsage,
  useCPUUsage,
  useMemoryHistory,
  useCPUHistory,
} from '@/hooks/useMetrics';
import './page.css';
import PodsSkeleton from '@/components/PodsSkeleton';

export default function VisualizePage() {
  // ------------------------------------------------------------------
  // Toggle State (cluster/container)
  // ------------------------------------------------------------------
  const TRANSITION_DURATION = 1000; // Match this with CSS animation duration

  const [sourceType, setSourceType] = useState<'cluster' | 'container'>(
    'container',
  );

  // ------------------------------------------------------------------
  // Toggle State (Time Preset Selector Component - to change parameter
  //  applied to /history endpoints
  // ------------------------------------------------------------------
  const [selectedPreset, setSelectedPreset] =
    useState<string>(DEFAULT_PRESET_ID);

  // ------------------------------------------------------------------
  // Fetch Data from the Right Endpoints
  // ------------------------------------------------------------------
  // CPU usage
  const {
    data: cpuData,
    error: cpuError,
    loading: cpuLoading,
  } = useCPUUsage(sourceType);

  // CPU history
  const {
    data: cpuHistoryData,
    error: cpuHistoryError,
    loading: cpuHistoryLoading,
  } = useCPUHistory(sourceType, selectedPreset);

  // Memory usage
  const {
    data: memoryData,
    error: memoryError,
    loading: memoryLoading,
  } = useMemoryUsage(sourceType);

  // Memory history
  const {
    data: memoryHistoryData,
    error: memoryHistoryError,
    loading: memoryHistoryLoading,
  } = useMemoryHistory(sourceType, selectedPreset);

  // ------------------------------------------------------------------
  // Pods selection (only relevant if sourceType === 'container')
  // ------------------------------------------------------------------
  const [selectedPod, setSelectedPod] = useState<string>('');
  const [isPodsLoading, setIsPodsLoading] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Wrapper function to handle sourceType change with view transition
  const handleSourceTypeChange = (newSourceType: 'cluster' | 'container') => {
    if (newSourceType === sourceType) return;

    // Start transition immediately
    setIsTransitioning(true);

    // For container view, prepare pod data
    if (newSourceType === 'container' && podNames.length > 0) {
      // Pre-select first pod to avoid empty state
      if (!selectedPod) {
        setSelectedPod(podNames[0]);
      }
    }

    // Use View Transitions API if available
    if ('startViewTransition' in document) {
      document
        .startViewTransition(() => {
          // Update source type immediately
          setSourceType(newSourceType);

          // If switching to cluster, clear pod selection
          if (newSourceType === 'cluster') {
            setSelectedPod('');
          }

          // Very brief delay to let React update the DOM
          return new Promise((resolve) => setTimeout(resolve, 32));
        })
        .finished.finally(() => {
          // Mark transition as complete
          setIsTransitioning(false);
          setIsPodsLoading(false);
        });
    } else {
      // Fallback for browsers without View Transitions API
      setSourceType(newSourceType);
      if (newSourceType === 'cluster') {
        setSelectedPod('');
      }

      // Use a shorter timeout for fallback
      setTimeout(() => {
        setIsTransitioning(false);
        setIsPodsLoading(false);
      }, TRANSITION_DURATION);
    }
  };

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

  // Show loading state when pod data is fetching
  useEffect(() => {
    if (sourceType === 'container') {
      // Only start loading if we're not mid-transition
      if (!isTransitioning) {
        setIsPodsLoading(true);
        const timer = setTimeout(() => {
          setIsPodsLoading(false);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [sourceType, isTransitioning]);

  // Improved pod selection effect
  useEffect(() => {
    if (
      sourceType === 'container' &&
      !selectedPod &&
      podNames.length > 0 &&
      !isTransitioning
    ) {
      setSelectedPod(podNames[0]);
    }
  }, [sourceType, selectedPod, podNames, isTransitioning]);

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
    <div className='dashboard-container' data-view-mode={sourceType}>
      {/* Source Type Selector */}
      <SourceTypeSelector
        sourceType={sourceType}
        setSourceType={handleSourceTypeChange}
        setSelectedPod={setSelectedPod}
      />

      <div
        className='gauge grid grid-cols-1 place-items-center rounded-lg bg-[#112240] p-4 shadow-lg'
        style={{ viewTransitionName: 'gauge' }}
      >
        {/* Gauges */}
        <div className='flex space-x-40 rounded-lg'>
          <Gauge value={memoryValue} name='Memory' />
          <Gauge value={cpuValue} name='CPU' />
        </div>
      </div>

      <div
        className='time-graph rounded-lg bg-[#112240] p-4 shadow-lg'
        style={{ viewTransitionName: 'time-graph' }}
      >
        {/* Time Graphs */}
        <TimeGraph
          data={historicalCpuData}
          metric='CPU'
          units='Millicores (m)'
          preset={selectedPreset}
        />
        <TimeGraph
          data={historicalMemoryData}
          metric='Memory'
          units='Mebibytes (MiB)'
          preset={selectedPreset}
        />

        {/* Time Preset Selector */}
        <TimePresetSelector
          selectedPreset={selectedPreset}
          onChange={setSelectedPreset}
        />
      </div>

      {/* Render pods container only for container mode, but use a placeholder for the grid area in cluster mode */}
      {sourceType === 'container' ? (
        <div
          className='pods rounded-lg bg-[#112240] p-6 shadow-lg'
          style={{ viewTransitionName: 'pods' }}
        >
          {isTransitioning || isPodsLoading || podNames.length === 0 ? (
            <div className='pods-skeleton w-full'>
              <PodsSkeleton />
            </div>
          ) : (
            <Pods
              podNames={podNames}
              selectedPod={selectedPod}
              setSelectedPod={setSelectedPod}
            />
          )}
        </div>
      ) : (
        <div
          className='pods-placeholder'
          aria-hidden='true'
          style={{ viewTransitionName: 'pods' }}
        ></div>
      )}
    </div>
  );
}
