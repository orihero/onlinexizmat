import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { formatDate } from '../../../lib/utils';
import { Eye } from 'lucide-react';

interface ChatHeaderProps {
  user: {
    telegram_id: number;
    phone_number: string;
    username: string;
    first_name: string;
    last_name: string;
  };
}

export function ChatHeader({ user }: ChatHeaderProps) {
  const navigate = useNavigate();

  const { data: latestOrder, isError } = useQuery({
    queryKey: ['latest-order', user.telegram_id],
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
        .eq('telegram_user_id', user.telegram_id)
        .in('status', ['pending', 'paid', 'inprogress', 'delivered'])
        .order('created_at', { ascending: false })
        .limit(1);
      
      // Return null if no orders found
      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data?.[0] || null;
    },
  });

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
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white border-b border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-orange-600 font-medium">
              {user.first_name ? user.first_name[0].toUpperCase() : '#'}
            </span>
          </div>
          <div>
            <div className="font-medium">
              {[user.first_name, user.last_name].filter(Boolean).join(' ') || 'Anonymous'}
            </div>
            {user.username && (
              <div className="text-sm text-gray-600">@{user.username}</div>
            )}
            <div className="text-sm text-gray-500">
              {user.phone_number || 'No phone number'}
            </div>
          </div>
        </div>

        {latestOrder && (
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <div className="font-medium text-gray-900">
                Latest Order: #{latestOrder.id.slice(0, 8)}
              </div>
              <div className="text-gray-500">{latestOrder.services.name_uz}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(latestOrder.status)}`}>
                  {latestOrder.status.charAt(0).toUpperCase() + latestOrder.status.slice(1)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(latestOrder.created_at)}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/orders/${latestOrder.id}`)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="View Order Details"
            >
              <Eye className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}