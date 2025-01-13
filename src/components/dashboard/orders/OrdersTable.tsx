import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, ArrowUpDown, Eye } from 'lucide-react';
import { formatDate } from '../../../lib/utils';
import { Order } from '../../../types/order';
import { StatusBadge } from './StatusBadge';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  searchQuery: string;
  filters: {
    status: string;
    date: string;
  };
}

export function OrdersTable({ orders, isLoading, searchQuery, filters }: OrdersTableProps) {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order;
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });

  const handleSort = (key: keyof Order) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredOrders = orders
    .filter(order => {
      if (!searchQuery) return true;
      return (
        order.telegram_users.phone_number?.includes(searchQuery) ||
        order.services.name_uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.services.name_ru.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortConfig.key === 'created_at') {
        return sortConfig.direction === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-100">
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Order ID
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Customer
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Service
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <button
              onClick={() => handleSort('created_at')}
              className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2"
            >
              Date
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Status
            </span>
          </th>
          <th className="px-6 py-4 text-right">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Actions
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredOrders.map((order) => (
          <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-6 py-4">
              <span className="text-sm font-medium">#{order.id.slice(0, 8)}</span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm">{order.telegram_users.phone_number}</span>
            </td>
            <td className="px-6 py-4">
              <div className="font-medium">{order.services.name_uz}</div>
              <div className="text-sm text-gray-500">{order.services.name_ru}</div>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-500">
                {formatDate(order.created_at)}
              </span>
            </td>
            <td className="px-6 py-4">
              <StatusBadge status={order.status} />
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}