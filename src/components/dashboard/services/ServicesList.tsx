import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Search, Filter, Plus } from 'lucide-react';
import ServiceForm from './ServiceForm';
import ServicesTable  from './ServicesTable';
import ServiceFilters  from './ServiceFilters';

export default function ServicesList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    date: 'all',
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          categories (
            name_uz,
            name_ru
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
          <h1 className="text-2xl font-semibold mb-1">Services</h1>
          <p className="text-gray-500">Manage your service offerings</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search services..."
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
            Add Service
          </button>
        </div>
      </div>

      <ServiceFilters filters={filters} onFilterChange={setFilters} />

      <div className="bg-white rounded-xl border border-gray-100 mt-6">
        <ServicesTable 
          services={services || []} 
          isLoading={isLoading}
          searchQuery={searchQuery}
          filters={filters}
          onEdit={setEditingService}
        />
      </div>

      {(isFormOpen || editingService) && (
        <ServiceForm
          service={editingService}
          onClose={() => {
            setIsFormOpen(false);
            setEditingService(null);
          }}
        />
      )}
    </div>
  );
}