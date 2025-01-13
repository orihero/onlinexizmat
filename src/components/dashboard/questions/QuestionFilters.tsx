interface QuestionFiltersProps {
  filters: {
    status: string;
    date: string;
  };
  onFilterChange: (filters: any) => void;
}

export function QuestionFilters({ filters, onFilterChange }: QuestionFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <select
        value={filters.status}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
      >
        <option value="all">All Types</option>
        <option value="yes_no">Yes/No</option>
        <option value="text">Text</option>
        <option value="file">File</option>
        <option value="picture">Picture</option>
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
