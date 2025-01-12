import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import CategoryForm from './CategoryForm';
import { Category } from '../../../types/category';

export default function CategoriesList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          telegram_groups (
            name,
            photo_url,
            member_count
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Category[];
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Category
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name (UZ)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name (RU)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Telegram Group
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories?.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">{category.name_uz}</td>
                <td className="px-6 py-4 whitespace-nowrap">{category.name_ru}</td>
                <td className="px-6 py-4">
                  {category.telegram_groups ? (
                    <div className="flex items-center">
                      {category.telegram_groups.photo_url && (
                        <img
                          src={category.telegram_groups.photo_url}
                          alt={category.telegram_groups.name}
                          className="w-8 h-8 rounded-full mr-2"
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
                    <span className="text-gray-500">No group assigned</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      await supabase
                        .from('categories')
                        .delete()
                        .eq('id', category.id);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(isFormOpen || editingCategory) && (
        <CategoryForm
          category={editingCategory}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}