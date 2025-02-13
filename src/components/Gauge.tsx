import * as d3 from 'd3';
import React from 'react';
import { useRef, useEffect } from 'react';

interface GaugeProps {
  name: string;
  value: number;
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

// Declare constants for Gauge component animation
const ANIMATION_DURATION = 2000; // 2-second animation
const ANIMATION_EASING = d3.easeCubicOut; // Smooth easing function

export default function Gauge({
  name,
  value,
  min = 0,
  max = 100,
  width = 200,
  height = 200,
  innerRadius = 50,
  outerRadius = 80,
}: GaugeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove(); // Clear previous render

    const fraction = Math.max(0, Math.min((value - min) / (max - min), 1));

    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, 0.2, 0.4, 0.6, 0.8, 1])
      .range(['#006B3D', '#069C56', '#FF980E', '#FF681E', '#D3212C']);

    const fillColor = colorScale(fraction);

    const startAngle = 0;
    const endAngle = 2 * Math.PI;
    const fillAngle = endAngle * fraction;

    const backgroundArc = d3
      .arc()
      .startAngle(startAngle)
      .endAngle(endAngle)
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const foregroundArc = d3
      .arc()
      .startAngle(startAngle)
      // .endAngle(fillAngle)
      .endAngle(0) // Start at 0 for animation effect
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const centerX = width / 2;
    const centerY = height / 2;

    // Create constants for tick marks around Gauge
    const tickCount = 20;
    const tickLength = 6; // Length of tick marks
    const tickWidth = 1; // Width of tick marks

    // Generate the tick data
    const ticks = Array.from({ length: tickCount }, (_, i) => {
      const angle =
        startAngle + (endAngle - startAngle) * (i / (tickCount - 1));
      return angle;
    });

    svg
      .append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', backgroundArc)
      .attr('fill', '#8892b0');

    svg
      .append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', foregroundArc)
      .attr('fill', fillColor)
      .transition() // Add transition effect
      .duration(ANIMATION_DURATION) // Added timing length of animation
      .ease(ANIMATION_EASING) // Added animation function
      .attrTween('d', function () {
        const interpolate = d3.interpolate(0, fillAngle);
        return function (t) {
          return foregroundArc.endAngle(interpolate(t))();
        };
      });

    // Add tick marks to the SVG
    svg
      .selectAll('.tick')
      .data(ticks)
      .enter()
      .append('line')
      .attr('class', 'tick')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('x1', (d) => Math.cos(d - Math.PI / 2) * (outerRadius + 2))
      .attr('y1', (d) => Math.sin(d - Math.PI / 2) * (outerRadius + 2))
      .attr(
        'x2',
        (d) => Math.cos(d - Math.PI / 2) * (outerRadius + tickLength + 2)
      )
      .attr(
        'y2',
        (d) => Math.sin(d - Math.PI / 2) * (outerRadius + tickLength + 2)
      )
      .attr('stroke', '#00ccff')
      .attr('stroke-width', tickWidth)
      .attr('opacity', 0.4);

    svg
      .append('text')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('font-size', 20)
      .attr('fill', '#bbcdff')
      .text(`${value.toFixed(1)}%`);
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
