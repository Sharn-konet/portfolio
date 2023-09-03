<script>
import { onMount } from "svelte";


import data from "./../../data/tools.js"

import * as d3 from 'd3';


onMount(() => {
// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40},
  width = 600 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)      
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto; margin-left: 20%; border-color: white; border-style: solid; margin-top: 15%;")
.append("g")
  .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

  // Initialize the links
  const link = svg
    .selectAll("line")
    .data(data.links)
    .join("line")
      .style("stroke", "#0084f5")
      .style("stroke-width", 3)


  const node = svg
    .selectAll(".logo")
    .data(data.nodes)
    .append()
    .join("circle")
      .attr("r", 10)
      .style("fill",  "#0084f5")
    .join("text")

  // Let's list the force we wanna apply on the network
  const simulation = d3.forceSimulation(data.nodes)
      .alphaDecay(0.001) // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink(data.links).id(d => d.id))                     // This provide  the id of a nod
      .force("charge", d3.forceManyBody())         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.7))     // This force attracts nodes to the center of the svg area
      .force("radial", d3.forceRadial(60, width/2, height/2).strength(0.08))
      .force("collision", d3.forceCollide(10))
      .on("tick", ticked);

  // Add a drag behavior.
  node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
         .attr("cx", function (d) { return d.x; })
         .attr("cy", function(d) { return d.y; });
  }

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

});

</script>

<div id="my_dataviz"></div>

<style>
</style>
