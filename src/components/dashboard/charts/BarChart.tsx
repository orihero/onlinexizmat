interface BarChartProps {
  data: number[];
}

export function BarChart({ data }: BarChartProps) {
  const max = Math.max(...data);
  
  return (
    <div className="flex items-end h-full gap-1">
      {data.map((value, index) => (
        <div
          key={index}
          className="flex-1 bg-orange-100 rounded-sm"
          style={{ 
            height: `${(value / max) * 100}%`,
            transition: 'height 0.3s ease-in-out'
          }}
        />
      ))}
    </div>
  );
}