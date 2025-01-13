import { useState } from 'react';
import { MoreHorizontal, ArrowUpDown, Trash2, Edit2 } from 'lucide-react';
import { formatDate } from '../../../lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';

interface Category {
  id: string;
  name_uz: string;
  name_ru: string;
  created_at: string;
  services: any[];
  telegram_groups?: {
    name: string;
    photo_url: string;
    member_count: number;
  };
}

interface CategoriesTableProps {
  categories: Category[];
  isLoading: boolean;
  searchQuery: string;
  filters: {
    status: string;
    date: string;
  };
  onEdit: (category: Category) => void;
}

export function CategoriesTable({ categories, isLoading, searchQuery, filters, onEdit }: CategoriesTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Category;
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });

  const queryClient = useQueryClient();

  const handleSort = (key: keyof Category) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const filteredCategories = categories
    .filter(category => {
      if (!searchQuery) return true;
      return (
        category.name_uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.name_ru.toLowerCase().includes(searchQuery.toLowerCase())
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
        Loading categories...
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-100">
          <th className="px-6 py-4 text-left">
            <button
              onClick={() => handleSort('name_uz')}
              className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2"
            >
              Name
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Services
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Telegram Group
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
        {filteredCategories.map((category) => (
          <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-6 py-4">
              <div className="font-medium">{category.name_uz}</div>
              <div className="text-sm text-gray-500">{category.name_ru}</div>
            </td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {category.services?.length || 0} services
              </span>
            </td>
            <td className="px-6 py-4">
              {category.telegram_groups ? (
                <div className="flex items-center gap-3">
                  {category.telegram_groups.photo_url && (
                    <img 
                      src={category.telegram_groups.photo_url} 
                      alt={category.telegram_groups.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium">{category.telegram_groups.name}</div>
                    <div className="text-sm text-gray-500">
                      {category.telegram_groups.member_count} members
                    </div>
                  </div>
                </div>
              ) : (
                <span className="text-sm text-gray-500">No group assigned</span>
              )}
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-500">
                {formatDate(category.created_at)}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => onEdit(category)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
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