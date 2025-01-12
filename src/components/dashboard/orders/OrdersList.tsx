import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import OrdersTable from './OrdersTable';
import OrdersFilter from './OrdersFilter';
import { Order } from '../../../types/order';

export default function OrdersList() {
  const [filters, setFilters] = useState({
    date: '',
    orderType: '',
    orderStatus: '',
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
      return data as Order[];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Order Lists</h2>
      </div>

      <OrdersFilter filters={filters} onFilterChange={setFilters} />
      
      <div className="bg-white shadow-md rounded-lg">
        <OrdersTable orders={orders || []} isLoading={isLoading} />
      </div>
    </div>
  );
}