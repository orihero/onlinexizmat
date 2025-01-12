import { supabase } from '../../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { Service } from '../../../types/service';

interface ServicesTableProps {
  services: Service[];
  isLoading: boolean;
  onEdit: (service: Service) => void;
}

export default function ServicesTable({ services, isLoading, onEdit }: ServicesTableProps) {
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    await supabase.from('services').delete().eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['services'] });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Price</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {services.map((service) => (
            <tr key={service.id}>
              <td className="px-6 py-4">
                <div>{service.name_uz}</div>
                <div className="text-sm text-gray-500">{service.name_ru}</div>
              </td>
              <td className="px-6 py-4">
                {service.categories ? (
                  <>
                    <div>{service.categories.name_uz}</div>
                    <div className="text-sm text-gray-500">{service.categories.name_ru}</div>
                  </>
                ) : (
                  <span className="text-gray-500">No category</span>
                )}
              </td>
              <td className="px-6 py-4">${service.base_price}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => onEdit(service)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
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
  );
}