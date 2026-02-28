<script>
import * as d3 from 'd3';
import data from "./../../data/tools.js"

let container: HTMLDivElement;

$effect(() => {
  if (!container) return;

  const margin = {top: 10, right: 30, bottom: 30, left: 40};
  const width = 600 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const link = svg
    .selectAll("line")
    .data(data.links)
    .join("line")
    .style("stroke", "#0084f5")
    .style("stroke-width", 3);

  const node = svg
    .selectAll(".logo")
    .data(data.nodes)
    .join("image")
    .attr("width", 10)
    .attr("height", 10);

  const simulation = d3.forceSimulation(data.nodes)
    .alphaDecay(0.001)
    .force("link", d3.forceLink(data.links).id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2).strength(0.7))
    .force("radial", d3.forceRadial(60, width/2, height/2).strength(0.08))
    .force("collision", d3.forceCollide(10))
    .on("tick", ticked);

  node.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  function ticked() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return () => {
    simulation.stop();
  };
});
</script>

<div bind:this={container}></div>

<style>
</style>
