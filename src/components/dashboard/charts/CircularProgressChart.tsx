import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CircularProgressChartProps {
  value: number;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgressChart({ 
  value, 
  size = 120, 
  strokeWidth = 10 
}: CircularProgressChartProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Clear previous content
    d3.select(ref.current).selectAll("*").remove();

    const svg = d3.select(ref.current);
    const radius = size / 2;
    const progress = value / 100;

    // Create arc generator
    const arc = d3.arc()
      .innerRadius(radius - strokeWidth)
      .outerRadius(radius)
      .startAngle(0)
      .cornerRadius(strokeWidth / 2);

    // Background circle
    svg.append("path")
      .datum({ endAngle: 2 * Math.PI })
      .style("fill", "#f3f4f6")
      .attr("d", arc as any)
      .attr("transform", `translate(${radius},${radius})`);

    // Foreground circle
    const foreground = svg.append("path")
      .datum({ endAngle: 0 })
      .style("fill", "#ff6b6b")
      .attr("d", arc as any)
      .attr("transform", `translate(${radius},${radius})`);

    // Animate the foreground circle
    foreground.transition()
      .duration(750)
      .attrTween("d", (d: any) => {
        const interpolate = d3.interpolate(d.endAngle, 2 * Math.PI * progress);
        return (t: number) => {
          d.endAngle = interpolate(t);
          return arc(d as any) as string;
        };
      });

  }, [value, size, strokeWidth]);

  return (
    <div className="flex items-center justify-center h-full">
      <svg ref={ref} width={size} height={size} />
    </div>
  );
}