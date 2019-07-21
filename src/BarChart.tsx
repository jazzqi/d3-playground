import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { IData } from "./App";

enum BarColors {
  "pink" = "pink",
  "skyblue" = "skyblue"
}

const BarChart: React.FC<{ data: IData[] }> = ({ data }) => {
  const d3Container = useRef(null);
  const graphRef = useRef(null);
  const xAxisGroup = useRef(null);
  const yAxisGroup = useRef(null);

  const barColor = BarColors.skyblue;

  // create margins & dimensions
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const graphWidth = 600 - margin.left - margin.right;
  const graphHeight = 600 - margin.top - margin.bottom;

  // var xAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  // var yAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  // var y: d3.ScaleLinear<number, number>;
  // var x: d3.ScaleBand<string>;
  // var xAxis: d3.Axis<string>;
  // var yAxis: d3.Axis<any> | null = null;

  // create axes range
  const y = d3.scaleLinear().range([graphHeight, 0]);
  const x = d3
    .scaleBand()
    .range([0, graphWidth])
    .paddingInner(0.2)
    .paddingOuter(0.2);

  // create axes
  const xAxis = d3.axisBottom(x);
  const yAxis = d3
    .axisLeft(y)
    .ticks(6)
    .tickFormat(d => `${d} 个`);

  const t = d3.transition().duration(600);

  useEffect(() => {
    return () => {
      if (
        d3Container.current !== null &&
        graphRef.current !== null &&
        yAxisGroup.current !== null &&
        xAxisGroup.current !== null
      ) {
        d3.select(d3Container.current)
          .attr("width", 600)
          .attr("height", 600);

        d3.select(graphRef.current)
          .attr("width", graphWidth)
          .attr("height", graphHeight)
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

        d3.select(xAxisGroup.current).attr(
          "transform",
          `translate(0, ${graphHeight})`
        );

        d3.select(xAxisGroup.current)
          .selectAll("text")
          .attr("fill", "green")
          .attr("transform", "rotate(-30)")
          .attr("text-anchor", "end");
      }
    };
  }, [
    d3Container.current,
    graphRef.current,
    xAxisGroup.current,
    yAxisGroup.current
  ]);

  useEffect(() => {
    //  the update function
    if (d3Container.current !== null) {
      if (yAxis === null || xAxis === null) return;

      const graph = d3.select(graphRef.current);

      // join the data to rects
      const rects = graph.selectAll("rect").data(data);

      // remove unwanted rects
      rects.exit().remove();

      // update the domains
      x.domain(data.map(d => d.name));
      y.domain([0, d3.max(data, d => d.orders) as number]);

      // add attrs to rects already in DOM
      rects
        .attr("width", x.bandwidth)
        .attr("fill", barColor)
        .attr("x", d => (x(d.name) as any) as string);
      // .transition();
      // .duration(500)
      // .attr("height", d => graphHeight - y(d.orders))
      // .attr("y", d => y(d.orders));

      // append the enter selection to the DOM
      rects
        .enter()
        .append("rect")
        .attr("width", x.bandwidth)
        .attr("height", x => 0)
        .attr("fill", barColor)
        .attr("x", d => (x(d.name) as any) as string)
        .attr("y", d => graphHeight)
        .merge((rects as any) as d3.Selection<
          SVGRectElement,
          IData,
          null,
          unknown
        >) // Merge exists DOM
        .transition()
        .duration(500)
        .attr("height", d => graphHeight - y(d.orders))
        .attr("y", d => y(d.orders));

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
    }
  }, [data]);

  return (
    <svg ref={d3Container}>
      <g ref={graphRef}>
        <g ref={yAxisGroup} />
        <g ref={xAxisGroup} />
      </g>
    </svg>
  );
};

export default BarChart;
