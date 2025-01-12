import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../lib/supabase';
import FormSelect from '../../../ui/FormSelect';

interface ServiceSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function ServiceSelect({ value, onChange, error }: ServiceSelectProps) {
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name_uz');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <FormSelect
      label="Service"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
    >
      <option value="">Select a service</option>
      {services?.map((service) => (
        <option key={service.id} value={service.id}>
          {service.name_uz} / {service.name_ru}
        </option>
      ))}
    </FormSelect>
  );
}