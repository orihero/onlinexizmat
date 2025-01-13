import SlideOver from '../../../ui/SlideOver';
import { Order } from '../../../../types/order';
import OrderInfo from './OrderInfo';
import OrderAnswers from './OrderAnswers';
import OrderFiles from './OrderFiles';
import OrderStatusUpdate from './OrderStatusUpdate';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  return (
    <SlideOver
      title="Order Details"
      isOpen={true}
      onClose={onClose}
    >
      <div className="space-y-6">
        <OrderInfo order={order} />
        <OrderAnswers order={order} />
        <OrderFiles order={order} />
        <OrderStatusUpdate order={order} />
      </div>
    </SlideOver>
  );
}