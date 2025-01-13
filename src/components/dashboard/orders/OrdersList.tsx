import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Search, Filter } from 'lucide-react';
import { OrdersTable } from './OrdersTable';
import { OrderFilters } from './OrderFilters';

export default function OrdersList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    date: 'all',
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          telegram_users (
            phone_number
          ),
          services (
            name_uz,
            name_ru
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Orders</h1>
          <p className="text-gray-500">Track and manage customer orders</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64"
            />
          </div>
          
          <button className="p-2 rounded-lg border border-gray-200">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <OrderFilters filters={filters} onFilterChange={setFilters} />

      <div className="bg-white rounded-xl border border-gray-100 mt-6">
        <OrdersTable 
          orders={orders || []} 
          isLoading={isLoading}
          searchQuery={searchQuery}
          filters={filters}
        />
      </div>
    </div>
  );
}