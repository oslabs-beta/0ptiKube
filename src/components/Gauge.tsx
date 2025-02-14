import * as d3 from 'd3';
import React from 'react';
import { useRef, useEffect } from 'react';

/**
 * Props interface for the Gauge component
 * Defines customizable properties for size, value, range, and dimensions
 */
interface GaugeProps {
  name: string; // Display name for the gauge
  value: number; // Current value to display
  min?: number; // Minimum value (default: 0)
  max?: number; // Maximum value (default: 100)
  width?: number; // Width of SVG (default: 200)
  height?: number; // Height of SVG (default: 200)
  innerRadius?: number; // Inner radius of gauge arc (default: 50)
  outerRadius?: number; // Outer radius of gauge arc (default: 80)
}

/**
 * Interface defining the shape of data needed for D3's arc generator
 * D3 uses this data structure to create circular/arc shapes
 */
interface ArcData {
  startAngle: number; // Starting angle of the arc (in radians)
  endAngle: number; // Ending angle of the arc (in radians)
  innerRadius: number; // Inner radius of the arc
  outerRadius: number; // Outer radius of the arc
}

// Animation constants for smooth gauge updates
const ANIMATION_DURATION = 2000; // Duration in milliseconds
const ANIMATION_EASING = d3.easeCubicOut; // Smooth easing function for natural movement

function Gauge({
  name,
  value,
  min = 0,
  max = 100,
  width = 200,
  height = 200,
  innerRadius = 50,
  outerRadius = 80,
}: GaugeProps) {
  // Reference to the SVG element for D3 manipulation
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Initialize D3 selection of the SVG element and set dimensions
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Clear any existing elements for re-render
    svg.selectAll('*').remove();

    // Calculate the percentage (0-1) of the current value within the range
    const fraction = Math.max(0, Math.min((value - min) / (max - min), 1));

    // Create a color scale that transitions from green to red based on value
    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, 0.2, 0.4, 0.6, 0.8, 1])
      .range(['#006B3D', '#069C56', '#FF980E', '#FF681E', '#D3212C']);

    const fillColor = colorScale(fraction);

    // Define the angles for the gauge. (full circle = 2π radians)
    const startAngle = 0;
    const endAngle = 2 * Math.PI; // full circle in radians represented by Tau (τ)
    const fillAngle = endAngle * fraction; // How much of the circle to fill

    // Create the D3 arc generator for the background (empty) part of the gauge
    const backgroundArc = d3
      .arc<ArcData>()
      .startAngle((d) => d.startAngle)
      .endAngle((d) => d.endAngle)
      .innerRadius((d) => d.innerRadius)
      .outerRadius((d) => d.outerRadius);

    // Create the D3 arc generator for the filled part of the gauge
    const foregroundArc = d3
      .arc<ArcData>()
      .startAngle((d) => d.startAngle)
      .endAngle((d) => d.endAngle)
      .innerRadius((d) => d.innerRadius)
      .outerRadius((d) => d.outerRadius);

    // Base configuration for both arcs
    const arcData: ArcData = {
      startAngle,
      endAngle,
      innerRadius,
      outerRadius,
    };

    // Calculate center position for the gauge
    const centerX = width / 2;
    const centerY = height / 2;

    // Configuration for tick marks
    const tickCount = 15;
    const tickLength = 8;
    const tickWidth = 2;

    // Generate evenly spaced angles for tick marks
    const ticks = Array.from({ length: tickCount }, (_, i) => {
      const angle =
        startAngle + (endAngle - startAngle) * (i / (tickCount - 1));
      return angle;
    });

    // Draw the background arc (empty gauge)
    svg
      .append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`) // Move to center
      .attr('d', backgroundArc(arcData)) // Generate arc path
      .attr('fill', '#8892b0'); // Gray background

    // Initialize the foreground arc (filled gauge) starting at 0
    const foregroundArcData: ArcData = {
      ...arcData,
      endAngle: 0, // Start empty for animation
    };

    // Draw and animate the foreground arc
    svg
      .append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', foregroundArc(foregroundArcData))
      .attr('fill', fillColor)
      .transition()
      .duration(ANIMATION_DURATION)
      .ease(ANIMATION_EASING)
      .attrTween('d', function (this: SVGPathElement) {
        // Create interpolator for smooth animation
        const interpolate = d3.interpolate(0, fillAngle);
        return function (t: number): string {
          // Update arc end angle based on animation progress
          const newArcData = {
            ...arcData,
            endAngle: interpolate(t),
          };
          return foregroundArc(newArcData) || '';
        };
      });

    // Add tick marks around the gauge
    svg
      .selectAll('.tick')
      .data(ticks) // Bind tick angles to elements
      .enter() // Create new elements for each tick
      .append('line') // Add line elements
      .attr('class', 'tick')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      // Calculate tick mark start position (from outer radius)
      .attr('x1', (d) => Math.cos(d - Math.PI / 2) * outerRadius)
      .attr('y1', (d) => Math.sin(d - Math.PI / 2) * outerRadius)
      // Calculate tick mark end position (inward by tickLength)
      .attr('x2', (d) => Math.cos(d - Math.PI / 2) * (outerRadius - tickLength))
      .attr('y2', (d) => Math.sin(d - Math.PI / 2) * (outerRadius - tickLength))
      .attr('stroke', '#032e49') // Tick color
      .attr('stroke-width', tickWidth)
      .attr('opacity', 0.4);

    // Add center text displaying the current value
    svg
      .append('text')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('text-anchor', 'middle') // Center text horizontally
      .attr('alignment-baseline', 'middle') // Center text vertically
      .attr('font-size', 20)
      .attr('fill', '#bbcdff')
      .text(`${value.toFixed(1)}%`); // Display value with 1 decimal place
  }, [value, min, max, width, height, innerRadius, outerRadius]);

  return (
    <div className='flex flex-col size-64 bg-[#172a45] rounded-2xl m-2 items-center justify-center border-2 border-columbia_blue-900'>
      <span className='text-2xl font-semibold bg-gradient-to-r from-columbia_blue-300 to-columbia_blue-900 bg-clip-text text-transparent'>
        {name}
      </span>
      <svg ref={svgRef} />
    </div>
  );
}

export default Gauge;
