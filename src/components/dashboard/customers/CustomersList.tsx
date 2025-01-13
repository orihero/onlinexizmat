import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Search, Filter } from 'lucide-react';
import { ClientsTable } from './ClientsTable';
import { ClientFilters } from './ClientFilters';

export default function CustomersList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    date: 'all',
  });

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('telegram_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Clients</h1>
          <p className="text-gray-500">Manage your client base</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64"
            />
          </div>
          
          <button className="p-2 rounded-lg border border-gray-200">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <ClientFilters filters={filters} onFilterChange={setFilters} />

      <div className="bg-white rounded-xl border border-gray-100 mt-6">
        <ClientsTable 
          clients={clients || []} 
          isLoading={isLoading}
          searchQuery={searchQuery}
          filters={filters}
        />
      </div>
    </div>
  );
}