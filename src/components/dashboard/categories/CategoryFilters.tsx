interface CategoryFiltersProps {
  filters: {
    status: string;
    date: string;
  };
  onFilterChange: (filters: any) => void;
}

export function CategoryFilters({ filters, onFilterChange }: CategoryFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <select
        value={filters.status}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
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