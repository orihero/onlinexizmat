import { useState } from 'react';
import { MoreHorizontal, ArrowUpDown, Trash2, Edit2 } from 'lucide-react';
import { formatDate, formatCurrency } from '../../../lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Service } from '../../../types/service';

interface ServicesTableProps {
  services: Service[];
  isLoading: boolean;
  searchQuery: string;
  filters: {
    status: string;
    date: string;
  };
  onEdit: (service: Service) => void;
}

export default function ServicesTable({ services, isLoading, searchQuery, filters, onEdit }: ServicesTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Service;
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });

  const queryClient = useQueryClient();

  const handleSort = (key: keyof Service) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    await supabase
      .from('services')
      .delete()
      .eq('id', id);

    queryClient.invalidateQueries({ queryKey: ['services'] });
  };

  const filteredServices = services
    .filter(service => {
      if (!searchQuery) return true;
      return (
        service.name_uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.name_ru.toLowerCase().includes(searchQuery.toLowerCase())
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
        Loading services...
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-100">
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Name
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Category
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Base Price
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <button
              onClick={() => handleSort('created_at')}
              className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2"
            >
              Created At
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </th>
          <th className="px-6 py-4 text-right">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Actions
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredServices.map((service) => (
          <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-6 py-4">
              <div className="font-medium">{service.name_uz}</div>
              <div className="text-sm text-gray-500">{service.name_ru}</div>
            </td>
            <td className="px-6 py-4">
              {service.categories ? (
                <>
                  <div className="font-medium">{service.categories.name_uz}</div>
                  <div className="text-sm text-gray-500">{service.categories.name_ru}</div>
                </>
              ) : (
                <span className="text-sm text-gray-500">No category</span>
              )}
            </td>
            <td className="px-6 py-4">
              <span className="text-sm font-medium">
                {formatCurrency(service.base_price)}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-500">
                {formatDate(service.created_at)}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => onEdit(service)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
                <button 
                  onClick={() => handleDelete(service.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}