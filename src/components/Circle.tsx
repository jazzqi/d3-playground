import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { IData3 } from "../containers/App";

const Circle: React.FC<{ data: IData3[] }> = ({ data }) => {
  const svgRef = useRef(null);
  const graphRef = useRef(null);

  const stratify = d3
    .stratify<IData3>()
    .id(d => d.name)
    .parentId(d => d.parent);

  const pack = d3
    .pack()
    .size([500, 500])
    .padding(5);

  // create an ordinal scale
  const color = d3.scaleOrdinal(["#d1c4e9", "#b39ddb", "#9575cd"]);

  // init
  useEffect(() => {
    if (svgRef.current !== null) {
      //
      d3.select(svgRef.current)
        .attr("width", 600)
        .attr("height", 600);

      d3.select(graphRef.current).attr("transform", "translate(50, 50)");
    }
  }, [svgRef]);

  // update
  useEffect(() => {
    const rootNode = stratify(data).sum(d => d.amount as number);

    const bubbleData = (pack(rootNode) as d3.HierarchyCircularNode<
      IData3
    >).descendants();

    // join data and add group for each other
    const nodes = d3
      .select(graphRef.current)
      .selectAll("g")
      .data(bubbleData)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);
    // returns an array of nodes entered into the DOM (groups)

    // add circle to each group
    nodes
      .append("circle")
      .attr("r", d => d.r)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("fill", d => color(d.depth.toString()));

    // add text to each group
    nodes
      .filter(d => !d.children)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("fill", "white")
      .style("font-size", d => (d.value as number) * 3)
      .text(d => d.data.name);
  }, [data]);

  return (
    <svg ref={svgRef}>
      <g ref={graphRef} />
    </svg>
  );
};

export default Circle;
