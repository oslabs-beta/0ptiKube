'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type DataPoint = { time: number; value: number };

const TimeGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Set up graph dimensions
    const width = 1000;
    const height = 400;
    const margin = { top: 50, right: 50, bottom: 60, left: 70 };

    const dummyData: DataPoint[] = [
      { time: 0, value: 5 },
      { time: 1, value: 10 },
      { time: 2, value: 8 },
      { time: 3, value: 15 },
      { time: 4, value: 12 },
      { time: 5, value: 18 },
      { time: 6, value: 20 },
      { time: 7, value: 16 },
      { time: 8, value: 21 },
      { time: 9, value: 25 },
    ];

    // Set up x-axis and y-axis scales
    const xScale = d3
      .scaleLinear()
      .domain(
        d3.extent(dummyData, (d: DataPoint) => d.time) as [number, number]
      )
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dummyData, (d: DataPoint) => d.value) as number])
      .range([height - margin.bottom, margin.top]);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    // Add background grid
    const grid = svg.append('g').attr('class', 'grid');

    grid
      .append('g')
      .attr('class', 'grid-lines')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(dummyData.length)
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

    // Generate line path
    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.value))
      .curve(d3.curveLinear);

    // Append path
    const path = svg
      .append('path')
      .datum(dummyData)
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
      .duration(2000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Append x-axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(dummyData.length))
      .selectAll('text')
      .attr('fill', 'white')
      .attr('font-size', '14px');

    // Append y-axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .attr('fill', 'white')
      .attr('font-size', '14px');

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
      .attr('x', -height / 2)
      .attr('y', 20)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .text('Value');

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

    svg
      .selectAll('circle')
      .data(dummyData)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.time))
      .attr('cy', (d) => yScale(d.value))
      .attr('r', 6)
      .attr('fill', '#00ccff')
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip
          .html(`Time: ${d.time}, Value: ${d.value}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', () => {
        tooltip.transition().duration(200).style('opacity', 0);
      });

    // Placeholder for future chart logic
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '20px',
      }}
    >
      <svg ref={svgRef} width={1000} height={400} />
    </div>
  );
};

export default TimeGraph;
