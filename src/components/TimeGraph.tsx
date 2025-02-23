import type { PrometheusMatrixResponse } from '@/types/metrics';
import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * A simple interface to represent the time-series data
 * used by D3. Each data point has a timestamp (in ms)
 * and a numerical value.
 */
interface DataPoint {
  time: number; // Unix timestamp in milliseconds
  value: number; // Numeric value of the metric at that timestamp
}

/**
 * Props for the TimeGraph component:
 * @property {PrometheusMatrixResponse | null} data - The timeseries data to plot.
 * @property {string} [units="Value"] - Display units for the metric (e.g. "Millicores (m)", "Mebibytes (MiB)").
 * @property {string} [metric="Resource"] - A short descriptor of the metric (e.g. "CPU", "Memory").
 */
interface TimeGraphProps {
  data: PrometheusMatrixResponse | null;
  units?: string;
  metric?: string;
}

/**
 * TimeGraph is a reusable React component that renders a line chart
 * for a given set of time-series data using D3.js. It includes axes,
 * gridlines, interactive tooltips, and an optional trend line.
 */
const TimeGraph = ({
  data,
  metric = 'Resource',
  units = 'Value',
}: TimeGraphProps) => {
  // Refs for the SVG and container elements
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State to manage the chart width. Defaults to 900px for initial render.
  const [width, setWidth] = useState(900);
  // Fixed height of the chart
  const height = 450;

  /**
   * Transform the raw Prometheus data into an array of DataPoints
   * that D3 can work with easily (time in ms, numeric value).
   */
  const transformedData: DataPoint[] = useMemo(() => {
    if (!data || data.result.length === 0) return [];

    // Collect all values from all results
    const allPoints: DataPoint[] = data.result.flatMap((result) =>
      result.values.map((entry) => ({
        // Parse ISO 8601 string directly
        time: Date.parse(entry.time),
        value: entry.value,
      })),
    );

    return allPoints;
  }, [data]);

  /**
   * formatTime is a small helper function used to display
   * timestamps in tooltips, using HH:MM:SS (24-hour) format.
   */
  function formatTime(timestamp: number) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  /**
   * Whenever the container's size changes, recalculate the width.
   * This effect runs on initial mount and whenever the user resizes
   * the browser window.
   */
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Enforce a minimum width so the chart isn't squashed too small
        const containerWidth = Math.max(
          containerRef.current.getBoundingClientRect().width,
          300, // Minimum width
        );
        setWidth(containerWidth);
      }
    };

    // Initial size calculation
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Cleanup: Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Main D3 chart rendering effect. This runs whenever
   * `transformedData`, `width`, or `units` change.
   */
  useEffect(() => {
    // If we have no data or no SVG ref, skip chart drawing
    if (!svgRef.current || transformedData.length === 0) return;

    // Clear any existing content from previous renders
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Chart layout margins
    const margin = { top: 50, right: 50, bottom: 60, left: 70 };

    /**
     * Build X and Y scales based on the data.
     * - xScale: time scale from earliest to latest timestamp
     * - yScale: linear scale from 0 to max value (with some headroom)
     */
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(transformedData, (d) => d.time) as [number, number])
      .range([margin.left, width - margin.right]);

    const yMax = d3.max(transformedData, (d) => d.value) || 0;
    const yScale = d3
      .scaleLinear()
      .domain([0, yMax * 1.1]) // Add ~10% headroom for clarity
      .range([height - margin.bottom, margin.top]);

    // ====== X Axis ======
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(d3.timeMinute.every(10)) // Show tick every 10 minutes
          .tickFormat((d) => d3.timeFormat('%H:%M')(d as Date)), // 24-hour time format
      )
      .selectAll('text')
      .attr('fill', 'white')
      .attr('font-size', '14px');

    // ====== Y Axis ======
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', 'white')
      .attr('font-size', '14px');

    // ====== Grid Lines ======
    const grid = svg.append('g').attr('class', 'grid');

    // Vertical grid lines
    grid
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(transformedData.length / 10)
          .tickSize(-height + margin.top + margin.bottom)
          .tickFormat(() => ''),
      )
      .selectAll('line')
      .attr('stroke', '#ffffff30'); // Light transparency for more subtle effect

    // Horizontal grid lines
    grid
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickSize(-width + margin.left + margin.right)
          .tickFormat(() => ''),
      )
      .selectAll('line')
      .attr('stroke', '#ffffff30'); // Light transparency for more subtle effect

    // ====== Axis Labels ======
    // X-axis label
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 20)
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .attr('text-anchor', 'middle')
      .text('Time');

    // Y-axis label
    svg
      .append('text')
      .attr('x', -(height / 2))
      .attr('y', margin.left - 50)
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text(units);

    // ====== Line Path Generator ======
    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.value))
      .curve(d3.curveLinear);

    // Append the main data path
    const path = svg
      .append('path')
      .datum(transformedData)
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#00ccff')
      .attr('stroke-width', 3);

    // Animate the line drawing
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr('stroke-dasharray', totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // ====== Data Point Circles ======
    const circles = svg
      .selectAll('circle')
      .data(transformedData)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.time))
      .attr('cy', (d) => yScale(d.value))
      .attr('r', 4)
      .attr('fill', '#00ccff')
      .style('cursor', 'pointer');

    // ====== Tooltip ======
    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', '#333')
      .style('color', 'white')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('opacity', 0);

    // Tooltip interaction
    circles
      .on('mouseover', function (event, d) {
        d3.select(this).transition().duration(300).attr('r', 6); // Expand on hover
        tooltip.transition().duration(300).style('opacity', 1);
        tooltip
          .html(
            `Time: ${formatTime(d.time)}<br/>${units}: ${d.value.toFixed(2)}`,
          )
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(300).attr('r', 4); // Shrink back on mouse leave
        tooltip.transition().duration(300).style('opacity', 0);
      });

    // ====== (Optional) Trend Line ======
    // Calculate a simple linear regression for illustrative purposes
    const xSeries = transformedData.map((_, i) => i);
    const ySeries = transformedData.map((d) => d.value);
    const n = xSeries.length;
    if (n > 1) {
      const xMean = d3.mean(xSeries) as number;
      const yMean = d3.mean(ySeries) as number;

      const slope =
        xSeries
          .map((x, i) => (x - xMean) * (ySeries[i] - yMean))
          .reduce((a, b) => a + b, 0) /
        xSeries.map((x) => Math.pow(x - xMean, 2)).reduce((a, b) => a + b, 0);

      const intercept = yMean - slope * xMean;

      const trendData = xSeries.map((x) => ({
        time: transformedData[x].time,
        value: slope * x + intercept,
      }));

      const trendLine = d3
        .line<{ time: number; value: number }>()
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
        .attr('opacity', 0.6); // Create dashed line
    }

    // Cleanup function to remove tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, [transformedData, width, units]);

  return (
    <div ref={containerRef} style={{ width: '100%', margin: 'auto' }}>
      {/* A descriptive title for the chart */}
      <div style={{ textAlign: 'center', color: 'white' }}>
        <h2 className='bg-gradient-to-r from-columbia_blue-300 to-columbia_blue-900 bg-clip-text text-2xl font-semibold text-transparent'>
          {metric} Usage Over Time
        </h2>
      </div>

      {/* The SVG container where D3 draws the chart */}
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};

export default TimeGraph;