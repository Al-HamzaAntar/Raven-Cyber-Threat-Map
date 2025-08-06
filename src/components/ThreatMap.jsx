import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const ThreatMap = () => {
  const svgRef = useRef();

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .style('width', '100%')
      .style('height', '100%')
      .style('background', '#fff');

    const projection = d3.geoNaturalEarth1()
      .scale(width / 6)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);
    const g = svg.append("g");

    // Color by threat type
    const threatColor = type => {
      switch (type) {
        case "malware": return "red";
        case "phishing": return "orange";
        case "ddos": return "purple";
        case "ransomware": return "blue";
        default: return "gray";
      }
    };

    d3.json('/countries-110m.json').then(world => {
      const countries = topojson.feature(world, world.objects.countries || { type: "GeometryCollection", geometries: [] });

      g.append('g')
        .selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#111')
        .attr('stroke', '#555');

      d3.json('/data.json').then(data => {
        g.selectAll('path.arc')
          .data(data)
          .enter()
          .append('path')
          .attr('class', 'arc')
          .attr('fill', 'none')
          .attr('stroke', d => threatColor(d.type))
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.8)
          .attr('d', d => {
            const source = projection([d.source.lon, d.source.lat]);
            const target = projection([d.target.lon, d.target.lat]);
            const mid = [(source[0] + target[0]) / 2, (source[1] + target[1]) / 2 - 80];
            return d3.line().curve(d3.curveBasis)([source, mid, target]);
          })
          .attr("stroke-dasharray", function () {
            return this.getTotalLength();
          })
          .attr("stroke-dashoffset", function () {
            return this.getTotalLength();
          })
          .transition()
          .duration(3000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)
          .on("end", function repeat() {
            d3.select(this)
              .attr("stroke-dashoffset", this.getTotalLength())
              .transition()
              .duration(3000)
              .ease(d3.easeLinear)
              .attr("stroke-dashoffset", 0)
              .on("end", repeat);
          });
      });
    });
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default ThreatMap;
