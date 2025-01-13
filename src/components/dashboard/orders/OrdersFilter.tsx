import { Filter } from 'lucide-react';

interface OrdersFilterProps {
  filters: {
    date: string;
    orderType: string;
    orderStatus: string;
  };
  onFilterChange: (filters: any) => void;
}

export function OrdersFilter({ filters, onFilterChange }: OrdersFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">Filter By</span>
      </div>

      <select
        value={filters.date}
        onChange={(e) => onFilterChange({ ...filters, date: e.target.value })}
        className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="">Date</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>

      <select
        value={filters.orderType}
        onChange={(e) => onFilterChange({ ...filters, orderType: e.target.value })}
        className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="">Order Type</option>
        <option value="service">Service</option>
        <option value="product">Product</option>
      </select>

      <select
        value={filters.orderStatus}
        onChange={(e) => onFilterChange({ ...filters, orderStatus: e.target.value })}
        className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="">Order Status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <button className="px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm">
        Reset Filter
      </button>
    </div>
  );
}