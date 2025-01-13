import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { formatDate } from '../../../lib/utils';
import { Eye } from 'lucide-react';

interface ChatOrderDetailsProps {
  userId: number;
}

export function ChatOrderDetails({ userId }: ChatOrderDetailsProps) {
  const navigate = useNavigate();
  
  const { data: orders } = useQuery({
    queryKey: ['user-orders', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          services (
            name_uz,
            name_ru
          )
        `)
        .eq('telegram_user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (!orders?.length) {
    return (
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2">Orders</h3>
        <p className="text-sm text-gray-500">No orders found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'paid':
        return 'bg-blue-50 text-blue-700';
      case 'inprogress':
        return 'bg-indigo-50 text-indigo-700';
      case 'delivered':
        return 'bg-green-50 text-green-700';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700';
      case 'cancelled':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="p-4">
      <h3 className="font-medium text-gray-900 mb-4">Orders</h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order.id}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">#{order.id.slice(0, 8)}</span>
              <button
                onClick={() => navigate(`/orders/${order.id}`)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Eye className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="text-sm font-medium mb-2">
              {order.services.name_uz}
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(order.created_at)}
              </span>
            </div>

            {order.answers?.length > 0 && (
              <div className="text-xs text-gray-500">
                {order.answers.length} answers
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}