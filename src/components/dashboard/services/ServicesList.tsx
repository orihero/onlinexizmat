import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import ServiceForm from './ServiceForm';
import ServicesTable from './ServicesTable';
import { Service } from '../../../types/service';

export default function ServicesList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

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
      return data as Service[];
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Services</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Service
        </button>
      </div>

      <ServicesTable 
        services={services || []}
        isLoading={isLoading}
        onEdit={setEditingService}
      />

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