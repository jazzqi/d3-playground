import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { IData2 } from "../containers/App";

const Line: React.FC<{ data: IData2[] }> = ({ data }) => {
  const d3Container = useRef(null);
  const graphRef = useRef(null);
  const xAxisGroup = useRef(null);
  const yAxisGroup = useRef(null);
  const pathRef = useRef(null);
  const pointsRef = useRef(null);
  const dottedLinesRef = useRef(null);
  const xDottedLineRef = useRef(null);
  const yDottedLineRef = useRef(null);

  const margin = { top: 20, right: 20, bottom: 20, left: 100 };
  const graphWidth = 600 - margin.left - margin.right;
  const graphHeight = 600 - margin.top - margin.bottom;

  // scales
  const x = d3.scaleTime().range([0, graphWidth]);
  const y = d3.scaleLinear().range([graphHeight, 0]);

  // d3 line path generator
  const line = d3
    .line<IData2>()
    .curve(d3.curveCardinal)
    .x(d => x(new Date(d.date)))
    .y(d => y(d.count));

  // axes groups

  // useEffect init
  useEffect(() => {
    if (d3Container.current !== null) {
      d3.select(d3Container.current)
        .attr("width", 600)
        .attr("height", 600);

      d3.select(graphRef.current)
        .attr("width", graphWidth)
        .attr("height", graphHeight)
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      d3.select(xAxisGroup.current)
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${graphHeight})`);

      d3.select(yAxisGroup.current).attr("class", "y-axis");

      // init dotted line group
      d3.select(dottedLinesRef.current)
        .attr("class", "lines")
        .style("opacity", 0);

      // init dotted lines
      d3.select(xDottedLineRef.current)
        .attr("stroke", "#bcbcbc")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", 4);

      d3.select(yDottedLineRef.current)
        .attr("stroke", "#bcbcbc")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", 4);
    }
  }, [d3Container]);

  // useEffect update
  useEffect(() => {
    // filter data based on current activity

    // sort
    data.sort(
      (a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()
    );

    // set scale domains
    x.domain(d3.extent(data, d => new Date(d.date)) as Date[]);
    y.domain([0, d3.max(data, d => d.count) as number]);

    d3.select(pathRef.current)
      .data([data])
      .attr("fill", "none")
      .attr("stroke", "#00bfa6")
      .attr("stroke-width", 2)
      .attr("d", line);

    const xAxis = d3
      .axisBottom<Date>(x)
      .ticks(4)
      .tickFormat(d3.timeFormat("%b %d"));

    const yAxis = d3
      .axisLeft(y)
      .ticks(4)
      .tickFormat(d => d + " unit");

    // create circles for points
    const circles = d3
      .select(pointsRef.current)
      .selectAll("circle")
      .data(data);

    // remove unwanted points
    circles.exit().remove();

    // update current points
    circles.attr("cx", d => x(new Date(d.date))).attr("cy", d => y(d.count));

    // add new points
    circles
      .enter()
      .append("circle")
      .attr("r", "4")
      .attr("cx", d => x(new Date(d.date)))
      .attr("cy", d => y(d.count))
      .attr("fill", "#ccc");

    // add event listeners to circle (and show dotted lines)
    d3.select(pointsRef.current)
      .selectAll("circle")
      .on("mouseover", (d, i, n) => {
        const dd = (d as any) as IData2;

        d3.select(n[i])
          .transition()
          .duration(100)
          .attr("r", 8)
          .attr("fill", "#00bfa6");

        d3.select(xDottedLineRef.current)
          .attr("x1", x(new Date(dd.date)))
          .attr("x2", x(new Date(dd.date)))
          .attr("y1", graphHeight)
          .attr("y2", y(dd.count));

        d3.select(yDottedLineRef.current)
          .attr("x1", 0)
          .attr("x2", x(new Date(dd.date)))
          .attr("y1", y(dd.count))
          .attr("y2", y(dd.count));

        d3.select(dottedLinesRef.current).style("opacity", 1);
      })
      .on("mouseleave", (d, i, n) => {
        d3.select(n[i])
          .transition()
          .duration(100)
          .attr("r", 3)
          .attr("fill", "#ccc");

        d3.select(dottedLinesRef.current).style("opacity", 0);
      });

    ((d3.select(xAxisGroup.current) as any) as d3.Selection<
      SVGSVGElement,
      any,
      any,
      any
    >).call(xAxis);

    ((d3.select(yAxisGroup.current) as any) as d3.Selection<
      SVGSVGElement,
      any,
      any,
      any
    >).call(yAxis);
  }, [data]);

  return (
    <svg ref={d3Container} viewBox="0 0 600 600">
      <g ref={graphRef}>
        <g ref={yAxisGroup} />
        <g ref={xAxisGroup} />
        <g>
          <path ref={pathRef} />
          <g ref={dottedLinesRef}>
            <line ref={xDottedLineRef} />
            <line ref={yDottedLineRef} />
          </g>
          <g ref={pointsRef} />
        </g>
      </g>
    </svg>
  );
};

export default Line;
