interface OrderFiltersProps {
  filters: {
    status: string;
    date: string;
  };
  onFilterChange: (filters: any) => void;
}

export function OrderFilters({ filters, onFilterChange }: OrderFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <select
        value={filters.status}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select
        value={filters.date}
        onChange={(e) => onFilterChange({ ...filters, date: e.target.value })}
        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>
    </div>
  );
}
