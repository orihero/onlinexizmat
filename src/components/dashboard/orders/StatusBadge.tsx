import { OrderStatus } from '../../../types/order';

interface StatusBadgeProps {
  status: OrderStatus;
}

export const getStatusColor = (status: string): string => {
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

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}