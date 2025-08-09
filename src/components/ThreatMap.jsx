import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { generateRandomAttack } from '../utils/attackGenerator.js';
import { getRandomCountry } from '../data/countries.js';

const countryColors = {
  dark: '#2a2a2a',
  light: '#e0e0e0',
  custom: '#2a2a40',
};
const strokeColors = {
  dark: '#444',
  light: '#aaa',
  custom: '#4e4e7e',
};
const bgColors = {
  dark: '#0a0a0a',
  light: '#fff',
  custom: '#1a1a2a',
};

const ThreatMap = forwardRef(({ theme = 'dark', mode = 'live', onAttackSelect, onNewAttack, customizations = {} }, ref) => {
  const svgRef = useRef();
  const rotationRef = useRef({ lambda: 0, phi: 0 });

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
    const radius = Math.min(width, height) / 2.5;
    
    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .style('width', '100%')
      .style('height', '100%')
      .style('background', bgColors[theme]);

    svg.selectAll('*').remove();
    
    // Create orthographic projection for globe effect
    const projection = d3.geoOrthographic()
      .scale(radius)
      .translate([width / 2, height / 2])
      .clipAngle(90);
    
    const path = d3.geoPath().projection(projection);
    const g = svg.append('g');

    // Create graticule (grid lines)
    const graticule = d3.geoGraticule();
    
    // Add sphere background
    g.append('path')
      .datum({ type: 'Sphere' })
      .attr('class', 'sphere')
      .attr('d', path)
      .style('fill', theme === 'dark' ? '#1a1a1a' : '#f0f0f0')
      .style('stroke', theme === 'dark' ? '#333' : '#ccc')
      .style('stroke-width', 1);

    // Add graticule lines
    g.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', theme === 'dark' ? '#333' : '#ddd')
      .style('stroke-width', 0.5)
      .style('opacity', 0.3);

    // Pan/zoom with constraints for globe
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        const { transform } = event;
        projection.scale(radius * transform.k);
        g.selectAll('path').attr('d', path);
      });

    svg.call(zoom);

    // Add rotation on drag
    const drag = d3.drag()
      .on('start', function(event) {
        const [x, y] = d3.pointer(event);
        rotationRef.current.startX = x;
        rotationRef.current.startY = y;
        rotationRef.current.startRotation = projection.rotate();
      })
      .on('drag', function(event) {
        const [x, y] = d3.pointer(event);
        const sensitivity = 0.25;
        const deltaX = (x - rotationRef.current.startX) * sensitivity;
        const deltaY = (y - rotationRef.current.startY) * sensitivity;
        
        const rotation = [
          rotationRef.current.startRotation[0] + deltaX,
          rotationRef.current.startRotation[1] - deltaY,
          0
        ];
        
        projection.rotate(rotation);
        g.selectAll('path').attr('d', path);
      });

    svg.call(drag);

    // Load and render countries
    d3.json('/countries-110m.json').then(world => {
      const countries = topojson.feature(world, world.objects.countries || { type: 'GeometryCollection', geometries: [] });
      
      g.append('g')
        .attr('class', 'countries')
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
        })
        .attr('stroke-width', 0.5)
        .style('opacity', 0.8);
    });

    // Auto-rotation animation (optional)
    const autoRotate = () => {
      const rotation = projection.rotate();
      rotation[0] += 0.1;
      projection.rotate(rotation);
      g.selectAll('path').attr('d', path);
    };

    // Uncomment the line below to enable auto-rotation
    // const rotationInterval = setInterval(autoRotate, 50);

    // Cleanup function
    return () => {
      // clearInterval(rotationInterval);
    };
  }, [theme, customizations]);

  function drawAttack(attack) {
    const width = window.innerWidth * 0.75;
    const height = window.innerHeight * 0.85;
    const radius = Math.min(width, height) / 2.5;
    const svg = d3.select(svgRef.current);
    
    const projection = d3.geoOrthographic()
      .scale(radius)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const source = projection([attack.source.lon, attack.source.lat]);
    const target = projection([attack.target.lon, attack.target.lat]);
    
    // Only draw attack if both points are visible on the globe
    if (!source || !target) return;
    
    // Create great circle path for more realistic globe arcs
    const geoInterpolate = d3.geoInterpolate([attack.source.lon, attack.source.lat], [attack.target.lon, attack.target.lat]);
    const arcPoints = [];
    for (let i = 0; i <= 100; i++) {
      const point = geoInterpolate(i / 100);
      const projected = projection(point);
      if (projected) arcPoints.push(projected);
    }
    
    if (arcPoints.length < 2) return;
    
    const arcPath = d3.line().curve(d3.curveCardinal)(arcPoints);
    
    const color = {
      malware: '#ff4444',
      phishing: '#ff8800',
      ddos: '#8844ff',
      ransomware: '#4488ff',
      spyware: '#ffff44',
      trojan: '#44ff88',
    }[attack.type] || '#888';
    
    const g = svg.select('g');
    const arc = g.append('path')
      .attr('class', 'arc')
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('opacity', 0.9)
      .attr('d', arcPath)
      .attr('stroke-dasharray', function () { return this.getTotalLength(); })
      .attr('stroke-dashoffset', function () { return this.getTotalLength(); })
      .on('click', () => onAttackSelect && onAttackSelect(attack));
    
    // Add glow effect
    arc.style('filter', 'drop-shadow(0 0 3px ' + color + ')');
    
    arc.transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)
      .on('end', function() {
        // Fade out after animation completes
        d3.select(this)
          .transition()
          .duration(1000)
          .attr('opacity', 0)
          .remove();
      });
    
    // Add source and target dots
    if (source) {
      g.append('circle')
        .attr('cx', source[0])
        .attr('cy', source[1])
        .attr('r', 3)
        .attr('fill', color)
        .attr('opacity', 0.8)
        .style('filter', 'drop-shadow(0 0 2px ' + color + ')')
        .transition()
        .duration(3000)
        .attr('opacity', 0)
        .remove();
    }
    
    if (target) {
      g.append('circle')
        .attr('cx', target[0])
        .attr('cy', target[1])
        .attr('r', 4)
        .attr('fill', color)
        .attr('opacity', 0.9)
        .style('filter', 'drop-shadow(0 0 3px ' + color + ')')
        .transition()
        .duration(3000)
        .attr('opacity', 0)
        .remove();
    }
  }

  return <svg ref={svgRef}></svg>;
});

export default ThreatMap;
