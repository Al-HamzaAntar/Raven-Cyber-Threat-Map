import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { generateRandomAttack } from '../utils/attackGenerator.js';
import { getRandomCountry } from '../data/countries.js';

const countryColors = {
  dark: '#111',
  light: '#e0e0e0',
  custom: '#2a2a40',
};
const strokeColors = {
  dark: '#555',
  light: '#aaa',
  custom: '#4e4e7e',
};
const bgColors = {
  dark: '#181a1b',
  light: '#fff',
  custom: '#1a1a2a',
};

const ThreatMap = forwardRef(({ theme = 'dark', mode = 'live', onAttackSelect, onNewAttack, customizations = {} }, ref) => {
  const svgRef = useRef();

  useImperativeHandle(ref, () => ({
    animateAttacks: (attacks, delay = 500) => {
      attacks.forEach((attack, i) => {
        setTimeout(() => {
          drawAttack(attack);
          if (onNewAttack) onNewAttack(attack);
        }, i * delay);
      });
    }
  }));

  useEffect(() => {
    const width = window.innerWidth * 0.75;
    const height = window.innerHeight * 0.85;
    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .style('width', '100%')
      .style('height', '100%')
      .style('background', bgColors[theme]);

    svg.selectAll('*').remove();
    const projection = d3.geoNaturalEarth1()
      .scale(width / 6)
      .translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);
    const g = svg.append('g');

    // Pan/zoom
    svg.call(d3.zoom().on('zoom', (event) => {
      g.attr('transform', event.transform);
    }));

    d3.json('/countries-110m.json').then(world => {
      const countries = topojson.feature(world, world.objects.countries || { type: 'GeometryCollection', geometries: [] });
      g.append('g')
        .selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', d => {
          const code = d.id || d.properties?.iso_a2;
          if (customizations[code]) return customizations[code];
          return countryColors[theme];
        })
        .attr('stroke', d => {
          const code = d.id || d.properties?.iso_a2;
          if (customizations[code]) return customizations[code];
          return strokeColors[theme];
        });
    });
    // Removed automatic live attack generation - attacks will only be generated when user triggers them
  }, [theme, customizations]);

  function drawAttack(attack) {
    const width = window.innerWidth * 0.75;
    const height = window.innerHeight * 0.85;
    const svg = d3.select(svgRef.current);
    const projection = d3.geoNaturalEarth1()
      .scale(width / 6)
      .translate([width / 2, height / 2]);
    const source = projection([attack.source.lon, attack.source.lat]);
    const target = projection([attack.target.lon, attack.target.lat]);
    const mid = [(source[0] + target[0]) / 2, (source[1] + target[1]) / 2 - 80];
    const arcPath = d3.line().curve(d3.curveBasis)([source, mid, target]);
    const color = {
      malware: 'red',
      phishing: 'orange',
      ddos: 'purple',
      ransomware: 'blue',
      spyware: 'yellow',
      trojan: 'green',
    }[attack.type] || 'gray';
    const g = svg.select('g');
    const arc = g.append('path')
      .attr('class', 'arc')
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.8)
      .attr('d', arcPath)
      .attr('stroke-dasharray', function () { return this.getTotalLength(); })
      .attr('stroke-dashoffset', function () { return this.getTotalLength(); })
      .on('click', () => onAttackSelect && onAttackSelect(attack));
    arc.transition()
      .duration(3000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)
      .on('end', function repeat() {
        d3.select(this)
          .attr('stroke-dashoffset', this.getTotalLength())
          .transition()
          .duration(3000)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)
          .on('end', repeat);
      });
    // Remove arc after a while
    setTimeout(() => arc.remove(), 8000);
  }

  return <svg ref={svgRef}></svg>;
});

export default ThreatMap;
