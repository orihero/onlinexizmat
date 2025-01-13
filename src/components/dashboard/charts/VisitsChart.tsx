interface VisitsChartProps {
  data: number[];
}

export function VisitsChart({ data }: VisitsChartProps) {
  const max = Math.max(...data);
  const hours = ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'];
  
  return (
    <div className="flex items-end h-full gap-1">
      {data.map((value, index) => {
        const height = (value / max) * 100;
        const isHighlight = index === 15; // Highlight 3pm bar
        
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className={`w-full rounded-sm transition-all duration-300 ${
                isHighlight ? 'bg-orange-500' : 'bg-orange-100'
              }`}
              style={{ height: `${height}%` }}
            />
            {index % 3 === 0 && (
              <div className="text-xs text-gray-500 mt-2">
                {hours[index / 3]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}