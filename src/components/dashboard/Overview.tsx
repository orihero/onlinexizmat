import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Search, Plus, Bell, Filter, ArrowRight, MoreHorizontal } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CircularProgressChart } from './charts/CircularProgressChart';
import { BarChart } from './charts/BarChart';
import { VisitsChart } from './charts/VisitsChart';
import { TopProductsTable } from './tables/TopProductsTable';

// Mock data for the area chart
const areaChartData = Array.from({ length: 12 }, (_, i) => ({
  name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  value: Math.floor(Math.random() * 50000) + 10000
}));

// Mock data for the bar chart
const barChartData = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));

// Mock data for visits
const visitsData = {
  total: 288822,
  change: '+4.3%',
  hourlyData: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
};

// Mock data for top products
const topProductsData = [
  { id: 1, name: 'Bird Shorts', sales: 127, revenue: 1890, stock: 110, status: 'In stock' },
  { id: 2, name: 'T-Shirts Max', sales: 540, revenue: 2889, stock: 100, status: 'Out of stock' },
  { id: 3, name: 'Nike Shoes', sales: 235, revenue: 3200, stock: 80, status: 'Low stock' },
  { id: 4, name: 'Hoodies Blue', sales: 320, revenue: 4500, stock: 200, status: 'In stock' }
];

export default function Overview() {
  const [timeRange, setTimeRange] = useState('This month');

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*');
      
      if (error) throw error;
      
      const totalSales = data.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const activeSales = data.filter(order => order.status === 'confirmed').length;
      const revenue = totalSales * 0.8;
      
      return {
        totalSales,
        activeSales,
        revenue
      };
    }
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
          <p className="text-gray-500">Track your sales and performance of your strategy</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64"
            />
          </div>
          
          <button className="p-2 rounded-lg border border-gray-200">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
          
          <button className="p-2 rounded-lg border border-gray-200">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Product overview</h3>
              <div className="text-2xl font-semibold">{formatCurrency(stats?.totalSales || 0)}</div>
              <div className="text-sm text-gray-500">Total sales</div>
            </div>
            <select className="text-sm border-0 bg-transparent">
              <option>This month</option>
              <option>Last month</option>
              <option>This year</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg text-sm">
              Cosmetics
            </button>
            <button className="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg text-sm">
              Housewell
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Active sales</h3>
              <div className="text-2xl font-semibold">{stats?.activeSales || 0}</div>
              <div className="text-sm text-gray-500">vs last month <span className="text-green-500">+5.2%</span></div>
            </div>
            <button className="text-sm text-blue-600">See Details <ArrowRight className="w-4 h-4 inline" /></button>
          </div>
          
          <div className="h-12">
            <BarChart data={barChartData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Product Revenue</h3>
              <div className="text-2xl font-semibold">{formatCurrency(stats?.revenue || 0)}</div>
              <div className="text-sm text-gray-500">vs last month <span className="text-green-500">+2.1%</span></div>
            </div>
            <button className="text-sm text-blue-600">See Details <ArrowRight className="w-4 h-4 inline" /></button>
          </div>
          
          <div className="relative h-32">
            <CircularProgressChart value={17.9} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Analytics</h3>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-semibold">-$4,543</div>
                <span className="text-sm text-red-500">-0.4%</span>
              </div>
            </div>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
              <option>This year</option>
              <option>Last year</option>
            </select>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ff6b6b"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Total visits by hourly</h3>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-semibold">{visitsData.total.toLocaleString()}</div>
                  <span className="text-sm text-green-500">{visitsData.change}</span>
                </div>
              </div>
              <button>
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="h-32">
              <VisitsChart data={visitsData.hourlyData} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm text-gray-500">Top Products</h3>
              <button className="text-sm text-orange-600">See Details</button>
            </div>
            
            <TopProductsTable products={topProductsData} />
          </div>
        </div>
      </div>
    </div>
  );
}