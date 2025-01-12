import { Order } from '../../../../types/order';
import { formatDate } from '../../../../lib/utils';

interface OrderInfoProps {
  order: Order;
}

export default function OrderInfo({ order }: OrderInfoProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">Order Information</h3>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-gray-500">Order ID</dt>
          <dd className="mt-1 text-sm text-gray-900">#{order.id.slice(0, 8)}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Created At</dt>
          <dd className="mt-1 text-sm text-gray-900">{formatDate(order.created_at)}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Customer Phone</dt>
          <dd className="mt-1 text-sm text-gray-900">{order.telegram_users.phone_number}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Service</dt>
          <dd className="mt-1 text-sm text-gray-900">{order.services.name_uz}</dd>
        </div>
      </dl>
    </div>
  );
}