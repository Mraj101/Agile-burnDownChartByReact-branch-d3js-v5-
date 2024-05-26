import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BurnDownChart = ({ data, labels, taskNames, deadline }) => {
  const svgRef = useRef();

  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Remove any existing SVG before creating a new one
    d3.select(svgRef.current).select("svg").remove();

    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain([new Date(labels[0]), new Date(labels[labels.length - 1])])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data.actual) || 10])
      .nice()
      .range([height, 0]);

    // Create axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(d3.timeDay.every(1))
      .tickFormat(d3.timeFormat("%Y-%m-%d"));
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(taskNames.length)
      .tickFormat((d, i) => taskNames[taskNames.length - d - 1] || "");

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").call(yAxis);

    // Add the area path
    svg
      .append("path")
      .datum(data.actual.map((d, i) => [new Date(labels[i]), d]))
      .attr("fill", "rgba(0, 0, 255, 0.3)")
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x((d) => xScale(d[0]))
          .y((d) => yScale(d[1]))
          .curve(d3.curveStepAfter)
      );

    // Add the deadline line
    svg
      .append("line")
      .attr("x1", xScale(new Date(deadline)))
      .attr("x2", xScale(new Date(deadline)))
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "red")
      .attr("stroke-width", 2);

    // Add the deadline label
    svg
      .append("text")
      .attr("x", xScale(new Date(deadline)))
      .attr("y", -10)
      .attr("fill", "red")
      .attr("text-anchor", "middle")
      .text("Deadline");
  }, [data, labels, taskNames, deadline]);

  return <div ref={svgRef}></div>;
};

export default BurnDownChart;
