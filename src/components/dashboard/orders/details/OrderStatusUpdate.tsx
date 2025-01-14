import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../../lib/supabase';
import { Order, OrderStatus } from '../../../../types/order';
import Button from '../../../ui/Button';
import FormSelect from '../../../ui/FormSelect';

interface OrderStatusUpdateProps {
  order: Order;
}

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

export default function OrderStatusUpdate({ order }: OrderStatusUpdateProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await supabase
        .from('orders')
        .update({ status })
        .eq('id', order.id);
      
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as OrderStatus);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">Update Status</h3>
      <div className="space-y-4">
        <FormSelect
          value={status}
          onChange={handleStatusChange}
          label="Order Status"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormSelect>
        <Button
          type="button"
          variant="primary"
          onClick={handleUpdate}
          isLoading={isUpdating}
          className="w-full"
        >
          Update Status
        </Button>
      </div>
    </div>
  );
}