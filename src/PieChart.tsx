import React, { useRef, useEffect } from "react";
import { IData } from "./App";
import * as d3 from "d3";

const PieChart: React.FC<{ data: IData[] }> = props => {
  const data = props.data;
  const dimensions = { height: 300, width: 300, radius: 150 };
  const center = { x: dimensions.width / 2 + 5, y: dimensions.height / 2 + 5 };

  const svg = useRef(null);
  const graphRef = useRef(null);

  const pie = d3
    .pie<IData>()
    .sort(null)
    .value(d => d.orders);
  // the value we are evaluating to create the pie angles

  const arcPath = d3
    .arc<d3.PieArcDatum<IData>>()
    .outerRadius(dimensions.radius)
    .innerRadius(dimensions.radius / 2);
  // the <path d="...">

  // ordinal color scale
  const color = d3.scaleOrdinal(d3.schemeSet3);

  // initial
  useEffect(() => {
    if (svg.current !== null) {
      d3.select(svg.current)
        .attr("width", dimensions.width + 10)
        .attr("height", dimensions.height + 10);

      // translate the graph group to the middle of the svg container
      d3.select(graphRef.current).attr(
        "transform",
        `translate(${center.x}, ${center.y})`
      );
    }
  }, [svg.current]);

  // update
  useEffect(() => {
    // update the color scale domain
    console.log(data);
    color.domain(data.map(d => d.name));

    // join enhanced (pie) data to path elements
    const paths = d3
      .select(graphRef.current)
      .selectAll("path")
      .data(pie(data));

    // handle the exit selection
    paths.exit().remove();

    // handle the current DOM path updates
    paths.attr("d", arcPath);

    paths
      .enter()
      .append("path") // .attr("class", "arc")
      .attr("stroke", "white")
      .attr("stroke-width", "3")
      .attr("d", arcPath)
      .attr("fill", d => color(d.data.name));
  }, [data]);

  return (
    <svg ref={svg}>
      <g ref={graphRef} />
    </svg>
  );
};

export default PieChart;
