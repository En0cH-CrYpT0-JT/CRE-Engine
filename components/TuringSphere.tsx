
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TuringState } from '../types';

interface TuringSphereProps {
  history: TuringState[];
  currentState: TuringState | null;
}

const TuringSphere: React.FC<TuringSphereProps> = ({ history, currentState }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Draw base Turing Sphere boundary (Rmax)
    g.append('circle')
      .attr('r', 120)
      .attr('fill', 'rgba(15, 23, 42, 0.4)')
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5,5');

    // Draw radial axes (Recursive Depth layers)
    const axisScale = d3.scaleLinear().domain([0, 10]).range([0, 120]);
    [2, 4, 6, 8, 10].forEach(r => {
      g.append('circle')
        .attr('r', axisScale(r))
        .attr('fill', 'none')
        .attr('stroke', '#0f172a')
        .attr('stroke-width', 0.5);
    });

    // Helper to parse "R=X"
    const parseR = (rStr: string) => {
      const val = parseInt(rStr.split('=')[1]);
      return isNaN(val) ? 0 : val;
    };

    // Draw history as points in the sphere
    const points = history.map((h) => {
      const angle = (h.timestamp % 3600000) / 10000; 
      const radius = axisScale(Math.min(parseR(h.telemetry_log.recursive_depth), 10));
      
      let color = '#3b82f6'; // Default Blue
      if (h.turing_sphere.visual_color === 'Purple') color = '#a855f7';
      if (h.turing_sphere.visual_color === 'Red') color = '#ef4444';

      return {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        color: color,
        size: 3 + (h.timestamp % 5)
      };
    });

    g.selectAll('.history-point')
      .data(points)
      .enter()
      .append('circle')
      .attr('class', 'history-point')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.size)
      .attr('fill', d => d.color)
      .attr('opacity', 0.3);

    // Current State highlight
    if (currentState) {
      const angle = (currentState.timestamp % 3600000) / 10000;
      const radius = axisScale(Math.min(parseR(currentState.telemetry_log.recursive_depth), 10));
      const cx = radius * Math.cos(angle);
      const cy = radius * Math.sin(angle);
      
      const activeColor = currentState.turing_sphere.visual_color === 'Purple' ? '#a855f7' : 
                         currentState.turing_sphere.visual_color === 'Red' ? '#ef4444' : '#60a5fa';

      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 8)
        .attr('fill', 'none')
        .attr('stroke', activeColor)
        .attr('stroke-width', 2)
        .append('animate')
        .attr('attributeName', 'r')
        .attr('values', '8;16;8')
        .attr('dur', '1.5s')
        .attr('repeatCount', 'indefinite');

      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 5)
        .attr('fill', activeColor)
        .style('filter', `drop-shadow(0 0 5px ${activeColor})`);
    }

  }, [history, currentState]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 border border-slate-800 rounded-lg bg-slate-950/40 backdrop-blur-sm">
      <h3 className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-2 orbitron font-bold">Turing Sphere Projection</h3>
      <svg ref={svgRef} className="w-full h-64 md:h-80" />
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 w-full text-[8px] text-slate-500 font-mono font-bold uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> HIGH FLUX
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> DILATED FLUX
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> CRITICAL STATE
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[7px]">RADIUS = RECURSIVE DEPTH (R)</span>
        </div>
      </div>
    </div>
  );
};

export default TuringSphere;
