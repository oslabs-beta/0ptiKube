/**
 * @fileoverview TimeGraph component for visualizing Kubernetes metrics from Prometheus
 * @requires Next.js 13+ (for app directory structure)
 * @requires d3 5+ (for data visualization)
 *
 * Renders time-series data for Kubernetes metrics in an interactive graph format. Handles
 * real-time updates and user interactions on the client side.
 */
'use client';

/**
 * Core React imports for component functionality.
 * - React: Core library
 * - Hooks: State management and component lifecycle
 */
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';

/**
 * External dependencies
 * @module d3 - Data visualization library
 * @module handleError - Custom error handling utilities
 */
import * as d3 from 'd3';
import { handleError } from '@/app/api/utils/errorHandler';

/**
 * Metric type definitions for Kubernetes resource monitoring
 * @typedef { 'cpu' | 'memory' } MetricType - Type of resource being monitored
 * @typedef { 'cluster' | 'container' } - Scope of the metric measurement
 */
type MetricType = 'cpu' | 'memory';
type MetricScope = 'cluster' | 'container';

/**
 * @interface TimeGraph Props
 * @description Props for the TimeGraph component
 * @property {MetricScope} metricScope - Scope of metric measurement (cluster/container)
 * @property {string} viewMode - Display mode for the graph - not currently being used
 * @property {string} [containerName] - Optional container name for container-level metrics
 * @property {{data: PrometheusResponse} => void} [onDataUpdate] - Optional callback that fires when new data is fetched,
 * allowing parent components to sync with the latest Prometheus metrics
 */
interface TimeGraphProps {
  metricScope: MetricScope;
  viewMode: ViewMode;
  containerName?: string; // Required when viewMode is 'container'
  onDataUpdate?: (data: PrometheusResponse) => void;
}

/**
 * @function getMetricUnits
 * @description Helper function to get the y-axis units based on metric type
 * @param {MetricType} metricType - Type of metric (cpu/memory)
 * @returns {string} Units for the metric (millicores for cpu and MiB for memory)
 */
const getMetricUnits = (metricType: MetricType): string => {
  return metricType === 'cpu' ? 'millicores' : 'MiB';
};

/**
 * @function formatTime
 * @description Helper function to convert time units for tooltip integration
 * @param {number} leads - Number to format
 * @returns {Intl.DateTimeFormatOptions} Formatting options for time display
 */
const formatTime = (leads: number) => {
  const date = new Date(leads);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

/**
 * @interface DataPoint
 * @description Represents a single data point in the time series
 * @property {number} time - Unix timestamp
 * @property {number} value - Metric value at the given timestamp
 */
interface DataPoint {
  time: number;
  value: number;
}

/**
 * @interface PrometheusResponse
 * @description Structure of the response from the Prometheus API
 * @property {string} resultType - Type of result returned by Prometheur
 * @property {Array<PrometheusResult>} result - Array of metric results
 */
interface PrometheusResponse {
  resultType: string;
  result: Array<{
    metric: Record<string, string>;
    values: Array<{ time: string; value: number }>;
  }>;
}

/**
 * @component TimeGraph
 * @description Renders a D3-based time series graph for Kubernetes metrics
 * Uses Prometheus data to visualize CPU or Memory usage over time
 *
 * @param {TimeGraphProps} props
 * @returns {React.FC<TimeGraphProps>} Rendered graph component
 */
const TimeGraph: React.FC<TimeGraphProps> = ({
  // metricScope, // Not currently being used
  viewMode,
  containerName,
  // onDataUpdate, // Not currently being used
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  /**
   * State Hooks
   * @state {[number, number]} [width, setWidth] - Current screen width, default 900
   * @state {MetricType} [metricType, setMetric] - Current metric type being displayed
   * @state {PrometheusResponse | null} [rawData, setRawData] - Raw data from Prometheus before transformation
   * @state {string} [containerType, setContainerType] - Type of container being monitored (defaults to /cluter/cpu metrics)
   */
  const [width, setWidth] = useState(900); // Default screen width
  const [rawData, setRawData] = useState<PrometheusResponse | null>(null);
  const [containerType, setContainerType] = useState('/cluster/cpu');
  const [metricType, setMetricType] = useState<MetricType>('cpu');

  /**
   * @callback constructEndpoint
   * @description Builds the API endpoint URL based on container type and metric type
   * @returns {string} Constructed endpoint URL
   */
  const constructEndpoint = useCallback(() => {
    const baseEndpoint = '/api/metrics';
    if (viewMode === 'cluster') {
      return `${baseEndpoint}/${containerType}/${metricType}/history`;
    } else {
      // For container view, we'll need to include the container name in the query
      return `${baseEndpoint}/container/${metricType}/history?container=${containerName}`;
    }
  }, [containerType, viewMode, containerName, metricType]);

  /**
   * @effect Metric Type extraction
   * @description Extracts metric type (cpu/memory) from containerType string
   * Updates metricType state when containerType changes
   */
  useEffect(() => {
    const newMetricType = containerType.includes('memory') ? 'memory' : 'cpu';
    setMetricType(newMetricType);
  }, [containerType]);

  /**
   * @effect Prometheus Data Fetcher
   * @description Fetches metrics data from Preometheus API endpoints
   * Re-fetches when containerType, constructEndpoint, containerName, or metricType change
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = constructEndpoint();
        const response = await fetch(endpoint);

        if (!response.ok)
          throw new Error(`HTTP Error! Status: ${response.status}`);

        const responseData: PrometheusResponse = await response.json();
        setRawData(responseData);
      } catch (error) {
        return handleError(
          error,
          'Failed to retrieve Prometheus data from API endpoint'
        );
      }
    };

    fetchData();
  }, [containerType, constructEndpoint, containerName, metricType]);

  /**
   * @memo transformedData
   * @description Memoized transformation of raw Prometheus data into D3-compatatible format
   * @returns {DataPoint[]} Array of time-value data points for visualization
   *
   * Returns empty array if:
   * - rawData is null
   * - rawData has no results
   * - rawData result array is empty
   */
  const transformedData: DataPoint[] = useMemo(() => {
    // Early return if no data is available
    if (!rawData || !rawData.result.length) return [];

    // Transform API data for D3 consumption
    return rawData.result[0].values.map((entry) => ({
      time: new Date(entry.time).getTime(), // Convert ISO string to timestamp
      value: Number(entry.value),
    }));
  }, [rawData]); // Only reloads when rawData changes

  /**
   * @effect Window Resize Handler
   * @description Manages responsive behavior of the graph
   * Sets up resize listener and performs initial size calculation
   * @depends containerRef - Reference to the container element for width calculations
   */
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Get container width and set a minimum
        const containerWidth = Math.max(
          containerRef.current.getBoundingClientRect().width,
          300 // Minimum width
        );
        setWidth(containerWidth);
      }
    };

    // Initial size calculation
    handleResize();

    // Resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup: Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef]);

  /**
   * @effect D3 Graph Rendering
   * @description Handles D3 graph visualization setup and updates
   * @depends {
   * transformedData - Processed data points for visualizaion
   * metricType - Current metric being displayed (cpu/memory)
   * containerType - Current container type displayed (cluster/container)
   * containerName - Current container name displayed
   * }
   */
  useEffect(() => {
    // Guard clause: Returns early is no data or svgRef
    if (!svgRef.current || transformedData.length === 0) return;

    // Set up graph dimensions
    const width = 900;
    const height = 450;
    const margin = { top: 50, right: 50, bottom: 60, left: 70 };

    // Set up x-axis scale
    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(transformedData, (d) => d.time) || 0, // Get min timestamp
        d3.max(transformedData, (d) => d.time) || 0,
      ])
      .range([margin.left, width - margin.right]);

    // Set up y-axis scale
    const yScale = d3
      .scaleLinear()
      .domain([0, (d3.max(transformedData, (d) => d.value) || 0) * 1.1])
      .range([height - margin.bottom, margin.top]);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    // Append x-axis to SVG
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(d3.timeMinute.every(10)) // Show tick every 10 minutes
          .tickFormat((d) => {
            return d3.timeFormat('%I:%M %p')(d as Date);
          })
      )
      .selectAll('text')
      .attr('fill', 'white')
      .attr('font-size', '14px');

    // Append y-axis to SVG
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', 'white')
      .attr('font-size', '14px');

    // Add background grid
    const grid = svg.append('g').attr('class', 'grid');

    grid
      .append('g')
      .attr('class', 'grid-lines')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(transformedData.length / 10)
          .tickSize(-height + margin.top + margin.bottom)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#ffffff30'); // Light transparency for more subtle effect

    grid
      .append('g')
      .attr('class', 'grid-lines')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickSize(-width + margin.left + margin.right)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#ffffff30'); // Light transparency for more subtle effect

    // Axis label - x-axis
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 20)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .text('Time');

    // Axis label - y-axis
    svg
      .append('text')
      .attr('x', -(height / 2))
      .attr('y', margin.left - 50) // Adjust as needed
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .text(`Value (${getMetricUnits(metricType)})`);

    // Generate line path
    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.value))
      .curve(d3.curveLinear);

    // Append path
    const path = svg
      .append('path')
      .datum(transformedData)
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#00ccff')
      .attr('stroke-width', '3');

    // Animate the line drawing
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr('stroke-dasharray', totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Append Circles for data points
    const circles = svg
      .selectAll('circle')
      .data(transformedData)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.time))
      .attr('cy', (d) => yScale(d.value))
      .attr('r', 4)
      .attr('fill', '#00ccff')
      .attr('cursor', 'pointer');

    // Add tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', '#333')
      .style('color', 'white')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('opacity', 0);

    // Calculate linear regression
    const xSeries = transformedData.map((d, i) => i);
    const ySeries = transformedData.map((d) => d.value);

    const n = xSeries.length;
    const xMean = xSeries.reduce((a, b) => a + b, 0) / n;
    const yMean = ySeries.reduce((a, b) => a + b, 0) / n;

    const slope =
      xSeries
        .map((x, i) => (x - xMean) * (ySeries[i] - yMean))
        .reduce((a, b) => a + b, 0) /
      xSeries.map((x) => Math.pow(x - xMean, 2)).reduce((a, b) => a + b, 0);

    const intercept = yMean - slope * xMean;

    // Create trend line data
    const trendData = xSeries.map((x) => ({
      time: transformedData[x].time,
      value: slope * x + intercept,
    }));

    // Add trend line to the graph
    const trendLine = d3
      .line<DataPoint>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.value));

    svg
      .append('path')
      .datum(trendData)
      .attr('class', 'trend-line')
      .attr('d', trendLine)
      .attr('fill', 'none')
      .attr('stroke', '#ffcc00')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '10,10') // Create dashed line
      .attr('opacity', 0.6); // Make it slightly transparent

    circles
      .on('mouseover', function (event, d) {
        d3.select(this).transition().duration(300).attr('r', 6); // Expand on hover

        tooltip.transition().duration(300).style('opacity', 1);
        tooltip
          // .html(`Time: ${d.time}, Value: ${d.value}`)
          .html(`Time: ${formatTime(d.time)}, Value: ${d.value.toFixed(2)}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(300).attr('r', 4); // Shrink back on mouse leave

        tooltip.transition().duration(300).style('opacity', 0);
      });
  }, [transformedData, metricType, containerType, containerName]);

  /**
   * @returns React component structure
   * Container div with dynamic styling
   * SVG element for D3 graph rendering
   * Metric selector options in dropdown menu
   */
  return (
    <div style={{ textAlign: 'center', color: 'white' }}>
      <div className='flex justify-center items-center mb-6 p-4 border-b-2 border-columbia_blue-900'>
        <h2 className='text-2xl font-semibold bg-gradient-to-r from-columbia_blue-300 to-columbia_blue-900 bg-clip-text text-transparent'>
          Resource Use Over Time
        </h2>
      </div>

      {/* Container for the graph */}
      <div
        ref={containerRef}
        className='w-full px-4'
        style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
        <svg ref={svgRef} width={width} height={450} />
      </div>

      {/* Section with metric selector */}
      <div className='flex justify-center items-center mb-4 p-4 bg-[#0a192f]'>
        <select
          value={containerType}
          onChange={(e) => setContainerType(e.target.value)}
          className='justify-self-center bg-[#112240] text-white px-4 py-2 rounded border border-[#172a45] cursor-pointer hover:bg-[#172a45] transition-colors'
        >
          <option value='cluster/cpu'>Cluster CPU</option>
          <option value='cluster/memory'>Cluster Memory</option>
          <option value='container/cpu'>Container CPU</option>
          <option value='container/memory'>Container Memory</option>
        </select>
      </div>
    </div>
  );
};

export default TimeGraph;
