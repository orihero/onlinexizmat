import { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import OrderDetailsModal from './details/OrderDetailsModal';
import { Order } from '../../../types/order';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
}

export default function OrdersTable({ orders, isLoading }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">#{order.id.slice(0, 5)}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{order.telegram_users.phone_number}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {order.services.name_uz}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}