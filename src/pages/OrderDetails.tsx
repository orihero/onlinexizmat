import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';
import OrderInfo from '../components/dashboard/orders/details/OrderInfo';
import OrderAnswers from '../components/dashboard/orders/details/OrderAnswers';
import OrderFiles from '../components/dashboard/orders/details/OrderFiles';
import OrderStatusUpdate from '../components/dashboard/orders/details/OrderStatusUpdate';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
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
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Order not found</h2>
          <p className="mt-2 text-gray-500">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 text-indigo-600 hover:text-indigo-500"
          >
            Go back to orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-gray-500">View and manage order details</p>
        </div>
      </div>

      <div className="space-y-6">
        <OrderInfo order={order} />
        <OrderAnswers order={order} />
        <OrderFiles order={order} />
        <OrderStatusUpdate order={order} />
      </div>
    </div>
  );
}