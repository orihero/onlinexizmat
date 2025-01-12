import { LucideIcon } from 'lucide-react';
import { ColorType, TrendType } from '../../types/dashboard';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: TrendType;
  icon: LucideIcon;
  color: ColorType;
}

const colorMap: Record<ColorType, string> = {
  blue: 'bg-blue-100 text-blue-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600'
};

export default function StatsCard({ title, value, change, trend, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-2">from yesterday</span>
      </div>
    </div>
  );
}