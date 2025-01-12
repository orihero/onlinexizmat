import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Service } from '../../../types/service';
import SlideOver from '../../ui/SlideOver';
import FormSelect from '../../ui/FormSelect';
import FormInput from '../../ui/FormInput';
import FormTextarea from '../../ui/FormTextarea';
import ImageUpload from '../../ui/ImageUpload';
import Button from '../../ui/Button';
import ButtonGroup from '../../ui/ButtonGroup';

const serviceSchema = z.object({
  category_id: z.string().min(1, 'Category is required'),
  name_uz: z.string().min(1, 'Name in Uzbek is required'),
  name_ru: z.string().min(1, 'Name in Russian is required'),
  description_uz: z.string().min(1, 'Description in Uzbek is required'),
  description_ru: z.string().min(1, 'Description in Russian is required'),
  base_price: z.number().min(0, 'Base price must be positive'),
  photo_url: z.string().optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: Service | null;
  onClose: () => void;
}

export default function ServiceForm({ service, onClose }: ServiceFormProps) {
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_uz');
      
      if (error) throw error;
      return data;
    },
  });

  const defaultValues: ServiceFormData = service ? {
    category_id: service.category_id,
    name_uz: service.name_uz,
    name_ru: service.name_ru,
    description_uz: service.description_uz,
    description_ru: service.description_ru,
    base_price: service.base_price,
    photo_url: service.photo_url,
  } : {
    category_id: '',
    name_uz: '',
    name_ru: '',
    description_uz: '',
    description_ru: '',
    base_price: 0,
    photo_url: '',
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues,
  });

  const photoUrl = watch('photo_url');

  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (service) {
        await supabase
          .from('services')
          .update(data)
          .eq('id', service.id);
      } else {
        await supabase
          .from('services')
          .insert([data]);
      }
      
      queryClient.invalidateQueries({ queryKey: ['services'] });
      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  return (
    <SlideOver
      title={service ? 'Edit Service' : 'Add Service'}
      isOpen={true}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Photo</label>
            <ImageUpload
              value={photoUrl}
              onChange={(url) => setValue('photo_url', url)}
            />
          </div>

          <FormSelect
            label="Category"
            error={errors.category_id?.message}
            {...register('category_id')}
          >
            <option value="">Select a category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_uz} / {category.name_ru}
              </option>
            ))}
          </FormSelect>

          <FormInput
            type="number"
            label="Base Price"
            error={errors.base_price?.message}
            {...register('base_price', { valueAsNumber: true })}
          />

          <FormInput
            label="Name (Uzbek)"
            error={errors.name_uz?.message}
            {...register('name_uz')}
          />

          <FormInput
            label="Name (Russian)"
            error={errors.name_ru?.message}
            {...register('name_ru')}
          />

          <FormTextarea
            label="Description (Uzbek)"
            error={errors.description_uz?.message}
            rows={4}
            {...register('description_uz')}
          />

          <FormTextarea
            label="Description (Russian)"
            error={errors.description_ru?.message}
            rows={4}
            {...register('description_ru')}
          />
        </div>

        <ButtonGroup>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            {service ? 'Update' : 'Create'}
          </Button>
        </ButtonGroup>
      </form>
    </SlideOver>
  );
}