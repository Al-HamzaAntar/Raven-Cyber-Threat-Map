import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

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

function randomIP() {
  return Array(4).fill(0).map(() => Math.floor(Math.random() * 255)).join('.');
}
function randomPort() {
  return Math.floor(Math.random() * 65535);
}
function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Example city/country/coords (should be replaced with a full list for realism)
const locations = [
  { country: 'United States', countryCode: 'US', city: 'New York', lat: 40.7128, lon: -74.0060 },
  { country: 'Germany', countryCode: 'DE', city: 'Berlin', lat: 52.52, lon: 13.405 },
  { country: 'China', countryCode: 'CN', city: 'Beijing', lat: 39.9042, lon: 116.4074 },
  { country: 'Brazil', countryCode: 'BR', city: 'Rio', lat: -22.9068, lon: -43.1729 },
  { country: 'India', countryCode: 'IN', city: 'Mumbai', lat: 19.076, lon: 72.8777 },
  { country: 'Australia', countryCode: 'AU', city: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { country: 'Russia', countryCode: 'RU', city: 'Moscow', lat: 55.7558, lon: 37.6173 },
  { country: 'UK', countryCode: 'GB', city: 'London', lat: 51.5074, lon: -0.1278 },
  { country: 'South Africa', countryCode: 'ZA', city: 'Cape Town', lat: -33.9249, lon: 18.4241 },
  { country: 'Japan', countryCode: 'JP', city: 'Tokyo', lat: 35.6895, lon: 139.6917 },
];
const threatTypes = ['malware', 'phishing', 'ddos', 'ransomware'];

const ThreatMap = ({ theme = 'dark', mode = 'live', onAttackSelect, onNewAttack }) => {
  const svgRef = useRef();
  const attackInterval = useRef();

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
        .attr('fill', countryColors[theme])
        .attr('stroke', strokeColors[theme]);
    });

    // Live mode: random attacks
    if (mode === 'live') {
      attackInterval.current = setInterval(() => {
        const source = randomFromArray(locations);
        let target = randomFromArray(locations);
        while (target === source) target = randomFromArray(locations);
        const attack = {
          type: randomFromArray(threatTypes),
          source: { ...source, ip: randomIP(), port: randomPort() },
          target: { ...target, ip: randomIP(), port: randomPort() },
          timestamp: Date.now(),
        };
        drawAttack(attack);
        if (onNewAttack) onNewAttack(attack);
      }, 1200);
    }
    return () => {
      clearInterval(attackInterval.current);
    };
    // eslint-disable-next-line
  }, [theme, mode]);

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
};

export default ThreatMap;
