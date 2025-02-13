'use client';

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import * as d3 from 'd3';
import { handleError } from '@/app/api/utils/errorHandler';

type MetricType = 'cpu' | 'memory';
type MetricScope = 'cluster' | 'container';

interface TimeGraphProps {
  metricScope: MetricScope;
  viewMode: ViewMode;
  containerName?: string; // Required when viewMode is 'container'
  onDataUpdate?: (data: PrometheusResponse) => void; // Optional callback for parent updates
}

// Helper function to get the y-axis units
const getMetricUnits = (metricType: MetricType): string => {
  return metricType === 'cpu' ? 'millicores' : 'MiB';
};

// Helper function to convert time units for tooltip integration
const formatTime = (timeMs: number) => {
  const date = new Date(timeMs);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

type DataPoint = { time: number; value: number };

type PrometheusResponse = {
  resultType: string;
  result: Array<{
    metric: Record<string, string>;
    values: Array<{ time: string; value: number }>;
  }>;
};

const TimeGraph: React.FC<TimeGraphProps> = ({
  metricScope,
  viewMode,
  containerName,
  onDataUpdate,
}) => {
  const [width, setWidth] = useState(900); // Default screen width
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [rawData, setRawData] = useState<PrometheusResponse | null>(null);
  const [containerType, setContainerType] = useState('/cluster/cpu');
  const [metricType, setMetricType] = useState<MetricType>('cpu');

  const constructEndpoint = useCallback(() => {
    const baseEndpoint = '/api/metrics';
    if (viewMode === 'cluster') {
      return `${baseEndpoint}/${containerType}/${metricType}/history`;
    } else {
      // For container view, we'll need to include the container name in the query
      return `${baseEndpoint}/container/${metricType}/history?container=${containerName}`;
    }
  }, [containerType, viewMode, containerName, metricType]);

  useEffect(() => {
    // Extract metric type from containerType
    const newMetricType = containerType.includes('memory') ? 'memory' : 'cpu';
    setMetricType(newMetricType);
  }, [containerType]);

  // Fetch Prometheus data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = `api/metrics/${containerType}/history`;
        const response = await fetch(endpoint);
        if (!response.ok)
          throw new Error(`HTTP Error! Status: ${response.status}`);

        const data: PrometheusResponse = await response.json();
        console.log('Fetched Data:', data); // Debugging log to confirm data receipt

        setRawData(data);
      } catch (error) {
        return handleError(
          error,
          'Failed to retrieve Prometheus data from API endpoint'
        );
      }
    };

    fetchData();
  }, [containerType]); // Re-fetch when containerType changes

  // Transform API data for use within D3
  const transformedData: DataPoint[] = useMemo(() => {
    if (!rawData || !rawData.result.length) return [];

    return rawData.result[0].values.map((entry) => ({
      time: new Date(entry.time).getTime(), // Convert ISO string to timestamp
      value: Number(entry.value),
    }));
  }, [rawData]);

  // Graph resize handler
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

    // Initial size
    handleResize();

    // Resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //Render Graph with D3
  useEffect(() => {
    if (!svgRef.current || transformedData.length === 0) return;

    // Set up graph dimensions
    const width = 900;
    const height = 450;
    const margin = { top: 50, right: 50, bottom: 60, left: 70 };

    // Set up x-axis and y-axis scales
    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(transformedData, (d) => d.time) || 0, // Get min timestamp
        d3.max(transformedData, (d) => d.time) || 0,
      ])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, (d3.max(transformedData, (d) => d.value) || 0) * 1.1])
      .range([height - margin.bottom, margin.top]);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    // Append x-axis
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

    // Append y-axis
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

    // Axis labels
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 20)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .text('Time');

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
  }, [transformedData, metricType]);

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
