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
      .endAngle(fillAngle)
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const centerX = width / 2;
    const centerY = height / 2;

    svg
      .append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', backgroundArc)
      .attr('fill', '#8892b0');

    svg
      .append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', foregroundArc)
      .attr('fill', fillColor);

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
    <div className='flex flex-col size-64 bg-[#172a45] rounded-2xl m-2 items-center justify-center'>
      <span className='text-center text-[#bbcdff] font-bold'>{name}</span>
      <svg ref={svgRef} />
    </div>
  );
}
