import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Search, Filter, Plus, ArrowUpDown } from 'lucide-react';
import { CategoriesTable } from './CategoriesTable';
import { CategoryFilters } from './CategoryFilters';
import CategoryForm from './CategoryForm';

export default function CategoriesList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    date: 'all',
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          services (
            id
          ),
          telegram_groups (
            name,
            photo_url,
            member_count
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Categories</h1>
          <p className="text-gray-500">Manage your service categories</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64"
            />
          </div>
          
          <button className="p-2 rounded-lg border border-gray-200">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
          
          <button 
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg flex items-center gap-2 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      <CategoryFilters filters={filters} onFilterChange={setFilters} />

      <div className="bg-white rounded-xl border border-gray-100 mt-6">
        <CategoriesTable 
          categories={categories || []} 
          isLoading={isLoading}
          searchQuery={searchQuery}
          filters={filters}
          onEdit={setEditingCategory}
        />
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