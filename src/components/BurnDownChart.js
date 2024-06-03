import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BurnDownChart = ({ data, labels, taskNames, deadline, tasks }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 50, left: 80 };
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    d3.select(svgRef.current).select("svg").remove();

    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain([new Date(labels[0]), new Date(labels[labels.length - 1])])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, taskNames.length + 1])
      .nice()
      .range([height, 0]);

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(d3.timeDay.every(1))
      .tickFormat(d3.timeFormat("%Y-%m-%d"));

    const yAxis = d3
      .axisLeft(yScale)
      .tickValues(taskNames.map((_, i) => i + 1))
      .tickSize(8)
      .tickFormat(() => "");

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").call(yAxis);

    const finishedData = data.actual
      .map((d, i) => ({
        date: labels[i],
        value: d,
      }))
      .filter((d) => d.value !== null);

    const uniqueFinishedData = finishedData.filter((d, i, arr) => {
      return i === 0 || d.value !== arr[i - 1].value;
    });

    svg
      .append("path")
      .datum(finishedData)
      .attr("fill", "rgba(0, 0, 255, 0.3)")
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x((d) => xScale(new Date(d.date)))
          .y((d) => yScale(d.value))
          .curve(d3.curveStepAfter)
      );

    svg
      .append("line")
      .attr("x1", xScale(new Date(deadline)))
      .attr("x2", xScale(new Date(deadline)))
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "red")
      .attr("stroke-width", 2);

    svg
      .append("text")
      .attr("x", xScale(new Date(deadline)))
      .attr("y", -10)
      .attr("fill", "red")
      .attr("text-anchor", "middle")
      .text("Deadline");

    if (!tooltipRef.current) {
      tooltipRef.current = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("box-shadow", "0px 0px 5px 0px #aaa")
        .style("pointer-events", "none")
        .style("visibility", "hidden");
    }

    const tooltip = tooltipRef.current;

    const showTooltip = (event, taskName) => {
      const task = tasks.find((task) => task.taskName === taskName);
      const tooltipWidth = 200;
      const mouseX = event.pageX;
      const mouseY = event.pageY;
      const tooltipX =
        mouseX + tooltipWidth < window.innerWidth
          ? mouseX + 10
          : mouseX - tooltipWidth - 10;
      const tooltipY = mouseY - 10;

      tooltip
        .style("visibility", "visible")
        .html(
          `Task Name: ${task.taskName}<br>
          Start Date: ${task.startDate}<br>
          End Date: ${task.endDate}`
        )
        .style("top", `${tooltipY}px`)
        .style("left", `${tooltipX}px`);
    };

    const hideTooltip = () => {
      tooltip.style("visibility", "hidden");
    };

    svg
      .selectAll(".y-axis-label")
      .data(taskNames)
      .enter()
      .append("text")
      .attr("class", "y-axis-label")
      .attr("x", -10)
      .attr("y", (d, i) => yScale(i + 1))
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .text((d) => d)
      .on("mouseover", function (event, d) {
        showTooltip(event, d);
      })
      .on("mouseout", hideTooltip);

    svg
      .selectAll("circle")
      .data(uniqueFinishedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(new Date(d.date)))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 5)
      .attr("fill", "blue")
      .on("mouseover", function (event, d) {
        tooltip
          .style("visibility", "visible")
          .html(`Date: ${d.date}<br>Tasks remaining: ${d.value}`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", hideTooltip);
  }, [data, labels, taskNames, deadline, tasks]);

  return <div ref={svgRef}></div>;
};

export default BurnDownChart;
